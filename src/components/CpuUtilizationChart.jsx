import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

const CpuUtilizationChart = ({ data }) => {
  const [chartData, setChartData] = useState({
    times: [],
    trendValues: [],
    lowerBond: 0,
    upperBond: 1
  });

  useEffect(() => {
    if (!data || data.length === 0) return;

    const processChartData = () => {
      const times = data.map(item => {
        const dateTime = new Date(item.dateTime);
        return dateTime.toTimeString().slice(0, 5);
      });
      const trendValues = data.map(item => item.trendValue);
      const lowerBond = Math.min(...data.map(item => item.trendLower));
      const upperBond = Math.max(...data.map(item => item.trendUpper));

      const filteredTimes = [];
      let lastHour = null;
      times.forEach((time) => {
        const currentHour = time.split(':')[0];
        if (currentHour !== lastHour) {
          filteredTimes.push(time);
          lastHour = currentHour;
        } else {
          filteredTimes.push('');
        }
      });

      setChartData({
        times: filteredTimes,
        trendValues,
        lowerBond: parseFloat(lowerBond.toFixed(7)),
        upperBond: parseFloat(upperBond.toFixed(7))
      });
    };

    processChartData();
  }, [data]);

  const { times, trendValues, lowerBond, upperBond } = chartData;

  const chartOptions = {
    chart: {
      id: 'cpu-utilization-chart',
      type: 'line'
    },
    xaxis: {
      categories: times,
      title: {
        text: 'Time'
      },
      labels: {
        offsetY: 15 // Adjust as needed
      }
    },
    yaxis: {
      min: lowerBond,
      max: upperBond,
      title: {
        text: 'CPU Utilization',
        style: {
          fontSize: '14px', // Adjust font size as needed
          fontFamily: 'Helvetica, Arial, sans-serif' // Specify font family
        }
      },
      labels: {
        offsetX: -10, // Adjust to move the labels away from the axis
        style: {
          fontSize: '12px' // Adjust font size as needed
        }
      }
    },
    stroke: {
      curve: 'smooth'
    },
    title: {
      text: 'CPU Utilization Over Time',
      align: 'left'
    }
  };

  const chartSeries = [
    {
      name: 'Trend Value',
      data: trendValues
    }
  ];

  return (
    <div className="chart-container">
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="line"
        width="100%"
        height="400"
      />
    </div>
  );
};

export default CpuUtilizationChart;
