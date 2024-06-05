// src/components/TrendGraph.jsx
import React from 'react';
import PropTypes from 'prop-types';
import Chart from 'react-apexcharts';
import Button from './Button'; // Import the Button component

const TrendGraph = ({ title, categories, series, yAxisRange, onNext, onPrev, disableNext, disablePrev }) => {
  const { minY, maxY } = yAxisRange;

  const options = {
    chart: {
      id: 'trend-graph-chart',
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: categories,
      tickAmount: 6, // Adjust the number of ticks on the x-axis
      labels: {
        style: {
          fontSize: '12px',
        },
        formatter: (value) => value,
        padding: 10, // Add padding between x-axis labels
      },
    },
    yaxis: {
      min: minY,
      max: maxY,
      tickAmount: 10, // Adjust the number of ticks on the y-axis
      labels: {
        formatter: (value) => value.toFixed(6),
        style: {
          fontSize: '10px', // Make the y-axis labels a bit smaller
        },
        
      },
    },
  };

  return (
    <div className="widget-chart">
      <div className="widget-title">
        <h2>{title}</h2>
        <div className="button-container">
          <Button onClick={onPrev} disabled={disablePrev}>{'<'}</Button>
          <Button onClick={onNext} disabled={disableNext}>{'>'}</Button>
        </div>
      </div>
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
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  disableNext: PropTypes.bool.isRequired,
  disablePrev: PropTypes.bool.isRequired,
};

export default TrendGraph;
