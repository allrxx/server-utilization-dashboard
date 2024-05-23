import React from 'react';
import GraphWidget from '../components/GraphWidget.jsx'; // Adjust the path to GraphWidget
import WeeklyWidget from '../components/WeeklyGW.jsx'
import DailyWG from '../components/DailyGW.jsx';
import { mockData1, mockData2, mockData3, mockData4 } from '../utils/mockData.js'; // Adjust the path to mockData

const Dashboard = () => {
  return (
    <div className="dashboard">
      <DailyWG title="Daily" data={mockData3} />
      <WeeklyWidget title="Weekly" data={mockData2} />
      <GraphWidget title="Monthly" data={mockData1} />
    </div>
  );
};

export default Dashboard;