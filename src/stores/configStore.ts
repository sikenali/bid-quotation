import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BidConfig, BidUnit, CalcResult } from '../types';
import { createDefaultConfig, PRESET_TEMPLATES } from '../utils/templates';
import { calculateResult } from '../utils/algorithms';

interface ConfigStore {
  config: BidConfig;
  calculationResult: CalcResult | null;
  setConfig: (config: Partial<BidConfig>) => void;
  setAlgorithm: (algorithm: BidConfig['algorithm']) => void;
  addBidUnit: (unit: BidUnit) => void;
  removeBidUnit: (id: string) => void;
  updateBidUnit: (id: string, updates: Partial<BidUnit>) => void;
  loadTemplate: (templateId: string) => void;
  calculate: () => void;
  reset: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setApiKey: (apiKey: string) => void;
  setApiEndpoint: (apiEndpoint: string) => void;
}

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set, get) => ({
      config: createDefaultConfig('arithmetic_mean'),
      calculationResult: null,

      setConfig: (partial) =>
        set((state) => ({
          config: { ...state.config, ...partial },
        })),

      setAlgorithm: (algorithm) =>
        set((state) => ({
          config: { ...state.config, algorithm },
        })),

      addBidUnit: (unit) =>
        set((state) => ({
          config: {
            ...state.config,
            bidUnits: [...state.config.bidUnits, unit],
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
        },
      }),
    },
  ),
);
