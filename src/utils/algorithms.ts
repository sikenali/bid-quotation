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
  const deductHigh = deduction.deductPerHighPercent;
  const deductLow = deduction.deductPerLowPercent;
  const minScore = deduction.minScore;
  let basePrice = 0;
  let aPrice = 0;
  let algorithmName = getAlgorithmName(algorithm);

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
      const byTechScore = [...effectiveUnits].sort((a, b) => (b.technicalScore ?? 0) - (a.technicalScore ?? 0));
      const top2 = byTechScore.slice(0, 2);
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

  function calcScore(price: number, aboveMultiplier: number = 1): number {
    if (basePrice <= 0) return 0;
    const deviationPercent = ((price - basePrice) / basePrice) * 100;
    let score: number;
    if (price > basePrice) {
      score = fullScore - deviationPercent * deductHigh;
    } else {
      score = fullScore - Math.abs(deviationPercent) * deductLow;
    }
    score = score * aboveMultiplier;
    return parseFloat(Math.max(Math.min(score, fullScore), minScore).toFixed(2));
  }

  const unsorted = sortedUnits.map((unit) => {
    let score = 0;
    switch (algorithm) {
      case 'low_price_priority':
        score = calcScore(unit.price);
        break;
      case 'average_price':
        score = calcScore(unit.price);
        break;
      case 'gradient_method': {
        const aboveMultiplier = unit.price > basePrice ? 0.95 : 1;
        score = calcScore(unit.price, aboveMultiplier);
        break;
      }
      case 'conventional_method':
        score = calcScore(unit.price);
        break;
      default:
        score = unit.price > 0 ? (basePrice / unit.price) * fullScore : 0;
        score = parseFloat(Math.max(Math.min(score, fullScore), minScore).toFixed(2));
    }

    const deviationPercent = aPrice > 0 ? ((unit.price - aPrice) / aPrice) * 100 : 0;

    return {
      unit,
      deviationPercent: parseFloat(deviationPercent.toFixed(2)),
      score,
      priceDiff: parseFloat((unit.price - aPrice).toFixed(2)),
      rank: 0,
    };
  });

  unsorted.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.unit.price - b.unit.price;
  });

  unsorted.forEach((r, i) => { r.rank = i + 1; });

  return {
    basePrice: parseFloat(basePrice.toFixed(2)),
    aValue: parseFloat(aPrice.toFixed(2)),
    effectiveCount: effectiveUnits.length,
    algorithmName,
    trimmedNames,
    rankings: unsorted,
  };
}