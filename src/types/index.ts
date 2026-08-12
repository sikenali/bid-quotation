export type Algorithm =
  | 'low_price_priority'
  | 'average_price'
  | 'gradient_method'
  | 'conventional_method'
  | 'ai_parse';

export type TrimAction =
  | 'trim_percent'
  | 'remove_highest_n'
  | 'remove_lowest_n'
  | 'nth_lowest'
  | 'direct';

export interface ValidRule {
  id: string;
  minCount: number;
  maxCount: number; // -1 表示无穷
  action: TrimAction;
  params: {
    trimPercent?: number;
    removeN?: number;
    nth?: number;
  };
}

export interface DeductionParams {
  fullScore: number;
  deductPerHighPercent: number;
  deductPerLowPercent: number;
  minScore: number;
}

export interface BidUnit {
  id: string;
  name: string;
  price: number;
  isValid: boolean;
  businessScore?: number;
  technicalScore?: number;
}

export interface BidConfig {
  algorithm: Algorithm;
  validRules: ValidRule[];
  deduction: DeductionParams;
  bidUnits: BidUnit[];
  theme: 'light' | 'dark';
  apiKey?: string;
  apiEndpoint?: string;
}

export interface AlgorithmOption {
  id: Algorithm;
  name: string;
  description: string;
  shortDesc?: string;
  icon: string;
}

export interface CalcResult {
  basePrice: number;
  aValue: number;
  effectiveCount: number;
  algorithmName: string;
  trimmedNames?: string[];
  unitPriceScores?: Record<string, number>;
  rankings: Array<{
    rank: number;
    unit: BidUnit;
    deviationPercent: number;
    score: number;
    priceDiff: number;
    businessScore?: number;
    technicalScore?: number;
    totalPrice?: number;
  }>;
}

export interface Template {
  id: string;
  name: string;
  config: Omit<BidConfig, 'bidUnits' | 'theme' | 'apiKey' | 'apiEndpoint'>;
}
