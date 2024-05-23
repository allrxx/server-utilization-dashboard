import React from 'react';
import Chart from 'react-apexcharts';

const WeeklyGW = ({ title, data }) => {
  const options = {
    chart: {
      id: 'basic-bar',
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    },
    yaxis: {
      min: 0,
      max: 1,
      labels: {
        formatter: (value) => value.toFixed(3),
      },
    },
    tooltip: {
      y: {
        formatter: (value) => value.toFixed(3),
      },
    },
  };

  const series = [
    {
      name: 'CPU Utilization',
      data: data.cpuUtilization.map((value) => value / 100), // Ensure CPU utilization values are between 0 and 100
    },
  ];

  return (
    <div className="weekly-wg">
      <h2>{title}</h2>
      <Chart options={options} series={series} type="line" height={350} />
    </div>
  );
};

export default WeeklyGW;
