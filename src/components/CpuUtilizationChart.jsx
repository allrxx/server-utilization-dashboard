import React from 'react';
import Chart from 'react-apexcharts';

const CpuUtilizationChart = ({ data }) => {
  // Extract the categories (time) and series data from the input data
  const times = data.map(item => new Date(item.dateTime).toTimeString().slice(0, 5));
  const trendValues = data.map(item => item.trendValue);
  const lowerBond = Math.min(...data.map(item => item.trendLower));
  const upperBond = Math.max(...data.map(item => item.trendUpper));

  // Function to filter out duplicate hours, only showing one label per hour
  const filteredTimes = [];
  let lastHour = null;
  times.forEach((time, index) => {
    const currentHour = time.slice(0, 2); // Extract hour
    if (currentHour !== lastHour) {
      filteredTimes.push(time);
      lastHour = currentHour;
    } else {
      filteredTimes.push('');
    }
  });

  // Define the chart options
  const chartOptions = {
    chart: {
      id: 'cpu-utilization-chart',
      type: 'line'
    },
    xaxis: {
      categories: filteredTimes,
      title: {
        text: 'Time'
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
    }
  };

  // Define the series data
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
