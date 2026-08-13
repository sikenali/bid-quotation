import { describe, it, expect } from 'vitest';
import { calculateResult } from '../utils/algorithms';

describe('calculateResult', () => {
  it('低价优先法: 最低价=基准价，得分=满分-偏离百分比×扣分系数', () => {
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
    // A 报价=基准价 → 满分 20
    // B 报价140, 高于基准价40% → 20 - 40×0.6 = -4 → 截断到 0
    expect(result!.rankings[0].score).toBe(20);
    expect(result!.rankings[0].rank).toBe(1);
    expect(result!.rankings[1].score).toBe(0);
    expect(result!.rankings[1].rank).toBe(2);
  });

  it('平均价计法: 基准价=平均值，得分=满分-偏离百分比×扣分系数', () => {
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
    // A 低于基准价 16.67% → 20 - 16.67×0.3 = 15
    // B 高于基准价 16.67% → 20 - 16.67×0.6 = 10
    expect(result!.rankings[0].score).toBeCloseTo(15, 0);
    expect(result!.rankings[0].rank).toBe(1);
    expect(result!.rankings[1].score).toBeCloseTo(10, 0);
    expect(result!.rankings[1].rank).toBe(2);
  });

  it('基准价梯度法: 技术前两名均值，高于基准价×0.95', () => {
    const config = {
      algorithm: 'gradient_method' as const,
      validRules: [],
      deduction: { fullScore: 20, deductPerHighPercent: 0.6, deductPerLowPercent: 0.3, minScore: 0 },
      bidUnits: [
        { id: '1', name: 'A', price: 100, isValid: true, technicalScore: 90 },
        { id: '2', name: 'B', price: 110, isValid: true, technicalScore: 80 },
        { id: '3', name: 'C', price: 140, isValid: true, technicalScore: 70 },
      ] as any[],
      theme: 'light' as const,
    };
    const result = calculateResult(config);
    expect(result).not.toBeNull();
    // 技术前两名 = A(90) 和 B(80), 报价均值 = (100+110)/2 = 105
    expect(result!.basePrice).toBe(105);
    // A ≤ 基准价, 偏离 4.76% → 20 - 4.76×0.3 = 18.57
    // B > 基准价, 偏离 4.76% → (20 - 4.76×0.6)×0.95 = 16.29
    // C > 基准价, 偏离 33.33% → (20 - 33.33×0.6)×0.95 = 0
    expect(result!.rankings[0].score).toBeCloseTo(18.57, 1);
    expect(result!.rankings[0].rank).toBe(1);
    expect(result!.rankings[1].score).toBeCloseTo(16.29, 1);
    expect(result!.rankings[1].rank).toBe(2);
    expect(result!.rankings[2].score).toBe(0);
    expect(result!.rankings[2].rank).toBe(3);
  });

  it('基准价常规法: 基准价=平均值，得分=满分-偏离百分比×扣分系数', () => {
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
    // A 低于基准价 16.67% → 20 - 16.67×0.3 = 15
    // B 高于基准价 16.67% → 20 - 16.67×0.6 = 10
    expect(result!.rankings[0].score).toBeCloseTo(15, 0);
    expect(result!.rankings[0].rank).toBe(1);
    expect(result!.rankings[1].score).toBeCloseTo(10, 0);
    expect(result!.rankings[1].rank).toBe(2);
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