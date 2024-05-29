// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import GraphWidget from '../components/GraphWidget';
import Papa from 'papaparse';

const Dashboard = () => {
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        const daily = await parseCSV('/trend_trend.csv'); // Fetch CSV from public directory
        setDailyData(daily);
      } catch (error) {
        setError('Error loading CSV data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const aggregateHourlyData = (data) => {
    const hourlyData = {};

    data.forEach(item => {
      const date = new Date(item.ds);
      const hour = date.getHours();
      const hourKey = `${date.toLocaleDateString()} ${hour}:00`;

      if (!hourlyData[hourKey]) {
        hourlyData[hourKey] = [];
      }
      hourlyData[hourKey].push(parseFloat(item.trend));
    });

    const aggregatedData = Object.keys(hourlyData).map(hour => {
      const avg = hourlyData[hour].reduce((sum, value) => sum + value, 0) / hourlyData[hour].length;
      return { hour, avg };
    });

    aggregatedData.sort((a, b) => new Date(a.hour) - new Date(b.hour));

    const categories = aggregatedData.map(item => item.hour);
    const values = aggregatedData.map(item => item.avg);

    // Calculate min and max values for y-axis range
    const minY = Math.min(...values);
    const maxY = Math.max(...values);

    return {
      categories,
      series: [
        {
          name: 'Hourly Utilization', // Trend data series
          data: values,
        },
      ],
      yAxisRange: { minY, maxY },
    };
  };

  const hourlyChartData = aggregateHourlyData(dailyData);

  return (
    <div>
      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <GraphWidget
          title="Hourly CPU Utilization"
          categories={hourlyChartData.categories}
          series={hourlyChartData.series}
          yAxisRange={hourlyChartData.yAxisRange}
        />
      )}
    </div>
  );
};

export default Dashboard;
