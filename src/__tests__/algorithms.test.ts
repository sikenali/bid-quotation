import { describe, it, expect } from 'vitest';
import { calculateResult } from '../utils/algorithms';

describe('calculateResult', () => {
  it('低价优先法: 最低价=基准价，最高分满分', () => {
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
    // A 与基准价一致 → 满分；B 高出 40% × 0.6 → 20 - 24 = -4 → 封底 minScore 0
    expect(result!.rankings[0].score).toBe(20);
    expect(result!.rankings[1].score).toBe(0);
  });

  it('平均价计法: 基准价=平均值，线性扣分', () => {
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
    // A 低出 16.67% × 0.3 → 20 - 5 = 15；B 高出 16.67% × 0.6 → 20 - 10 = 10
    expect(result!.rankings[0].score).toBeCloseTo(15, 1);
    expect(result!.rankings[1].score).toBeCloseTo(10, 1);
  });

  it('基准价梯度法: 技术前两名均值', () => {
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
    // C 高出 33.33% × 0.6 → 20 - 20 = 0
    expect(result!.rankings[2].score).toBe(0);
  });

  it('基准价常规法: 得分不超过满分', () => {
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
    // 常规法基准价 = 平均值 120；得分封顶于满分 20，且不低于 minScore 0
    result!.rankings.forEach((r) => {
      expect(r.score).toBeLessThanOrEqual(20);
      expect(r.score).toBeGreaterThanOrEqual(0);
    });
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