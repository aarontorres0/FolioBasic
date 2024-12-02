import { Chart } from "chart.js/auto";
import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../AppContext";

const PortfolioCharts = ({ data, selectedCharts }) => {
  const { stockData } = useAppContext();
  const doughnutChartRef = useRef(null);
  const portfolioChartRef = useRef(null);
  const individualChartRef = useRef(null);
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    if (!data.length) return;

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
    if (!data.length || !historicalData.length) return;

    // Doughnut Chart
    if (doughnutChartRef.current) {
      const doughnutContext = doughnutChartRef.current.getContext("2d");
      new Chart(doughnutContext, {
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
          maintainAspectRatio: false,
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
    }

    // Portfolio Value Chart
    if (portfolioChartRef.current) {
      const portfolioContext = portfolioChartRef.current.getContext("2d");
      const combinedPortfolioData = historicalData[0]?.data.map(
        (_, dayIndex) => {
          return historicalData.reduce((totalValue, stock) => {
            const quantity = data.find(
              (row) => row.Ticker === stock.ticker
            )?.Quantity;
            const closingPrice = stock.data[dayIndex]?.close;
            return totalValue + closingPrice * quantity;
          }, 0);
        }
      );
      new Chart(portfolioContext, {
        type: "line",
        data: {
          labels: historicalData[0]?.data.map(
            (entry) => entry.date.split("T")[0]
          ),
          datasets: [
            {
              label: "Portfolio Value",
              data: combinedPortfolioData,
              borderColor: "#4BC0C0",
              backgroundColor: "rgba(75, 192, 192, 0.5)",
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "top" },
          },
          scales: {
            x: {
              title: { display: true, text: "Date" },
            },
            y: {
              title: { display: true, text: "Portfolio Value (USD)" },
              beginAtZero: false,
            },
          },
        },
      });
    }

    // Individual Performance Line Chart
    if (individualChartRef.current) {
      const individualContext = individualChartRef.current.getContext("2d");
      new Chart(individualContext, {
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
    }

    return () => {
      if (doughnutChartRef.current) {
        const doughnutChart = Chart.getChart(doughnutChartRef.current);
        if (doughnutChart) {
          doughnutChart.destroy();
        }
      }
      if (portfolioChartRef.current) {
        const portfolioChart = Chart.getChart(portfolioChartRef.current);
        if (portfolioChart) {
          portfolioChart.destroy();
        }
      }
      if (individualChartRef.current) {
        const individualChart = Chart.getChart(individualChartRef.current);
        if (individualChart) {
          individualChart.destroy();
        }
      }
    };
  }, [historicalData, stockData, selectedCharts]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {selectedCharts.includes("composition") && data.length > 0 && (
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-center">Portfolio Composition</h2>
            <div className="relative w-full h-64">
              <canvas ref={doughnutChartRef}></canvas>
            </div>
          </div>
        </div>
      )}
      {selectedCharts.includes("value") && data.length > 0 && (
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-center">Portfolio Value</h2>
            <canvas ref={portfolioChartRef}></canvas>
          </div>
        </div>
      )}
      {selectedCharts.includes("performance") && data.length > 0 && (
        <div className="col-span-1 md:col-span-2 card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-center">30-Day Performance</h2>
            <canvas ref={individualChartRef}></canvas>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioCharts;
