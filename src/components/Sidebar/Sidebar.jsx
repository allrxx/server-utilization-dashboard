// src/components/Sidebar.jsx
import React, { useState } from 'react';

const Sidebar = ({ trends, servers, onTrendChange, onServerChange }) => {
  const [selectedTrend, setSelectedTrend] = useState('');
  const [selectedServer, setSelectedServer] = useState('');

  const handleTrendChange = (event) => {
    const trend = event.target.value;
    setSelectedTrend(trend);
    onTrendChange(trend);
  };

  const handleServerChange = (event) => {
    const server = event.target.value;
    setSelectedServer(server);
    onServerChange(server);
  };

  return (
    <div className="sidebar">
      <h2>Settings</h2>
      <div className="form-group">
        <label htmlFor="trend-select">Select Trend</label>
        <select id="trend-select" value={selectedTrend} onChange={handleTrendChange}>
          <option value="">--Choose a trend--</option>
          {trends.map((trend) => (
            <option key={trend.id} value={trend.id}>
              {trend.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="server-select">Select Server</label>
        <select id="server-select" value={selectedServer} onChange={handleServerChange}>
          <option value="">--Choose a server--</option>
          {servers.map((server) => (
            <option key={server.id} value={server.id}>
              {server.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Sidebar;
