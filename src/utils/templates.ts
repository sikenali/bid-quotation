import type { Algorithm, BidConfig } from '../types';

export interface Template {
  id: string;
  name: string;
  config: Omit<BidConfig, 'bidUnits' | 'theme' | 'apiKey' | 'apiEndpoint'>;
}

export function createDefaultConfig(algorithm: Algorithm = 'low_price_priority'): Omit<BidConfig, 'bidUnits' | 'theme' | 'apiKey' | 'apiEndpoint'> {
  return {
    algorithm,
    validRules: [
      { id: 'r1', minCount: 2, maxCount: 2, action: 'direct', params: {} },
      { id: 'r2', minCount: 3, maxCount: 3, action: 'nth_lowest', params: { nth: 2 } },
      { id: 'r3', minCount: 4, maxCount: 6, action: 'remove_highest_n', params: { removeN: 1 } },
    ],
    deduction: { fullScore: 60, deductPerHighPercent: 0.6, deductPerLowPercent: 0.3, minScore: 0 },
  };
}

export const PRESET_TEMPLATES: Template[] = [
  {
    id: 'low-price-first',
    name: '低价优先法',
    config: createDefaultConfig('low_price_priority'),
  },
  {
    id: 'average-price',
    name: '平均价计法',
    config: createDefaultConfig('average_price'),
  },
  {
    id: 'gradient-price',
    name: '基准价梯度法',
    config: createDefaultConfig('gradient_method'),
  },
  {
    id: 'conventional-price',
    name: '基准价常规法',
    config: createDefaultConfig('conventional_method'),
  },
];

export function loadTemplate(id: string): Template | undefined {
  return PRESET_TEMPLATES.find((t) => t.id === id);
}
