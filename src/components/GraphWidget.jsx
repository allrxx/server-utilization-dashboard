// GraphWidget.jsx
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Chart from 'react-apexcharts';
import Button from './Button';

const GraphWidget = ({ title }) => {
  const [data, setData] = useState({});
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
        const hourlyData = await parseCSV('/trend_trend.csv');
        const groupedData = groupDataByDateAndHour(hourlyData);
        setData(groupedData);
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

  const transformData = (data) => {
    const dates = Object.keys(data);
    const currentDateData = dates.length > 0 ? data[dates[currentPage]] : {};
    const categories = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    const seriesData = Array(24).fill(0).map((_, i) => {
      const hourlyData = currentDateData[i];
      return hourlyData ? hourlyData.reduce((sum, val) => sum + val, 0) / hourlyData.length : 0;
    });

    return {
      categories,
      series: [
        {
          name: 'Hourly Utilization',
          data: seriesData,
        },
      ],
    };
  };

  const chartData = transformData(data);

  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, Object.keys(data).length - 1));
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
          <Button onClick={handleNextPage} disabled={currentPage === Object.keys(data).length - 1}>{'>'}</Button>
        </div>
      </div>
      <Chart
        options={{
          chart: { id: 'graph-widget' },
          xaxis: { categories: chartData.categories,
            labels: {
              padding: 20,
            }
           },
          yaxis: {
            labels: {
              formatter: (value) => value.toFixed(6),
              padding:15,
            },
          },
          toolbar: { show: false, },
        }}
        series={chartData.series}
        type="line"
        height="350"
      />
    </div>
  )
};

export default GraphWidget;
