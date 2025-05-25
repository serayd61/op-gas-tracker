# OP Gas Tracker 🚀

Real-time gas price tracker and fee estimator for Optimism L2 network. Monitor L1 data fees, L2 execution costs, and get accurate transaction cost predictions.

## 🌟 Features

- **Real-time Gas Monitoring**: Track L1 and L2 gas prices updated every block
- **Fee Estimation**: Calculate accurate transaction costs including L1 data fees
- **Historical Data**: Access gas price history and statistics
- **REST API**: Easy-to-use endpoints for integration
- **Optimism-Specific**: Built specifically for OP Stack chains with proper L1 fee calculation

## 📊 Why OP Gas Tracker?

Optimism uses a unique fee model where users pay both:
1. **L2 execution fee**: For computation on L2
2. **L1 data fee**: For posting transaction data to Ethereum

This tool helps developers and users understand and optimize their transaction costs on Optimism.

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/serayd61/op-gas-tracker.git
cd op-gas-tracker

# Install dependencies
npm install

# Build the project
npm run build

# Start the server
npm start
```

### Development Mode

```bash
# Run in development mode with hot reload
npm run dev
```

## 📡 API Endpoints

### Get Current Gas Prices
```http
GET /gas/current
```

Response:
```json
{
  "timestamp": 1703123456789,
  "l1BaseFee": "35.5",
  "l2GasPrice": "0.001",
  "overhead": "188",
  "scalar": "684000",
  "estimatedL1DataFee": "0.000542",
  "totalEstimatedFee": "0.000563"
}
```

### Get Historical Data
```http
GET /gas/history
```
Returns last hour of gas price data (5-second intervals).

### Get Statistics
```http
GET /gas/stats
```

Response:
```json
{
  "current": { ... },
  "average": {
    "l2GasPrice": "0.0012",
    "l1DataFee": "0.000523"
  },
  "min": {
    "l2GasPrice": "0.001",
    "l1DataFee": "0.000421"
  },
  "max": {
    "l2GasPrice": "0.0015",
    "l1DataFee": "0.000651"
  }
}
```

### Estimate Transaction Cost
```http
GET /gas/estimate?to=0x...&data=0x...
```

Query Parameters:
- `to`: Target address (optional)
- `data`: Transaction data in hex (optional)

## 🛠️ Configuration

Create a `.env` file:

```env
# RPC URL (optional, defaults to public endpoint)
RPC_URL=https://mainnet.optimism.io

# Server port (optional, defaults to 3000)
PORT=3000

# Update interval in ms (optional, defaults to 12000)
UPDATE_INTERVAL=12000
```

## 🏗️ Architecture

```
src/
├── index.ts          # Main server and API routes
├── gas-tracker.ts    # Core gas tracking logic
├── types.ts          # TypeScript interfaces
└── utils.ts          # Helper functions
```

## 🧮 How L1 Data Fee Calculation Works

Optimism's L1 data fee formula:
```
L1_data_fee = (tx_data_size + overhead) * l1_base_fee * scalar / 10^decimals
```

This tool automatically calculates this for you!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 TODO

- [ ] Add WebSocket support for real-time updates
- [ ] Create web dashboard UI
- [ ] Add support for other OP Stack chains (Base, Zora, etc.)
- [ ] Implement gas price predictions
- [ ] Add transaction batching optimizer
- [ ] Create npm package for easy integration

## 🔗 Resources

- [Optimism Documentation](https://docs.optimism.io)
- [OP Stack Gas Fees](https://docs.optimism.io/stack/transactions/fees)
- [Optimism Gas Oracle](https://optimistic.etherscan.io/address/0x420000000000000000000000000000000000000F)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**serayd61**
- GitHub: [@serayd61](https://github.com/serayd61)
- Project: [OP Stack Bridge Dashboard](https://github.com/serayd61/op-stack-bridge-dashboard)

---

Built with ❤️ for the Optimism ecosystem