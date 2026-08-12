import type { Algorithm } from '../types';

export const ALGORITHM_OPTIONS: Array<{ id: Algorithm; name: string; shortDesc: string; description: string; icon: string }> = [
  {
    id: 'low_price_priority',
    name: '低价优先法',
    shortDesc: '最低价=基准价，按报价比打分',
    description: '满足要求且最后磋商报价最低的报价为基准价，其价格分为满分。其他供应商得分=(基准价／最后磋商报价)×价格分。',
    icon: 'ri-trophy-line',
  },
  {
    id: 'average_price',
    name: '平均价计法',
    shortDesc: '基准价=所有有效报价平均值',
    description: '满足要求且最后磋商报价的平均值为基准价。供应商得分=((基准价-|基准价-报价|)/基准价)×价格分。',
    icon: 'ri-function-line',
  },
  {
    id: 'gradient_method',
    name: '基准价梯度法',
    shortDesc: '基准价=技术前两名均值，梯度扣分',
    description: '评标基准价=技术评审得分前两名的投标单位报价的算数平均值。报价≤基准价：得分=(1-|报价-基准价|/基准价)×标准分；报价>基准价：得分×0.95。',
    icon: 'ri-scales-line',
  },
  {
    id: 'conventional_method',
    name: '基准价常规法',
    shortDesc: '价格评分=(基准价/评标价)×满分',
    description: '评标基准价为满足磋商文件要求且最后磋商报价的平均值。价格评分＝（评标基准价格/评标价格）×满分，四舍五入保留两位小数。',
    icon: 'ri-ruler-2-line',
  },
  {
    id: 'ai_parse',
    name: 'AI智能解析',
    shortDesc: '粘贴规则原文，AI自动分析',
    description: '上传招标文件，AI 自动识别并配置报价参数',
    icon: 'ri-brain-line',
  },
];
