import React, { useState, useEffect } from 'react';
import GraphWidget from '../components/GraphWidget';
import DayWiseWidget from '../components/DayWiseWidget';
import TrendGraph from '../components/TrendGraph'; // Import the new TrendGraph component
import Button from '../components/Button';
import Papa from 'papaparse';
import './Dashboard.css'; // Import the CSS file for Dashboard

const Dashboard = () => {
  const [hourlyData, setHourlyData] = useState({});
  const [dailyData, setDailyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]); // State for weekly data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentDayPage, setCurrentDayPage] = useState(0); // State for daily data pagination
  const [currentWeeklyPage, setCurrentWeeklyPage] = useState(0); // State for weekly data pagination

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

        const weeklyData = await parseCSV('/trend_weekly.csv'); // Fetch weekly CSV from public directory
        setWeeklyData(weeklyData);
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
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const categories = [];
    const dailyValues = [];
    const dailyLowerValues = [];
    const dailyUpperValues = [];
  
    const dayDataMap = new Map();
  
    // Initialize the map with empty arrays for each day of the week
    daysOfWeek.forEach(day => {
      dayDataMap.set(day, {
        daily: [],
        daily_lower: [],
        daily_upper: [],
      });
    });
  
    data.forEach(item => {
      const date = new Date(item.ds);
      const day = date.toLocaleDateString('en-US', { weekday: 'short' });
      if (dayDataMap.has(day)) {
        dayDataMap.get(day).daily.push(parseFloat(item.daily));
        dayDataMap.get(day).daily_lower.push(parseFloat(item.daily_lower));
        dayDataMap.get(day).daily_upper.push(parseFloat(item.daily_upper));
      }
    });
  
    daysOfWeek.forEach(day => {
      const dayData = dayDataMap.get(day);
      categories.push(day);
      dailyValues.push(dayData.daily.length ? dayData.daily.reduce((a, b) => a + b) / dayData.daily.length : 0);
      dailyLowerValues.push(dayData.daily_lower.length ? Math.min(...dayData.daily_lower) : 0);
      dailyUpperValues.push(dayData.daily_upper.length ? Math.max(...dayData.daily_upper) : 0);
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

  const transformWeeklyData = (data) => {
    const startIdx = currentWeeklyPage * 6;
    const endIdx = startIdx + 6;
    const paginatedData = data.slice(startIdx, endIdx);

    const categories = [];
    const weeklyValues = [];
    const weeklyLowerValues = [];
    const weeklyUpperValues = [];

    paginatedData.forEach(item => {
      const date = new Date(item.ds);
      const week = date.toLocaleDateString();
      categories.push(week);
      weeklyValues.push(parseFloat(item.weekly));
      weeklyLowerValues.push(parseFloat(item.weekly_lower));
      weeklyUpperValues.push(parseFloat(item.weekly_upper));
    });

    const minY = Math.min(...weeklyLowerValues);
    const maxY = Math.max(...weeklyUpperValues);

    return {
      categories,
      series: [
        {
          name: 'Weekly Utilization',
          data: weeklyValues,
        },
      ],
      yAxisRange: { minY, maxY },
    };
  };

  const dates = Object.keys(hourlyData);
  const currentDateData = dates.length > 0 ? hourlyData[dates[currentPage]] : {};
  const hourlyChartData = transformHourlyData(currentDateData);
  const dailyChartData = transformDailyData(dailyData);
  const weeklyChartData = transformWeeklyData(weeklyData);

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

  const handleNextWeeklyPage = () => {
    setCurrentWeeklyPage(prevPage => Math.min(prevPage + 1, Math.ceil(weeklyData.length / 6) - 1));
  };

  const handlePrevWeeklyPage = () => {
    setCurrentWeeklyPage(prevPage => Math.max(prevPage - 1, 0));
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
          <TrendGraph
            title="Weekly CPU Utilization"
            categories={weeklyChartData.categories}
            series={weeklyChartData.series}
            yAxisRange={weeklyChartData.yAxisRange}
          />
          <div className="button-container">
            <Button onClick={handlePrevWeeklyPage} disabled={currentWeeklyPage === 0}>Previous</Button>
            <Button onClick={handleNextWeeklyPage} disabled={currentWeeklyPage === Math.ceil(weeklyData.length / 6) - 1}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
