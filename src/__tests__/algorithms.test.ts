import { describe, it, expect } from 'vitest';
import { calculateResult } from '../utils/algorithms';

describe('calculateResult', () => {
  it('低价优先法: 最低价=基准价，最高分满分', () => {
    const config = {
      algorithm: 'low_price_priority' as const,
      validRules: [],
      deduction: { fullScore: 20, deductPerHighPercent: 1.0, deductPerLowPercent: 0.5, minScore: 0 },
      bidUnits: [
        { id: '1', name: 'A', price: 100, isValid: true },
        { id: '2', name: 'B', price: 140, isValid: true },
      ] as any[],
      theme: 'light' as const,
    };
    const result = calculateResult(config);
    expect(result).not.toBeNull();
    expect(result!.basePrice).toBe(100);
    expect(result!.rankings[0].score).toBe(20);
    expect(result!.rankings[1].score).toBeCloseTo(14.29, 1);
  });

  it('平均价计法: 基准价=平均值', () => {
    const config = {
      algorithm: 'average_price' as const,
      validRules: [],
      deduction: { fullScore: 20, deductPerHighPercent: 1.0, deductPerLowPercent: 0.5, minScore: 0 },
      bidUnits: [
        { id: '1', name: 'A', price: 100, isValid: true },
        { id: '2', name: 'B', price: 140, isValid: true },
      ] as any[],
      theme: 'light' as const,
    };
    const result = calculateResult(config);
    expect(result).not.toBeNull();
    expect(result!.basePrice).toBe(120);
  });

  it('基准价梯度法: 技术前两名均值', () => {
    const config = {
      algorithm: 'gradient_method' as const,
      validRules: [],
      deduction: { fullScore: 20, deductPerHighPercent: 1.0, deductPerLowPercent: 0.5, minScore: 0 },
      bidUnits: [
        { id: '1', name: 'A', price: 100, isValid: true },
        { id: '2', name: 'B', price: 110, isValid: true },
        { id: '3', name: 'C', price: 140, isValid: true },
      ] as any[],
      theme: 'light' as const,
    };
    const result = calculateResult(config);
    expect(result).not.toBeNull();
    expect(result!.basePrice).toBe(105);
  });

  it('基准价常规法: 价格评分=(基准价/评标价)×满分', () => {
    const config = {
      algorithm: 'conventional_method' as const,
      validRules: [],
      deduction: { fullScore: 20, deductPerHighPercent: 1.0, deductPerLowPercent: 0.5, minScore: 0 },
      bidUnits: [
        { id: '1', name: 'A', price: 100, isValid: true },
        { id: '2', name: 'B', price: 140, isValid: true },
      ] as any[],
      theme: 'light' as const,
    };
    const result = calculateResult(config);
    expect(result).not.toBeNull();
    expect(result!.rankings[0].score).toBe(20);
    expect(result!.rankings[1].score).toBeCloseTo(14.29, 1);
  });

  it('无报价时返回 null', () => {
    const config = {
      algorithm: 'low_price_priority' as const,
      validRules: [],
      deduction: { fullScore: 60, deductPerHighPercent: 0.6, deductPerLowPercent: 0.3, minScore: 0 },
      bidUnits: [] as any[],
      theme: 'light' as const,
    };
    const result = calculateResult(config);
    expect(result).toBeNull();
  });
});
