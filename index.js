const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuration
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Railway için önemli

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

// Railway health check
app.get('/_health', (req, res) => {
  res.status(200).send('OK');
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

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server - Railway uyumlu
const server = app.listen(PORT, HOST, () => {
  console.log(`OP Gas Tracker is running on http://${HOST}:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

// Keep alive log
setInterval(() => {
  console.log(`[${new Date().toISOString()}] Server is alive on port ${PORT}`);
}, 300000); // Her 5 dakikada bir
