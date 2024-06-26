import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import './Button.css'; // Import the custom CSS file

const CpuUtilizationChart = ({ data }) => {
  const [chartData, setChartData] = useState({
    times: [],
    trendValues: [],
    lowerBond: 0,
    upperBond: 1,
    tooltipData: []
  });

  useEffect(() => {
    const processChartData = () => {
      const times = data.map(item => new Date(item.dateTime).toTimeString().slice(0, 5));
      const trendValues = data.map(item => item.trendValue);
      const lowerBond = Math.min(...data.map(item => item.trendLower));
      const upperBond = Math.max(...data.map(item => item.trendUpper));
      const tooltipData = data.map(item => ({
        dateTime: item.dateTime,
        trendValue: item.trendValue,
        trendLower: item.trendLower,
        trendUpper: item.trendUpper
      }));

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
        upperBond: parseFloat(upperBond.toFixed(7)),
        tooltipData
      });
    };

    processChartData();
  }, [data]);

  const { times, trendValues, lowerBond, upperBond, tooltipData } = chartData;

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
        offsetY: 15
      }
    },
    yaxis: {
      min: lowerBond,
      max: upperBond,
      title: {
        text: 'CPU Utilization'
      }
    },
    stroke: {
      curve: 'smooth'
    },
    title: {
      text: 'CPU Utilization Over Time',
      align: 'left'
    },
    tooltip: {
      custom: function({ series, seriesIndex, dataPointIndex, w }) {
        const item = tooltipData[dataPointIndex];
        const dateTime = new Date(item.dateTime);
        const time = dateTime.toLocaleTimeString();
        const date = dateTime.toLocaleDateString();
        return (
          `<div class="tooltip-container">
            <div class="tooltip-time">${time}</div>
            <div class="tooltip-date">${date}</div>
            <div>Trend Value: ${item.trendValue}</div>
            <div>Trend Lower: ${item.trendLower}</div>
            <div>Trend Upper: ${item.trendUpper}</div>
          </div>`
        );
      }
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
