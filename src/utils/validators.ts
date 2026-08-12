import { BidUnit, ValidRule, Algorithm } from '../types';

export function getAlgorithmName(algorithm: Algorithm): string {
  const names: Record<Algorithm, string> = {
    low_price_priority: '低价优先法',
    average_price: '平均价计法',
    gradient_method: '基准价梯度法',
    conventional_method: '基准价常规法',
    ai_parse: 'AI 智能解析',
  };
  return names[algorithm];
}

export function getEffectiveRules(rules: ValidRule[], count: number): ValidRule[] {
  return rules.filter(r => {
    if (r.maxCount === -1) return count >= r.minCount;
    return count >= r.minCount && count <= r.maxCount;
  });
}

export function getTrimmedUnits(
  sortedUnits: BidUnit[],
  rules: ValidRule[]
): { effectiveUnits: BidUnit[]; trimmedNames: string[] } {
  if (rules.length === 0) {
    return { effectiveUnits: sortedUnits, trimmedNames: [] };
  }

  const rule = rules[0];
  const trimmed: string[] = [];

  switch (rule.action) {
    case 'trim_percent': {
      const n = sortedUnits.length;
      const removeCount = Math.max(1, Math.floor(n * (rule.params.trimPercent ?? 20) / 100));
      trimmed.push(...sortedUnits.slice(0, removeCount).map(u => u.name));
      trimmed.push(...sortedUnits.slice(n - removeCount).map(u => u.name));
      return {
        effectiveUnits: sortedUnits.slice(removeCount, n - removeCount),
        trimmedNames: trimmed,
      };
    }
    case 'remove_highest_n': {
      const removeCount = Math.min(rule.params.removeN ?? 1, sortedUnits.length - 1);
      trimmed.push(...sortedUnits.slice(sortedUnits.length - removeCount).map(u => u.name));
      return {
        effectiveUnits: sortedUnits.slice(0, sortedUnits.length - removeCount),
        trimmedNames: trimmed,
      };
    }
    case 'remove_lowest_n': {
      const removeCount = Math.min(rule.params.removeN ?? 1, sortedUnits.length - 1);
      trimmed.push(...sortedUnits.slice(0, removeCount).map(u => u.name));
      return {
        effectiveUnits: sortedUnits.slice(removeCount),
        trimmedNames: trimmed,
      };
    }
    case 'nth_lowest': {
      const nth = rule.params.nth ?? 2;
      const selected = sortedUnits[nth - 1];
      if (selected) {
        return { effectiveUnits: [selected], trimmedNames: sortedUnits.filter(u => u !== selected).map(u => u.name) };
      }
      return { effectiveUnits: sortedUnits, trimmedNames: [] };
    }
    case 'direct':
    default:
      return { effectiveUnits: sortedUnits, trimmedNames: [] };
  }
}
