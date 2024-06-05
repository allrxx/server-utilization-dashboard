// src/components/TrendGraph.jsx
import React from 'react';
import PropTypes from 'prop-types';
import Chart from 'react-apexcharts';

const TrendGraph = ({ title, categories, series, yAxisRange }) => {
  const { minY, maxY } = yAxisRange;

  const options = {
    chart: {
      id: 'trend-graph-chart',
      toolbar: {
        show: true,
      },
    },
    xaxis: {
      categories: categories,
    },
    yaxis: {
      min: minY,
      max: maxY,
      labels: {
        formatter: (value) => value.toFixed(6),
      },
    },
  };

  return (
    <div className="widget-chart">
      <h2>{title}</h2>
      <Chart options={options} series={series} type="line" height={350} />
    </div>
  );
};

TrendGraph.propTypes = {
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

export default TrendGraph;
