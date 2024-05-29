// src/components/GraphWidget.jsx
import React from 'react';
import PropTypes from 'prop-types';
import Chart from 'react-apexcharts';

const GraphWidget = ({ title, categories, series, yAxisRange }) => {
  const { minY, maxY } = yAxisRange;

  const options = {
    chart: {
      id: 'cpu-utilization-chart',
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: categories,
    },
    yaxis: {
      min: minY,
      max: maxY,
      labels: {
        formatter: (value) => value.toFixed(3),
      },
    }
  };

  return (
    <div className="widget-chart">
      <h2>{title}</h2>
      <Chart options={options} series={series} type="line" height={350} />
    </div>
  );
};

GraphWidget.propTypes = {
  title: PropTypes.string.isRequired,
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  series: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      data: PropTypes.arrayOf(PropTypes.number).isRequired,
    })
  ).isRequired,
  yAxisRange: PropTypes.shape({
    minY: PropTypes.number.isRequired,
    maxY: PropTypes.number.isRequired,
  }).isRequired,
};

export default GraphWidget;
