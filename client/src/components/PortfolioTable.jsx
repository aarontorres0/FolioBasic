import { useAppContext } from "../AppContext";

const PortfolioTable = ({ data }) => {
    const { loading, stockData } = useAppContext();
    if (loading) {
        return (
            <div className="flex justify-center items-center h-40">
                <span className="loading loading-spinner loading-lg text-blue-500"></span>
            </div>
        );
    }

    const numberFormatter = new Intl.NumberFormat("en-US");

    const calculateRow = (row, totalPortfolioValue) => {
        let quantity, price

        if (row.Quantity < 0) {
            quantity = -row.Quantity;
            price = row["SellPrice"];
        } else {
            price = stockData[row.Ticker]?.price || 0;
            quantity = row.Quantity;
        }

        const name = stockData[row.Ticker]?.name || "Unknown";
        const totalValue = price * quantity;
        const costBasis = row["Cost Basis"] * (row.Quantity < 0 ? -row.Quantity : row.Quantity)
        const totalGainLoss = totalValue - costBasis;
        const percentGainLoss = (totalGainLoss / costBasis) * 100;

        const portfolioPercentage = totalPortfolioValue
            ? (totalValue / totalPortfolioValue) * 100
            : 0;

        return {
            ...row,
            Name: name,
            Price: price,
            "Total Value": totalValue,
            "Portfolio %": portfolioPercentage,
            "Total Gain/Loss": totalGainLoss,
            "% Total Gain/Loss": percentGainLoss,
        };
    };

    const totalPortfolioValue = data.reduce((sum, row) => {
        let quantity, price

        if (row.Quantity < 0) {
            quantity = -row.Quantity;
            price = row["SellPrice"];
        } else {
            price = stockData[row.Ticker]?.price || 0;
            quantity = row.Quantity;
        }
        return sum + price * (row.Quantity < 0 ? -row.Quantity : row.Quantity);
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
        <div className="overflow-x-auto rounded-lg shadow-lg border">
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
                            <td>${numberFormatter.format(row["Cost Basis"])}</td>
                            <td>{numberFormatter.format(row.Quantity)}</td>
                            <td>${numberFormatter.format(row.Price.toFixed(2))}</td>
                            <td>${numberFormatter.format(row["Total Value"].toFixed(2))}</td>
                            <td>{numberFormatter.format(row["Portfolio %"].toFixed(2))}%</td>
                            <td
                                className={`${row["Total Gain/Loss"] >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                    }`}
                            >
                                ${numberFormatter.format(row["Total Gain/Loss"].toFixed(2))}
                            </td>
                            <td
                                className={`${row["% Total Gain/Loss"] >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                    }`}
                            >
                                {numberFormatter.format(row["% Total Gain/Loss"].toFixed(2))}%
                                {row.Quantity < 0 && (
                                    <span className="bg-red-600 text-white font-bold px-2 py-1 rounded ml-2">Sold</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="bg-base-200 text-lg">
                        <td colSpan="5">Summary</td>
                        <td colSpan="2">
                            ${numberFormatter.format(totalPortfolioValue.toFixed(2))}
                        </td>
                        <td
                            className={`${totalGainLoss >= 0 ? "text-green-600" : "text-red-600"
                                }`}
                        >
                            ${numberFormatter.format(totalGainLoss.toFixed(2))}
                        </td>
                        <td
                            className={`${percentTotalGainLoss >= 0 ? "text-green-600" : "text-red-600"
                                }`}
                        >
                            {numberFormatter.format(percentTotalGainLoss.toFixed(2))}%
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default PortfolioTable;
