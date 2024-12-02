export const fetchStockData = async (tickers, portfolioData) => {
  const stockData = {}
  let totalPortfolioValue = 0

  for (const ticker of tickers) {
    try {
      const response = await fetch(`http://localhost:5000/api/quote?symbol=${ticker}`)
      const result = await response.json()

      // Ensure the result contains valid stock data
      if (!result || !result.symbol || !result.regularMarketPrice) {
        throw new Error(`No stock data found for ${ticker}`)
      }

      const price = result.regularMarketPrice
      const name = result.shortName
      const shares = portfolioData.find((row) => row.Ticker === ticker)?.Quantity || 0

      stockData[ticker] = { price, name }
      totalPortfolioValue += price * shares
    } catch (error) {
      console.error(`Error fetching data for ${ticker}:`, error)
    }
  }

  stockData.totalPortfolioValue = totalPortfolioValue
  return stockData
}
