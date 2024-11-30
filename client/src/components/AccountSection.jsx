import PortfolioCharts from "./PortfolioCharts";
import PortfolioTable from "./PortfolioTable";
import ChartSelector from "./ChartSelector";
import { useEffect, useState } from "react";

const availableCharts = [
  { id: "composition", name: "Portfolio Composition" },
  { id: "value", name: "Portfolio Value" },
  { id: "performance", name: "30-Day Performance" },
];

const AccountSection = ({ account, data, stockData, loading }) => {
    const [selectedCharts, setSelectedCharts] = useState([]);
  
    const handleSelectChart = (chartId) => {
      setSelectedCharts((prev) =>
        prev.includes(chartId)
          ? prev.filter((id) => id !== chartId)
          : [...prev, chartId]
      );
    };
  
    return (
      <div className="mb-8 p-4 border rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">{account}</h2>
        <PortfolioTable data={data} stockData={stockData} loading={loading} />
        <ChartSelector
          availableCharts={availableCharts}
          selectedCharts={selectedCharts}
          onSelectChart={handleSelectChart}
        />
        <PortfolioCharts 
          data={data} 
          stockData={stockData} 
          selectedCharts={selectedCharts} 
        />
      </div>
    );
  };

export default AccountSection;
