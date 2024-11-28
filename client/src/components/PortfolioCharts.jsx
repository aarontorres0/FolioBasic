import { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";

const PortfolioCharts = ({ data, stockData }) => {
  const doughnutChartRef = useRef(null);
  const barChartRef = useRef(null);
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    if (!data.length) return;

    // Fetch historical data for all tickers
    const fetchHistoricalData = async () => {
      const fetchedData = await Promise.all(
        data.map(async (row) => {
          const response = await fetch(
            `http://localhost:5000/api/historical?symbol=${row.Ticker}`
          );
          const result = await response.json();
          return { ticker: row.Ticker, data: result };
        })
      );
      setHistoricalData(fetchedData);
    };

    fetchHistoricalData();
  }, [data]);

  useEffect(() => {
    if (!historicalData.length) return;

    const doughnutCtx = doughnutChartRef.current.getContext("2d");
    new Chart(doughnutCtx, {
      type: "doughnut",
      data: {
        labels: data.map((row) => row.Ticker),
        datasets: [
          {
            data: data.map(
              (row) => stockData[row.Ticker]?.price * row.Quantity || 0
            ),
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
              "#FF9F40",
            ],
            hoverOffset: 10,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top" },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const ticker = tooltipItem.label;
                const value = tooltipItem.raw.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                });
                return `${ticker}: ${value}`;
              },
            },
          },
        },
        cutout: "50%",
      },
    });

    const barCtx = barChartRef.current.getContext("2d");
    new Chart(barCtx, {
      type: "line",
      data: {
        labels: Array.from(
          { length: historicalData[0].data.length },
          (_, i) => historicalData[0].data[i].date.split("T")[0]
        ),
        datasets: historicalData.map((stock, idx) => ({
          label: stock.ticker,
          data: stock.data.map((entry) => entry.close),
          borderColor: `rgba(${50 * idx}, ${100 + 10 * idx}, 200, 1)`,
          backgroundColor: `rgba(${50 * idx}, ${100 + 10 * idx}, 200, 0.5)`,
          tension: 0.3,
        })),
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "top" },
        },
        scales: {
          x: { title: { display: true, text: "Date" } },
          y: {
            title: { display: true, text: "Price (USD)" },
            beginAtZero: false,
          },
        },
      },
    });

    return () => {
      Chart.getChart(doughnutCtx)?.destroy();
      Chart.getChart(barCtx)?.destroy();
    };
  }, [historicalData, stockData]);

  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-center">Portfolio Composition</h2>
          <canvas ref={doughnutChartRef}></canvas>
        </div>
      </div>
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-center">30-Day Performance</h2>
          <canvas ref={barChartRef}></canvas>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCharts;
