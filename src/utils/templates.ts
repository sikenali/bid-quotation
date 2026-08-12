import type { Algorithm, BidConfig } from '../types';

export interface Template {
  id: string;
  name: string;
  config: Omit<BidConfig, 'bidUnits' | 'theme' | 'apiKey' | 'apiEndpoint'>;
}

export function createDefaultConfig(algorithm: Algorithm = 'arithmetic_mean'): Omit<BidConfig, 'bidUnits' | 'theme' | 'apiKey' | 'apiEndpoint'> {
  return {
    algorithm,
    kEnabled: false,
    kValue: 0.96,
    trimHighPercent: 20,
    trimLowPercent: 20,
    removeHighestN: 1,
    nthLowest: 2,
    q1Weight: 50,
    k1: 1,
    k2: 1,
    maxPrice: 0,
    customBasePrice: 0,
    validRules: [
      { id: 'r1', minCount: 2, maxCount: 2, action: 'direct', params: {} },
      { id: 'r2', minCount: 3, maxCount: 3, action: 'nth_lowest', params: { nth: 2 } },
      { id: 'r3', minCount: 4, maxCount: 6, action: 'remove_highest_n', params: { removeN: 1 } },
      { id: 'r4', minCount: 7, maxCount: -1, action: 'trim_percent', params: { trimPercent: 20 } },
    ],
    deduction: { fullScore: 60, deductPerHighPercent: 0.6, deductPerLowPercent: 0.3, minScore: 0 },
  };
}

export const PRESET_TEMPLATES: Template[] = [
  {
    id: 'jiangsu-method1',
    name: '【江苏】公路合理低价-方法一',
    config: {
      ...createDefaultConfig('trimmed_mean'),
      kEnabled: true,
      kValue: 0.95,
      trimHighPercent: 20,
      trimLowPercent: 20,
    },
  },
  {
    id: 'jiangsu-method2',
    name: '【江苏】公路合理低价-方法二(含限价)',
    config: {
      ...createDefaultConfig('weighted_limit'),
      q1Weight: 50,
      k1: 1,
      k2: 1,
      maxPrice: 1000,
    },
  },
  {
    id: 'sichuan-weighted',
    name: '【四川】公路-随机权重法',
    config: {
      ...createDefaultConfig('weighted_limit'),
      q1Weight: 50,
      k1: 0.95,
      k2: 0.9,
    },
  },
  {
    id: 'sichuan-double',
    name: '【四川】公路-二次平均法',
    config: {
      ...createDefaultConfig('double_average'),
      kEnabled: true,
      kValue: 0.95,
    },
  },
  {
    id: 'sichuan-lowest',
    name: '【四川】公路-最低价法',
    config: createDefaultConfig('lowest_price'),
  },
  {
    id: 'shanxi-method1',
    name: '【山西】公路合理低价-方法1(限价加权)',
    config: {
      ...createDefaultConfig('weighted_limit'),
      q1Weight: 40,
      k1: 0.95,
      k2: 0.9,
    },
  },
  {
    id: 'shanxi-method2',
    name: '【山西】公路合理低价-方法2(区间均值)',
    config: {
      ...createDefaultConfig('trimmed_mean'),
      kEnabled: true,
      kValue: 0.95,
      trimHighPercent: 20,
      trimLowPercent: 20,
      deduction: { fullScore: 60, deductPerHighPercent: 0.9, deductPerLowPercent: 0.6, minScore: 0 },
    },
  },
  {
    id: 'henan',
    name: '【河南】建设工程-合理低价法',
    config: {
      ...createDefaultConfig('trimmed_mean'),
      kEnabled: true,
      kValue: 0.96,
      trimHighPercent: 20,
      trimLowPercent: 20,
    },
  },
  {
    id: 'gov-procurement',
    name: '【政府采购】低价优先法',
    config: {
      ...createDefaultConfig('second_lowest'),
      kEnabled: true,
      kValue: 1.0,
      deduction: { fullScore: 60, deductPerHighPercent: 1.0, deductPerLowPercent: 0.5, minScore: 0 },
    },
  },
  {
    id: 'generic-k',
    name: '【通用】K值均值法(高0.6低0.3)',
    config: {
      ...createDefaultConfig('arithmetic_mean'),
      kEnabled: true,
      kValue: 0.96,
    },
  },
  {
    id: 'generic-trim-k',
    name: '【通用】去极值+K值(高0.9低0.6)',
    config: {
      ...createDefaultConfig('trimmed_mean'),
      kEnabled: true,
      kValue: 0.95,
      trimHighPercent: 20,
      trimLowPercent: 20,
      deduction: { fullScore: 60, deductPerHighPercent: 0.9, deductPerLowPercent: 0.6, minScore: 0 },
    },
  },
  {
    id: 'generic-double-heavy',
    name: '【通用】二次平均+高扣2低扣1',
    config: {
      ...createDefaultConfig('double_average'),
      kEnabled: true,
      kValue: 0.95,
      deduction: { fullScore: 60, deductPerHighPercent: 2.0, deductPerLowPercent: 1.0, minScore: 0 },
    },
  },
];

export function loadTemplate(id: string): Template | undefined {
  return PRESET_TEMPLATES.find((t) => t.id === id);
}
