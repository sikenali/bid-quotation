import { Algorithm, DeductionParams, ValidRule } from '../types';

export interface ParseResult {
  algorithm: Algorithm;
  deduction: DeductionParams;
  validRules: ValidRule[];
}

export async function parseRuleText(text: string, apiKey: string, endpoint: string): Promise<ParseResult | null> {
  const systemPrompt = `你是一个招投标评分专家。请从用户提供的招标文件评分办法原文中，提取以下信息并以JSON格式返回：
- algorithm: 算法类型（low_price_priority/average_price/gradient_method/conventional_method）
- deduction: 价格评分参数 {fullScore, deductPerHighPercent, deductPerLowPercent, minScore}
- validRules: 有效投标规则数组 [{minCount, maxCount, action, params}]

算法说明：
- low_price_priority: 低价优先法，最低价=基准价
- average_price: 平均价计法，平均值=基准价
- gradient_method: 基准价梯度法，技术前两名均值为基准价，超基准价×0.95
- conventional_method: 基准价常规法，价格评分=(基准价/评标价)×满分

只返回JSON，不要有其他内容。`;

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
