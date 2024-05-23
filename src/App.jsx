import React from 'react';
import './App.css';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Server Utilization Dashboard</h1>
      </header>
      <main>
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
