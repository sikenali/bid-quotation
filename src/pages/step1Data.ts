import { AlgorithmOption } from '../types';

export const ALGORITHM_OPTIONS: AlgorithmOption[] = [
  {
    id: 'arithmetic_mean',
    name: '算术平均法',
    description: '所有有效报价的算术平均值作为基准价',
    icon: 'Σ',
  },
  {
    id: 'trimmed_mean',
    name: '去极值平均法',
    description: '去掉最高和最低报价后取平均，排除异常报价干扰',
    icon: '△',
  },
  {
    id: 'remove_highest',
    name: '去最高平均法',
    description: '去掉最高报价后取平均，避免高价干扰基准',
    icon: '▽',
  },
  {
    id: 'second_lowest',
    name: '次低报价法',
    description: '取最低报价的次低值作为基准价',
    icon: '2nd',
  },
  {
    id: 'double_average',
    name: '二次平均法',
    description: '取低于首次平均值的报价再做平均，鼓励理性报价',
    icon: '∞',
  },
  {
    id: 'weighted_limit',
    name: '随机权重法',
    description: '结合平均价与最高限价加权计算基准价',
    icon: '⚖',
  },
  {
    id: 'lowest_price',
    name: '最低价法',
    description: '最低报价直接作为基准价，价低者得',
    icon: '↓',
  },
  {
    id: 'custom',
    name: '手动指定',
    description: '手动输入自定义基准价',
    icon: '✎',
  },
  {
    id: 'ai_parse',
    name: 'AI 智能解析',
    description: '上传招标文件，AI 自动识别并配置报价参数',
    icon: 'AI',
  },
];
