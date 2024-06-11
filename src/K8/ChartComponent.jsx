// src/components/ChartComponent.js
import React from "react";
import PropTypes from "prop-types";
import ReactApexChart from "react-apexcharts";

class ChartComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          type: "bar",
          background: "#1e1e1e", // Dark background
          toolbar: {
            show: false,
          },
        },
        series: [],
        xaxis: {
          categories: [],
          title: {
            text: "Namespace",
            style: {
              color: "#fff", // Light text color
            },
          },
          labels: {
            style: {
              colors: "#fff", // Light text color
            },
          },
        },
        yaxis: {
          min: 0,
          max: 0,
          labels: {
            formatter: function (value) {
              return value.toFixed(2);
            },
            style: {
              colors: "#fff", // Light text color
            },
          },
          title: {
            text: "Count",
            style: {
              color: "#fff", // Light text color
            },
          },
        },
        tooltip: {
          theme: "dark", // Dark theme for tooltip
          y: {
            formatter: function (value) {
              return value.toFixed(2);
            },
          },
        },
        dataLabels: {
          enabled: true,
          style: {
            colors: ["#fff"], // Light text color for data labels
          },
          formatter: function (val) {
            return val.toFixed(2);
          },
        },
        plotOptions: {
          bar: {
            dataLabels: {
              position: "center", // Data labels position
            },
          },
        },
      },
    };
  }

  componentDidMount() {
    if (this.props.rawData) {
      this.initializeChartData(this.props.rawData);
    }
  }

  initializeChartData = (rawData) => {
    const dataFrame = rawData.find((item) => item.data_type === "dataframe");

    if (dataFrame) {
      const categories = dataFrame.data_value[0].column_values; // Assuming first column is for x-axis categories
      const columns = dataFrame.data_value.slice(1); // Remaining columns for data series

      const series = columns.map((column) => ({
        name: column.column_name,
        data: column.column_values.map((value) => parseFloat(value)),
      }));

      const allValues = columns.reduce(
        (acc, column) =>
          acc.concat(
            column.column_values
              .map((value) => parseFloat(value))
              .filter((value) => !isNaN(value))
          ),
        []
      );
      const minValue =
        allValues.length > 0 ? Math.floor(Math.min(...allValues)) : 0; // Default minValue to 0 if allValues is empty
      const maxValue =
        allValues.length > 0 ? Math.ceil(Math.max(...allValues)) : 0; // Default maxValue to 0 if allValues is empty

      this.setState({
        options: {
          ...this.state.options,
          series: series,
          xaxis: {
            ...this.state.options.xaxis,
            categories: categories,
          },
          yaxis: {
            ...this.state.options.yaxis,
            min: minValue,
            max: maxValue,
          },
          dataLabels: {
            enabled: true,
            style: {
              colors: ["#fff"],
              fontSize: "9px",
            },
          }
        },
      });
    }
  };

  render() {
    return (
      <div
        id="chart"
        style={{
          marginBottom: "40px",
          width: "auto",
          height: "auto",
          minWidth: "100vh",
        }}
      >
        {" "}
        {/* Added margin-bottom */}
        <ReactApexChart
          options={this.state.options}
          series={this.state.options.series}
          type={this.state.options.chart.type}
          height={600}
        />{" "}
        {/* Increased height */}
      </div>
    );
  }
}

ChartComponent.propTypes = {
  rawData: PropTypes.arrayOf(
    PropTypes.shape({
      data_type: PropTypes.string.isRequired,
      data_value: PropTypes.arrayOf(
        PropTypes.shape({
          column_name: PropTypes.string,
          column_values: PropTypes.array.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
};

export default ChartComponent;
