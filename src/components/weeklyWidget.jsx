import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { getTrendData } from '../services/api';
import './Button.css'

const WeeklyWidget = ({ cluster, resource }) => {
  const [chartData, setChartData] = useState({
    days: [],
    trendValues: [],
    lowerBond: 0,
    upperBond: 1,
    tooltipData: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trendData = await getTrendData(cluster, resource, 'weekly');
        processChartData(trendData.data);
      } catch (error) {
        console.error('Error fetching trend data:', error.message);
      }
    };

    fetchData();
  }, [cluster, resource]);

  const processChartData = (data) => {
    const days = [];
    const trendValues = [];
    const tooltipData = [];
    let lowerBond = Infinity;
    let upperBond = -Infinity;

    const dayMapping = {
      0: 'Sunday',
      1: 'Monday',
      2: 'Tuesday',
      3: 'Wednesday',
      4: 'Thursday',
      5: 'Friday',
      6: 'Saturday'
    };

    const groupedData = {};

    data.forEach(item => {
      const date = new Date(item.dateTime);
      const day = dayMapping[date.getDay()];
      if (!groupedData[day]) {
        groupedData[day] = [];
      }
      groupedData[day].push(item);
      lowerBond = Math.min(lowerBond, item.trendLower);
      upperBond = Math.max(upperBond, item.trendUpper);
    });

    // Ensure the labels start with Sunday and span to the next Sunday
    const orderedDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Add an initial Sunday
    days.push('Sunday');
    trendValues.push(groupedData['Sunday'][0].trendValue);
    tooltipData.push(groupedData['Sunday'][0]);

    orderedDays.forEach(day => {
      if (groupedData[day]) {
        groupedData[day].forEach((item, index) => {
          trendValues.push(item.trendValue);
          tooltipData.push(item);
          if (index === 0) {
            days.push(day);
          } else {
            days.push('');
          }
        });
      }
    });

    // Add an extra Sunday at the end if it's not already included
    if (days[days.length - 1] !== 'Sunday') {
      days.push('Sunday');
      trendValues.push(groupedData['Sunday'][0].trendValue);
      tooltipData.push(groupedData['Sunday'][0]);
    }

    setChartData({
      days,
      trendValues,
      lowerBond: parseFloat(lowerBond.toFixed(7)),
      upperBond: parseFloat(upperBond.toFixed(7)),
      tooltipData
    });
  };

  const { days, trendValues, lowerBond, upperBond, tooltipData } = chartData;

  const chartOptions = {
    chart: {
      id: 'weekly-utilization-chart',
      type: 'line'
    },
    xaxis: {
      categories: days,
      title: {
        text: 'Day'
      },
      labels: {
        offsetY: 15 // Increase this value to create more space
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
      text: 'CPU Utilization Over the Week',
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

export default WeeklyWidget;