const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuration
const PORT = process.env.PORT || 3000;

// Basic endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'OP Gas Tracker',
    version: '1.0.0',
    status: 'running',
    message: 'Gas tracker API is operational',
    endpoints: {
      health: '/health',
      current: '/gas/current (coming soon)',
      history: '/gas/history (coming soon)',
      stats: '/gas/stats (coming soon)'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Placeholder endpoints
app.get('/gas/current', (req, res) => {
  res.json({
    message: 'This endpoint will return current gas prices',
    l1BaseFee: '30.5',
    l2GasPrice: '0.001',
    timestamp: Date.now()
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`OP Gas Tracker is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
