export interface GasData {
  timestamp: number;
  l1BaseFee: string;
  l2GasPrice: string;
  overhead: string;
  scalar: string;
  estimatedL1DataFee: string;
  totalEstimatedFee: string;
}

export interface GasStats {
  current: GasData;
  average: {
    l2GasPrice: string;
    l1DataFee: string;
  };
  min: {
    l2GasPrice: string;
    l1DataFee: string;
  };
  max: {
    l2GasPrice: string;
    l1DataFee: string;
  };
}

export interface EstimateRequest {
  to?: string;
  data?: string;
  value?: string;
}

export interface EstimateResponse extends GasData {
  estimatedGas: string;
  dataSize: number;
}