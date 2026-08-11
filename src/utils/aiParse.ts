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
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as ParseResult;
    }
  } catch {
    // 解析失败
  }

  return null;
}
