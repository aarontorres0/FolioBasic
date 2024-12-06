import express from 'express'
import cors from 'cors'
import yahooFinance from 'yahoo-finance2'

const app = express()
app.use(cors())

app.get('/api/quote', async (req, res) => {
  const { symbol } = req.query

  try {
    const data = await yahooFinance.quote(symbol)
    res.json(data)
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error)
    res.status(500).json({ error: 'Failed to fetch stock data' })
  }
})

app.get('/api/calculate', async (req, res) => {
  const { symbol, sellDate } = req.query
  
  try {
    const historical = await yahooFinance.historical(symbol, {
      period1: new Date(sellDate)
    })
    const sellPrice = historical[0].close
    res.json(sellPrice)
  } catch (error) {
    console.error(`Error fetching selling data for ${symbol} on ${sellDate}:`, error)
    res.status(500).json({ error: 'Failed to fetch selling data' })
  }
})

app.get('/api/historical', async (req, res) => {
  const { symbol } = req.query
  try {
    const historical = await yahooFinance.historical(symbol, {
      period1: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      period2: new Date()
    })
    res.json(historical)
  } catch (error) {
    console.error(`Error fetching historical data for ${symbol}:`, error)
    res.status(500).json({ error: 'Failed to fetch historical data' })
  }
})

const PORT = 5000
app.listen(PORT, () =>
  console.log(`Proxy server running on http://localhost:${PORT}`)
)
