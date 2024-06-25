import React, { useState, useEffect } from 'react';
import GraphWidget from '../components/GraphWidget';
import DayWiseWidget from '../components/DayWiseWidget';
import TrendGraph from '../components/TrendGraph';
import './Dashboard.css';
import Bot from '../K8/Bot';
import CpuUtilizationChart from '../components/CpuUtilizationChart';
import { getTrendData } from '../services/api';

const Dashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trendData = await getTrendData();
        setData(trendData.data); // Assuming trendData has a 'data' property that contains the relevant data
      } catch (error) {
        console.error('Error fetching trend data:', error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <CpuUtilizationChart data={data} />
      <GraphWidget title={'trend'} />
      <DayWiseWidget title={'trend'} />
      <TrendGraph title={'trend'} />
    </div>
  );
};

export default Dashboard;
