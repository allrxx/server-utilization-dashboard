import GraphWidget from '../components/GraphWidget';
import DayWiseWidget from '../components/DayWiseWidget';
import TrendGraph from '../components/TrendGraph';
import './Dashboard.css';
import Bot from '../K8/Bot';

const Dashboard = () => (
  <div>
    <GraphWidget title={'trend'} / >
    <DayWiseWidget title={'trend'} / >
    <TrendGraph title={'trend'} / >
  </div>
);

export default Dashboard;
