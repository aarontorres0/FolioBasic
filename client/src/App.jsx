import { useEffect, useState } from "react";
import ChartSelector from "./components/ChartSelector";
import PortfolioCharts from "./components/PortfolioCharts";
import PortfolioTable from "./components/PortfolioTable";
import UploadCSV from "./components/UploadCSV";
import { fetchStockData } from "./utils/stockData";

const availableCharts = [
  { id: 'composition', name: 'Portfolio Composition' },
  { id: 'value', name: 'Portfolio Value' },
  { id: 'performance', name: '30-Day Performance' },
];

function App() {
  const [portfolioData, setPortfolioData] = useState([]);
  const [stockData, setStockData] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedCharts, setSelectedCharts] = useState([]);

  useEffect(() => {
    if (portfolioData.length > 0) {
      const tickers = portfolioData.map((row) => row.Ticker);

      setLoading(true);
      fetchStockData(tickers, portfolioData)
        .then(setStockData)
        .finally(() => setLoading(false));
    }
  }, [portfolioData]);

  const handleSelectChart = (chartId) => {
    setSelectedCharts((prev) =>
      prev.includes(chartId)
        ? prev.filter((id) => id !== chartId)
        : [...prev, chartId]
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-center">FolioBasic</h1>
      <UploadCSV onUpload={setPortfolioData} />
      {portfolioData.length > 0 && (
        <>
          <PortfolioTable
            data={portfolioData}
            stockData={stockData}
            loading={loading}
          />
          <ChartSelector
            availableCharts={availableCharts}
            selectedCharts={selectedCharts}
            onSelectChart={handleSelectChart}
          />
          <PortfolioCharts
            data={portfolioData}
            stockData={stockData}
            selectedCharts={selectedCharts}
          />
        </>
      )}
    </div>
  );
}

export default App;
