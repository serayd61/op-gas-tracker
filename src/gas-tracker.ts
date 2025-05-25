import { ethers } from 'ethers';
import { GasData, GasStats } from './types';

// Gas Oracle contract address on Optimism
const GAS_ORACLE_ADDRESS = '0x420000000000000000000000000000000000000F';

// Gas Oracle ABI
const GAS_ORACLE_ABI = [
  'function l1BaseFee() view returns (uint256)',
  'function overhead() view returns (uint256)',
  'function scalar() view returns (uint256)',
  'function decimals() view returns (uint256)',
  
];

export class OptimismGasTracker {
  private provider: ethers.JsonRpcProvider;
  private gasOracle: ethers.Contract;
  private gasHistory: GasData[] = [];
  private updateInterval: number;
  private intervalId?: NodeJS.Timeout;

  constructor(rpcUrl: string, updateInterval: number = 12000) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.gasOracle = new ethers.Contract(GAS_ORACLE_ADDRESS, GAS_ORACLE_ABI, this.provider);
    this.updateInterval = updateInterval;
  }

  async start(): Promise<void> {
    console.log('Starting Optimism Gas Tracker...');
    
    // Get initial data
    await this.updateGasData();
    
    // Set up interval
    this.intervalId = setInterval(async () => {
      try {
        await this.updateGasData();
      } catch (error) {
        console.error('Error updating gas data:', error);
      }
    }, this.updateInterval);
    
    console.log(`Gas tracker started. Updating every ${this.updateInterval}ms`);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      console.log('Gas tracker stopped');
    }
  }

  async getCurrentGasData(): Promise<GasData> {
    try {
      // Fetch all data in parallel
      const [l1BaseFee, overhead, scalar, decimals, l2GasPrice, block] = await Promise.all([
        this.gasOracle.l1BaseFee(),
        this.gasOracle.overhead(),
        this.gasOracle.scalar(),
        this.gasOracle.decimals(),
        this.provider.getGasPrice(),
        this.provider.getBlock('latest')
      ]);

      // Calculate L1 data fee for a typical transaction (2000 bytes)
      const typicalTxSize = 2000;
      const l1DataFee = this.calculateL1DataFee(
        typicalTxSize,
        l1BaseFee,
        overhead,
        scalar,
        decimals
      );

      // Calculate total fee for a standard transfer
      const l2ExecutionGas = 21000n;
      const l2ExecutionFee = l2GasPrice * l2ExecutionGas;
      const totalFee = l1DataFee + l2ExecutionFee;

      const gasData: GasData = {
        timestamp: Date.now(),
        l1BaseFee: ethers.formatGwei(l1BaseFee),
        l2GasPrice: ethers.formatGwei(l2GasPrice),
        overhead: overhead.toString(),
        scalar: scalar.toString(),
        estimatedL1DataFee: ethers.formatEther(l1DataFee),
        totalEstimatedFee: ethers.formatEther(totalFee)
      };

      if (process.env.DEBUG === 'true') {
        console.log(`Block ${block?.number}: L1 Base Fee: ${gasData.l1BaseFee} gwei, L2 Gas Price: ${gasData.l2GasPrice} gwei`);
      }

      return gasData;
    } catch (error) {
      console.error('Error fetching gas data:', error);
      throw error;
    }
  }

  private calculateL1DataFee(
    dataSize: number,
    l1BaseFee: bigint,
    overhead: bigint,
    scalar: bigint,
    decimals: bigint
  ): bigint {
    // Optimism L1 data fee formula
    const scaledBaseFee = (l1BaseFee * scalar) / (10n ** decimals);
    return (BigInt(dataSize) + overhead) * scaledBaseFee;
  }

  private async updateGasData(): Promise<void> {
    const gasData = await this.getCurrentGasData();
    this.gasHistory.push(gasData);
    
    // Keep only last 300 entries (1 hour at 12s intervals)
    if (this.gasHistory.length > 300) {
      this.gasHistory.shift();
    }
  }

  getHistory(): GasData[] {
    return [...this.gasHistory];
  }

  getStats(): GasStats | null {
    if (this.gasHistory.length === 0) {
      return null;
    }

    const l2Prices = this.gasHistory.map(d => parseFloat(d.l2GasPrice));
    const l1Fees = this.gasHistory.map(d => parseFloat(d.estimatedL1DataFee));

    return {
      current: this.gasHistory[this.gasHistory.length - 1],
      average: {
        l2GasPrice: (l2Prices.reduce((a, b) => a + b, 0) / l2Prices.length).toFixed(6),
        l1DataFee: (l1Fees.reduce((a, b) => a + b, 0) / l1Fees.length).toFixed(6)
      },
      min: {
        l2GasPrice: Math.min(...l2Prices).toFixed(6),
        l1DataFee: Math.min(...l1Fees).toFixed(6)
      },
      max: {
        l2GasPrice: Math.max(...l2Prices).toFixed(6),
        l1DataFee: Math.max(...l1Fees).toFixed(6)
      }
    };
  }

  async estimateTransactionCost(to: string, data: string = '0x', value: string = '0'): Promise<{
    estimatedGas: bigint;
    dataSize: number;
    l1DataFee: bigint;
    l2ExecutionFee: bigint;
    totalFee: bigint;
  }> {
    // Get current gas prices
    const [l1BaseFee, overhead, scalar, decimals, l2GasPrice] = await Promise.all([
      this.gasOracle.l1BaseFee(),
      this.gasOracle.overhead(),
      this.gasOracle.scalar(),
      this.gasOracle.decimals(),
      this.provider.getGasPrice()
    ]);

    // Estimate gas for the transaction
    const estimatedGas = await this.provider.estimateGas({
      to,
      data,
      value
    });

    // Calculate data size (remove 0x prefix and divide by 2 for bytes)
    const dataSize = Math.ceil((data.length - 2) / 2);

    // Calculate fees
    const l1DataFee = this.calculateL1DataFee(dataSize, l1BaseFee, overhead, scalar, decimals);
    const l2ExecutionFee = l2GasPrice * estimatedGas;
    const totalFee = l1DataFee + l2ExecutionFee;

    return {
      estimatedGas,
      dataSize,
      l1DataFee,
      l2ExecutionFee,
      totalFee
    };
  }
}