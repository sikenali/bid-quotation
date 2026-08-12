import { BidConfig, CalcResult } from '../types';
import { getAlgorithmName, getTrimmedUnits, getEffectiveRules } from './validators';

export function calculateResult(config: BidConfig): CalcResult | null {
  const { bidUnits, algorithm, validRules, deduction } = config;

  if (bidUnits.length === 0) return null;

  const sortedUnits = [...bidUnits].sort((a, b) => a.price - b.price);
  const rules = getEffectiveRules(validRules, bidUnits.length);
  const { effectiveUnits, trimmedNames } = getTrimmedUnits(sortedUnits, rules);

  if (effectiveUnits.length === 0) return null;

  const fullScore = deduction.fullScore;
  let basePrice = 0;
  let aPrice = 0;
  let algorithmName = getAlgorithmName(algorithm);

  // 计算基准价（aValue / basePrice）
  switch (algorithm) {
    case 'low_price_priority':
      basePrice = effectiveUnits[0].price;
      aPrice = basePrice;
      break;

    case 'average_price': {
      const avg = effectiveUnits.reduce((s, u) => s + u.price, 0) / effectiveUnits.length;
      basePrice = avg;
      aPrice = avg;
      break;
    }

    case 'gradient_method': {
      // 技术评审前两名报价的算术平均值
      const top2 = effectiveUnits.slice(0, 2);
      basePrice = top2.length >= 2
        ? (top2[0].price + top2[1].price) / 2
        : top2[0].price;
      aPrice = basePrice;
      break;
    }

    case 'conventional_method': {
      const avg = effectiveUnits.reduce((s, u) => s + u.price, 0) / effectiveUnits.length;
      basePrice = avg;
      aPrice = avg;
      break;
    }

    default:
      basePrice = effectiveUnits.reduce((s, u) => s + u.price, 0) / effectiveUnits.length;
      aPrice = basePrice;
  }

  // 计算得分：统一线性扣分口径
  // 得分 = 满分 - |偏离基准价的百分比| × 对应系数
  // 报价 > 基准价 → 用 deductPerHighPercent；报价 < 基准价 → 用 deductPerLowPercent
  // 结果封顶在 [minScore, fullScore]，避免 NaN 与超满分
  const rankings = sortedUnits.map((unit, index) => {
    const deviationPercent = aPrice > 0 ? ((unit.price - aPrice) / aPrice) * 100 : 0;
    const coefficient = unit.price > aPrice
      ? deduction.deductPerHighPercent
      : deduction.deductPerLowPercent;
    const rawScore = fullScore - Math.abs(deviationPercent) * coefficient;
    const score = Math.max(Math.min(rawScore, fullScore), deduction.minScore);

    return {
      rank: index + 1,
      unit,
      deviationPercent: parseFloat(deviationPercent.toFixed(2)),
      score: parseFloat(score.toFixed(2)),
      priceDiff: parseFloat((unit.price - aPrice).toFixed(2)),
    };
  });

  return {
    basePrice: parseFloat(basePrice.toFixed(2)),
    aValue: parseFloat(aPrice.toFixed(2)),
    effectiveCount: effectiveUnits.length,
    algorithmName,
    trimmedNames,
    rankings,
  };
}
