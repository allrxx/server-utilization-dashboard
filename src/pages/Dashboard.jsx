import React, { useState, useEffect } from 'react';
import GraphWidget from '../components/GraphWidget';
import DayWiseWidget from '../components/DayWiseWidget';
import Button from '../components/Button';
import Papa from 'papaparse';
import './Dashboard.css'; // Import the CSS file for Dashboard

const Dashboard = () => {
  const [hourlyData, setHourlyData] = useState({});
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentDayPage, setCurrentDayPage] = useState(0); // State for daily data pagination

  const parseCSV = async (url) => {
    const response = await fetch(url);
    const text = await response.text();
    return new Promise((resolve, reject) => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => resolve(results.data),
        error: (error) => reject(error),
      });
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hourlyData = await parseCSV('/trend_trend.csv'); // Fetch hourly CSV from public directory
        const groupedHourlyData = groupDataByDateAndHour(hourlyData);
        setHourlyData(groupedHourlyData);

        const dailyData = await parseCSV('/Daily_Trend.csv'); // Fetch daily CSV from public directory
        setDailyData(dailyData);
      } catch (error) {
        setError('Error loading CSV data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const groupDataByDateAndHour = (data) => {
    return data.reduce((acc, item) => {
      const date = new Date(item.ds);
      const dateString = date.toLocaleDateString();
      const hour = date.getHours();

      if (!acc[dateString]) {
        acc[dateString] = {};
      }

      if (!acc[dateString][hour]) {
        acc[dateString][hour] = [];
      }

      acc[dateString][hour].push(parseFloat(item.trend));

      return acc;
    }, {});
  };

  const transformHourlyData = (data) => {
    const categories = [];
    const hourlyValues = [];

    Object.keys(data).forEach(hour => {
      const hourData = data[hour];
      const avg = hourData.reduce((sum, value) => sum + value, 0) / hourData.length;
      categories.push(`${hour}:00`);
      hourlyValues.push(avg);
    });

    // Ensure 24-hour format categories
    for (let i = 0; i < 24; i++) {
      if (!categories.includes(`${i}:00`)) {
        categories.push(`${i}:00`);
        hourlyValues.push(0); // Push zero or some default value if there is no data for that hour
      }
    }

    categories.sort((a, b) => parseInt(a) - parseInt(b));

    // Calculate min and max values for y-axis range
    const minY = Math.min(...hourlyValues);
    const maxY = Math.max(...hourlyValues);

    return {
      categories,
      series: [
        {
          name: 'Hourly Utilization', // Trend data series
          data: hourlyValues,
        },
      ],
      yAxisRange: { minY, maxY },
    };
  };

  const transformDailyData = (data) => {
    const categories = [];
    const dailyValues = [];
    const dailyLowerValues = [];
    const dailyUpperValues = [];

    data.forEach(item => {
      const date = new Date(item.ds);
      const day = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dateString = date.toLocaleDateString();
      categories.push(`${day} (${dateString})`);
      dailyValues.push(parseFloat(item.daily));
      dailyLowerValues.push(parseFloat(item.daily_lower));
      dailyUpperValues.push(parseFloat(item.daily_upper));
    });

    const minY = Math.min(...dailyLowerValues);
    const maxY = Math.max(...dailyUpperValues);

    return {
      categories,
      series: [
        {
          name: 'Daily Utilization',
          data: dailyValues,
        },
      ],
      yAxisRange: { minY, maxY },
    };
  };

  const dates = Object.keys(hourlyData);
  const currentDateData = dates.length > 0 ? hourlyData[dates[currentPage]] : {};
  const hourlyChartData = transformHourlyData(currentDateData);
  const dailyChartData = transformDailyData(dailyData);

  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, dates.length - 1));
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 0));
  };

  const handleNextDayPage = () => {
    setCurrentDayPage(prevPage => Math.min(prevPage + 1, Math.ceil(dailyData.length / 7) - 1));
  };

  const handlePrevDayPage = () => {
    setCurrentDayPage(prevPage => Math.max(prevPage - 1, 0));
  };

  // Slicing the daily data for the current week
  const startIdx = currentDayPage * 7;
  const endIdx = startIdx + 7;
  const currentWeekData = dailyData.slice(startIdx, endIdx);
  const currentWeekChartData = transformDailyData(currentWeekData);

  return (
    <div className="dashboard">
      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div>
          <GraphWidget
            title={`CPU Utilization on ${dates[currentPage]}`}
            categories={hourlyChartData.categories}
            series={hourlyChartData.series}
            yAxisRange={hourlyChartData.yAxisRange}
          />
          <div className="button-container">
            <Button onClick={handlePrevPage} disabled={currentPage === 0}>Previous Hour</Button>
            <Button onClick={handleNextPage} disabled={currentPage === dates.length - 1}>Next Hour</Button>
          </div>
          <DayWiseWidget
            title={`Day-wise CPU Utilization`}
            categories={currentWeekChartData.categories}
            series={currentWeekChartData.series}
            yAxisRange={currentWeekChartData.yAxisRange}
          />
          <div className="button-container">
            <Button onClick={handlePrevDayPage} disabled={currentDayPage === 0}>Previous Week</Button>
            <Button onClick={handleNextDayPage} disabled={currentDayPage === Math.ceil(dailyData.length / 7) - 1}>Next Week</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
