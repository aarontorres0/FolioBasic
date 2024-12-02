export const fetchStockData = async (portfolioData) => {
    const stockData = {};
    let totalPortfolioValue = 0;

    for (const row of portfolioData) {
        try {
            const shares = row.Quantity
            const ticker = row.Ticker

            const response = await fetch(`http://localhost:5000/api/quote?symbol=${ticker}`);
            const result = await response.json();

            // Ensure the result contains valid stock data
            if (!result || !result.symbol || !result.regularMarketPrice) {
                throw new Error(`No stock data found for ${ticker}`);
            }
            const price = parseFloat(result.regularMarketPrice);
            const name = result.shortName;

            stockData[ticker] = { price, name };
            totalPortfolioValue += price * shares;
        } catch (error) {
            console.error(`Error fetching data for ${ticker}:`, error);
        }
    }

    stockData.totalPortfolioValue = totalPortfolioValue;
    return stockData;
};

export const fetchSellPrice = async (ticker, sellDate, costBasis) => {
    let price;
    try {
        const response = await fetch(`http://localhost:5000/api/calculate?symbol=${ticker}&buyPrice=${costBasis}&sellDate=${sellDate}`);
        price = await response.json();
    } catch (error) {
        console.error(`Error fetching sell price for ${ticker}:`, error);
    }
    return parseFloat(price);
}
