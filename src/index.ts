import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ethers } from 'ethers';
import { OptimismGasTracker } from './gas-tracker';
import { EstimateRequest } from './types';

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuration
const RPC_URL = process.env.RPC_URL || 'https://mainnet.optimism.io';
const PORT = parseInt(process.env.PORT || '3000');
const UPDATE_INTERVAL = parseInt(process.env.UPDATE_INTERVAL || '12000');

// Initialize tracker
const tracker = new OptimismGasTracker(RPC_URL, UPDATE_INTERVAL);

// API Routes

// Get current gas prices
app.get('/gas/current', async (req, res) => {
  try {
    const data = await tracker.getCurrentGasData();
    res.json(data);
  } catch (error) {
    console.error('Error getting current gas data:', error);
    res.status(500).json({ error: 'Failed to fetch gas data' });
  }
});

// Get historical data
app.get('/gas/history', (req, res) => {
  const history = tracker.getHistory();
  res.json(history);
});

// Get statistics
app.get('/gas/stats', (req, res) => {
  const stats = tracker.getStats();
  if (!stats) {
    res.status(404).json({ error: 'No data available yet' });
  } else {
    res.json(stats);
  }
});

// Estimate transaction cost
app.get('/gas/estimate', async (req, res) => {
  const { to = '0x0000000000000000000000000000000000000000', data = '0x', value = '0' } = req.query as EstimateRequest;
  
  try {
    // Validate inputs
    if (!ethers.isAddress(to)) {
      return res.status(400).json({ error: 'Invalid address' });
    }
    
    if (data && !data.startsWith('0x')) {
      return res.status(400).json({ error: 'Data must be hex string starting with 0x' });
    }

    const estimate = await tracker.estimateTransactionCost(to, data, value);
    const currentGas = await tracker.getCurrentGasData();
    
    res.json({
      estimatedGas: estimate.estimatedGas.toString(),
      dataSize: estimate.dataSize,
      l1DataFee: ethers.formatEther(estimate.l1DataFee),
      l2ExecutionFee: ethers.formatEther(estimate.l2ExecutionFee),
      totalFee: ethers.formatEther(estimate.totalFee),
      ...currentGas
    });
  } catch (error) {
    console.error('Error estimating gas:', error);
    res.status(500).json({ error: 'Failed to estimate gas' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    uptime: process.uptime(),
    rpcUrl: RPC_URL.replace(/https?:\/\/([^\/]+).*/, '$1'), // Show only domain
    updateInterval: UPDATE_INTERVAL
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'OP Gas Tracker',
    version: '1.0.0',
    description: 'Real-time gas price tracker for Optimism L2',
    endpoints: {
      current: '/gas/current',
      history: '/gas/history',
      stats: '/gas/stats',
      estimate: '/gas/estimate?to=0x...&data=0x...&value=0',
      health: '/health'
    }
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
async function start() {
  try {
    // Start the gas tracker
    await tracker.start();
    
    // Start the Express server
    app.listen(PORT, () => {
      console.log(`\n🚀 OP Gas Tracker is running!`);
      console.log(`📡 API: http://localhost:${PORT}`);
      console.log(`🔗 RPC: ${RPC_URL}`);
      console.log(`⏱️  Update interval: ${UPDATE_INTERVAL}ms\n`);
    });
  } catch (error) {
    console.error('Failed to start:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  tracker.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nShutting down gracefully...');
  tracker.stop();
  process.exit(0);
});

// Start the application
start();