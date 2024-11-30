import { useEffect, useState } from "react";
import AccountSection from "./components/AccountSection";
import Navbar from "./components/Navbar";
import UploadCSV from "./components/UploadCSV";
import { fetchStockData } from "./utils/stockData";

function App() {
  const [portfolioData, setPortfolioData] = useState({});
  const [stockData, setStockData] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("All");
  const [isNavbarOpen, setIsNavbarOpen] = useState(true);

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

  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
  };

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  const accounts = Object.keys(portfolioData);

  return (
    <div className="flex h-screen overflow-hidden">
      <Navbar
        accounts={accounts}
        selectedAccount={selectedAccount}
        onSelectAccount={handleAccountSelect}
        isOpen={isNavbarOpen}
        onToggle={toggleNavbar}
      />
      <div className={`flex-1 overflow-auto transition-all duration-300 ${isNavbarOpen ? "ml-56" : "ml-16"}`}>
        <div className="p-4">
          <h1 className="text-3xl font-bold text-center mb-6">FolioBasic</h1>
          <UploadCSV onUpload={setPortfolioData} />
          {selectedAccount === "All" ? (
            Object.entries(portfolioData).map(([account, data]) => (
              <AccountSection
                key={account}
                account={account}
                data={data}
                stockData={stockData}
                loading={loading}
              />
            ))
          ) : (
            <AccountSection
              account={selectedAccount}
              data={portfolioData[selectedAccount]}
              stockData={stockData}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
