import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Algorithm, BidConfig, BidUnit, CalcResult, DeductionParams, ValidRule, UnitScore } from '../types';
import { createDefaultConfig, PRESET_TEMPLATES } from '../utils/templates';
import { calculateResult } from '../utils/algorithms';

interface ConfigState extends BidConfig {
  calculationResult: CalcResult | null;
  currentStep: number;
  exportFormat: 'csv' | 'md';
  activeRuleId: string | null;
  showAlgorithmDesc: boolean;
  unitScores: UnitScore[];

  setCurrentStep: (step: number) => void;
  setAlgorithm: (algorithm: Algorithm) => void;
  setValidRules: (rules: ValidRule[]) => void;
  addValidRule: (rule: ValidRule) => void;
  removeValidRule: (id: string) => void;
  updateValidRule: (id: string, updates: Partial<ValidRule>) => void;
  setDeduction: (deduction: DeductionParams) => void;
  addBidUnit: (name: string, price: number) => void;
  updateBidUnit: (id: string, updates: Partial<BidUnit>) => void;
  removeBidUnit: (id: string) => void;
  clearBidUnits: () => void;
  randomFill: (count: number, centerPrice: number, fluctuationPercent: number) => void;
  parsePrices: (text: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setExportFormat: (format: 'csv' | 'md') => void;
  setActiveRuleId: (id: string | null) => void;
  setShowAlgorithmDesc: (show: boolean) => void;
  setApiKey: (key: string) => void;
  setApiEndpoint: (endpoint: string) => void;
  loadTemplate: (templateId: string) => void;
  setUnitScores: (scores: UnitScore[]) => void;
  updateUnitScore: (unitId: string, updates: Partial<Pick<UnitScore, 'businessScore' | 'technicalScore'>>) => void;
  exportConfig: () => string;
  importConfig: (json: string) => void;
  calculate: () => void;
  reset: () => void;
}

const defaultConfig = createDefaultConfig();

function getAlgorithmDeduction(algorithm: Algorithm): DeductionParams {
  switch (algorithm) {
    case 'low_price_priority':
    case 'conventional_method':
      return { fullScore: 20, deductPerHighPercent: 0, deductPerLowPercent: 0, minScore: 0 };
    case 'average_price':
      return { fullScore: 20, deductPerHighPercent: 0.6, deductPerLowPercent: 0.3, minScore: 0 };
    case 'gradient_method':
      return { fullScore: 20, deductPerHighPercent: 0.6, deductPerLowPercent: 0.3, minScore: 0 };
    case 'ai_parse':
      return { fullScore: 60, deductPerHighPercent: 0.6, deductPerLowPercent: 0.3, minScore: 0 };
    default:
      return { fullScore: 60, deductPerHighPercent: 0.6, deductPerLowPercent: 0.3, minScore: 0 };
  }
}

const defaultBidUnits = [
  { id: 'default-1', name: '武汉锂钠氪锶科技有限公司', price: 0, isValid: true },
  { id: 'default-2', name: '武汉懒猫微服科技有限公司', price: 0, isValid: true },
  { id: 'default-3', name: '武汉铀锂氪锶科技合伙企业（有限合伙）', price: 0, isValid: true },
  { id: 'default-4', name: '广西锂钠氪锶软件科技有限公司', price: 0, isValid: true },
];

const defaultValidRules: ValidRule[] = [
  { id: 'r1', minCount: 2, maxCount: 2, action: 'direct', params: {} },
  { id: 'r2', minCount: 3, maxCount: 3, action: 'nth_lowest', params: { nth: 2 } },
  { id: 'r3', minCount: 4, maxCount: 6, action: 'remove_highest_n', params: { removeN: 1 } },
];

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      algorithm: defaultConfig.algorithm,
      validRules: defaultConfig.validRules,
          deduction: getAlgorithmDeduction(defaultConfig.algorithm),
      bidUnits: [...defaultBidUnits],
      theme: 'light' as const,
      exportFormat: 'csv' as const,
      currentStep: 1,
      calculationResult: null,
      activeRuleId: 'r2',
      showAlgorithmDesc: false,
      unitScores: [],
      apiKey: undefined,
      apiEndpoint: 'https://api.deepseek.com/v1',

      setCurrentStep: (step) => set({ currentStep: step }),
      setAlgorithm: (algorithm) => set({ algorithm, showAlgorithmDesc: false, ...getAlgorithmDeduction(algorithm) }),
      setValidRules: (validRules) => set({ validRules }),
      addValidRule: (rule) => set((s) => ({ validRules: [...s.validRules, rule] })),
      removeValidRule: (id) => set((s) => ({ validRules: s.validRules.filter((r) => r.id !== id) })),
      updateValidRule: (id, updates) =>
        set((s) => ({
          validRules: s.validRules.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        })),
      setDeduction: (deduction) => set({ deduction }),
      addBidUnit: (name, price) =>
        set((s) => ({
          bidUnits: [...s.bidUnits, { id: crypto.randomUUID(), name, price, isValid: true }],
        })),
      updateBidUnit: (id, updates) =>
        set((s) => ({
          bidUnits: s.bidUnits.map((u) => (u.id === id ? { ...u, ...updates } : u)),
        })),
      removeBidUnit: (id) => set((s) => ({ bidUnits: s.bidUnits.filter((u) => u.id !== id) })),
      clearBidUnits: () => set({ bidUnits: [] }),
      randomFill: (count, centerPrice, fluctuationPercent) => {
        const names = [
          '武汉锂钠氪锶科技有限公司',
          '武汉懒猫微服科技有限公司',
          '武汉铀锂氪锶科技合伙企业（有限合伙）',
          '广西锂钠氪锶软件科技有限公司',
        ];
        const units: BidUnit[] = [];
        for (let i = 0; i < count; i++) {
          const f = (Math.random() - 0.5) * 2 * fluctuationPercent;
          units.push({
            id: crypto.randomUUID(),
            name: names[i % names.length],
            price: parseFloat((centerPrice * (1 + f / 100)).toFixed(2)),
            isValid: true,
          });
        }
        set({ bidUnits: units });
      },
      parsePrices: (text) => {
        const prices = text
          .replace(/，/g, ',')
          .split(',')
          .map((s) => s.trim())
          .filter((s) => /^\d+(\.\d+)?$/.test(s))
          .map((s) => parseFloat(s));
        const units: BidUnit[] = prices.map((price, i) => ({
          id: crypto.randomUUID(),
          name: `单位${String.fromCharCode(65 + i)}`,
          price,
          isValid: true,
        }));
        set({ bidUnits: units });
      },
      setTheme: (theme) => set({ theme }),
      setExportFormat: (exportFormat) => set({ exportFormat }),
      setActiveRuleId: (activeRuleId) => set({ activeRuleId }),
      setShowAlgorithmDesc: (showAlgorithmDesc) => set({ showAlgorithmDesc }),
      setApiKey: (apiKey) => set({ apiKey }),
      setApiEndpoint: (apiEndpoint) => set({ apiEndpoint }),
      setUnitScores: (unitScores) => set({ unitScores }),
      updateUnitScore: (unitId, updates) => set((s) => ({
        unitScores: s.unitScores.map((us) =>
          us.unitId === unitId ? { ...us, ...updates } : us
        ),
      })),
      loadTemplate: (templateId) => {
        const template = PRESET_TEMPLATES.find((t) => t.id === templateId);
        if (template) {
          const { config } = template;
          set({
            algorithm: config.algorithm,
            validRules: config.validRules,
            deduction: config.deduction,
            showAlgorithmDesc: false,
          });
        }
      },
      exportConfig: (): string => {
        const s = useConfigStore.getState();
        return JSON.stringify(
          {
            algorithm: s.algorithm,
            validRules: s.validRules,
            deduction: s.deduction,
          },
          null,
          2
        );
      },
      importConfig: (json: string) => {
        try {
          const data = JSON.parse(json);
          set({
            algorithm: data.algorithm,
            validRules: data.validRules,
            deduction: data.deduction,
          });
        } catch {
          console.error('导入配置失败');
        }
      },
      calculate: () => {
        const s = useConfigStore.getState();
        const result = calculateResult(s as unknown as BidConfig);
        if (result) {
          // Build unitPriceScores from rankings
          const unitPriceScores: Record<string, number> = {};
          const unitScores: UnitScore[] = s.bidUnits.map((unit) => {
            const ranking = result.rankings.find(r => r.unit.id === unit.id);
            const priceScore = ranking ? ranking.score : 0;
            // Find existing saved scores
            const existing = s.unitScores.find(us => us.unitId === unit.id);
            return {
              id: crypto.randomUUID(),
              unitId: unit.id,
              priceScore,
              businessScore: existing?.businessScore ?? 0,
              technicalScore: existing?.technicalScore ?? 0,
            };
          });
          result.unitPriceScores = unitPriceScores;
          set({ calculationResult: result, unitScores });
        } else {
          set({ calculationResult: null });
        }
      },
      reset: () => {
        set({
          algorithm: defaultConfig.algorithm,
          validRules: [...defaultValidRules],
          deduction: getAlgorithmDeduction(defaultConfig.algorithm),
          bidUnits: [...defaultBidUnits],
          activeRuleId: 'r2',
           showAlgorithmDesc: false,
           unitScores: [],
           currentStep: 1,
          calculationResult: null,
        });
      },
    }),
    {
      name: 'bidQuotationConfig',
      partialize: (s) => ({
        algorithm: s.algorithm,
        validRules: s.validRules,
        deduction: s.deduction,
        theme: s.theme,
        exportFormat: s.exportFormat,
        apiKey: s.apiKey,
        apiEndpoint: s.apiEndpoint,
        unitScores: s.unitScores,
      }),
      onRehydrateStorage: () => (state: ConfigState | undefined) => {
        if (!state) return;
        if (state.bidUnits === null || state.bidUnits === undefined) {
          state.bidUnits = [...defaultBidUnits];
        } else if (state.bidUnits.length === 0) {
          state.bidUnits = [...defaultBidUnits];
        }
        if (!Array.isArray(state.validRules) || state.validRules.length < 2) {
          (state as any).validRules = [...defaultValidRules];
        }
      },
    }
  )
);
