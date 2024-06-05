// DayWiseWidget.jsx
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Chart from 'react-apexcharts';
import Button from './Button';


const DayWiseWidget = ({ title }) => {
  const [data, setData] = useState([]);
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
        const dailyData = await parseCSV('/Daily_Trend.csv');
        setData(dailyData);
      } catch (error) {
        setError('Error loading CSV data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const transformData = (data) => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const startIdx = currentPage * 7;
    const endIdx = startIdx + 7;
    const paginatedData = data.slice(startIdx, endIdx);

    const categories = [];
    const seriesData = [];

    daysOfWeek.forEach(day => {
      categories.push(day);
      const dayData = paginatedData.filter(item => {
        const date = new Date(item.ds);
        return date.toLocaleDateString('en-US', { weekday: 'short' }) === day;
      });
      const avg = dayData.length ? dayData.reduce((sum, item) => sum + parseFloat(item.daily), 0) / dayData.length : 0;
      seriesData.push(avg);
    });

    return {
      categories,
      series: [
        {
          name: 'Daily Utilization',
          data: seriesData,
        },
      ],
    };
  };

  const chartData = transformData(data);

  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, Math.ceil(data.length / 7) - 1));
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 0));
  };

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <div className='header'>
        <h2>{title}</h2>
        <div className='buttons'>
            <Button onClick={handlePrevPage} disabled={currentPage === 0}>{'<'}</Button>
            <Button onClick={handleNextPage} disabled={currentPage === Math.ceil(data.length / 7) - 1}>{'>'}</Button>
        </div>
      </div>
      <Chart
        options={{
          chart: { id: 'daywise-widget' },
          xaxis: { categories: chartData.categories,
            labels: {
              padding: 25,
            }
           },
          yaxis: {
            labels: {
              formatter: (value) => value.toFixed(6), // Update to display 6 decimal places
              padding: 15,
            },
          },
        }}
        series={chartData.series}
        type="line"
        height="350"
      />
    </div>
  );
};

export default DayWiseWidget;
