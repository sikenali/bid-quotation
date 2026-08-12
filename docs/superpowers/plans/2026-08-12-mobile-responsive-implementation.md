# 移动端响应式布局 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现移动端（375px）和平板端（768px）响应式布局，PC 端保持不变

**Architecture:** 通过 Tailwind 响应式断点（`sm:`/`md:`/`lg:`）控制布局变化，使用 CSS 类 `mobile-*` 辅助移动端样式。弹窗通过 `mobile-modal` 类实现底部弹出效果。

**Tech Stack:** React 19 + Tailwind CSS v4 + TypeScript

**Design Doc:** `docs/superpowers/specs/2026-08-12-mobile-responsive-design.md`

## Global Constraints

- PC 端完全不变，所有改动通过 `sm:` / `md:` 断点控制
- 移动端触控区域 ≥44px
- 横向滚动仅用于表格和标签卡片
- 弹窗采用底部弹出样式（`mobile-modal`）

---

### Task 1: 全局样式和工具类

**Files:**
- Modify: `src/index.css`

**Interfaces:**
- Produces: CSS 工具类 `.mobile-hide`, `.mobile-padding`, `.mobile-grid`, `.mobile-stack`, `.mobile-scroll-table`, `.mobile-modal`

- [ ] **Step 1: 添加移动端媒体查询样式**

在 `src/index.css` 底部添加 `@media (max-width: 640px)` 媒体查询，包含：
```css
@media (max-width: 640px) {
  .mobile-hide { display: none !important; }
  .mobile-padding { padding-left: 12px !important; padding-right: 12px !important; }
  .mobile-grid { grid-template-columns: 1fr !important; }
  .mobile-stack { flex-direction: column !important; align-items: stretch !important; gap: 8px !important; }
  .mobile-scroll-table { overflow-x: auto !important; -webkit-overflow-scrolling: touch; }
  .mobile-modal { max-width: 100vw !important; width: 100% !important; border-radius: 16px 16px 0 0 !important; margin-top: auto !important; max-height: 90vh !important; }
}
```

- [ ] **Step 2: 提交**

```bash
git add src/index.css
git commit -m "feat: 添加移动端响应式工具类"
```

---

### Task 2: 顶部导航 + 步骤指示器响应式

**Files:**
- Modify: `src/components/Layout.tsx`
- Modify: `src/components/StepIndicator.tsx`

**Interfaces:**
- 无

- [ ] **Step 1: 修改 Layout.tsx 头部导航**

```tsx
// 头部导航容器
<header className="sticky top-0 z-40 bg-bg dark:bg-dark-bg border-b border-border/50">
  <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between md:px-8 md:py-4">
    {/* 左侧品牌 */}
    <div
      className="flex items-center gap-2 cursor-pointer select-none"
      onClick={() => { setCurrentStep(1); navigate('/algorithm'); }}
    >
      <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center flex-shrink-0 md:w-11 md:h-11">
        <i className="ri-auction-line text-white text-lg md:text-xl"></i>
      </div>
      <div className="hidden sm:block">
        <h1 className="text-text font-semibold text-[18px] leading-tight dark:text-dark-text md:text-[20px]">文价猩</h1>
        <p className="text-text-secondary text-[10px] dark:text-dark-text-secondary md:text-[11px]">标书智能报价平台</p>
      </div>
      <div className="block sm:hidden">
        <h1 className="text-text font-semibold text-[16px] leading-tight dark:text-dark-text">文价猩</h1>
      </div>
    </div>

    {/* 右侧操作区 */}
    <div className="flex items-center gap-2 md:gap-4">
      {!isResultPage && (
        <div className="overflow-x-auto max-w-[180px] sm:max-w-none">
          <StepIndicator currentStep={currentStep} />
        </div>
      )}
      <button
        onClick={() => setShowSettings(true)}
        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 md:w-10 md:h-10 ${
          showSettings
            ? 'bg-primary text-white'
            : 'bg-card border border-border text-text-secondary hover:bg-border-light dark:bg-dark-card dark:border-dark-border dark:text-dark-text-secondary dark:hover:bg-dark-border'
        }`}
        aria-label="设置"
      >
        <i className="ri-settings-3-line text-lg md:text-xl"></i>
      </button>
    </div>
  </div>
</header>

// 主内容区
<main className="max-w-7xl mx-auto px-4 py-4 md:px-8 md:py-8">
  {children}
</main>
```

- [ ] **Step 2: 修改 StepIndicator.tsx 步骤容器**

在 `StepIndicator` 组件的外层容器添加内联样式处理，确保在小屏上可滚动并居中：

```tsx
return (
  <div className="flex items-center gap-1 md:gap-2" style={{ minWidth: '280px' }}>
    {/* ... 保持不变 ... */}
  </div>
);
```

同时将步骤间连接线宽度改为响应式：
```tsx
// 连接线
<div className={`w-4 h-0.5 rounded-full mt-3 md:w-6 ${
  stepNum < currentStep ? 'bg-[#5B8C5A]' : isDark ? 'bg-[#3D3D3D]' : 'bg-[#D4C4A8]'
}`} />
```

- [ ] **Step 3: 提交**

```bash
git add src/components/Layout.tsx src/components/StepIndicator.tsx
git commit -m "feat: 顶部导航和步骤指示器移动端响应式"
```

---

### Task 3: 报价方法页面（Step 1）响应式

**Files:**
- Modify: `src/components/AlgorithmGrid.tsx`

**Interfaces:**
- 无

- [ ] **Step 1: 修改 AlgorithmGrid 网格布局**

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
```

- [ ] **Step 2: 修改 Step1Algorithm.tsx 标题**

```tsx
<h2 className="text-[22px] sm:text-[28px] font-semibold text-text">报价方法</h2>
```

- [ ] **Step 3: 提交**

```bash
git add src/components/AlgorithmGrid.tsx src/pages/Step1Algorithm.tsx
git commit -m "feat: 报价方法页面移动端响应式"
```

---

### Task 4: 规则管理页面（Step 2）移动端布局

**Files:**
- Modify: `src/components/RuleManager.tsx`

**Interfaces:**
- 无

- [ ] **Step 1: 修改规则标签容器为横向滚动**

```tsx
// 规则标签横排 -> 小屏横向滚动
<div className="flex flex-wrap gap-3 overflow-x-auto sm:flex-wrap pb-2">
```

- [ ] **Step 2: 修改规则卡片宽度为响应式**

```tsx
// 将 w-[292px] 改为响应式
className={`relative p-5 rounded-xl border-2 text-left transition-all duration-200 sm:w-[292px] w-full flex-shrink-0 sm:flex-shrink`}
```

- [ ] **Step 3: 修改规则行输入框为移动端适配**

```tsx
// 修改 RuleRow 组件的布局
<div className="flex items-center gap-4 px-4 py-3 flex-wrap md:flex-nowrap">
  // 输入框宽度改为响应式
  <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
    <span className="text-sm">投标人数量</span>
    <input className="input-field w-14 text-center md:w-16" />
    <span className="text-sm">~</span>
    <input className="input-field w-14 text-center md:w-20" />
    <span className="text-sm">家时</span>
  </div>
  {/* 删除按钮 */}
  <button className="p-3 md:p-2 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
    <i className="ri-close-line text-base"></i>
  </button>
</div>
```

- [ ] **Step 4: 提交**

```bash
git add src/components/RuleManager.tsx
git commit -m "feat: 规则管理页面移动端响应式"
```

---

### Task 5: 投标报价页面（Step 4）移动端布局

**Files:**
- Modify: `src/components/BidInput.tsx`

**Interfaces:**
- 无

- [ ] **Step 1: 修改单位标签为移动端布局**

```tsx
// 投标单位标签横排 -> 小屏可滚动
<div className="flex flex-wrap gap-3">
  {bidUnits.map((unit) => (
    <button
      key={unit.id}
      onClick={() => setActiveUnitId(unit.id === activeUnitId ? null : unit.id)}
      className={`flex flex-col items-center justify-center px-4 py-3 rounded-xl min-w-[120px] sm:min-w-[140px] transition-all border-2 flex-1 sm:flex-none ${
        // ... 颜色逻辑不变
      }`}
    >
      // ... 内容不变
    </button>
  ))}
  // 添加按钮
  <button className="min-h-[44px]">添加单位</button>
</div>
```

- [ ] **Step 2: 修改编辑区域为移动端垂直表单**

```tsx
// 编辑区域 - 响应式布局
<div className="flex items-center gap-3 p-4 rounded-xl border transition-colors flex-col sm:flex-row">
  <input
    type="text"
    value={unit.name}
    placeholder="单位名称"
    className="input-field w-full sm:flex-1"
  />
  <div className="flex items-center gap-2 w-full sm:w-auto">
    <input
      type="number"
      value={unit.price}
      placeholder="报价金额"
      className="input-field w-full sm:w-[200px] text-center"
    />
    <span className="text-sm font-medium whitespace-nowrap">元</span>
  </div>
  <button className="px-4 py-3 sm:py-2 bg-[#FFF0ED] border border-[#F5C6C0] rounded-lg text-[#C43A31] text-sm font-medium min-h-[44px] flex items-center gap-1">
    <i className="ri-delete-bin-line"></i>
    <span>删除</span>
  </button>
</div>
```

- [ ] **Step 3: 修改快捷操作按钮**

```tsx
// 快捷操作区 - 小屏堆叠
<div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
  <button className="px-5 py-3 sm:py-2 rounded-lg text-sm flex items-center gap-2 min-h-[44px]">
    <i className="ri-dice-line"></i>随机厂商
  </button>
  <button className="px-5 py-3 sm:py-2 rounded-lg text-sm flex items-center gap-2 min-h-[44px]">
    <i className="ri-file-search-line"></i>总价计算
  </button>
  <button className="px-5 py-3 sm:py-2 rounded-lg text-sm flex items-center gap-2 min-h-[44px]">
    <i className="ri-delete-bin-line"></i>清空所有
  </button>
</div>
```

- [ ] **Step 4: 提交**

```bash
git add src/components/BidInput.tsx
git commit -m "feat: 投标报价页面移动端响应式"
```

---

### Task 6: 扣分规则页面（Step 3）移动端布局

**Files:**
- Modify: `src/components/DeductionForm.tsx`

**Interfaces:**
- 无

- [ ] **Step 1: 修改参数行布局为响应式**

```tsx
// 将 flex 行改为响应式网格
<div className="grid grid-cols-2 md:grid-cols-4 gap-0 rounded-xl overflow-hidden border">
  {/* 满分 */}
  <div className="p-4 flex flex-col gap-1.5 border-r border-b md:border-b-0">
    <label>满分 (分)</label>
    <input type="number" value={deduction.fullScore} className="input-field w-full text-sm text-center" />
  </div>
  {/* 每高 1% 扣 */}
  <div className="p-4 flex flex-col gap-1.5 border-b md:border-b-0 md:border-r">
    <label>每高 1% 扣 (分)</label>
    <input type="number" value={deductHigh} className="input-field w-full text-sm text-center" />
  </div>
  {/* 每低 1% 扣 */}
  <div className="p-4 flex flex-col gap-1.5 border-r">
    <label>每低 1% 扣 (分)</label>
    <input type="number" value={deductLow} className="input-field w-full text-sm text-center" />
  </div>
  {/* 最低得分 */}
  <div className="p-4 flex flex-col gap-1.5">
    <label>最低得分 (分)</label>
    <input type="number" value={minScore} className="input-field w-full text-sm text-center" />
  </div>
</div>
```

- [ ] **Step 2: 提交**

```bash
git add src/components/DeductionForm.tsx
git commit -m "feat: 扣分规则页面移动端响应式"
```

---

### Task 7: 导航按钮响应式（Step 4）

**Files:**
- Modify: `src/pages/Step4BidInput.tsx`

**Interfaces:**
- 无

- [ ] **Step 1: 修改按钮布局**

```tsx
// 将按钮布局改为移动端堆叠
<div className="flex items-start justify-between pt-4 flex-col sm:flex-row gap-3 sm:gap-0">
  <button onClick={handlePrev} className="btn-secondary w-full sm:w-auto">
    <i className="ri-arrow-left-line"></i>
    <span>上一步</span>
  </button>
  <div className="flex items-center gap-3 w-full sm:w-auto">
    <button onClick={handleTotalCalc} className="flex-1 sm:flex-none px-6 py-2.5 min-h-[44px] bg-[#059669] hover:bg-[#047857] text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
      <i className="ri-calculator-line"></i>
      <span>总价测算</span>
    </button>
    <button onClick={handleNext} className="flex-1 sm:flex-none btn-primary min-h-[44px]">
      <i className="ri-bar-chart-grouped-line"></i>
      <span>报价测算</span>
    </button>
  </div>
</div>
```

- [ ] **Step 2: 提交**

```bash
git add src/pages/Step4BidInput.tsx
git commit -m "feat: 导航按钮移动端响应式"
```

---

### Task 8: 测算结果页面（Step 5）移动端布局

**Files:**
- Modify: `src/components/SummaryCards.tsx`
- Modify: `src/components/RankingTable.tsx`

**Interfaces:**
- 无

- [ ] **Step 1: 修改 SummaryCards 为响应式网格**

```tsx
// 将内联样式改为响应式类
<div className="grid grid-cols-2 md:grid-cols-4 gap-4" style={{ gridTemplateColumns: includeTotalScores ? 'repeat(2, minmax(0, 1fr))' : undefined }}>
  // 或者简单使用 Tailwind 类
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4"
```

- [ ] **Step 2: 修改 RankingTable 添加横向滚动类**

```tsx
// 在表格外层容器添加 mobile-scroll-table 类
<div className="overflow-x-auto mobile-scroll-table">
```

- [ ] **Step 3: 提交**

```bash
git add src/components/SummaryCards.tsx src/components/RankingTable.tsx
git commit -m "feat: 测算结果页面移动端响应式"
```

---

### Task 9: 设置面板（SettingsPanel）移动端布局

**Files:**
- Modify: `src/components/SettingsPanel.tsx`

**Interfaces:**
- 无

- [ ] **Step 1: 修改左侧面板为移动端隐藏**

```tsx
// 左侧标签面板 - 移动端隐藏
<div className={`w-[280px] border-r flex-col hidden md:flex ${isDark ? 'bg-[#2D2D2D] border-[#3D3D3D]' : 'bg-[#FBF7EF] border-[#E8DCC8]'}`}>
```

- [ ] **Step 2: 添加移动端顶部标签切换栏**

```tsx
// 在内容区顶部添加移动端标签切换
<div className="flex md:hidden gap-2 mb-4 overflow-x-auto">
  {tabs.map((tab) => (
    <button
      key={tab.id}
      onClick={() => setActiveTab(tab.id)}
      className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all min-h-[44px] whitespace-nowrap ${
        activeTab === tab.id
          ? 'bg-[#C43A31] text-white'
          : isDark ? 'bg-[#3D3D3D] text-[#C0B098]' : 'bg-[#F5EFE0] text-text-secondary'
      }`}
    >
      <i className={`${TAB_ICONS[tab.id]} mr-2`}></i>
      {tab.label}
    </button>
  ))}
</div>
```

- [ ] **Step 3: 修改右侧内容区为移动端全宽**

```tsx
// 右侧内容区 - 移动端全宽
<div className="flex-1 p-4 md:p-8 overflow-y-auto">
  <div className="max-w-2xl">
    // ... 内容不变
  </div>
</div>
```

- [ ] **Step 4: 提交**

```bash
git add src/components/SettingsPanel.tsx
git commit -m "feat: 设置面板移动端响应式"
```

---

### Task 10: 弹窗组件移动端适配

**Files:**
- Modify: `src/components/BidInput.tsx`（随机厂商弹窗和总价计算弹窗）

**Interfaces:**
- 无

- [ ] **Step 1: 修改随机厂商弹窗为移动端底部弹出**

```tsx
// 随机厂商弹窗容器
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowRandomModal(false)}>
  <div className={`rounded-xl p-6 w-full max-w-md mx-4 sm:mx-auto mobile-modal sm:rounded-xl sm:max-w-md ${isDark ? 'bg-[#2D2D2D]' : 'bg-white'}`} onClick={(e) => e.stopPropagation()}>
    // ... 内容不变
  </div>
</div>
```

- [ ] **Step 2: 修改总价计算弹窗表格为移动端横向滚动**

```tsx
// 弹窗容器
<div className={`rounded-xl p-6 w-full max-w-[720px] mx-4 sm:mx-auto max-h-[80vh] overflow-y-auto mobile-modal sm:rounded-xl sm:max-w-[720px] ${isDark ? 'bg-[#2D2D2D]' : 'bg-white'}`} onClick={(e) => e.stopPropagation()}>
  // 表格容器添加横向滚动
  <div className="rounded-xl overflow-hidden border mobile-scroll-table">
    <table className="w-full text-xs sm:text-sm table-fixed">
      // ... 表头和数据行不变，输入框宽度 w-14
    </table>
  </div>
</div>
```

- [ ] **Step 3: 提交**

```bash
git add src/components/BidInput.tsx
git commit -m "feat: 弹窗组件移动端底部弹出适配"
```

---

### Task 11: 全局按钮触控区域优化

**Files:**
- Modify: `src/index.css`

**Interfaces:**
- 无

- [ ] **Step 1: 在媒体查询中添加按钮触控优化**

```css
@media (max-width: 640px) {
  /* ... 已有样式 ... */
  
  .btn-primary, .btn-secondary {
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .input-field {
    min-height: 44px;
  }
}
```

- [ ] **Step 2: 提交**

```bash
git add src/index.css
git commit -m "feat: 全局按钮触控区域最小高度44px"
```