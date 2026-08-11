# 投标报价评分测算工具 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a React + Vite bid quotation scoring calculator with 5-step wizard, 8 algorithms, rule engine, AI parsing, template system, and dark/light themes.

**Architecture:** Single-page React app with React Router for step navigation. Zustand for state management with localStorage persistence. All calculations run client-side. Settings panel as a full-screen overlay. Tailwind CSS for styling with custom warm-beige theme.

**Tech Stack:** React 18, TypeScript, Vite, Tailwind CSS, Zustand, react-router-dom

## Global Constraints

- 配色主色 `#C43A31`，背景 `#FDF5E6`，卡片背景 `#F5EFE0`
- 所有配置自动保存到 localStorage，key 为 `bidQuotationConfig`
- 响应式：≤768px 时算法宫格改为 2 列
- 深色主题完整支持，所有颜色有对应暗色值
- CSV 导出使用 UTF-8 BOM 编码
- API Key 仅存 localStorage，不调用第三方服务器中转
- 无柱状图/ECharts，结果页只保留摘要卡片 + 排名表格

---

### Task 1: 项目初始化

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `index.html`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `src/index.css`
- Create: `src/main.tsx`

**Interfaces:**
- Consumes: none
- Produces: 项目基础结构，可运行 `npm run dev`

- [ ] **Step 1: 初始化 Vite + React + TypeScript 项目**

```bash
npm create vite@latest . -- --template react-ts
```

- [ ] **Step 2: 安装依赖**

```bash
npm install tailwindcss @tailwindcss/vite zustand react-router-dom dayjs uuid
npm install -D autoprefixer
npx tailwindcss init -p
```

- [ ] **Step 3: 配置 tailwind.config.ts**

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#C43A31',
        primaryHover: '#A83028',
        bg: '#FDF5E6',
        card: '#F5EFE0',
        border: '#D4C4A8',
        borderLight: '#E8E0CC',
        success: '#5B8C5A',
        successLight: '#E8F0E7',
        text: '#5C4033',
        textSecondary: '#8B7355',
        stepInactive: '#F0E8D5',
        darkBg: '#1A1A1A',
        darkCard: '#2A2A2A',
        darkBorder: '#3A3A3A',
        darkText: '#E8E0D0',
        darkTextSecondary: '#A89880',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 4: 配置 postcss.config.js**

```javascript
export default {
  plugins: {
    '@tailwindcss/vite': true,
  },
};
```

- [ ] **Step 5: 修改 index.html**

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>投标报价测算</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 6: 配置 src/index.css**

```css
@import 'tailwindcss';

@layer base {
  body {
    @apply bg-bg text-text font-sans antialiased;
  }
  .dark body {
    @apply bg-darkBg text-darkText;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary text-white px-6 py-2.5 rounded-lg font-medium
           hover:bg-primaryHover transition-colors duration-200
           flex items-center gap-2;
  }
  .btn-secondary {
    @apply bg-card text-text px-6 py-2.5 rounded-lg font-medium
           hover:bg-borderLight transition-colors duration-200
           border border-border;
  }
  .input-field {
    @apply bg-white border border-border rounded-lg px-4 py-2
           focus:outline-none focus:ring-2 focus:ring-primary/30
           focus:border-primary transition-all;
  }
  .card {
    @apply bg-card border border-border rounded-xl p-6;
  }
}
```

- [ ] **Step 7: 配置 src/main.tsx**

```typescript
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 8: 创建 src/App.tsx（骨架）**

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>首页重定向到 step-1</div>} />
        <Route path="/step-1" element={<div>Step 1 占位</div>} />
        <Route path="/step-2" element={<div>Step 2 占位</div>} />
        <Route path="/step-3" element={<div>Step 3 占位</div>} />
        <Route path="/step-4" element={<div>Step 4 占位</div>} />
        <Route path="/step-5" element={<div>Step 5 占位</div>} />
      </Routes>
    </BrowserRouter>
  );
}
```

- [ ] **Step 9: 验证项目可运行**

```bash
npm run dev
```

访问 http://localhost:5173 确认页面正常显示。

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "chore: init project with Vite + React + TypeScript + Tailwind"
```

---

### Task 2: TypeScript 类型定义

**Files:**
- Create: `src/types/index.ts`

**Interfaces:**
- Consumes: none
- Produces: 所有业务类型，供后续所有任务使用

- [ ] **Step 1: 创建类型定义文件**

```typescript
// src/types/index.ts

export type Algorithm =
  | 'arithmetic_mean'
  | 'trimmed_mean'
  | 'remove_highest'
  | 'second_lowest'
  | 'double_average'
  | 'weighted_limit'
  | 'lowest_price'
  | 'custom'
  | 'ai_parse';

export type TrimAction =
  | 'trim_percent'
  | 'remove_highest_n'
  | 'remove_lowest_n'
  | 'nth_lowest'
  | 'direct';

export interface ValidRule {
  id: string;
  minCount: number;
  maxCount: number; // -1 表示无穷
  action: TrimAction;
  params: {
    trimPercent?: number;
    removeN?: number;
    nth?: number;
  };
}

export interface DeductionParams {
  fullScore: number;
  deductPerHighPercent: number;
  deductPerLowPercent: number;
  minScore: number;
}

export interface BidUnit {
  id: string;
  name: string;
  price: number;
  isValid: boolean;
}

export interface BidConfig {
  algorithm: Algorithm;
  kEnabled: boolean;
  kValue: number;
  trimHighPercent: number;
  trimLowPercent: number;
  removeHighestN: number;
  nthLowest: number;
  q1Weight: number;
  k1: number;
  k2: number;
  maxPrice: number;
  customBasePrice: number;
  validRules: ValidRule[];
  deduction: DeductionParams;
  bidUnits: BidUnit[];
  theme: 'light' | 'dark';
  apiKey?: string;
  apiEndpoint?: string;
}

export interface AlgorithmOption {
  id: Algorithm;
  name: string;
  description: string;
  icon: string;
}

export interface CalcResult {
  basePrice: number;
  aValue: number;
  effectiveCount: number;
  algorithmName: string;
  trimmedNames?: string[];
  rankings: Array<{
    rank: number;
    unit: BidUnit;
    deviationPercent: number;
    score: number;
    priceDiff: number;
  }>;
}

export interface Template {
  id: string;
  name: string;
  config: Omit<BidConfig, 'bidUnits' | 'theme' | 'apiKey' | 'apiEndpoint'>;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add TypeScript type definitions"
```

---

### Task 3: 核心计算逻辑

**Files:**
- Create: `src/utils/algorithms.ts`
- Create: `src/utils/validators.ts`
- Create: `src/__tests__/algorithms.test.ts`

**Interfaces:**
- Consumes: `BidConfig`, `BidUnit`, `CalcResult`, `ValidRule` from `types/index.ts`
- Produces: `calculateResult(config: BidConfig): CalcResult | null`

- [ ] **Step 1: 编写测试（先失败）**

```typescript
// src/__tests__/algorithms.test.ts
import { describe, it, expect } from 'vitest';
import { calculateResult } from '../utils/algorithms';
import { createDefaultConfig } from '../utils/templates';

describe('calculateResult', () => {
  it('算术平均法: 基准价 = 平均价 × K', () => {
    const config = createDefaultConfig('arithmetic_mean');
    config.bidUnits = [
      { id: '1', name: 'A', price: 100, isValid: true },
      { id: '2', name: 'B', price: 200, isValid: true },
      { id: '3', name: 'C', price: 300, isValid: true },
    ];
    config.kEnabled = true;
    config.kValue = 0.95;

    const result = calculateResult(config);
    expect(result).not.toBeNull();
    // 平均 = 200, 基准价 = 200 × 0.95 = 190
    expect(result!.basePrice).toBeCloseTo(190, 2);
  });

  it('最低价法: 基准价 = 最低报价', () => {
    const config = createDefaultConfig('lowest_price');
    config.bidUnits = [
      { id: '1', name: 'A', price: 150, isValid: true },
      { id: '2', name: 'B', price: 200, isValid: true },
      { id: '3', name: 'C', price: 100, isValid: true },
    ];

    const result = calculateResult(config);
    expect(result).not.toBeNull();
    expect(result!.basePrice).toBeCloseTo(100, 2);
  });

  it('次低报价法: 基准价 = 第2低报价', () => {
    const config = createDefaultConfig('second_lowest');
    config.bidUnits = [
      { id: '1', name: 'A', price: 150, isValid: true },
      { id: '2', name: 'B', price: 200, isValid: true },
      { id: '3', name: 'C', price: 100, isValid: true },
      { id: '4', name: 'D', price: 180, isValid: true },
    ];

    const result = calculateResult(config);
    expect(result).not.toBeNull();
    // 排序: 100, 150, 180, 200 → 第2低 = 150
    expect(result!.basePrice).toBeCloseTo(150, 2);
  });

  it('有效投标判定: 根据规则过滤', () => {
    const config = createDefaultConfig('arithmetic_mean');
    config.bidUnits = [
      { id: '1', name: 'A', price: 100, isValid: true },
      { id: '2', name: 'B', price: 200, isValid: true },
      { id: '3', name: 'C', price: 300, isValid: true },
      { id: '4', name: 'D', price: 400, isValid: true },
      { id: '5', name: 'E', price: 500, isValid: true },
      { id: '6', name: 'F', price: 600, isValid: true },
      { id: '7', name: 'G', price: 700, isValid: true },
    ];
    // 默认规则: ≥7家去极值20%
    // 7家的20% = 1.4 → 去掉1高1低 → 剩余5家: 200,300,400,500,600
    // 平均 = 400
    config.validRules = [
      { id: 'r1', minCount: 7, maxCount: -1, action: 'trim_percent', params: { trimPercent: 20 } },
    ];

    const result = calculateResult(config);
    expect(result).not.toBeNull();
    expect(result!.effectiveCount).toBe(5);
  });

  it('得分计算: 高于基准价扣分', () => {
    const config = createDefaultConfig('arithmetic_mean');
    config.bidUnits = [
      { id: '1', name: 'A', price: 100, isValid: true },
      { id: '2', name: 'B', price: 110, isValid: true },
    ];
    config.deduction = { fullScore: 60, deductPerHighPercent: 0.6, deductPerLowPercent: 0.3, minScore: 0 };

    const result = calculateResult(config);
    expect(result).not.toBeNull();
    // 基准价 = 105, B报价偏差 = (110-105)/105 = 4.76%
    // B得分 = 60 - 4.76 × 0.6 = 60 - 2.86 = 57.14
    const bRanking = result!.rankings.find(r => r.unit.id === '2');
    expect(bRanking).toBeDefined();
    expect(bRanking!.score).toBeCloseTo(57.14, 1);
  });

  it('无有效报价时返回 null', () => {
    const config = createDefaultConfig('arithmetic_mean');
    config.bidUnits = [];

    const result = calculateResult(config);
    expect(result).toBeNull();
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

```bash
npm install -D vitest
npx vitest run
```

期望：所有测试 FAIL（calculateResult 未定义）

- [ ] **Step 3: 实现核心计算逻辑**

```typescript
// src/utils/algorithms.ts
import { BidConfig, BidUnit, CalcResult, ValidRule } from '../types';
import { getAlgorithmName, getTrimmedUnits, getEffectiveRules } from './validators';

export function calculateResult(config: BidConfig): CalcResult | null {
  const { bidUnits, algorithm, validRules, deduction, kEnabled, kValue } = config;

  if (bidUnits.length === 0) return null;

  // 1. 有效投标判定
  const sortedUnits = [...bidUnits].sort((a, b) => a.price - b.price);
  const rules = getEffectiveRules(validRules, bidUnits.length);
  const { effectiveUnits, trimmedNames } = getTrimmedUnits(sortedUnits, rules);

  if (effectiveUnits.length === 0) return null;

  // 2. 计算 A 值（基准价前值）
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

  // 3. 计算每个单位的得分
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
```

- [ ] **Step 4: 实现辅助函数**

```typescript
// src/utils/validators.ts
import { BidUnit, ValidRule, Algorithm, TrimAction } from '../types';

export function getAlgorithmName(algorithm: Algorithm): string {
  const names: Record<Algorithm, string> = {
    arithmetic_mean: '算术平均法',
    trimmed_mean: '去极值平均法',
    remove_highest: '去最高平均法',
    second_lowest: '次低报价法',
    double_average: '二次平均法',
    weighted_limit: '随机权重法',
    lowest_price: '最低价法',
    custom: '手动指定',
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
```

- [ ] **Step 5: 运行测试确认通过**

```bash
npx vitest run
```

期望：所有测试 PASS

- [ ] **Step 6: Commit**

```bash
git add src/utils/algorithms.ts src/utils/validators.ts src/__tests__/algorithms.test.ts
git commit -m "feat: implement core calculation logic with 8 algorithms"
```

---

### Task 4: 12 套预设模板

**Files:**
- Create: `src/utils/templates.ts`

**Interfaces:**
- Consumes: `BidConfig`, `Algorithm`, `Template` from `types/index.ts`
- Produces: `createDefaultConfig()`, `PRESET_TEMPLATES`, `loadTemplate(id)`

- [ ] **Step 1: 创建模板文件**

```typescript
// src/utils/templates.ts
import { Algorithm, BidConfig, DeductionParams, Template, ValidRule } from '../types';

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
      { id: 'r1', minCount: 7, maxCount: -1, action: 'trim_percent', params: { trimPercent: 20 } },
      { id: 'r2', minCount: 4, maxCount: 6, action: 'remove_highest_n', params: { removeN: 1 } },
      { id: 'r3', minCount: 2, maxCount: 3, action: 'nth_lowest', params: { nth: 2 } },
      { id: 'r4', minCount: 1, maxCount: 1, action: 'direct', params: {} },
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
```

- [ ] **Step 2: Commit**

```bash
git add src/utils/templates.ts
git commit -m "feat: add 12 preset templates for different regions"
```

---

### Task 5: Zustand 状态管理

**Files:**
- Create: `src/stores/configStore.ts`

**Interfaces:**
- Consumes: `BidConfig` from `types/index.ts`, `PRESET_TEMPLATES` from `utils/templates.ts`
- Produces: store with getters/setters for all config, localStorage persistence

- [ ] **Step 1: 创建 Zustand store**

```typescript
// src/stores/configStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BidConfig, Algorithm } from '../types';
import { createDefaultConfig } from '../utils/templates';

const STORAGE_KEY = 'bidQuotationConfig';

interface ConfigState extends BidConfig {
  currentStep: number;
  calculationResult: ReturnType<NonNullable<BidConfig['basePrice'] extends number ? never : never>> | null;

  // Step navigation
  setCurrentStep: (step: number) => void;

  // Algorithm
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

  // Valid rules
  setValidRules: (rules: BidConfig['validRules']) => void;
  addValidRule: (rule: BidConfig['validRules'][0]) => void;
  removeValidRule: (id: string) => void;
  updateValidRule: (id: string, updates: Partial<BidConfig['validRules'][0]>) => void;

  // Deduction
  setDeduction: (deduction: BidConfig['deduction']) => void;

  // Bid units
  addBidUnit: (name: string, price: number) => void;
  updateBidUnit: (id: string, updates: Partial<BidConfig['bidUnits'][0]>) => void;
  removeBidUnit: (id: string) => void;
  clearBidUnits: () => void;
  randomFill: (count: number, centerPrice: number, fluctuationPercent: number) => void;
  parsePrices: (text: string) => void;

  // Theme
  setTheme: (theme: 'light' | 'dark') => void;

  // API
  setApiKey: (key: string) => void;
  setApiEndpoint: (endpoint: string) => void;

  // Template
  loadTemplate: (templateId: string) => void;

  // Export/Import
  exportConfig: () => string;
  importConfig: (json: string) => void;

  // Calculation
  calculate: () => void;
  reset: () => void;
}

const defaultConfig = createDefaultConfig();

export const useConfigStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      // Default values
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
      theme: 'light',
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
      addValidRule: (rule) => set((state) => ({ validRules: [...state.validRules, rule] })),
      removeValidRule: (id) => set((state) => ({ validRules: state.validRules.filter((r) => r.id !== id) })),
      updateValidRule: (id, updates) =>
        set((state) => ({
          validRules: state.validRules.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        })),

      setDeduction: (deduction) => set({ deduction }),

      addBidUnit: (name, price) =>
        set((state) => ({
          bidUnits: [
            ...state.bidUnits,
            { id: crypto.randomUUID(), name, price, isValid: true },
          ],
        })),

      updateBidUnit: (id, updates) =>
        set((state) => ({
          bidUnits: state.bidUnits.map((u) => (u.id === id ? { ...u, ...updates } : u)),
        })),

      removeBidUnit: (id) =>
        set((state) => ({
          bidUnits: state.bidUnits.filter((u) => u.id !== id),
        })),

      clearBidUnits: () => set({ bidUnits: [] }),

      randomFill: (count, centerPrice, fluctuationPercent) => {
        const units: BidConfig['bidUnits'] = [];
        for (let i = 0; i < count; i++) {
          const fluctuation = (Math.random() - 0.5) * 2 * fluctuationPercent;
          const price = parseFloat((centerPrice * (1 + fluctuation / 100)).toFixed(2));
          units.push({ id: crypto.randomUUID(), name: `单位${String.fromCharCode(65 + i)}`, price, isValid: true });
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
        const units: BidConfig['bidUnits'] = prices.map((price, i) => ({
          id: crypto.randomUUID(),
          name: `单位${String.fromCharCode(65 + i)}`,
          price,
          isValid: true,
        }));
        set({ bidUnits: units });
      },

      setTheme: (theme) => set({ theme }),

      setApiKey: (apiKey) => set({ apiKey }),
      setApiEndpoint: (apiEndpoint) => set({ apiEndpoint }),

      loadTemplate: (templateId) => {
        const { PRESET_TEMPLATES } = require('../utils/templates');
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

      exportConfig: () => {
        const state = get();
        return JSON.stringify(
          {
            algorithm: state.algorithm,
            kEnabled: state.kEnabled,
            kValue: state.kValue,
            trimHighPercent: state.trimHighPercent,
            trimLowPercent: state.trimLowPercent,
            removeHighestN: state.removeHighestN,
            nthLowest: state.nthLowest,
            q1Weight: state.q1Weight,
            k1: state.k1,
            k2: state.k2,
            maxPrice: state.maxPrice,
            customBasePrice: state.customBasePrice,
            validRules: state.validRules,
            deduction: state.deduction,
          },
          null,
          2
        );
      },

      importConfig: (json) => {
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
        const state = get();
        const { calculateResult } = require('../utils/algorithms');
        const result = calculateResult(state as unknown as import('../types').BidConfig);
        set({ calculationResult: result });
      },

      reset: () => {
        const defaults = createDefaultConfig();
        set({
          algorithm: defaults.algorithm,
          kEnabled: defaults.kEnabled,
          kValue: defaults.kValue,
          trimHighPercent: defaults.trimHighPercent,
          trimLowPercent: defaults.trimLowPercent,
          removeHighestN: defaults.removeHighestN,
          nthLowest: defaults.nthLowest,
          q1Weight: defaults.q1Weight,
          k1: defaults.k1,
          k2: defaults.k2,
          maxPrice: defaults.maxPrice,
          customBasePrice: defaults.customBasePrice,
          validRules: defaults.validRules,
          deduction: defaults.deduction,
          bidUnits: [],
          currentStep: 1,
          calculationResult: null,
        });
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        algorithm: state.algorithm,
        kEnabled: state.kEnabled,
        kValue: state.kValue,
        trimHighPercent: state.trimHighPercent,
        trimLowPercent: state.trimLowPercent,
        removeHighestN: state.removeHighestN,
        nthLowest: state.nthLowest,
        q1Weight: state.q1Weight,
        k1: state.k1,
        k2: state.k2,
        maxPrice: state.maxPrice,
        customBasePrice: state.customBasePrice,
        validRules: state.validRules,
        deduction: state.deduction,
        theme: state.theme,
        apiKey: state.apiKey,
        apiEndpoint: state.apiEndpoint,
      }),
    }
  )
);
```

- [ ] **Step 2: Commit**

```bash
git add src/stores/configStore.ts
git commit -m "feat: add Zustand store with localStorage persistence"
```

---

### Task 6: 全局布局和导航

**Files:**
- Create: `src/components/Layout.tsx`
- Create: `src/components/StepIndicator.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `currentStep` from configStore
- Produces: 全局框架，所有页面共用

- [ ] **Step 1: 创建步骤指示器组件**

```typescript
// src/components/StepIndicator.tsx
import React from 'react';

interface Props {
  currentStep: number;
  totalSteps?: number;
}

const steps = ['报价方法', '判定规则', '扣分规则', '投标报价'];

export function StepIndicator({ currentStep, totalSteps = 4 }: Props) {
  return (
    <div className="flex items-center gap-2">
      {steps.slice(0, totalSteps).map((label, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isDone = stepNum < currentStep;

        return (
          <React.Fragment key={stepNum}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-white'
                  : isDone
                  ? 'bg-success text-white'
                  : 'bg-stepInactive text-textSecondary'
              }`}
            >
              {isDone ? '✓' : stepNum}
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`w-6 h-0.5 ${
                  stepNum < currentStep ? 'bg-success' : 'bg-border'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: 创建布局组件**

```typescript
// src/components/Layout.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfigStore } from '../stores/configStore';
import { StepIndicator } from './StepIndicator';
import SettingsPanel from './SettingsPanel';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  const navigate = useNavigate();
  const { currentStep, setCurrentStep, theme, setTheme, algorithm } = useConfigStore();
  const [showSettings, setShowSettings] = useState(false);

  const isResultPage = currentStep === 5;

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-bg dark:bg-darkBg">
        {/* 顶部导航 */}
        <header className="sticky top-0 z-40 bg-bg dark:bg-darkBg border-b border-border/50">
          <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
            {/* 左侧品牌 */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white text-lg font-bold">投</span>
              </div>
              <div>
                <h1 className="text-text font-semibold text-lg leading-tight">投标报价测算</h1>
                <p className="text-textSecondary text-xs">评分辅助工具</p>
              </div>
            </div>

            {/* 右侧操作区 */}
            <div className="flex items-center gap-4">
              {!isResultPage && <StepIndicator currentStep={currentStep} />}

              {isResultPage && (
                <button
                  onClick={() => navigate('/step-4')}
                  className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-text hover:bg-borderLight transition-colors"
                >
                  <span>返回编辑</span>
                </button>
              )}

              {isResultPage && (
                <button
                  onClick={() => {
                    const { exportCSV } = require('../utils/export');
                    exportCSV();
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <span>导出 CSV</span>
                </button>
              )}

              <button
                onClick={() => setShowSettings(true)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                  showSettings
                    ? 'bg-primary text-white'
                    : 'bg-card border border-border text-textSecondary hover:bg-borderLight'
                }`}
                aria-label="设置"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 2l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 2l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* 主内容区 */}
        <main className="max-w-7xl mx-auto px-8 py-8">
          {children}
        </main>

        {/* 设置面板 */}
        {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 更新 App.tsx**

```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useConfigStore } from './stores/configStore';
import Layout from './components/Layout';
import Step1Algorithm from './pages/Step1Algorithm';
import Step2Rules from './pages/Step2Rules';
import Step3Deduction from './pages/Step3Deduction';
import Step4BidInput from './pages/Step4BidInput';
import Step5Results from './pages/Step5Results';

export default function App() {
  const { currentStep } = useConfigStore();

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/step-1" replace />} />
          <Route path="/step-1" element={<Step1Algorithm />} />
          <Route path="/step-2" element={<Step2Rules />} />
          <Route path="/step-3" element={<Step3Deduction />} />
          <Route path="/step-4" element={<Step4BidInput />} />
          <Route path="/step-5" element={<Step5Results />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Layout.tsx src/components/StepIndicator.tsx src/App.tsx
git commit -m "feat: add global layout with step indicator and settings panel"
```

---

### Task 7: Step 1 报价方法页面

**Files:**
- Create: `src/components/AlgorithmCard.tsx`
- Create: `src/components/AlgorithmGrid.tsx`
- Create: `src/components/TemplateSelector.tsx`
- Create: `src/pages/Step1Algorithm.tsx`

**Interfaces:**
- Consumes: `algorithm`, `kEnabled`, `kValue` etc. from configStore
- Produces: 算法选择 UI，下一步导航到 /step-2

- [ ] **Step 1: 算法选项定义**

```typescript
// src/pages/step1Data.ts
import { Algorithm } from '../types';

export const ALGORITHM_OPTIONS: Array<{
  id: Algorithm;
  name: string;
  description: string;
}> = [
  { id: 'arithmetic_mean', name: '算术平均法', description: '所有有效报价算术平均' },
  { id: 'trimmed_mean', name: '去极值平均法', description: '去掉最高/最低N%后取均值' },
  { id: 'remove_highest', name: '去最高平均法', description: '去掉最高报价后取均值' },
  { id: 'second_lowest', name: '次低报价法', description: '取次低报价作为基准价A' },
  { id: 'double_average', name: '二次平均法', description: '先算全均→再算≤均值的二次均值' },
  { id: 'weighted_limit', name: '随机权重法', description: 'A×K1×Q1+B×K2×Q2，含最高限价' },
  { id: 'lowest_price', name: '最低价法', description: '以最低有效报价为基准价' },
  { id: 'custom', name: '手动指定', description: '直接输入基准价' },
  { id: 'ai_parse', name: '🤖 AI智能解析', description: '粘贴评分规则原文，AI自动分析' },
];
```

- [ ] **Step 2: AlgorithmCard 组件**

```typescript
// src/components/AlgorithmCard.tsx
import React from 'react';

interface Props {
  id: string;
  name: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

export default function AlgorithmCard({ id, name, description, selected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`relative w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${
        selected
          ? 'bg-white border-primary shadow-sm'
          : 'bg-card border-transparent hover:border-border hover:bg-white'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center ${
            selected ? 'bg-rose-50' : 'bg-card'
          }`}
        >
          <span className={`text-xl ${selected ? 'text-primary' : 'text-textSecondary'}`}>
            {id === 'ai_parse' ? '🤖' : '📊'}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-text text-sm">{name}</div>
          <div className="text-textSecondary text-xs mt-0.5">{description}</div>
        </div>
        {selected && (
          <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}
      </div>
    </button>
  );
}
```

- [ ] **Step 3: AlgorithmGrid 组件**

```typescript
// src/components/AlgorithmGrid.tsx
import React from 'react';
import AlgorithmCard from './AlgorithmCard';
import { ALGORITHM_OPTIONS } from '../pages/step1Data';

interface Props {
  selected: string;
  onSelect: (id: string) => void;
}

export default function AlgorithmGrid({ selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {ALGORITHM_OPTIONS.map((algo) => (
        <AlgorithmCard
          key={algo.id}
          id={algo.id}
          name={algo.name}
          description={algo.description}
          selected={selected === algo.id}
          onClick={() => onSelect(algo.id)}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 4: 参数配置区组件**

```typescript
// src/components/AlgorithmParams.tsx
import React from 'react';
import { useConfigStore } from '../stores/configStore';
import { Algorithm } from '../types';

interface Props {
  algorithm: Algorithm;
}

export default function AlgorithmParams({ algorithm }: Props) {
  const {
    kEnabled, setKEnabled, kValue, setKValue,
    trimHighPercent, setTrimHighPercent, trimLowPercent, setTrimLowPercent,
    removeHighestN, setRemoveHighestN,
    nthLowest, setNthLowest,
    q1Weight, setQ1Weight, k1, setK1, k2, setK2, maxPrice, setMaxPrice,
    customBasePrice, setCustomBasePrice,
  } = useConfigStore();

  if (algorithm === 'ai_parse') {
    return (
      <div className="mt-8">
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-5 bg-border rounded-full" />
            <h3 className="font-semibold text-text">AI 智能解析</h3>
          </div>
          <p className="text-textSecondary text-sm mb-4">
            粘贴招标文件「评分办法」原文，AI 自动分析配置
          </p>
          <textarea
            className="w-full h-40 bg-white border border-border rounded-lg p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            placeholder="请粘贴评分规则原文..."
          />
          <div className="mt-4 flex items-center gap-3">
            <button className="btn-primary">
              <span>🤖</span>
              <span>开始解析</span>
            </button>
            <span className="text-textSecondary text-xs">需要配置 API Key</span>
          </div>
        </div>
      </div>
    );
  }

  if (algorithm === 'lowest_price') return null;

  return (
    <div className="mt-8">
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-1 h-5 bg-border rounded-full" />
          <h3 className="font-semibold text-text">参数配置</h3>
        </div>

        {/* K 值开关 + 输入 */}
        {(algorithm === 'arithmetic_mean' || algorithm === 'trimmed_mean' ||
          algorithm === 'remove_highest' || algorithm === 'second_lowest' ||
          algorithm === 'double_average') && (
          <div className="flex items-center gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={kEnabled}
                onChange={(e) => setKEnabled(e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="text-text text-sm">启用 K 值</span>
            </label>
            {kEnabled && (
              <div className="flex items-center gap-2">
                <span className="text-textSecondary text-sm">K =</span>
                <input
                  type="number"
                  value={kValue}
                  onChange={(e) => setKValue(parseFloat(e.target.value) || 0)}
                  step="0.01"
                  className="input-field w-20 text-center"
                />
              </div>
            )}
          </div>
        )}

        {/* 去极值参数 */}
        {algorithm === 'trimmed_mean' && (
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2">
              <span className="text-textSecondary text-sm">去掉最高</span>
              <input
                type="number"
                value={trimHighPercent}
                onChange={(e) => setTrimHighPercent(parseFloat(e.target.value) || 0)}
                className="input-field w-20 text-center"
              />
              <span className="text-textSecondary text-sm">%</span>
            </div>
            <div className="w-px h-7 bg-border" />
            <div className="flex items-center gap-2">
              <span className="text-textSecondary text-sm">去掉最低</span>
              <input
                type="number"
                value={trimLowPercent}
                onChange={(e) => setTrimLowPercent(parseFloat(e.target.value) || 0)}
                className="input-field w-20 text-center"
              />
              <span className="text-textSecondary text-sm">%</span>
            </div>
          </div>
        )}

        {/* 去最高家数 */}
        {algorithm === 'remove_highest' && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
            <span className="text-textSecondary text-sm">去掉最高</span>
            <input
              type="number"
              value={removeHighestN}
              onChange={(e) => setRemoveHighestN(parseInt(e.target.value) || 0)}
              className="input-field w-20 text-center"
            />
            <span className="text-textSecondary text-sm">家</span>
          </div>
        )}

        {/* 次低参数 */}
        {algorithm === 'second_lowest' && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
            <span className="text-textSecondary text-sm">取第</span>
            <input
              type="number"
              value={nthLowest}
              onChange={(e) => setNthLowest(parseInt(e.target.value) || 0)}
              className="input-field w-20 text-center"
            />
            <span className="text-textSecondary text-sm">低报价</span>
          </div>
        )}

        {/* 随机权重参数 */}
        {algorithm === 'weighted_limit' && (
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border/50">
            <div className="flex items-center gap-2">
              <span className="text-textSecondary text-sm">Q1 权重</span>
              <input
                type="number"
                value={q1Weight}
                onChange={(e) => setQ1Weight(parseFloat(e.target.value) || 0)}
                className="input-field w-20 text-center"
              />
              <span className="text-textSecondary text-sm">%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-textSecondary text-sm">K1</span>
              <input
                type="number"
                value={k1}
                onChange={(e) => setK1(parseFloat(e.target.value) || 0)}
                step="0.01"
                className="input-field w-20 text-center"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-textSecondary text-sm">K2</span>
              <input
                type="number"
                value={k2}
                onChange={(e) => setK2(parseFloat(e.target.value) || 0)}
                step="0.01"
                className="input-field w-20 text-center"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-textSecondary text-sm">最高限价 B</span>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseFloat(e.target.value) || 0)}
                className="input-field w-20 text-center"
              />
            </div>
          </div>
        )}

        {/* 手动指定 */}
        {algorithm === 'custom' && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
            <span className="text-textSecondary text-sm">基准价</span>
            <input
              type="number"
              value={customBasePrice}
              onChange={(e) => setCustomBasePrice(parseFloat(e.target.value) || 0)}
              className="input-field w-32 text-center"
            />
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: 模板下拉组件**

```typescript
// src/components/TemplateSelector.tsx
import React from 'react';
import { useConfigStore } from '../stores/configStore';
import { PRESET_TEMPLATES } from '../utils/templates';

export default function TemplateSelector() {
  const { loadTemplate } = useConfigStore();

  return (
    <div className="flex items-center gap-3">
      <span className="text-textSecondary text-sm">快速模板</span>
      <select
        onChange={(e) => {
          if (e.target.value) loadTemplate(e.target.value);
        }}
        className="input-field min-w-[280px]"
        defaultValue=""
      >
        <option value="" disabled>选择预设模板...</option>
        {PRESET_TEMPLATES.map((t) => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>
    </div>
  );
}
```

- [ ] **Step 6: Step1Algorithm 页面**

```typescript
// src/pages/Step1Algorithm.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfigStore } from '../stores/configStore';
import AlgorithmGrid from '../components/AlgorithmGrid';
import AlgorithmParams from '../components/AlgorithmParams';
import TemplateSelector from '../components/TemplateSelector';

export default function Step1Algorithm() {
  const navigate = useNavigate();
  const { algorithm, setAlgorithm, currentStep, setCurrentStep } = useConfigStore();

  const handleNext = () => {
    setCurrentStep(2);
    navigate('/step-2');
  };

  return (
    <div className="space-y-6">
      {/* 标题区 */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-text">选择报价计算方法</h2>
        <p className="text-textSecondary">根据招标文件中的评分办法，选择合适的基准价计算算法</p>
      </div>

      {/* 算法宫格 */}
      <AlgorithmGrid selected={algorithm} onSelect={(id) => setAlgorithm(id as any)} />

      {/* 参数配置 */}
      <AlgorithmParams algorithm={algorithm} />

      {/* 底部操作 */}
      <div className="flex items-center justify-between pt-4">
        <TemplateSelector />
        <button onClick={handleNext} className="btn-primary">
          <span>下一步</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Commit**

```bash
git add src/components/AlgorithmCard.tsx src/components/AlgorithmGrid.tsx src/components/AlgorithmParams.tsx src/components/TemplateSelector.tsx src/pages/step1Data.ts src/pages/Step1Algorithm.tsx
git commit -m "feat: implement step 1 algorithm selection page"
```

---

### Task 8: Step 2 判定规则页面

**Files:**
- Create: `src/pages/Step2Rules.tsx`
- Create: `src/components/RuleManager.tsx`

**Interfaces:**
- Consumes: `validRules`, setters from configStore
- Produces: 规则管理 UI，下一步导航到 /step-3

- [ ] **Step 1: RuleManager 组件**

```typescript
// src/components/RuleManager.tsx
import React from 'react';
import { useConfigStore } from '../stores/configStore';
import { ValidRule, TrimAction } from '../types';

const ACTION_LABELS: Record<TrimAction, string> = {
  trim_percent: '去极值',
  remove_highest_n: '去最高 N 家',
  remove_lowest_n: '去最低 N 家',
  nth_lowest: '第 N 低',
  direct: '全部参与',
};

export default function RuleManager() {
  const { validRules, addValidRule, removeValidRule, updateValidRule } = useConfigStore();

  const addNewRule = (action: TrimAction) => {
    const newRule: ValidRule = {
      id: crypto.randomUUID(),
      minCount: 1,
      maxCount: -1,
      action,
      params: action === 'trim_percent' ? { trimPercent: 20 } :
              action === 'remove_highest_n' ? { removeN: 1 } :
              action === 'nth_lowest' ? { nth: 2 } : {},
    };
    addValidRule(newRule);
  };

  return (
    <div className="space-y-6">
      {/* 规则类型标签 */}
      <div className="flex flex-wrap gap-3">
        {(Object.keys(ACTION_LABELS) as TrimAction[]).map((action) => (
          <button
            key={action}
            onClick={() => addNewRule(action)}
            className="px-4 py-2 bg-card border border-border rounded-xl text-textSecondary text-sm hover:bg-white hover:border-primary hover:text-primary transition-all"
          >
            + {ACTION_LABELS[action]}
          </button>
        ))}
      </div>

      {/* 规则列表 */}
      <div className="bg-card rounded-xl p-6 border border-border space-y-4">
        {validRules.length === 0 ? (
          <p className="text-textSecondary text-center py-8">暂无规则，点击上方按钮添加</p>
        ) : (
          validRules.map((rule) => (
            <RuleRow key={rule.id} rule={rule} onUpdate={(updates) => updateValidRule(rule.id, updates)} onRemove={() => removeValidRule(rule.id)} />
          ))
        )}
      </div>
    </div>
  );
}

function RuleRow({ rule, onUpdate, onRemove }: {
  rule: ValidRule;
  onUpdate: (updates: Partial<ValidRule>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-border/50">
      <div className="flex items-center gap-2 flex-1">
        <span className="text-textSecondary text-sm">当投标家数</span>
        <input
          type="number"
          value={rule.minCount}
          onChange={(e) => onUpdate({ minCount: parseInt(e.target.value) || 0 })}
          className="input-field w-16 text-center"
        />
        <span className="text-textSecondary text-sm">~</span>
        <input
          type="number"
          value={rule.maxCount === -1 ? '' : rule.maxCount}
          onChange={(e) => onUpdate({ maxCount: e.target.value ? parseInt(e.target.value) : -1 })}
          className="input-field w-16 text-center"
          placeholder="∞"
        />
        <span className="text-textSecondary text-sm">家时</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-textSecondary text-sm">执行</span>
        <select
          value={rule.action}
          onChange={(e) => onUpdate({ action: e.target.value as TrimAction })}
          className="input-field"
        >
          {Object.entries(ACTION_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {/* 动作参数 */}
      {rule.action === 'trim_percent' && (
        <div className="flex items-center gap-2">
          <span className="text-textSecondary text-sm">各去</span>
          <input
            type="number"
            value={rule.params.trimPercent ?? 20}
            onChange={(e) => onUpdate({ params: { ...rule.params, trimPercent: parseInt(e.target.value) || 0 } })}
            className="input-field w-16 text-center"
          />
          <span className="text-textSecondary text-sm">%</span>
        </div>
      )}

      {rule.action === 'remove_highest_n' && (
        <div className="flex items-center gap-2">
          <span className="text-textSecondary text-sm">去掉最高</span>
          <input
            type="number"
            value={rule.params.removeN ?? 1}
            onChange={(e) => onUpdate({ params: { ...rule.params, removeN: parseInt(e.target.value) || 0 } })}
            className="input-field w-16 text-center"
          />
          <span className="text-textSecondary text-sm">家</span>
        </div>
      )}

      {rule.action === 'nth_lowest' && (
        <div className="flex items-center gap-2">
          <span className="text-textSecondary text-sm">取第</span>
          <input
            type="number"
            value={rule.params.nth ?? 2}
            onChange={(e) => onUpdate({ params: { ...rule.params, nth: parseInt(e.target.value) || 0 } })}
            className="input-field w-16 text-center"
          />
          <span className="text-textSecondary text-sm">低</span>
        </div>
      )}

      <button
        onClick={onRemove}
        className="ml-2 text-textSecondary hover:text-primary transition-colors"
        aria-label="删除规则"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Step2Rules 页面**

```typescript
// src/pages/Step2Rules.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfigStore } from '../stores/configStore';
import RuleManager from '../components/RuleManager';

export default function Step2Rules() {
  const navigate = useNavigate();
  const { currentStep, setCurrentStep } = useConfigStore();

  const handlePrev = () => { setCurrentStep(1); navigate('/step-1'); };
  const handleNext = () => { setCurrentStep(3); navigate('/step-3'); };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-text">设置有效投标判定规则</h2>
        <p className="text-textSecondary">根据招标文件，配置有效投标的判定条件和计算方式</p>
      </div>

      <RuleManager />

      <div className="flex items-center justify-between pt-4">
        <button onClick={handlePrev} className="btn-secondary">上一步</button>
        <button onClick={handleNext} className="btn-primary">下一步</button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/RuleManager.tsx src/pages/Step2Rules.tsx
git commit -m "feat: implement step 2 valid rule management page"
```

---

### Task 9: Step 3 扣分规则页面

**Files:**
- Create: `src/pages/Step3Deduction.tsx`
- Create: `src/components/DeductionForm.tsx`

**Interfaces:**
- Consumes: `deduction`, setter from configStore
- Produces: 扣分参数表单，下一步导航到 /step-4

- [ ] **Step 1: DeductionForm 组件**

```typescript
// src/components/DeductionForm.tsx
import React from 'react';
import { useConfigStore } from '../stores/configStore';

export default function DeductionForm() {
  const { deduction, setDeduction } = useConfigStore();

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-1 h-5 bg-border rounded-full" />
        <h3 className="font-semibold text-text">扣分参数</h3>
      </div>

      <div className="space-y-4">
        {/* 第1行 */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-textSecondary text-sm w-24">报价满分</span>
            <input
              type="number"
              value={deduction.fullScore}
              onChange={(e) => setDeduction({ ...deduction, fullScore: parseFloat(e.target.value) || 0 })}
              className="input-field w-20 text-center"
            />
            <span className="text-textSecondary text-sm">分</span>
          </div>
          <div className="w-px h-7 bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-textSecondary text-sm w-24">每高 1% 扣</span>
            <input
              type="number"
              value={deduction.deductPerHighPercent}
              onChange={(e) => setDeduction({ ...deduction, deductPerHighPercent: parseFloat(e.target.value) || 0 })}
              step="0.1"
              className="input-field w-20 text-center"
            />
            <span className="text-textSecondary text-sm">分</span>
          </div>
        </div>

        {/* 第2行 */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-textSecondary text-sm w-24">每低 1% 扣</span>
            <input
              type="number"
              value={deduction.deductPerLowPercent}
              onChange={(e) => setDeduction({ ...deduction, deductPerLowPercent: parseFloat(e.target.value) || 0 })}
              step="0.1"
              className="input-field w-20 text-center"
            />
            <span className="text-textSecondary text-sm">分</span>
          </div>
          <div className="w-px h-7 bg-border" />
          <div className="flex items-center gap-2">
            <span className="text-textSecondary text-sm w-24">最低得分</span>
            <input
              type="number"
              value={deduction.minScore}
              onChange={(e) => setDeduction({ ...deduction, minScore: parseFloat(e.target.value) || 0 })}
              className="input-field w-20 text-center"
            />
            <span className="text-textSecondary text-sm">分</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Step3Deduction 页面**

```typescript
// src/pages/Step3Deduction.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfigStore } from '../stores/configStore';
import DeductionForm from '../components/DeductionForm';

export default function Step3Deduction() {
  const navigate = useNavigate();
  const { currentStep, setCurrentStep } = useConfigStore();
  const [ruleText, setRuleText] = useState('');
  const [expanded, setExpanded] = useState(false);

  const handlePrev = () => { setCurrentStep(2); navigate('/step-2'); };
  const handleNext = () => { setCurrentStep(4); navigate('/step-4'); };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-text">设置扣分规则</h2>
        <p className="text-textSecondary">配置报价得分的扣分标准和满分基准</p>
      </div>

      <DeductionForm />

      {/* 招标文件规则原文对照 */}
      <div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-textSecondary hover:text-text transition-colors"
        >
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className={`transition-transform ${expanded ? 'rotate-180' : ''}`}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
          <span>招标文件规则原文对照</span>
        </button>
        {expanded && (
          <textarea
            value={ruleText}
            onChange={(e) => setRuleText(e.target.value)}
            className="w-full h-48 mt-3 bg-card border border-border rounded-xl p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            placeholder="粘贴招标文件「评分办法」原文，方便人工对照核验..."
          />
        )}
      </div>

      <div className="flex items-center justify-between pt-4">
        <button onClick={handlePrev} className="btn-secondary">上一步</button>
        <button onClick={handleNext} className="btn-primary">下一步</button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/DeductionForm.tsx src/pages/Step3Deduction.tsx
git commit -m "feat: implement step 3 deduction rules page"
```

---

### Task 10: Step 4 投标报价录入

**Files:**
- Create: `src/pages/Step4BidInput.tsx`
- Create: `src/components/BidInput.tsx`

**Interfaces:**
- Consumes: `bidUnits`, CRUD operations from configStore
- Produces: 投标报价录入 UI，下一步导航到 /step-5

- [ ] **Step 1: BidInput 组件**

```typescript
// src/components/BidInput.tsx
import React, { useState } from 'react';
import { useConfigStore } from '../stores/configStore';
import { BidUnit } from '../types';

export default function BidInput() {
  const { bidUnits, addBidUnit, updateBidUnit, removeBidUnit, clearBidUnits, randomFill, parsePrices } = useConfigStore();
  const [showRandomModal, setShowRandomModal] = useState(false);
  const [showParseModal, setShowParseModal] = useState(false);
  const [randomCount, setRandomCount] = useState(5);
  const [randomCenter, setRandomCenter] = useState(100);
  const [randomFluctuation, setRandomFluctuation] = useState(10);
  const [parseText, setParseText] = useState('');

  const handleAdd = () => addBidUnit('', 0);

  const handleChange = (id: string, field: keyof BidUnit, value: string | number | boolean) => {
    updateBidUnit(id, { [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* 单位列表 */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-border rounded-full" />
            <h3 className="font-semibold text-text">投标单位列表</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRandomModal(true)}
              className="px-3 py-1.5 text-sm bg-white border border-border rounded-lg text-textSecondary hover:text-primary hover:border-primary transition-colors"
            >
              🎲 随机填充
            </button>
            <button
              onClick={() => setShowParseModal(true)}
              className="px-3 py-1.5 text-sm bg-white border border-border rounded-lg text-textSecondary hover:text-primary hover:border-primary transition-colors"
            >
              📋 报价解析
            </button>
            <button
              onClick={clearBidUnits}
              className="px-3 py-1.5 text-sm bg-white border border-border rounded-lg text-textSecondary hover:text-red-500 hover:border-red-300 transition-colors"
            >
              🗑 清空
            </button>
          </div>
        </div>

        {bidUnits.length === 0 ? (
          <p className="text-textSecondary text-center py-8">暂无投标单位，点击下方按钮添加</p>
        ) : (
          <div className="space-y-3">
            {bidUnits.map((unit) => (
              <div key={unit.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-border/50">
                <input
                  type="text"
                  value={unit.name}
                  onChange={(e) => handleChange(unit.id, 'name', e.target.value)}
                  placeholder="单位名称"
                  className="input-field flex-1"
                />
                <input
                  type="number"
                  value={unit.price}
                  onChange={(e) => handleChange(unit.id, 'price', parseFloat(e.target.value) || 0)}
                  placeholder="报价金额"
                  className="input-field w-32 text-center"
                />
                <button
                  onClick={() => removeBidUnit(unit.id)}
                  className="p-2 text-textSecondary hover:text-red-500 transition-colors"
                  aria-label="删除"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleAdd}
          className="mt-4 w-full py-3 border-2 border-dashed border-border rounded-xl text-textSecondary hover:text-primary hover:border-primary transition-colors flex items-center justify-center gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          添加投标单位
        </button>
      </div>

      {/* 随机填充弹窗 */}
      {showRandomModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowRandomModal(false)}>
          <div className="bg-white rounded-xl p-6 w-96" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-text mb-4">随机填充</h3>
            <div className="space-y-3">
              <div>
                <label className="text-textSecondary text-sm">投标家数</label>
                <input
                  type="number"
                  value={randomCount}
                  onChange={(e) => setRandomCount(parseInt(e.target.value) || 0)}
                  className="input-field w-full mt-1"
                />
              </div>
              <div>
                <label className="text-textSecondary text-sm">基准价中值</label>
                <input
                  type="number"
                  value={randomCenter}
                  onChange={(e) => setRandomCenter(parseFloat(e.target.value) || 0)}
                  className="input-field w-full mt-1"
                />
              </div>
              <div>
                <label className="text-textSecondary text-sm">波动 ±%</label>
                <input
                  type="number"
                  value={randomFluctuation}
                  onChange={(e) => setRandomFluctuation(parseFloat(e.target.value) || 0)}
                  className="input-field w-full mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowRandomModal(false)} className="btn-secondary">取消</button>
              <button
                onClick={() => { randomFill(randomCount, randomCenter, randomFluctuation); setShowRandomModal(false); }}
                className="btn-primary"
              >
                生成
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 报价解析弹窗 */}
      {showParseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowParseModal(false)}>
          <div className="bg-white rounded-xl p-6 w-[500px]" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-text mb-4">报价解析</h3>
            <textarea
              value={parseText}
              onChange={(e) => setParseText(e.target.value)}
              className="input-field w-full h-32 resize-none"
              placeholder="输入报价，支持逗号、全角逗号分隔，如：100,110,120 或 100，110，120"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowParseModal(false)} className="btn-secondary">取消</button>
              <button
                onClick={() => { parsePrices(parseText); setShowParseModal(false); }}
                className="btn-primary"
              >
                解析填入
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Step4BidInput 页面**

```typescript
// src/pages/Step4BidInput.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfigStore } from '../stores/configStore';
import BidInput from '../components/BidInput';

export default function Step4BidInput() {
  const navigate = useNavigate();
  const { currentStep, setCurrentStep, calculate } = useConfigStore();

  const handlePrev = () => { setCurrentStep(3); navigate('/step-3'); };
  const handleNext = () => {
    setCurrentStep(5);
    calculate();
    navigate('/step-5');
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-text">录入投标报价</h2>
        <p className="text-textSecondary">添加投标单位名称和报价金额，支持批量解析</p>
      </div>

      <BidInput />

      <div className="flex items-center justify-between pt-4">
        <button onClick={handlePrev} className="btn-secondary">上一步</button>
        <button onClick={handleNext} className="btn-primary">
          <span>测算结果</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/BidInput.tsx src/pages/Step4BidInput.tsx
git commit -m "feat: implement step 4 bid input page"
```

---

### Task 11: Step 5 测算结果页面

**Files:**
- Create: `src/pages/Step5Results.tsx`
- Create: `src/components/SummaryCards.tsx`
- Create: `src/components/RankingTable.tsx`
- Create: `src/utils/export.ts`

**Interfaces:**
- Consumes: `calculationResult` from configStore
- Produces: 结果展示 UI

- [ ] **Step 1: SummaryCards 组件**

```typescript
// src/components/SummaryCards.tsx
import React from 'react';
import { CalcResult } from '../types';

interface Props {
  result: CalcResult;
}

const cards = [
  { label: '基准价', key: 'basePrice' as const, color: 'text-primary', icon: '📍' },
  { label: 'A 值', key: 'aValue' as const, color: 'text-success', icon: '📐' },
  { label: '有效家数', key: 'effectiveCount' as const, color: 'text-yellow-600', icon: '👥' },
  { label: '算法', key: 'algorithmName' as const, color: 'text-blue-600', icon: '📊' },
];

export default function SummaryCards({ result }: Props) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.key} className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
          <div className={`w-12 h-12 rounded-lg bg-white flex items-center justify-center text-2xl`}>
            {card.icon}
          </div>
          <div>
            <div className="text-textSecondary text-sm">{card.label}</div>
            <div className={`font-bold text-lg ${card.color}`}>
              {card.key === 'algorithmName' ? result[card.key] : result[card.key]?.toLocaleString('zh-CN', { maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: RankingTable 组件**

```typescript
// src/components/RankingTable.tsx
import React from 'react';
import { CalcResult } from '../types';

interface Props {
  result: CalcResult;
}

function getRankBadgeClass(rank: number): string {
  switch (rank) {
    case 1: return 'bg-orange-100 text-orange-700 border-orange-300';
    case 2: return 'bg-blue-100 text-blue-700 border-blue-300';
    case 3: return 'bg-green-100 text-green-700 border-green-300';
    default: return 'bg-gray-100 text-gray-600 border-gray-300';
  }
}

function getScoreColor(score: number, fullScore: number): string {
  const ratio = score / fullScore;
  if (ratio >= 0.95) return 'text-green-600';
  if (ratio >= 0.85) return 'text-orange-500';
  return 'text-red-500';
}

export default function RankingTable({ result }: Props) {
  const fullScore = 60; // 从配置中获取更准确

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-6 pb-4">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 bg-border rounded-full" />
          <h3 className="font-semibold text-text">排名结果</h3>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-t border-b border-border bg-white/50">
              <th className="px-6 py-3 text-left text-textSecondary font-medium">排名</th>
              <th className="px-6 py-3 text-left text-textSecondary font-medium">单位名称</th>
              <th className="px-6 py-3 text-right text-textSecondary font-medium">报价</th>
              <th className="px-6 py-3 text-right text-textSecondary font-medium">偏差率</th>
              <th className="px-6 py-3 text-right text-textSecondary font-medium">得分</th>
              <th className="px-6 py-3 text-right text-textSecondary font-medium">与基准价差</th>
            </tr>
          </thead>
          <tbody>
            {result.rankings.map((item) => (
              <tr key={item.unit.id} className="border-b border-border/50 hover:bg-white/30 transition-colors">
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full border text-sm font-semibold ${getRankBadgeClass(item.rank)}`}>
                    {item.rank}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-text">{item.unit.name || '未命名'}</td>
                <td className="px-6 py-4 text-right font-mono">{item.unit.price.toLocaleString()}</td>
                <td className="px-6 py-4 text-right font-mono">{item.deviationPercent > 0 ? '+' : ''}{item.deviationPercent}%</td>
                <td className={`px-6 py-4 text-right font-semibold ${getScoreColor(item.score, fullScore)}`}>
                  {item.score}
                </td>
                <td className={`px-6 py-4 text-right font-mono ${item.priceDiff > 0 ? 'text-red-500' : item.priceDiff < 0 ? 'text-green-600' : 'text-textSecondary'}`}>
                  {item.priceDiff > 0 ? '+' : ''}{item.priceDiff.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: export.ts 工具**

```typescript
// src/utils/export.ts
import { CalcResult } from '../types';

export function exportCSV(result: CalcResult): void {
  const BOM = '\uFEFF';
  const headers = ['排名', '单位名称', '报价', '是否有效', '偏差率(%)', '得分', '与基准价差'];
  const rows = result.rankings.map((r) => [
    r.rank,
    r.unit.name,
    r.unit.price,
    r.unit.isValid ? '有效' : '无效',
    r.deviationPercent,
    r.score,
    r.priceDiff,
  ]);

  const csv = BOM + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `投标报价结果_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
```

- [ ] **Step 4: Step5Results 页面**

```typescript
// src/pages/Step5Results.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useConfigStore } from '../stores/configStore';
import SummaryCards from '../components/SummaryCards';
import RankingTable from '../components/RankingTable';
import { exportCSV } from '../utils/export';

export default function Step5Results() {
  const navigate = useNavigate();
  const { calculationResult, currentStep, setCurrentStep } = useConfigStore();

  if (!calculationResult) {
    return (
      <div className="text-center py-20">
        <p className="text-textSecondary text-lg">暂无测算结果，请先完成前面的步骤</p>
        <button onClick={() => { setCurrentStep(1); navigate('/step-1'); }} className="btn-primary mt-6">
          返回开始
        </button>
      </div>
    );
  }

  const handleExport = () => exportCSV(calculationResult);
  const handlePrev = () => { setCurrentStep(4); navigate('/step-4'); };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-text">测算结果</h2>
        <p className="text-textSecondary">基准价计算完成，以下为各投标单位排名和得分</p>
      </div>

      <SummaryCards result={calculationResult} />
      <RankingTable result={calculationResult} />

      <div className="flex items-center justify-between pt-4">
        <button onClick={handlePrev} className="btn-secondary">上一步</button>
        <div className="flex items-center gap-3">
          <button onClick={handleExport} className="btn-secondary">
            <span>📥</span>
            <span>导出 CSV</span>
          </button>
          <button onClick={() => { setCurrentStep(1); navigate('/step-1'); }} className="btn-secondary">
            重新测算
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/SummaryCards.tsx src/components/RankingTable.tsx src/utils/export.ts src/pages/Step5Results.tsx
git commit -m "feat: implement step 5 results page with summary cards and ranking table"
```

---

### Task 12: 设置面板

**Files:**
- Create: `src/components/SettingsPanel.tsx`
- Create: `src/components/ThemeSelector.tsx`

**Interfaces:**
- Consumes: `theme`, `apiKey`, `apiEndpoint`, `exportConfig`, `importConfig` from configStore
- Produces: 全屏设置浮层

- [ ] **Step 1: ThemeSelector 组件**

```typescript
// src/components/ThemeSelector.tsx
import React from 'react';
import { useConfigStore } from '../stores/configStore';

export default function ThemeSelector() {
  const { theme, setTheme } = useConfigStore();

  return (
    <div className="space-y-4">
      <div
        className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
          theme === 'light' ? 'border-primary bg-white' : 'border-border bg-card'
        }`}
        onClick={() => setTheme('light')}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white border border-border flex items-center justify-center text-xl">☀️</div>
          <div>
            <div className="font-semibold text-text">浅色主题</div>
            <div className="text-textSecondary text-sm">暖米色背景，护眼舒适</div>
          </div>
          {theme === 'light' && (
            <div className="ml-auto w-5 h-5 rounded-full bg-primary flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          )}
        </div>
      </div>

      <div
        className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
          theme === 'dark' ? 'border-primary bg-gray-900' : 'border-border bg-card'
        }`}
        onClick={() => setTheme('dark')}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-600 flex items-center justify-center text-xl">🌙</div>
          <div>
            <div className="font-semibold dark:text-white">深色主题</div>
            <div className="text-textSecondary text-sm">暗色配色，夜间使用</div>
          </div>
          {theme === 'dark' && (
            <div className="ml-auto w-5 h-5 rounded-full bg-primary flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: SettingsPanel 组件**

```typescript
// src/components/SettingsPanel.tsx
import React, { useState } from 'react';
import { useConfigStore } from '../stores/configStore';
import ThemeSelector from './ThemeSelector';

interface Props {
  onClose: () => void;
}

type Tab = 'theme' | 'export' | 'api';

export default function SettingsPanel({ onClose }: Props) {
  const { theme, apiKey, apiEndpoint, setApiKey, setApiEndpoint, exportConfig, importConfig } = useConfigStore();
  const [activeTab, setActiveTab] = useState<Tab>('theme');
  const [importText, setImportText] = useState('');

  const tabs: Array<{ id: Tab; label: string; icon: string }> = [
    { id: 'theme', label: '主题管理', icon: '🎨' },
    { id: 'export', label: '导出管理', icon: '📦' },
    { id: 'api', label: 'API 管理', icon: '🔑' },
  ];

  const handleExport = () => {
    const blob = new Blob([exportConfig()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `投标报价配置_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      if (text) importConfig(text);
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      {/* 遮罩 */}
      <div className="absolute inset-0 bg-black/50" />

      {/* 面板 */}
      <div className="relative ml-auto w-full max-w-4xl bg-bg flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* 标题栏 */}
        <div className="flex items-center justify-between px-8 py-5 bg-card border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </div>
            <span className="font-semibold text-text text-lg">设置</span>
          </div>
          <button onClick={onClose} className="text-textSecondary hover:text-text transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* 左侧标签栏 */}
          <div className="w-64 bg-card border-r border-border p-4 flex flex-col">
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-textSecondary hover:bg-white hover:text-text'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                  {activeTab === tab.id && (
                    <div className="ml-auto w-2.5 h-2.5 rounded-full bg-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 右侧内容区 */}
          <div className="flex-1 bg-[#EAE5D9] dark:bg-gray-900 p-8 overflow-y-auto">
            <div className="max-w-2xl">
              {activeTab === 'theme' && (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white">🎨</div>
                    <div>
                      <h2 className="font-semibold text-text text-lg">主题管理</h2>
                      <p className="text-textSecondary text-sm">选择界面显示主题</p>
                    </div>
                  </div>
                  <ThemeSelector />
                </>
              )}

              {activeTab === 'export' && (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white">📦</div>
                    <div>
                      <h2 className="font-semibold text-text text-lg">导出管理</h2>
                      <p className="text-textSecondary text-sm">导入导出配置文件</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <button onClick={handleExport} className="btn-primary w-full justify-center">
                      <span>📥</span>
                      <span>导出配置（JSON）</span>
                    </button>
                    <div className="bg-white rounded-xl p-4 border border-border">
                      <label className="block text-textSecondary text-sm mb-2">导入配置</label>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImport}
                        className="block w-full text-sm text-textSecondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primaryHover cursor-pointer"
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (confirm('确定要清空所有数据吗？此操作不可恢复。')) {
                          localStorage.removeItem('bidQuotationConfig');
                          window.location.reload();
                        }
                      }}
                      className="w-full py-3 rounded-xl border-2 border-red-300 text-red-500 hover:bg-red-50 transition-colors font-medium"
                    >
                      清空所有数据
                    </button>
                  </div>
                </>
              )}

              {activeTab === 'api' && (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white">🔑</div>
                    <div>
                      <h2 className="font-semibold text-text text-lg">API 管理</h2>
                      <p className="text-textSecondary text-sm">配置 AI 解析所需的 API Key</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-textSecondary text-sm mb-2">API 端点</label>
                      <select
                        value={apiEndpoint}
                        onChange={(e) => setApiEndpoint(e.target.value)}
                        className="input-field w-full"
                      >
                        <option value="https://api.deepseek.com/v1">DeepSeek (api.deepseek.com)</option>
                        <option value="https://api.ccswitch.com/v1">CCswitch (api.ccswitch.com)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-textSecondary text-sm mb-2">API Key</label>
                      <input
                        type="password"
                        value={apiKey || ''}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="input-field w-full"
                        placeholder="sk-..."
                      />
                      <p className="text-textSecondary text-xs mt-2">
                        API Key 仅保存在浏览器 localStorage，不会上传到任何服务器
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/SettingsPanel.tsx src/components/ThemeSelector.tsx
git commit -m "feat: add settings panel with theme, export/import, and API management"
```

---

### Task 13: AI 智能解析

**Files:**
- Create: `src/utils/aiParse.ts`
- Modify: `src/components/AlgorithmParams.tsx`（增加一键应用按钮）

**Interfaces:**
- Consumes: `apiKey`, `apiEndpoint` from configStore
- Produces: 解析结果，可应用到配置

- [ ] **Step 1: AI 解析工具**

```typescript
// src/utils/aiParse.ts
import { Algorithm, DeductionParams, ValidRule } from '../types';

export interface ParseResult {
  algorithm: Algorithm;
  kEnabled: boolean;
  kValue: number;
  trimHighPercent: number;
  trimLowPercent: number;
  removeHighestN: number;
  nthLowest: number;
  q1Weight: number;
  k1: number;
  k2: number;
  maxPrice: number;
  deduction: DeductionParams;
  validRules: ValidRule[];
}

export async function parseRuleText(text: string, apiKey: string, endpoint: string): Promise<ParseResult | null> {
  const systemPrompt = `你是一个招投标评分专家。请从用户提供的招标文件评分办法原文中，提取以下信息并以JSON格式返回：
- algorithm: 算法类型（arithmetic_mean/trimmed_mean/remove_highest/second_lowest/double_average/weighted_limit/lowest_price/custom）
- kEnabled: 是否启用K值（true/false）
- kValue: K值（小数，如0.96）
- trimHighPercent: 去掉最高百分比（数字，如20）
- trimLowPercent: 去掉最低百分比（数字，如20）
- removeHighestN: 去掉最高家数（数字）
- nthLowest: 第N低报价（数字）
- q1Weight: Q1权重百分比（数字）
- k1: K1值（小数）
- k2: K2值（小数）
- maxPrice: 最高限价（数字）
- deduction: 扣分参数 {fullScore, deductPerHighPercent, deductPerLowPercent, minScore}
- validRules: 有效投标规则数组 [{minCount, maxCount, action, params}]

如果某项信息无法从原文中提取，使用默认值。只返回JSON，不要有其他内容。`;

  const response = await fetch(`${endpoint}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text },
      ],
      temperature: 0.1,
    }),
  });

  if (!response.ok) {
    throw new Error(`API请求失败: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';

  try {
    // 尝试提取 JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as ParseResult;
    }
  } catch {
    // 解析失败
  }

  return null;
}
```

- [ ] **Step 2: 修改 AlgorithmParams，增加 AI 解析的一键应用（在 Step1 中已添加按钮，此处补充逻辑）**

```typescript
// 在 src/pages/Step1Algorithm.tsx 中添加
import { useState } from 'react';
import { useConfigStore } from '../stores/configStore';
import { parseRuleText } from '../utils/aiParse';

// 在组件中：
const [isParsing, setIsParsing] = useState(false);
const [parseError, setParseError] = useState('');

const handleParse = async () => {
  const text = (document.querySelector('textarea') as HTMLTextAreaElement)?.value;
  if (!text) return;

  const { apiKey, apiEndpoint } = useConfigStore.getState();
  if (!apiKey) {
    setParseError('请先在设置中配置 API Key');
    return;
  }

  setIsParsing(true);
  setParseError('');

  try {
    const result = await parseRuleText(text, apiKey, apiEndpoint);
    if (result) {
      useConfigStore.getState().setAlgorithm(result.algorithm);
      useConfigStore.getState().setKEnabled(result.kEnabled);
      useConfigStore.getState().setKValue(result.kValue);
      useConfigStore.getState().setTrimHighPercent(result.trimHighPercent);
      useConfigStore.getState().setTrimLowPercent(result.trimLowPercent);
      useConfigStore.getState().setRemoveHighestN(result.removeHighestN);
      useConfigStore.getState().setNthLowest(result.nthLowest);
      useConfigStore.getState().setQ1Weight(result.q1Weight);
      useConfigStore.getState().setK1(result.k1);
      useConfigStore.getState().setK2(result.k2);
      useConfigStore.getState().setMaxPrice(result.maxPrice);
      useConfigStore.getState().setDeduction(result.deduction);
      useConfigStore.getState().setValidRules(result.validRules);
    } else {
      setParseError('解析失败，请检查 API 配置或原文格式');
    }
  } catch (err) {
    setParseError(`解析出错: ${err instanceof Error ? err.message : '未知错误'}`);
  } finally {
    setIsParsing(false);
  }
};
```

- [ ] **Step 3: Commit**

```bash
git add src/utils/aiParse.ts
git commit -m "feat: add AI rule parsing utility with DeepSeek API"
```

---

### Task 14: 样式完善与响应式

**Files:**
- Modify: `src/index.css`
- Modify: `src/components/Layout.tsx`
- Modify: `src/components/AlgorithmGrid.tsx`

**Interfaces:**
- Consumes: 所有组件
- Produces: 完整响应式布局和深色主题支持

- [ ] **Step 1: 完善 CSS 和深色主题**

```css
/* src/index.css */
@import 'tailwindcss';

@layer base {
  body {
    @apply bg-[#FDF5E6] text-[#5C4033] font-sans antialiased;
  }
  .dark body {
    @apply bg-[#1A1A1A] text-[#E8E0D0];
  }
}

@layer components {
  .btn-primary {
    @apply bg-[#C43A31] text-white px-6 py-2.5 rounded-lg font-medium
           hover:bg-[#A83028] transition-colors duration-200
           flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed;
  }
  .btn-secondary {
    @apply bg-[#F5EFE0] text-[#5C4033] px-6 py-2.5 rounded-lg font-medium
           hover:bg-[#E8E0CC] transition-colors duration-200
           border border-[#D4C4A8];
  }
  .dark .btn-secondary {
    @apply bg-[#2A2A2A] text-[#E8E0D0] hover:bg-[#3A3A3A] border-[#3A3A3A];
  }
  .input-field {
    @apply bg-white border border-[#D4C4A8] rounded-lg px-4 py-2
           focus:outline-none focus:ring-2 focus:ring-[#C43A31]/30
           focus:border-[#C43A31] transition-all text-[#5C4033];
  }
  .dark .input-field {
    @apply bg-[#2A2A2A] border-[#3A3A3A] text-[#E8E0D0] focus:ring-[#C43A31]/50;
  }
  .card {
    @apply bg-[#F5EFE0] border border-[#D4C4A8] rounded-xl p-6;
  }
  .dark .card {
    @apply bg-[#2A2A2A] border-[#3A3A3A];
  }
}
```

- [ ] **Step 2: 添加响应式断点**

```css
/* 在 tailwind.config.ts 中确认断点 */
/* 默认已包含 sm:640px, md:768px, lg:1024px */
```

- [ ] **Step 3: 确保算法宫格响应式**

```typescript
// src/components/AlgorithmGrid.tsx - 已使用 grid-cols-2 lg:grid-cols-4
```

- [ ] **Step 4: 给 dark 模式添加切换逻辑**

```typescript
// src/App.tsx 中添加 dark 类控制
import { useEffect } from 'react';
import { useConfigStore } from './stores/configStore';

// 在 App 组件内：
const { theme } = useConfigStore();
useEffect(() => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}, [theme]);
```

- [ ] **Step 5: Commit**

```bash
git add src/index.css src/App.tsx src/components/AlgorithmGrid.tsx
git commit -m "feat:完善样式、深色主题和响应式布局"
```

---

### Task 15: 测试与验证

**Files:**
- Run: `npm run build`
- Run: `npx vitest run`

**Interfaces:**
- Consumes: 所有已实现的功能
- Produces: 构建成功，测试通过

- [ ] **Step 1: 运行测试**

```bash
npx vitest run
```

期望：所有测试 PASS

- [ ] **Step 2: 构建项目**

```bash
npm run build
```

期望：无错误，生成 dist/ 目录

- [ ] **Step 3: 本地运行验证**

```bash
npm run dev
```

依次验证：
1. 访问 http://localhost:5173/step-1，选择算法，切换 K 值开关
2. 下一步到 step-2，添加/删除规则
3. 下一步到 step-3，修改扣分参数
4. 下一步到 step-4，添加投标单位，测试随机填充和解析
5. 测算结果，检查排名表格正确性
6. 打开设置面板，切换主题，导出/导入配置
7. 测试响应式（缩小浏览器窗口）

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "test: verify all features and responsive layout"
```

---

### Task 16: 清理与最终检查

- [ ] **Step 1: 移除所有 console.log 调试语句**
- [ ] **Step 2: 确认无 TODO/FIXME 注释**
- [ ] **Step 3: 确认所有文件路径正确**
- [ ] **Step 4: 最终构建**

```bash
npm run build && npm run preview
```

- [ ] **Step 5: 最终 Commit**

```bash
git add -A
git commit -m "chore: final cleanup and production build"
```
