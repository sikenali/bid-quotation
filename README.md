# 文价猩 — 智能投标报价测算工具

<p align="center">
  <strong>配置评分规则 · 录入报价 · 一键测算排名</strong>
</p>

<p align="center">
  <img src="public/favicon.svg" width="120" height="120" alt="文价猩 Logo">
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React_19-61DAFB?logo=react&logoColor=white">
  <img alt="Vite" src="https://img.shields.io/badge/Vite_5-646CFF?logo=vite&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-yellow">
</p>

## 软件介绍

文价猩是一款专为招投标场景设计的报价测算工具。配置招标文件中的评分规则，录入各投标单位报价，一键计算基准价与排名得分，辅助评标决策。

**核心功能**

| 功能 | 说明 |
|------|------|
| 报价算法 | 9 种基准价计算方法，覆盖算术平均、去极值、次低报价、随机权重等 |
| 有效判定 | 按投标家数区间配置有效规则（去极值、去最高/低 N 家、第 N 低等） |
| 扣分规则 | 配置满分、最低分、每偏离 1% 扣分标准，自动计算得分 |
| 报价录入 | 支持手动录入、批量解析（逗号/全角逗号分隔）、随机填充 |
| AI 智能解析 | 粘贴招标文件原文，AI 自动识别并配置报价方法与扣分参数 |
| 结果排名 | 基准价、偏差率、得分排名，支持 CSV 导出 |

## 技术实现

### 基准价计算引擎

系统内置 9 种报价算法，纯前端计算，零延迟。每种算法对应一套参数配置面板，选中后自动展示所需字段。计算流程：录入报价 → 有效判定（按家数区间命中规则）→ 去极值/次低/加权 → 基准价 → 偏差率 → 得分。

### 前端架构

纯 SPA 模式，所有计算在浏览器本地完成，不依赖后端服务器。状态管理采用 Zustand + localStorage 持久化。6 步向导式交互对应投标测算的完整流程，支持主题切换与配置导入导出。

### AI 解析

通过 DeepSeek / CCswitch API 调用大模型，解析招标文件中的报价计算方法与扣分规则原文，自动填充算法参数与扣分配置，省去手动配置步骤。

---

## 使用方法

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

浏览器打开 `http://localhost:5173` 即可使用。

---

## 声明

1. **使用目的**：本工具旨在辅助投标报价测算，不保证计算结果完全满足任何特定招标文件或政府标准的要求。用户应自行核对最终结果的合规性。
2. **数据安全**：所有报价数据与配置信息仅保存在浏览器本地（localStorage），不上传至任何服务器。AI 解析需自行配置 API Key，API Key 不存储于任何第三方服务。
3. **免责声明**：本工具按"现有状态"提供，不作任何形式的明示或默示保证。在任何情况下，作者或版权持有人均不对因使用本工具而产生的任何索赔、损害或其他责任负责。

## License

[MIT](./LICENSE)
