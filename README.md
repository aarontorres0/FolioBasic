# FolioBasic

FolioBasic allows users to visualize and analyze the performance of their investment portfolio.

## Getting Started

Follow these steps to get a development environment up and running:

1. Clone this repository:

   ```
   git clone https://github.com/aarontorres0/FolioBasic.git
   ```

1. Navigate to the project directory:

   ```
   cd FolioBasic
   ```

1. Open up a second terminal window or tab

   - One will be used for the proxy server and the other for the client

1. Install dependencies for the client (React app):

   ```
   cd client
   npm install
   ```

1. Install dependencies for the proxy server:

   ```
   cd proxy-server
   npm install
   ```

1. Start the Proxy Server:

   ```
   node server.js
   ```

   The proxy server will run on http://localhost:5000

1. Start the Client:

   ```
   npm run dev
   ```

   The client will run on http://localhost:5173

## CSV Format

To use FolioBasic, you need to upload a CSV file containing your portfolio data.

### Required Columns:

- `Account`: The name or type of the investment account (e.g., 401k, IRA, Brokerage).
- `Ticker`: Stock ticker symbol.
- `Quantity`: Number of shares owned.
- `Cost Basis`: Purchase price per share (in USD).

### Example CSV Content:

```csv
Account,Ticker,Sell Date,Quantity,Cost Basis
401k,AAPL,None,10,145.30
401k,AAPL,2024-11-10,-5,110.00
IRA,AAPL,None,8,250.25
IRA,AAPL,None,15,150.75
HSA,AAPL,None,3,75.50
```
