import GraphWidget from '../components/GraphWidget';
import DayWiseWidget from '../components/DayWiseWidget';
import TrendGraph from '../components/TrendGraph';
import './Dashboard.css';

const Dashboard = () => (
  <div>
    <TrendGraph title="Trend" />
    <DayWiseWidget title="Weekly" />
    <GraphWidget title="Daily" />
  </div>
);

export default Dashboard;
