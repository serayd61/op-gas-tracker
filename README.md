<<<<<<< HEAD
# OP Gas Tracker 🚀
# OP Gas Tracker 🚀

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Railway-7A5BE2)](https://op-gas-tracker-production.up.railway.app)
[![GitHub](https://img.shields.io/github/stars/serayd61/op-gas-tracker?style=social)](https://github.com/serayd61/op-gas-tracker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Real-time gas price tracker and fee estimator for Optimism L2 network.

Real-time gas price tracker and fee estimator for Optimism L2 network. Monitor L1 data fees, L2 execution costs, and get accurate transaction cost predictions.

## 🌟 Features

- **Real-time Gas Monitoring**: Track L1 and L2 gas prices updated every block
- **Fee Estimation**: Calculate accurate transaction costs including L1 data fees
- **Historical Data**: Access gas price history and statistics
- **REST API**: Easy-to-use endpoints for integration
- **Optimism-Specific**: Built specifically for OP Stack chains with proper L1 fee calculation

## 📊 Why OP Gas Tracker?
# 🌐 Live Demo

API is live at: https://op-gas-tracker-production.up.railway.app

## 🔗 API Endpoints

### Base URL
```
https://op-gas-tracker-production.up.railway.app
```

### Available Endpoints

#### 1. API Status
```http
GET /
```
Returns API information and available endpoints.

**Example Response:**
```json
{
  "name": "OP Gas Tracker",
  "version": "1.0.0",
  "status": "running",
  "message": "Gas tracker API is operational",
  "endpoints": {
    "health": "/health",
    "current": "/gas/current (coming soon)",
    "history": "/gas/history (coming soon)",
    "stats": "/gas/stats (coming soon)"
  }
}
```

#### 2. Health Check
```http
GET /health
```
Returns service health status.

**Example Response:**
```json
{
  "status": "ok",
  "uptime": 125.39,
  "timestamp": "2025-05-25T15:30:00.000Z"
}
```

#### 3. Current Gas Prices (Demo)
```http
GET /gas/current
```
Returns current gas price information (demo data for now).

**Example Response:**
```json
{
  "message": "This endpoint will return current gas prices",
  "l1BaseFee": "30.5",
  "l2GasPrice": "0.001",
  "timestamp": 1716742200000
}
```

## 💻 API Usage Examples

### Using cURL
```bash
# Get API status
curl https://op-gas-tracker-production.up.railway.app/

# Check health
curl https://op-gas-tracker-production.up.railway.app/health

# Get current gas prices
curl https://op-gas-tracker-production.up.railway.app/gas/current
```

### Using JavaScript (Fetch)
```javascript
// Get current gas prices
fetch('https://op-gas-tracker-production.up.railway.app/gas/current')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### Using Python
```python
import requests

# Get API status
response = requests.get('https://op-gas-tracker-production.up.railway.app/')
data = response.json()
print(data)
```

### Using Node.js (Axios)
```javascript
const axios = require('axios');

async function getGasPrice() {
  try {
    const response = await axios.get('https://op-gas-tracker-production.up.railway.app/gas/current');
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error);
  }
}

getGasPrice();
```

## 🚧 Development Status

- ✅ Basic API structure
- ✅ Health monitoring endpoints
- ✅ Live deployment on Railway
- 🔄 Real-time gas price tracking (in progress)
- 📅 Historical data storage (planned)
- 📅 WebSocket support (planned)
- 📅 Multi-chain support (planned)

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
=======
# op-gas-tracker
Real-time gas price tracker for Optimism L2
>>>>>>> 4eae2e3d863c7d6d63d9572cbbbf231c4f0301ea
>>>>>>> ## 🤝 Built for the Community

This project was created to address a real need in the Optimism ecosystem - transparent and accessible gas price monitoring. As part of my commitment to the OP Stack community, I'm continuously working on improvements and new features.

### Future Roadmap
- Integration with multiple OP Stack chains (Base, Zora, Mode)
- Advanced analytics and predictions
- Developer SDK for easy integration
- Mobile app companion

---

**Supporting the Optimism Collective** 🔴✨
