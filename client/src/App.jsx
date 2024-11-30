import { useEffect, useState } from "react";
import AccountSection from "./components/AccountSection";
import UploadCSV from "./components/UploadCSV";
import { fetchStockData } from "./utils/stockData";

function App() {
  const [portfolioData, setPortfolioData] = useState({});
  const [stockData, setStockData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const allTickers = Object.values(portfolioData)
      .flat()
      .map((row) => row.Ticker);
    if (allTickers.length > 0) {
      setLoading(true);
      fetchStockData(allTickers, Object.values(portfolioData).flat())
        .then(setStockData)
        .finally(() => setLoading(false));
    }
  }, [portfolioData]);

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-center mb-6">FolioBasic</h1>
      <UploadCSV onUpload={setPortfolioData} />
      {Object.entries(portfolioData).map(([account, data]) => (
        <AccountSection
          key={account}
          account={account}
          data={data}
          stockData={stockData}
          loading={loading}
        />
      ))}
    </div>
  );
}

export default App;
