import GraphWidget from '../components/GraphWidget';
import DayWiseWidget from '../components/DayWiseWidget';
import TrendGraph from '../components/TrendGraph';
import './Dashboard.css';
import Bot from '../K8/Bot';
import MyComponent from '../K8/MyComponent';
require('dotenv').config();

const Dashboard = () => (
  <div>
    <MyComponent></MyComponent>
  </div>
);

export default Dashboard;
