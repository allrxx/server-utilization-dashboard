import React from 'react';
import Chart from 'react-apexcharts';

const DailyGW = ({ title, data }) => {
  const options = {
    chart: {
      id: 'basic-bar',
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: [
        "12AM", "1AM", "2AM", "3AM", "4AM", "5AM", "6AM", "7AM", "8AM", "9AM",
        "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM", "7PM",
        "8PM", "9PM", "10PM", "11PM"
      ],
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
    <div className="daily-wg">
      <h2>{title}</h2>
      <Chart options={options} series={series} type="line" height={350} />
    </div>
  );
};

export default DailyGW;
