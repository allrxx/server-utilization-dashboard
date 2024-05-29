// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import GraphWidget from '../components/GraphWidget';
import Button from '../components/Button';
import Papa from 'papaparse';
import './Dashboard.css';

const Dashboard = () => {
  const [dailyData, setDailyData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

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
        const data = await parseCSV('/trend_trend.csv'); // Fetch CSV from public directory
        const groupedData = groupDataByDateAndHour(data);
        setDailyData(groupedData);
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

  const transformDailyData = (data) => {
    const categories = [];
    const dailyValues = [];

    Object.keys(data).forEach(hour => {
      const hourData = data[hour];
      const avg = hourData.reduce((sum, value) => sum + value, 0) / hourData.length;
      categories.push(`${hour}:00`);
      dailyValues.push(avg);
    });

    // Ensure 24-hour format categories
    for (let i = 0; i < 24; i++) {
      if (!categories.includes(`${i}:00`)) {
        categories.push(`${i}:00`);
        dailyValues.push(0); // Push zero or some default value if there is no data for that hour
      }
    }

    categories.sort((a, b) => parseInt(a) - parseInt(b));

    // Calculate min and max values for y-axis range
    const minY = Math.min(...dailyValues);
    const maxY = Math.max(...dailyValues);

    return {
      categories,
      series: [
        {
          name: 'Hourly Utilization', // Trend data series
          data: dailyValues,
        },
      ],
      yAxisRange: { minY, maxY },
    };
  };

  const dates = Object.keys(dailyData);
  const currentDateData = dates.length > 0 ? dailyData[dates[currentPage]] : {};
  const dailyChartData = transformDailyData(currentDateData);

  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, dates.length - 1));
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 0));
  };

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
            categories={dailyChartData.categories}
            series={dailyChartData.series}
            yAxisRange={dailyChartData.yAxisRange}
          />
          <div className="button-container">
            <Button onClick={handlePrevPage} disabled={currentPage === 0}>Previous</Button>
            <Button onClick={handleNextPage} disabled={currentPage === dates.length - 1}>Next</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
