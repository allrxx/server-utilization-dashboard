import React, { useState, useEffect } from 'react';
import CpuUtilizationChart from '../components/CpuUtilizationChart';
import WeeklyWidget from '../components/weeklyWidget';
import { getTrendData } from '../services/api';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [cluster, setCluster] = useState('datacenter-cluster');
  const [resource, setResource] = useState('CPU');
  const [seasonality, setSeasonality] = useState('daily');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const trendData = await getTrendData(cluster, resource, seasonality);
        setData(trendData.data); // Assuming trendData has a 'data' property that contains the relevant data
      } catch (error) {
        console.error('Error fetching trend data:', error.message);
      }
    };

    fetchData();
  }, [cluster, resource, seasonality]);

  return (
    <div>
      <CpuUtilizationChart data={data} />
      <WeeklyWidget cluster={cluster} resource={resource} />
      {/* <GraphWidget title="Graph" cluster={cluster} resource={resource} />
      <DayWiseWidget title="trend" />
      <TrendGraph title="trend" /> */}
    </div>
  );
};

export default Dashboard;
