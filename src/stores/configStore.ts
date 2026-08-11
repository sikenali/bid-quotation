import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BidConfig, BidUnit, CalcResult, ValidRule } from '../types';
import { createDefaultConfig, PRESET_TEMPLATES } from '../utils/templates';
import { calculateResult } from '../utils/algorithms';

interface ConfigStore {
  config: BidConfig;
  calculationResult: CalcResult | null;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  setConfig: (config: Partial<BidConfig>) => void;
  setAlgorithm: (algorithm: BidConfig['algorithm']) => void;
  addBidUnit: (name: string, price: number) => void;
  removeBidUnit: (id: string) => void;
  updateBidUnit: (id: string, updates: Partial<BidUnit>) => void;
  clearBidUnits: () => void;
  randomFill: (count: number, centerPrice: number, fluctuationPercent: number) => void;
  parsePrices: (text: string) => void;
  addValidRule: (rule: ValidRule) => void;
  removeValidRule: (id: string) => void;
  updateValidRule: (id: string, updates: Partial<ValidRule>) => void;
  loadTemplate: (templateId: string) => void;
  calculate: () => void;
  reset: () => void;
  setDeduction: (deduction: Partial<BidConfig['deduction']>) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setApiKey: (apiKey: string) => void;
  setApiEndpoint: (apiEndpoint: string) => void;
}

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set, get) => ({
      config: createDefaultConfig('arithmetic_mean'),
      calculationResult: null,
      currentStep: 1,

      setCurrentStep: (step) => set({ currentStep: step }),

      setConfig: (partial) =>
        set((state) => ({
          config: { ...state.config, ...partial },
        })),

      setAlgorithm: (algorithm) =>
        set((state) => ({
          config: { ...state.config, algorithm },
        })),

      addBidUnit: (name, price) =>
        set((state) => ({
          config: {
            ...state.config,
            bidUnits: [
              ...state.config.bidUnits,
              { id: crypto.randomUUID(), name, price, isValid: true },
            ],
          },
        })),

      removeBidUnit: (id) =>
        set((state) => ({
          config: {
            ...state.config,
            bidUnits: state.config.bidUnits.filter((u) => u.id !== id),
          },
        })),

      updateBidUnit: (id, updates) =>
        set((state) => ({
          config: {
            ...state.config,
            bidUnits: state.config.bidUnits.map((u) =>
              u.id === id ? { ...u, ...updates } : u,
            ),
          },
        })),

      clearBidUnits: () =>
        set((state) => ({
          config: {
            ...state.config,
            bidUnits: [],
          },
        })),

      randomFill: (count, centerPrice, fluctuationPercent) => {
        const units: BidUnit[] = [];
        for (let i = 0; i < count; i++) {
          const fluctuation = (Math.random() - 0.5) * 2 * fluctuationPercent;
          const price = parseFloat((centerPrice * (1 + fluctuation / 100)).toFixed(2));
          units.push({ id: crypto.randomUUID(), name: `单位${String.fromCharCode(65 + i)}`, price, isValid: true });
        }
        set((state) => ({
          config: {
            ...state.config,
            bidUnits: units,
          },
        }));
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
        set((state) => ({
          config: {
            ...state.config,
            bidUnits: units,
          },
        }));
      },

      addValidRule: (rule) =>
        set((state) => ({
          config: {
            ...state.config,
            validRules: [...state.config.validRules, rule],
          },
        })),

      removeValidRule: (id) =>
        set((state) => ({
          config: {
            ...state.config,
            validRules: state.config.validRules.filter((r) => r.id !== id),
          },
        })),

      updateValidRule: (id, updates) =>
        set((state) => ({
          config: {
            ...state.config,
            validRules: state.config.validRules.map((r) =>
              r.id === id ? { ...r, ...updates } : r,
            ),
          },
        })),

      loadTemplate: (templateId) => {
        const template = PRESET_TEMPLATES.find((t) => t.id === templateId);
        if (template) {
          set((state) => ({
            config: {
              ...state.config,
              ...template.config,
            },
            calculationResult: null,
          }));
        }
      },

      calculate: () => {
        const result = calculateResult(get().config);
        set({ calculationResult: result });
      },

      reset: () =>
        set({
          config: createDefaultConfig('arithmetic_mean'),
          calculationResult: null,
        }),

      setDeduction: (deduction) =>
        set((state) => ({
          config: {
            ...state.config,
            deduction: { ...state.config.deduction, ...deduction },
          },
        })),

      setTheme: (theme) =>
        set((state) => ({
          config: { ...state.config, theme },
        })),

      setApiKey: (apiKey) =>
        set((state) => ({
          config: { ...state.config, apiKey },
        })),

      setApiEndpoint: (apiEndpoint) =>
        set((state) => ({
          config: { ...state.config, apiEndpoint },
        })),
    }),
    {
      name: 'bid-quotation-config',
      version: 1,
      partialize: (state) => ({
        config: {
          ...state.config,
          bidUnits: [],
          currentStep: state.currentStep,
          validRules: state.config.validRules,
        },
      }),
    },
  ),
);
