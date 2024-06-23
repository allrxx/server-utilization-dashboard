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
      message: null,
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
      const objectColumns = dataFrame.data_value.filter(column => column.column_type === "object");
      let message = null;

      if (objectColumns.length > 2) {
        // Exclude columns and set a message
        dataFrame.data_value = dataFrame.data_value.filter(column => column.column_type !== "object");
        message = "Some columns were excluded because they are of type 'object' and there are more than two such columns.";
      } else if (objectColumns.length === 2) {
        // Combine the second object column with the first and display under x-axis
        const [firstColumn, secondColumn] = objectColumns;
        firstColumn.column_values = firstColumn.column_values.map((value, index) => 
          `${value} + ${secondColumn.column_values[index]}`
        );
        // Remove the second object column from dataFrame.data_value
        const secondColumnIndex = dataFrame.data_value.indexOf(secondColumn);
        dataFrame.data_value.splice(secondColumnIndex, 1);
      }

      const categories = dataFrame.data_value[0].column_values;
      const columns = dataFrame.data_value.slice(1);

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
      const minValue = allValues.length > 0 ? Math.floor(Math.min(...allValues)) : 0;
      const maxValue = allValues.length > 0 ? Math.ceil(Math.max(...allValues)) : 0;

      this.setState({
        options: {
          ...this.state.options,
          series: series,
          xaxis: {
            ...this.state.options.xaxis,
            categories: categories,
          },
          yaxis: {
                        formatter: function (value) {
              return value.toFixed(2);
            },
            ...this.state.options.yaxis,
            min: minValue,
            max: maxValue,
          },
          dataLabels: {
            enabled: true,
            style: {
              colors: ["#fff"],
              fontSize: "9px",
            }
          }
        },
        message: message,
      });
    }
  };

  render() {
    return (
      <div>
        {this.state.message && <p>{this.state.message}</p>}
        <div
          id="chart"
          style={{
            marginBottom: "40px",
            width: "auto",
            height: "auto",
            minWidth: "100vh",
          }}
        >
          <ReactApexChart
            options={this.state.options}
            series={this.state.options.series}
            type={this.state.options.chart.type}
            height={600}
          />
        </div>
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
