import { BidConfig, CalcResult } from '../types';
import { getAlgorithmName, getTrimmedUnits, getEffectiveRules } from './validators';

export function calculateResult(config: BidConfig): CalcResult | null {
  const { bidUnits, algorithm, validRules, deduction, kEnabled, kValue } = config;

  if (bidUnits.length === 0) return null;

  const sortedUnits = [...bidUnits].sort((a, b) => a.price - b.price);
  const rules = getEffectiveRules(validRules, bidUnits.length);
  const { effectiveUnits, trimmedNames } = getTrimmedUnits(sortedUnits, rules);

  if (effectiveUnits.length === 0) return null;

  let aValue = 0;
  let algorithmName = getAlgorithmName(algorithm);

  switch (algorithm) {
    case 'arithmetic_mean':
      aValue = effectiveUnits.reduce((s, u) => s + u.price, 0) / effectiveUnits.length;
      if (kEnabled) aValue *= kValue;
      break;

    case 'trimmed_mean': {
      const trimHigh = Math.floor(effectiveUnits.length * (config.trimHighPercent / 100));
      const trimLow = Math.floor(effectiveUnits.length * (config.trimLowPercent / 100));
      const trimmed = effectiveUnits.slice(trimLow, effectiveUnits.length - trimHigh);
      aValue = trimmed.length > 0
        ? trimmed.reduce((s, u) => s + u.price, 0) / trimmed.length
        : effectiveUnits.reduce((s, u) => s + u.price, 0) / effectiveUnits.length;
      if (kEnabled) aValue *= kValue;
      break;
    }

    case 'remove_highest': {
      const toRemove = Math.min(config.removeHighestN, effectiveUnits.length - 1);
      const remaining = effectiveUnits.slice(0, effectiveUnits.length - toRemove);
      aValue = remaining.reduce((s, u) => s + u.price, 0) / remaining.length;
      if (kEnabled) aValue *= kValue;
      break;
    }

    case 'second_lowest':
      aValue = effectiveUnits.length >= 2 ? effectiveUnits[1].price : effectiveUnits[0].price;
      if (kEnabled) aValue *= kValue;
      break;

    case 'double_average': {
      const firstAvg = effectiveUnits.reduce((s, u) => s + u.price, 0) / effectiveUnits.length;
      const secondGroup = effectiveUnits.filter(u => u.price <= firstAvg);
      aValue = secondGroup.length > 0
        ? secondGroup.reduce((s, u) => s + u.price, 0) / secondGroup.length
        : firstAvg;
      if (kEnabled) aValue *= kValue;
      break;
    }

    case 'weighted_limit': {
      const avg = effectiveUnits.reduce((s, u) => s + u.price, 0) / effectiveUnits.length;
      const q1 = config.q1Weight / 100;
      aValue = config.k1 * q1 * avg + config.k2 * (1 - q1) * config.maxPrice;
      break;
    }

    case 'lowest_price':
      aValue = effectiveUnits[0].price;
      break;

    case 'custom':
      aValue = config.customBasePrice;
      break;

    default:
      aValue = effectiveUnits.reduce((s, u) => s + u.price, 0) / effectiveUnits.length;
  }

  const rankings = sortedUnits.map((unit, index) => {
    const deviationPercent = ((unit.price - aValue) / aValue) * 100;
    let deductionScore = 0;

    if (unit.price > aValue) {
      deductionScore = deviationPercent * deduction.deductPerHighPercent;
    } else if (unit.price < aValue) {
      deductionScore = Math.abs(deviationPercent) * deduction.deductPerLowPercent;
    }

    const score = Math.max(deduction.fullScore - deductionScore, deduction.minScore);

    return {
      rank: index + 1,
      unit,
      deviationPercent: parseFloat(deviationPercent.toFixed(2)),
      score: parseFloat(score.toFixed(2)),
      priceDiff: parseFloat((unit.price - aValue).toFixed(2)),
    };
  });

  return {
    basePrice: parseFloat(aValue.toFixed(2)),
    aValue: parseFloat(aValue.toFixed(2)),
    effectiveCount: effectiveUnits.length,
    algorithmName,
    trimmedNames,
    rankings,
  };
}
