import React, { useState, useEffect } from 'react';
import GraphWidget from '../components/GraphWidget';
import DayWiseWidget from '../components/DayWiseWidget';
import TrendGraph from '../components/TrendGraph';
import Papa from 'papaparse';
import './Dashboard.css';

const Dashboard = () => {
  const [hourlyData, setHourlyData] = useState({});
  const [dailyData, setDailyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentDayPage, setCurrentDayPage] = useState(0);
  const [currentWeeklyPage, setCurrentWeeklyPage] = useState(0);

  const parseCSV = async (url) => {
    const response = await fetch(url);
    const text = await response.text();
    return new Promise((resolve, reject) => {
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => resolve(results.data),
        error: (error) => reject(error),
      });
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hourlyData = await parseCSV('/trend_trend.csv');
        const groupedHourlyData = groupDataByDateAndHour(hourlyData);
        setHourlyData(groupedHourlyData);

        const dailyData = await parseCSV('/Daily_Trend.csv');
        setDailyData(dailyData);

        const weeklyData = await parseCSV('/trend_weekly.csv');
        setWeeklyData(weeklyData);
      } catch (error) {
        setError('Error loading CSV data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const groupDataByDateAndHour = (data) => {
    return data.reduce((acc, item) => {
      const date = new Date(item.ds);
      const dateString = date.toLocaleDateString();
      const hour = date.getHours();

      if (!acc[dateString]) {
        acc[dateString] = {};
      }

      if (!acc[dateString][hour]) {
        acc[dateString][hour] = [];
      }

      acc[dateString][hour].push(parseFloat(item.trend));

      return acc;
    }, {});
  };

  const transformHourlyData = (data) => {
    const categories = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    const hourlyValues = Array(24).fill(0);

    Object.keys(data).forEach(hour => {
      const hourIndex = parseInt(hour);
      const hourData = data[hour];
      const avg = hourData.reduce((sum, value) => sum + value, 0) / hourData.length;
      hourlyValues[hourIndex] = avg;
    });

    const minY = Math.min(...hourlyValues);
    const maxY = Math.max(...hourlyValues);

    return {
      categories,
      series: [
        {
          name: 'Hourly Utilization',
          data: hourlyValues,
        },
      ],
      yAxisRange: { minY, maxY },
    };
  };

  const transformDailyData = (data) => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Next Sun'];
    const categories = [];
    const dailyValues = [];
    const dailyLowerValues = [];
    const dailyUpperValues = [];

    const dayDataMap = new Map();

    daysOfWeek.forEach(day => {
      dayDataMap.set(day, {
        daily: [],
        daily_lower: [],
        daily_upper: [],
      });
    });

    data.forEach(item => {
      const date = new Date(item.ds);
      const day = date.toLocaleDateString('en-US', { weekday: 'short' });
      const isSunday = date.getDay() === 0;
      if (dayDataMap.has(day) || isSunday) {
        const key = isSunday ? (categories.includes('Sun') ? 'Next Sun' : 'Sun') : day;
        dayDataMap.get(key).daily.push(parseFloat(item.daily));
        dayDataMap.get(key).daily_lower.push(parseFloat(item.daily_lower));
        dayDataMap.get(key).daily_upper.push(parseFloat(item.daily_upper));
      }
    });

    daysOfWeek.forEach(day => {
      const dayData = dayDataMap.get(day);
      categories.push(day);
      dailyValues.push(dayData.daily.length ? dayData.daily.reduce((a, b) => a + b) / dayData.daily.length : 0);
      dailyLowerValues.push(dayData.daily_lower.length ? Math.min(...dayData.daily_lower) : 0);
      dailyUpperValues.push(dayData.daily_upper.length ? Math.max(...dayData.daily_upper) : 0);
    });

    const minY = Math.min(...dailyLowerValues);
    const maxY = Math.max(...dailyUpperValues);

    return {
      categories,
      series: [
        {
          name: 'Daily Utilization',
          data: dailyValues,
        },
      ],
      yAxisRange: { minY, maxY },
    };
  };

  const transformWeeklyData = (data) => {
    const startIdx = currentWeeklyPage * 6;
    const endIdx = startIdx + 6;
    const paginatedData = data.slice(startIdx, endIdx);

    const categories = [];
    const weeklyValues = [];
    const weeklyLowerValues = [];
    const weeklyUpperValues = [];

    paginatedData.forEach(item => {
      const date = new Date(item.ds);
      const week = date.toLocaleDateString();
      categories.push(week);
      weeklyValues.push(parseFloat(item.weekly));
      weeklyLowerValues.push(parseFloat(item.weekly_lower));
      weeklyUpperValues.push(parseFloat(item.weekly_upper));
    });

    const minY = Math.min(...weeklyLowerValues);
    const maxY = Math.max(...weeklyUpperValues);

    return {
      categories,
      series: [
        {
          name: 'Weekly Utilization',
          data: weeklyValues,
        },
      ],
      yAxisRange: { minY, maxY },
    };
  };

  const dates = Object.keys(hourlyData);
  const currentDateData = dates.length > 0 ? hourlyData[dates[currentPage]] : {};
  const hourlyChartData = transformHourlyData(currentDateData);
  const weeklyChartData = transformWeeklyData(weeklyData);

  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, dates.length - 1));
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 0));
  };

  const handleNextDayPage = () => {
    setCurrentDayPage(prevPage => Math.min(prevPage + 1, Math.ceil(dailyData.length / 7) - 1));
  };

  const handlePrevDayPage = () => {
    setCurrentDayPage(prevPage => Math.max(prevPage - 1, 0));
  };

  const handleNextWeeklyPage = () => {
    setCurrentWeeklyPage(prevPage => Math.min(prevPage + 1, Math.ceil(weeklyData.length / 6) - 1));
  };

  const handlePrevWeeklyPage = () => {
    setCurrentWeeklyPage(prevPage => Math.max(prevPage - 1, 0));
  };

  const startIdx = currentDayPage * 7;
  const endIdx = startIdx + 7;
  const currentWeekData = dailyData.slice(startIdx, endIdx);
  const currentWeekChartData = transformDailyData(currentWeekData);

  return (
    <div className="dashboard">
      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div>
          <TrendGraph
            title="Trend"
            categories={weeklyChartData.categories}
            series={weeklyChartData.series}
            yAxisRange={weeklyChartData.yAxisRange}
            onNext={handleNextWeeklyPage}
            onPrev={handlePrevWeeklyPage}
            disableNext={currentWeeklyPage === Math.ceil(weeklyData.length / 6) - 1}
            disablePrev={currentWeeklyPage === 0}
          />
          <DayWiseWidget
            title={`Weekly`}
            categories={currentWeekChartData.categories}
            series={currentWeekChartData.series}
            yAxisRange={currentWeekChartData.yAxisRange}
            onNext={handleNextDayPage}
            onPrev={handlePrevDayPage}
            disableNext={currentDayPage === Math.ceil(dailyData.length / 7) - 1}
            disablePrev={currentDayPage === 0}
          />
          <GraphWidget
            title={`Daily ${dates[currentPage]}`}
            categories={hourlyChartData.categories}
            series={hourlyChartData.series}
            yAxisRange={hourlyChartData.yAxisRange}
            onNext={handleNextPage}
            onPrev={handlePrevPage}
            disableNext={currentPage === dates.length - 1}
            disablePrev={currentPage === 0}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
