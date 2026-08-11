import { describe, it, expect } from 'vitest';
import { calculateResult } from '../utils/algorithms';
import { createDefaultConfig } from '../utils/templates';

describe('calculateResult', () => {
  it('算术平均法: 基准价 = 平均价 × K', () => {
    const config = createDefaultConfig('arithmetic_mean');
    config.bidUnits = [
      { id: '1', name: 'A', price: 100, isValid: true },
      { id: '2', name: 'B', price: 200, isValid: true },
      { id: '3', name: 'C', price: 300, isValid: true },
    ];
    config.kEnabled = true;
    config.kValue = 0.95;

    const result = calculateResult(config);
    expect(result).not.toBeNull();
    expect(result!.basePrice).toBeCloseTo(190, 2);
  });

  it('最低价法: 基准价 = 最低报价', () => {
    const config = createDefaultConfig('lowest_price');
    config.validRules = []; // lowest_price uses all units directly
    config.bidUnits = [
      { id: '1', name: 'A', price: 150, isValid: true },
      { id: '2', name: 'B', price: 200, isValid: true },
      { id: '3', name: 'C', price: 100, isValid: true },
    ];

    const result = calculateResult(config);
    expect(result).not.toBeNull();
    expect(result!.basePrice).toBeCloseTo(100, 2);
  });

  it('次低报价法: 基准价 = 第2低报价', () => {
    const config = createDefaultConfig('second_lowest');
    config.bidUnits = [
      { id: '1', name: 'A', price: 150, isValid: true },
      { id: '2', name: 'B', price: 200, isValid: true },
      { id: '3', name: 'C', price: 100, isValid: true },
      { id: '4', name: 'D', price: 180, isValid: true },
    ];

    const result = calculateResult(config);
    expect(result).not.toBeNull();
    expect(result!.basePrice).toBeCloseTo(150, 2);
  });

  it('有效投标判定: 根据规则过滤', () => {
    const config = createDefaultConfig('arithmetic_mean');
    config.bidUnits = [
      { id: '1', name: 'A', price: 100, isValid: true },
      { id: '2', name: 'B', price: 200, isValid: true },
      { id: '3', name: 'C', price: 300, isValid: true },
      { id: '4', name: 'D', price: 400, isValid: true },
      { id: '5', name: 'E', price: 500, isValid: true },
      { id: '6', name: 'F', price: 600, isValid: true },
      { id: '7', name: 'G', price: 700, isValid: true },
    ];
    config.validRules = [
      { id: 'r1', minCount: 7, maxCount: -1, action: 'trim_percent', params: { trimPercent: 20 } },
    ];

    const result = calculateResult(config);
    expect(result).not.toBeNull();
    expect(result!.effectiveCount).toBe(5);
  });

  it('得分计算: 高于基准价扣分', () => {
    const config = createDefaultConfig('arithmetic_mean');
    config.validRules = []; // no rule filtering for this test
    config.bidUnits = [
      { id: '1', name: 'A', price: 100, isValid: true },
      { id: '2', name: 'B', price: 110, isValid: true },
    ];
    config.deduction = { fullScore: 60, deductPerHighPercent: 0.6, deductPerLowPercent: 0.3, minScore: 0 };

    const result = calculateResult(config);
    expect(result).not.toBeNull();
    const bRanking = result!.rankings.find(r => r.unit.id === '2');
    expect(bRanking).toBeDefined();
    expect(bRanking!.score).toBeCloseTo(57.14, 1);
  });

  it('无有效报价时返回 null', () => {
    const config = createDefaultConfig('arithmetic_mean');
    config.bidUnits = [];

    const result = calculateResult(config);
    expect(result).toBeNull();
  });
});
