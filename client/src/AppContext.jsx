import React, { createContext, useContext, useState } from 'react'

const AppContext = createContext()

export const useAppContext = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [isNavbarOpen, setIsNavbarOpen] = useState(true)
  const [portfolioData, setPortfolioData] = useState({})
  const [selectedAccount, setSelectedAccount] = useState('All')
  const [stockData, setStockData] = useState({})

  const value = {
    loading,
    setLoading,
    isNavbarOpen,
    setIsNavbarOpen,
    portfolioData,
    setPortfolioData,
    selectedAccount,
    setSelectedAccount,
    stockData,
    setStockData
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
