// src/components/ChartComponent.js
import React from 'react';
import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';

class ChartComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            options: {
                chart: {
                    type: 'bar',
                    background: '#ffffff',
                    toolbar: {
                        show: false,
                    }
                },
                series: [],
                xaxis: {
                    categories: [],
                    title: {
                        text: 'Namespace',
                        style: {
                            color: '#333'
                        }
                    }
                },
                yaxis: {
                    min: 0,
                    max: 0,
                    labels: {
                        formatter: function (value) {
                            return value.toFixed(2);
                        }
                    },
                    title: {
                        text: 'Cost ($)',
                        style: {
                            color: '#333'
                        }
                    }
                },
                tooltip: {
                    y: {
                        formatter: function (value) {
                            return value.toFixed(2);
                        }
                    }
                },
                dataLabels: {
                    enabled: true,
                    formatter: function (val) {
                        return val.toFixed(2);
                    }
                }
            }
        };

        if (props.rawData) {
            const dataFrame = props.rawData.find(item => item.data_type === 'dataframe');
            
            if (dataFrame) {
                const dates = dataFrame.data_value[0].column_values;
                const costs = dataFrame.data_value[1].column_values.map(value => parseFloat(value));
                const namespaces = dataFrame.data_value[2].column_values;

                this.state = {
                    options: {
                        ...this.state.options,
                        series: [{
                            name: 'Total Resource Cost',
                            data: costs.map((cost, index) => ({ x: namespaces[index], y: cost }))
                        }],
                        xaxis: {
                            ...this.state.options.xaxis,
                            categories: namespaces,
                        },
                        yaxis: {
                            ...this.state.options.yaxis,
                            min: Math.floor(Math.min(...costs)),
                            max: Math.ceil(Math.max(...costs)),
                        }
                    }
                };
            }
        }
    }

    render() {
        return (
            <div id="chart">
                <ReactApexChart options={this.state.options} series={this.state.options.series} type="bar" height={400} />
            </div>
        );
    }
}

ChartComponent.propTypes = {
    rawData: PropTypes.arrayOf(PropTypes.shape({
        data_type: PropTypes.string.isRequired,
        data_value: PropTypes.arrayOf(PropTypes.shape({
            column_values: PropTypes.array.isRequired
        })).isRequired
    })).isRequired
};

export default ChartComponent;
