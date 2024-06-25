// CpuUtilizationChart.js
import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const CpuUtilizationChart = ({ data }) => {
  // Extract the categories (dates) and series data from the input data
  const dates = data.map((item) => item.dateTime);
  const trendValues = data.map((item) => item.trendValue);
  const lowerBond = Math.min(...data.map((item) => item.trendLower));
  const upperBond = Math.max(...data.map((item) => item.trendUpper));

  // Define the chart options
  const chartOptions = {
    chart: {
      id: "cpu-utilization-chart",
      type: "line",
    },
    xaxis: {
      categories: dates,
      title: {
        text: "Date",
      },
      labels: {
        format: "yyyy-MM-dd HH:mm:ss",
      },
    },
    yaxis: {
      min: lowerBond,
      max: upperBond,
      title: {
        text: "CPU Utilization",
      },
    },
    stroke: {
      curve: "smooth",
    },
    title: {
      text: "CPU Utilization Over Time",
      align: "left",
    },
  };

  // Define the series data
  const chartSeries = [
    {
      name: "Trend Value",
      data: trendValues,
    },
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
