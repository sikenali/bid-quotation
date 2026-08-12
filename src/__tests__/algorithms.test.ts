import { describe, it, expect } from 'vitest';
import { calculateResult } from '../utils/algorithms';

describe('calculateResult', () => {
  it('低价优先法: 最低价=基准价，得分=(基准价/报价)×满分', () => {
    const config = {
      algorithm: 'low_price_priority' as const,
      validRules: [],
      deduction: { fullScore: 20, deductPerHighPercent: 0.6, deductPerLowPercent: 0.3, minScore: 0 },
      bidUnits: [
        { id: '1', name: 'A', price: 100, isValid: true },
        { id: '2', name: 'B', price: 140, isValid: true },
      ] as any[],
      theme: 'light' as const,
    };
    const result = calculateResult(config);
    expect(result).not.toBeNull();
    expect(result!.basePrice).toBe(100);
    // A 报价=基准价 → 满分；B 报价140 → (100/140)×20 = 14.29
    expect(result!.rankings[0].score).toBe(20);
    expect(result!.rankings[1].score).toBeCloseTo(14.29, 1);
  });

  it('平均价计法: 基准价=平均值，得分=((基准价-|偏离|)/基准价)×满分', () => {
    const config = {
      algorithm: 'average_price' as const,
      validRules: [],
      deduction: { fullScore: 20, deductPerHighPercent: 0.6, deductPerLowPercent: 0.3, minScore: 0 },
      bidUnits: [
        { id: '1', name: 'A', price: 100, isValid: true },
        { id: '2', name: 'B', price: 140, isValid: true },
      ] as any[],
      theme: 'light' as const,
    };
    const result = calculateResult(config);
    expect(result).not.toBeNull();
    // 平均值 = (100+140)/2 = 120
    expect(result!.basePrice).toBe(120);
    // 偏离 16.67% → (1-0.1667)×20 = 16.67
    expect(result!.rankings[0].score).toBeCloseTo(16.67, 1);
    expect(result!.rankings[1].score).toBeCloseTo(16.67, 1);
  });

  it('基准价梯度法: 前两名均值，高于基准价×0.95', () => {
    const config = {
      algorithm: 'gradient_method' as const,
      validRules: [],
      deduction: { fullScore: 20, deductPerHighPercent: 0.6, deductPerLowPercent: 0.3, minScore: 0 },
      bidUnits: [
        { id: '1', name: 'A', price: 100, isValid: true },
        { id: '2', name: 'B', price: 110, isValid: true },
        { id: '3', name: 'C', price: 140, isValid: true },
      ] as any[],
      theme: 'light' as const,
    };
    const result = calculateResult(config);
    expect(result).not.toBeNull();
    // 前两名均值 (100+110)/2 = 105
    expect(result!.basePrice).toBe(105);
    // A ≤ 基准价：偏离 4.76% → (1-0.0476)×20 = 19.05
    expect(result!.rankings[0].score).toBeCloseTo(19.05, 1);
    // B > 基准价：偏离 4.76% → (1-0.0476)×20×0.95 = 18.10
    expect(result!.rankings[1].score).toBeCloseTo(18.10, 1);
    // C > 基准价：偏离 33.33% → (1-0.3333)×20×0.95 = 12.67
    expect(result!.rankings[2].score).toBeCloseTo(12.67, 1);
  });

  it('基准价常规法: 得分=(基准价/报价)×满分，封顶满分', () => {
    const config = {
      algorithm: 'conventional_method' as const,
      validRules: [],
      deduction: { fullScore: 20, deductPerHighPercent: 0.6, deductPerLowPercent: 0.3, minScore: 0 },
      bidUnits: [
        { id: '1', name: 'A', price: 100, isValid: true },
        { id: '2', name: 'B', price: 140, isValid: true },
      ] as any[],
      theme: 'light' as const,
    };
    const result = calculateResult(config);
    expect(result).not.toBeNull();
    // 常规法基准价 = 平均值 120
    expect(result!.basePrice).toBe(120);
    // A 报价100 → (120/100)×20 = 24 → 封顶 20
    expect(result!.rankings[0].score).toBe(20);
    // B 报价140 → (120/140)×20 = 17.14
    expect(result!.rankings[1].score).toBeCloseTo(17.14, 1);
  });

  it('特殊: 报价为 0 时不产生 NaN', () => {
    const config = {
      algorithm: 'low_price_priority' as const,
      validRules: [],
      deduction: { fullScore: 20, deductPerHighPercent: 0.6, deductPerLowPercent: 0.3, minScore: 0 },
      bidUnits: [
        { id: '1', name: 'A', price: 0, isValid: true },
        { id: '2', name: 'B', price: 100, isValid: true },
      ] as any[],
      theme: 'light' as const,
    };
    const result = calculateResult(config);
    expect(result).not.toBeNull();
    result!.rankings.forEach((r) => {
      expect(Number.isFinite(r.score)).toBe(true);
      expect(Number.isFinite(r.deviationPercent)).toBe(true);
    });
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