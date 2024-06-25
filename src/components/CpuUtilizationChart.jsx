import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

const CpuUtilizationChart = ({ data }) => {
  const [chartData, setChartData] = useState({
    times: [],
    trendValues: [],
    lowerBond: 0,
    upperBond: 1
  });

  useEffect(() => {
    const processChartData = () => {
      const times = data.map(item => new Date(item.dateTime).toTimeString().slice(0, 5));
      const trendValues = data.map(item => item.trendValue);
      const lowerBond = Math.min(...data.map(item => item.trendLower));
      const upperBond = Math.max(...data.map(item => item.trendUpper));

      const filteredTimes = [];
      let lastHour = null;
      times.forEach((time, index) => {
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
        lowerBond,
        upperBond
      });
    };

    processChartData();
  }, [data]);

  const { times, trendValues, lowerBond, upperBond } = chartData;

  const chartOptions = {
    chart: {
      id: 'cpu-utilization-chart',
      type: 'line'
    },
    xaxis: {
      categories: times,
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
