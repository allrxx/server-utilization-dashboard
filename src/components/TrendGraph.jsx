// TrendGraph.jsx
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import Chart from 'react-apexcharts';
import Button from './Button';

const TrendGraph = ({ title }) => {
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
        const weeklyData = await parseCSV('/trend_weekly.csv');
        setData(weeklyData);
      } catch (error) {
        setError('Error loading CSV data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const transformData = (data) => {
    const startIdx = currentPage * 6;
    const endIdx = startIdx + 6;
    const paginatedData = data.slice(startIdx, endIdx);

    const categories = [];
    const seriesData = [];

    paginatedData.forEach(item => {
      const date = new Date(item.ds);
      categories.push(date.toLocaleDateString());
      seriesData.push(parseFloat(item.weekly));
    });

    return {
      categories,
      series: [
        {
          name: 'Weekly Utilization',
          data: seriesData,
        },
      ],
    };
  };

  const chartData = transformData(data);

  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, Math.ceil(data.length / 6) - 1));
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
          <Button onClick={handleNextPage} disabled={currentPage === Math.ceil(data.length / 6) - 1}>{'>'}</Button>
        </div>
      </div>
      <Chart
        options={{
          chart: { id: 'trend-graph' },
          xaxis: { categories: chartData.categories,
            labels: {
              padding:15,
            }
           },
          yaxis: {
            labels: {
              formatter: (value) => value.toFixed(6),
              padding:15,
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

export default TrendGraph;
