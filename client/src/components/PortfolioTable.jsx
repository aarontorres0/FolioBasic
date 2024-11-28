const PortfolioTable = ({ data, stockData, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="loading loading-spinner loading-lg text-blue-500"></span>
      </div>
    );
  }

  const calculateRow = (row, totalPortfolioValue) => {
    const price = stockData[row.Ticker]?.price || 0;
    const name = stockData[row.Ticker]?.name || "Unknown";
    const totalValue = price * row.Quantity;
    const costBasis = row["Cost Basis"] * row.Quantity;
    const totalGainLoss = totalValue - costBasis;
    const percentGainLoss = (totalGainLoss / costBasis) * 100;

    const portfolioPercentage = totalPortfolioValue
      ? (totalValue / totalPortfolioValue) * 100
      : 0;

    return {
      ...row,
      Name: name,
      Price: price.toFixed(2),
      "Total Value": totalValue,
      "Portfolio %": portfolioPercentage.toFixed(2),
      "Total Gain/Loss": totalGainLoss,
      "% Total Gain/Loss": percentGainLoss,
    };
  };

  const totalPortfolioValue = data.reduce((sum, row) => {
    const price = stockData[row.Ticker]?.price || 0;
    return sum + price * row.Quantity;
  }, 0);

  const enhancedData = data.map((row) =>
    calculateRow(row, totalPortfolioValue)
  );

  const totalGainLoss = enhancedData.reduce(
    (sum, row) => sum + row["Total Gain/Loss"],
    0
  );
  const totalCostBasis = data.reduce(
    (sum, row) => sum + row["Cost Basis"] * row.Quantity,
    0
  );
  const percentTotalGainLoss = (totalGainLoss / totalCostBasis) * 100;

  return (
    <div className="overflow-x-auto p-4 rounded-lg shadow-lg border">
      <table className="table table-zebra w-full">
        <thead>
          <tr className="bg-base-200 text-lg">
            <th className="text-left">Ticker</th>
            <th className="text-left">Name</th>
            <th className="text-left">Cost Basis</th>
            <th className="text-left">Shares</th>
            <th className="text-left">Price</th>
            <th className="text-left">Total Value</th>
            <th className="text-left">Portfolio %</th>
            <th className="text-left">Total Gain/Loss</th>
            <th className="text-left">% Total Gain/Loss</th>
          </tr>
        </thead>
        <tbody>
          {enhancedData.map((row, index) => (
            <tr key={index}>
              <td>{row.Ticker}</td>
              <td>{row.Name || "Unknown"}</td>
              <td>${row["Cost Basis"]}</td>
              <td>{row.Quantity}</td>
              <td>${row.Price}</td>
              <td>${row["Total Value"].toFixed(2)}</td>
              <td>{row["Portfolio %"]}%</td>
              <td
                className={`${
                  row["Total Gain/Loss"] >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                ${row["Total Gain/Loss"].toFixed(2)}
              </td>
              <td
                className={`${
                  row["% Total Gain/Loss"] >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {row["% Total Gain/Loss"].toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-base-200 text-lg">
            <td colSpan="5">Summary</td>
            <td colSpan="2">${totalPortfolioValue.toFixed(2)}</td>
            <td
              className={`${
                totalGainLoss >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ${totalGainLoss.toFixed(2)}
            </td>
            <td
              className={`${
                percentTotalGainLoss >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {percentTotalGainLoss.toFixed(2)}%
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default PortfolioTable;
