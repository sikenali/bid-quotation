import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Algorithm, BidConfig, BidUnit, CalcResult, DeductionParams, ValidRule } from '../types';
import { createDefaultConfig, PRESET_TEMPLATES } from '../utils/templates';
import { calculateResult } from '../utils/algorithms';

interface ConfigState extends BidConfig {
  calculationResult: CalcResult | null;
  currentStep: number;
  exportFormat: 'csv' | 'md';

  setCurrentStep: (step: number) => void;
  setAlgorithm: (algorithm: Algorithm) => void;
  setKEnabled: (enabled: boolean) => void;
  setKValue: (value: number) => void;
  setTrimHighPercent: (value: number) => void;
  setTrimLowPercent: (value: number) => void;
  setRemoveHighestN: (value: number) => void;
  setNthLowest: (value: number) => void;
  setQ1Weight: (value: number) => void;
  setK1: (value: number) => void;
  setK2: (value: number) => void;
  setMaxPrice: (value: number) => void;
  setCustomBasePrice: (value: number) => void;
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
  setApiKey: (key: string) => void;
  setApiEndpoint: (endpoint: string) => void;
  loadTemplate: (templateId: string) => void;
  exportConfig: () => string;
  importConfig: (json: string) => void;
  calculate: () => void;
  reset: () => void;
}

const defaultConfig = createDefaultConfig();

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      algorithm: defaultConfig.algorithm,
      kEnabled: defaultConfig.kEnabled,
      kValue: defaultConfig.kValue,
      trimHighPercent: defaultConfig.trimHighPercent,
      trimLowPercent: defaultConfig.trimLowPercent,
      removeHighestN: defaultConfig.removeHighestN,
      nthLowest: defaultConfig.nthLowest,
      q1Weight: defaultConfig.q1Weight,
      k1: defaultConfig.k1,
      k2: defaultConfig.k2,
      maxPrice: defaultConfig.maxPrice,
      customBasePrice: defaultConfig.customBasePrice,
      validRules: defaultConfig.validRules,
      deduction: defaultConfig.deduction,
      bidUnits: [],
      theme: 'light' as const,
      exportFormat: 'csv' as const,
      currentStep: 1,
      calculationResult: null,
      apiKey: undefined,
      apiEndpoint: 'https://api.deepseek.com/v1',

      setCurrentStep: (step) => set({ currentStep: step }),
      setAlgorithm: (algorithm) => set({ algorithm }),
      setKEnabled: (kEnabled) => set({ kEnabled }),
      setKValue: (kValue) => set({ kValue }),
      setTrimHighPercent: (trimHighPercent) => set({ trimHighPercent }),
      setTrimLowPercent: (trimLowPercent) => set({ trimLowPercent }),
      setRemoveHighestN: (removeHighestN) => set({ removeHighestN }),
      setNthLowest: (nthLowest) => set({ nthLowest }),
      setQ1Weight: (q1Weight) => set({ q1Weight }),
      setK1: (k1) => set({ k1 }),
      setK2: (k2) => set({ k2 }),
      setMaxPrice: (maxPrice) => set({ maxPrice }),
      setCustomBasePrice: (customBasePrice) => set({ customBasePrice }),
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
        const units: BidUnit[] = [];
        for (let i = 0; i < count; i++) {
          const f = (Math.random() - 0.5) * 2 * fluctuationPercent;
          units.push({
            id: crypto.randomUUID(),
            name: `单位${String.fromCharCode(65 + i)}`,
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
      setApiKey: (apiKey) => set({ apiKey }),
      setApiEndpoint: (apiEndpoint) => set({ apiEndpoint }),
      loadTemplate: (templateId) => {
        const template = PRESET_TEMPLATES.find((t) => t.id === templateId);
        if (template) {
          const { config } = template;
          set({
            algorithm: config.algorithm,
            kEnabled: config.kEnabled,
            kValue: config.kValue,
            trimHighPercent: config.trimHighPercent,
            trimLowPercent: config.trimLowPercent,
            removeHighestN: config.removeHighestN,
            nthLowest: config.nthLowest,
            q1Weight: config.q1Weight,
            k1: config.k1,
            k2: config.k2,
            maxPrice: config.maxPrice,
            customBasePrice: config.customBasePrice,
            validRules: config.validRules,
            deduction: config.deduction,
          });
        }
      },
      exportConfig: (): string => {
        const s = useConfigStore.getState();
        return JSON.stringify(
          {
            algorithm: s.algorithm,
            kEnabled: s.kEnabled,
            kValue: s.kValue,
            trimHighPercent: s.trimHighPercent,
            trimLowPercent: s.trimLowPercent,
            removeHighestN: s.removeHighestN,
            nthLowest: s.nthLowest,
            q1Weight: s.q1Weight,
            k1: s.k1,
            k2: s.k2,
            maxPrice: s.maxPrice,
            customBasePrice: s.customBasePrice,
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
            kEnabled: data.kEnabled,
            kValue: data.kValue,
            trimHighPercent: data.trimHighPercent,
            trimLowPercent: data.trimLowPercent,
            removeHighestN: data.removeHighestN,
            nthLowest: data.nthLowest,
            q1Weight: data.q1Weight,
            k1: data.k1,
            k2: data.k2,
            maxPrice: data.maxPrice,
            customBasePrice: data.customBasePrice,
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
        set({ calculationResult: result });
      },
      reset: () => {
        const d = createDefaultConfig();
        set({
          algorithm: d.algorithm,
          kEnabled: d.kEnabled,
          kValue: d.kValue,
          trimHighPercent: d.trimHighPercent,
          trimLowPercent: d.trimLowPercent,
          removeHighestN: d.removeHighestN,
          nthLowest: d.nthLowest,
          q1Weight: d.q1Weight,
          k1: d.k1,
          k2: d.k2,
          maxPrice: d.maxPrice,
          customBasePrice: d.customBasePrice,
          validRules: d.validRules,
          deduction: d.deduction,
          bidUnits: [],
          currentStep: 1,
          calculationResult: null,
        });
      },
    }),
    {
      name: 'bidQuotationConfig',
      partialize: (s) => ({
        algorithm: s.algorithm,
        kEnabled: s.kEnabled,
        kValue: s.kValue,
        trimHighPercent: s.trimHighPercent,
        trimLowPercent: s.trimLowPercent,
        removeHighestN: s.removeHighestN,
        nthLowest: s.nthLowest,
        q1Weight: s.q1Weight,
        k1: s.k1,
        k2: s.k2,
        maxPrice: s.maxPrice,
        customBasePrice: s.customBasePrice,
        validRules: s.validRules,
        deduction: s.deduction,
        theme: s.theme,
        exportFormat: s.exportFormat,
        apiKey: s.apiKey,
        apiEndpoint: s.apiEndpoint,
      }),
    }
  )
);
