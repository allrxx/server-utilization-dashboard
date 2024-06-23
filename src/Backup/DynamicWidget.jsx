import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import Button from "./Button";
import { getTrend } from "../../services/api";
import "./Button.css";

const DynamicWidget = ({ title, cluster, namespace, resource }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [seasonality, setSeasonality] = useState("trend");

  const primary = "#181818";
  const secondary = "#222222";
  const tertiary = "#383838";
  const textColor = "#dddddd";

  const columnNames = {
    trend: { date: "dateTime", value: "trendValue", lower: "trendLower", upper: "trendUpper" },
    daily: { date: "dateTime", value: "trendValue", lower: "trendLower", upper: "trendUpper" },
    weekly: { date: "dateTime", value: "trendValue", lower: "trendLower", upper: "trendUpper" },
  };

  const fetchData = async (seasonality) => {
    try {
      setLoading(true);
      const jsonData = await getTrend(cluster, namespace, resource, seasonality);
      setData(jsonData.data);
    } catch (error) {
      setError("Error loading data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(seasonality);
  }, [seasonality]);

  const transformData = (data, currentPage) => {
    const columns = columnNames[seasonality];
    let categories = [];
    let trendData = [];
    let lowerData = [];
    let upperData = [];
    const tooltipData = [];

    const mainPoints = seasonality === "trend" ? 12 : seasonality === "daily" ? 24 : 7;
    const subPoints = seasonality === "trend" ? 20 : seasonality === "daily" ? 6 : 24;
    const totalPoints = mainPoints * (1 + subPoints);

    const paginatedData = data.slice(currentPage * totalPoints, (currentPage + 1) * totalPoints);
    const daySet = new Set();

    paginatedData.forEach((item) => {
      const dateObj = new Date(item[columns.date]);
      let formattedDate;

      if (seasonality === "trend") {
        formattedDate = `${dateObj.getDate()}${getOrdinalSuffix(dateObj.getDate())} ${dateObj.toLocaleDateString("en-US", { month: "short" }).toUpperCase()}'${dateObj.getFullYear().toString().slice(-2)}`;
      } else if (seasonality === "daily") {
        formattedDate = `${dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" })} ${dateObj.getHours()}:${dateObj.getMinutes() < 10 ? "0" : ""}${dateObj.getMinutes()}`;
      } else if (seasonality === "weekly") {
        formattedDate = `${dateObj.toLocaleDateString("en-US", { weekday: "short" })} ${dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
        if (daySet.has(formattedDate.split(" ")[0])) return;
        daySet.add(formattedDate.split(" ")[0]);
      }

      const trendValue = parseFloat(item[columns.value]);
      const lowerValue = parseFloat(item[columns.lower]);
      const upperValue = parseFloat(item[columns.upper]);

      categories.push(formattedDate);
      trendData.push(trendValue);
      tooltipData.push({ formattedDate, trendValue, lowerValue, upperValue });

      if (trendValue !== lowerValue || trendValue !== upperValue) {
        lowerData.push(lowerValue);
        upperData.push(upperValue);
      } else {
        lowerData.push(null);
        upperData.push(null);
      }
    });

    return {
      categories,
      series: [
        { name: "General Trend", data: trendData, color: "#00BFFF", strokeWidth: 4 },
        { name: "Lower Bound", data: lowerData, color: "#00FF00", strokeWidth: 2 },
        { name: "Upper Bound", data: upperData, color: "#FF0000", strokeWidth: 2 },
      ],
      tooltipData,
    };
  };

  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  };

  const chartData = transformData(data, currentPage);

  const handleNextPage = () => {
    if (seasonality === "trend") {
      setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(data.length / (12 * 21)) - 1));
    } else if (seasonality === "daily") {
      setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(data.length / (24 * 7)) - 1));
    } else if (seasonality === "weekly") {
      setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(data.length / (7 * 25)) - 1));
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <div className="header">
        <h2>{title}</h2>
        <div className="controls">
          <Button onClick={handlePrevPage} disabled={currentPage === 0}>{"<"}</Button>
          <Button onClick={handleNextPage} disabled={currentPage === Math.ceil(data.length / (seasonality === "trend"? 12 * 21 : seasonality === "daily"? 24 * 7 : 7 * 25)) - 1}>{">"}</Button>
          <select className="dropdown" value={seasonality} onChange={(e) => { setSeasonality(e.target.value); setCurrentPage(0); }}>
            <option value="trend">Trend</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
      </div>
      <Chart
        options={{
          chart: {
            id: "dynamic-widget",
            toolbar: {
              show: true,
              tools: {
                download: true,
                selection: true,
                zoom: true,
                zoomin: true,
                zoomout: true,
                pan: true,
                reset: true,
              },
            },
          },
          xaxis: {
            categories: chartData.categories,
            tickAmount: seasonality === "trend" ? 12 : seasonality === "daily" ? 24 : 7,
            labels: {
              formatter: (value) => {
                if (!value) return "";
                if (seasonality === "trend") {
                  const [day, monthYear] = value.split(" ");
                  return `${day} ${monthYear}`;
                } else if (seasonality === "daily" || seasonality === "weekly") {
                  return value;
                }
                return value;
              },
              style: { fontSize: "11px", colors: textColor },
              offsetY: 10,
              rotate: seasonality === "weekly" ? -45 : 0,
            },
          },
          yaxis: {
            labels: {
              formatter: (value) => (value !== null ? value.toFixed(6) : "N/A"),
              style: { fontSize: "11px", colors: textColor },
            },
          },
          tooltip: {
            enabled: true,
            custom: ({ dataPointIndex }) => {
              const pointData = chartData.tooltipData[dataPointIndex];
              const seriesColors = ["#00BFFF", "#00FF00", "#FF0000"];
              const seriesNames = ["trendValue", "lowerValue", "upperValue"];
              return `
                <div style="padding: 10px; border: 1px solid ${tertiary}; background: ${primary}; color: ${textColor}">
                  <span style="font-size: 14px; font-weight: bold">${pointData.formattedDate}</span>
                  <br /><br />
                  ${seriesNames.map((name, idx) => `
                    <span style="display: flex; align-items: center; margin-bottom: 5px;">
                      <span style="width: 10px; height: 10px; background-color: ${seriesColors[idx]}; border-radius: 50%; display: inline-block; margin-right: 5px;"></span>
                      <strong style="margin-right: 10px;">${name}: </strong>
                      ${pointData[name] || "N/A"}
                    </span>
                  `).join("")}
                </div>
              `;
            },
          },
          legend: {
            show: chartData.series.filter(serie => serie.data.some(point => point !== null)).length > 1,
            labels: { colors: textColor, useSeriesColors: false },
          },
        }}
        series={chartData.series.filter((serie) => serie.data.some((point) => point !== null))}
        type="line"
        height="350"
      />
    </div>
  );
};

export default DynamicWidget;
