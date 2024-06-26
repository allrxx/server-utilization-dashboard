import React, { useState, useEffect } from 'react';
import CpuUtilizationChart from '../components/CpuUtilizationChart';
import WeeklyWidget from '../components/WeeklyWidget';
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

  const handleSeasonalityChange = (event) => {
    setSeasonality(event.target.value);
  };

  return (
    <div>
      <select onChange={handleSeasonalityChange} value={seasonality}>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        {/* Add more options as needed */}
      </select>
      {seasonality === 'daily' ? (
        <CpuUtilizationChart data={data} />
      ) : (
        <WeeklyWidget cluster={cluster} resource={resource} seasonality={seasonality} />
      )}
    </div>
  );
};

export default Dashboard;
