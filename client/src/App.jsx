import { useEffect } from 'react'
import { useAppContext } from './AppContext'
import AccountSection from './components/AccountSection'
import Navbar from './components/Navbar'
import { fetchStockData } from './utils/stockData'

const App = () => {
  const {
    setLoading,
    isNavbarOpen,
    portfolioData,
    selectedAccount,
    setStockData
  } = useAppContext()

  useEffect(() => {
    const allTickers = Object.values(portfolioData)
      .flat()
      .map((row) => row.Ticker)
    if (allTickers.length > 0) {
      setLoading(true)
      fetchStockData(Object.values(portfolioData).flat())
        .then(setStockData)
        .finally(() => setLoading(false))
    }
  }, [portfolioData])

  const accounts = Object.keys(portfolioData)

  return (
    <div className='flex h-screen overflow-hidden'>
      <Navbar accounts={accounts} />
      <div

        className={`flex-1 overflow-auto transition-all duration-300 ${isNavbarOpen ? 'ml-56' : 'ml-16'
                    }`}
      >
        <div className='p-4'>
          <h1 className='text-3xl font-bold text-center mb-6'>FolioBasic</h1>
          {accounts.length === 0
            ? (
              <div className='text-center text-xl mt-10'>
                Upload a CSV file with your portfolio data to get started.
              </div>
              )
            : selectedAccount === 'All'
              ? (
                  Object.entries(portfolioData).map(([account, data]) => (
                    <AccountSection key={account} account={account} data={data} />
                  ))
                )
              : (
                <AccountSection
                  account={selectedAccount}
                  data={portfolioData[selectedAccount]}
                />
                )}
        </div>
      </div>
    </div>
  )
}

export default App
