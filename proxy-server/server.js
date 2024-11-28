import express from 'express';
import cors from 'cors';
import yahooFinance from 'yahoo-finance2';

const app = express();
app.use(cors());

app.get('/api/quote', async (req, res) => {
  const { symbol } = req.query;

  try {
    const data = await yahooFinance.quote(symbol);
    res.json(data);
  } catch (error) {
    console.error('Error fetching data from Yahoo Finance:', error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Proxy server is running on http://localhost:${PORT}`));
