import { useState, useEffect } from 'react';
import UploadCSV from './components/UploadCSV';
import PortfolioTable from './components/PortfolioTable';
import { fetchStockData } from './utils/stockData';

function App() {
  const [portfolioData, setPortfolioData] = useState([]);
  const [stockData, setStockData] = useState({});

  useEffect(() => {
    if (portfolioData.length > 0) {
      const tickers = portfolioData.map((row) => row.Ticker);
      fetchStockData(tickers, portfolioData).then(setStockData);
    }
  }, [portfolioData]);  

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center mb-4">FolioBasic</h1>
      <UploadCSV onUpload={setPortfolioData} />
      {portfolioData.length > 0 && (
        <PortfolioTable data={portfolioData} stockData={stockData} />
      )}
    </div>
  );
}

export default App;
