import { Algorithm, BidConfig, DeductionParams, ValidRule } from '../types';

const defaultDeduction: DeductionParams = {
  fullScore: 60,
  deductPerHighPercent: 0.6,
  deductPerLowPercent: 0.3,
  minScore: 0,
};

const defaultRules: ValidRule[] = [
  {
    id: 'default',
    minCount: 7,
    maxCount: -1,
    action: 'trim_percent',
    params: { trimPercent: 20 },
  },
];

export function createDefaultConfig(algorithm: Algorithm): BidConfig {
  return {
    algorithm,
    kEnabled: false,
    kValue: 1.0,
    trimHighPercent: 20,
    trimLowPercent: 20,
    removeHighestN: 1,
    nthLowest: 2,
    q1Weight: 50,
    k1: 1.0,
    k2: 1.0,
    maxPrice: 0,
    customBasePrice: 0,
    validRules: defaultRules,
    deduction: defaultDeduction,
    bidUnits: [],
    theme: 'light',
  };
}
