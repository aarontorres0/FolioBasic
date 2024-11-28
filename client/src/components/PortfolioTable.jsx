const PortfolioTable = ({ data, stockData }) => {
  const calculateRow = (row, totalPortfolioValue) => {
    const price = stockData[row.Ticker]?.price || 0;
    const name = stockData[row.Ticker]?.name || "Unknown";
    const totalValue = price * row.Quantity;
    const costBasis = row["Cost Basis"] * row.Quantity;
    const totalGainLoss = totalValue - costBasis;
    const percentGainLoss = (totalGainLoss / costBasis) * 100;

    // Calculate individual portfolio percentage
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

  // Calculate all rows
  const totalPortfolioValue = data.reduce((sum, row) => {
    const price = stockData[row.Ticker]?.price || 0;
    return sum + price * row.Quantity;
  }, 0);

  const enhancedData = data.map((row) =>
    calculateRow(row, totalPortfolioValue)
  );

  // Calculate summary values
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
    <div className="overflow-x-auto p-4">
      <table className="table-auto w-full bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Ticker</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Cost Basis</th>
            <th className="px-4 py-2 text-left">Shares</th>
            <th className="px-4 py-2 text-left">Price</th>
            <th className="px-4 py-2 text-left">Total Value</th>
            <th className="px-4 py-2 text-left">Portfolio %</th>
            <th className="px-4 py-2 text-left">Total Gain/Loss</th>
            <th className="px-4 py-2 text-left">% Total Gain/Loss</th>
          </tr>
        </thead>
        <tbody>
          {enhancedData.map((row, index) => (
            <tr
              key={index}
              className={`hover:bg-gray-100 ${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              }`}
            >
              <td className="px-4 py-2">{row.Ticker}</td>
              <td className="px-4 py-2">{row.Name || "Unknown"}</td>
              <td className="px-4 py-2">${row["Cost Basis"]}</td>
              <td className="px-4 py-2">{row.Quantity}</td>
              <td className="px-4 py-2">${row.Price}</td>
              <td className="px-4 py-2">${row["Total Value"].toFixed(2)}</td>
              <td className="px-4 py-2">{row["Portfolio %"]}%</td>
              <td
                className={`px-4 py-2 ${
                  row["Total Gain/Loss"] >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                ${row["Total Gain/Loss"].toFixed(2)}
              </td>
              <td
                className={`px-4 py-2 ${
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
        <tfoot className="bg-gray-100 text-gray-800 font-bold">
          <tr>
            <td className="px-4 py-2" colSpan="5">
              Summary
            </td>
            <td className="px-4 py-2" colSpan="2">${totalPortfolioValue.toFixed(2)}</td>
            <td
              className={`px-4 py-2 ${
                totalGainLoss >= 0 ? "text-green-600" : "text-red-600"
              }`}

            >
              ${totalGainLoss.toFixed(2)}
            </td>
            <td
              className={`px-4 py-2 ${
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
