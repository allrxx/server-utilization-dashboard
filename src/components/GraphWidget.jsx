import React from 'react';
import Chart from 'react-apexcharts';

const GraphWidget = ({ title, data }) => {
  const options = {
    chart: {
      id: 'basic-bar',
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    },
    yaxis: {
      labels: {
        formatter: (value) => value.toFixed(3),
      },
    },
  };

  

  const series = [
    {
      name: 'CPU Utilization',
      data: data.cpuUtilization,
    },
  ];

  return (
    <div className="widget-chart">
      <h2>{title}</h2>
      <Chart options={options} series={series} type="line" height={350} />
    </div>
  );
};

export default GraphWidget;