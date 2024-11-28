import { useEffect, useState } from "react";
import PortfolioCharts from "./components/PortfolioCharts";
import PortfolioTable from "./components/PortfolioTable";
import UploadCSV from "./components/UploadCSV";
import { fetchStockData } from "./utils/stockData";

function App() {
  const [portfolioData, setPortfolioData] = useState([]);
  const [stockData, setStockData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (portfolioData.length > 0) {
      const tickers = portfolioData.map((row) => row.Ticker);

      setLoading(true);
      fetchStockData(tickers, portfolioData)
        .then(setStockData)
        .finally(() => setLoading(false));
    }
  }, [portfolioData]);

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
          <PortfolioCharts data={portfolioData} stockData={stockData} />
        </>
      )}
    </div>
  );
}

export default App;
