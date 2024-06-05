// src/components/GraphWidget.jsx
import React from 'react';
import PropTypes from 'prop-types';
import Chart from 'react-apexcharts';
import Button from './Button'; // Import the Button component

const GraphWidget = ({ title, categories, series, yAxisRange, onNext, onPrev, disableNext, disablePrev }) => {
  const { minY, maxY } = yAxisRange;

  const options = {
    chart: {
      id: 'cpu-utilization-chart',
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
        formatter: (value) => value.toFixed(3),
      },
    }
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
  onNext: PropTypes.func.isRequired,
  onPrev: PropTypes.func.isRequired,
  disableNext: PropTypes.bool.isRequired,
  disablePrev: PropTypes.bool.isRequired,
};

export default GraphWidget;
