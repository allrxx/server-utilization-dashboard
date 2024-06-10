import GraphWidget from '../components/GraphWidget';
import DayWiseWidget from '../components/DayWiseWidget';
import TrendGraph from '../components/TrendGraph';
import './Dashboard.css';
import ChartComponent from '../components/ChartComponent'; 

function Dashboard() {

  const rawData = [
    {
        data_type: 'dataframe',
        data_value: [
            { column_name: 'date', column_values: ['2024-06-10', '2024-06-11', '2024-06-12'] },
            { column_name: 'total_cost', column_values: ['96.65074000000392', '21.676811699998794', '7.96075599999999', '6.262228879999886', '3.7209549999999294'] },
            { column_name: 'namespace', column_values: ['default', 'kube-system', 'kubevirt', 'costsense', 'cdi'] }
        ]
    }
];

  return(
  <div>
    <div className="Chatbot">
            <h1>Caze K8Cost Sense - AI Assistant</h1>
            <ChartComponent rawData={rawData} />
   </div>

    <h1>Dashboard</h1>
    <TrendGraph title="Trend" />
    <DayWiseWidget title="Weekly" />
    <GraphWidget title="Daily" />
  </div>
  )

};

export default Dashboard;
