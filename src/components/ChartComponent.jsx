// src/components/ChartComponent.js
import React from 'react';
import ReactApexChart from 'react-apexcharts';

class ChartComponent extends React.Component {
    constructor(props) {
        super(props);
        const { rawData } = props;
        const dataFrame = rawData.find(item => item.data_type === 'dataframe');
        
        if (dataFrame) {
            this.dates = dataFrame.data_value[0].column_values;
            this.costs = dataFrame.data_value[1].column_values.map(value => parseFloat(value));
            this.namespaces = dataFrame.data_value[2].column_values; // Assuming namespaces are the third column
        }

        this.state = {
            options: {
                chart: {
                    type: 'bar',
                    background: '#ffffff',
                    toolbar: {
                        show: false,
                    }
                },
                series: [{
                    name: 'Total Resource Cost',
                    data: this.costs.map((cost, index) => ({ x: this.namespaces[index], y: cost }))
                }],
                xaxis: {
                    categories: this.namespaces,
                    title: {
                        text: 'Namespace',
                        style: {
                            color: '#333'
                        }
                    }
                },
                yaxis: {
                    min: Math.floor(Math.min(...this.costs)),
                    max: Math.ceil(Math.max(...this.costs)),
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
    }

    render() {
        return (
            <div id="chart">
                <ReactApexChart options={this.state.options} series={this.state.options.series} type="bar" height={400} />
            </div>
        );
    }
}

export default ChartComponent;
