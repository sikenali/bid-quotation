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

  // 计算得分：每种算法使用各自的评分公式
  const rankings = sortedUnits.map((unit, index) => {
    let score = 0;

    switch (algorithm) {
      case 'low_price_priority':
        // 低价优先法：得分=(基准价／报价)×满分
        score = unit.price > 0 ? (basePrice / unit.price) * fullScore : 0;
        break;

      case 'average_price':
        // 平均价计法：得分=((基准价-|基准价-报价|)/基准价)×满分
        if (basePrice > 0) {
          const devAve = Math.abs(basePrice - unit.price) / basePrice;
          score = Math.max((1 - devAve) * fullScore, deduction.minScore);
        } else {
          score = 0;
        }
        break;

      case 'gradient_method':
        // 基准价梯度法
        // ≤基准价：得分=(1-|报价-基准价|/基准价)×标准分
        // >基准价：得分=(1-|报价-基准价|/基准价)×标准分×0.95
        if (basePrice > 0) {
          const d = Math.abs(basePrice - unit.price) / basePrice;
          if (unit.price <= basePrice) {
            score = (1 - d) * fullScore;
          } else {
            score = (1 - d) * fullScore * 0.95;
          }
        } else {
          score = 0;
        }
        break;

      case 'conventional_method':
        // 基准价常规法：价格评分=(基准价/评标价)×满分
        score = unit.price > 0 ? (basePrice / unit.price) * fullScore : 0;
        break;

      default:
        score = unit.price > 0 ? (basePrice / unit.price) * fullScore : 0;
    }

    const deviationPercent = aPrice > 0 ? ((unit.price - aPrice) / aPrice) * 100 : 0;

    return {
      rank: index + 1,
      unit,
      deviationPercent: parseFloat(deviationPercent.toFixed(2)),
      score: parseFloat(Math.max(Math.min(score, fullScore), deduction.minScore).toFixed(2)),
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