import { Algorithm, DeductionParams, ValidRule } from '../types';

const VALID_ALGORITHMS: Algorithm[] = [
  'low_price_priority', 'average_price', 'gradient_method', 'conventional_method', 'ai_parse',
];

const VALID_ACTIONS = ['direct', 'trim_percent', 'remove_highest_n', 'remove_lowest_n', 'nth_lowest'];

export interface ParseResult {
  algorithm: Algorithm;
  deduction: DeductionParams;
  validRules: ValidRule[];
}

function validateParseResult(raw: any): ParseResult | null {
  if (!raw || typeof raw !== 'object') return null;

  const algorithm = raw.algorithm;
  if (!VALID_ALGORITHMS.includes(algorithm)) return null;

  const deduction = raw.deduction;
  if (!deduction || typeof deduction !== 'object') return null;
  const fullScore = typeof deduction.fullScore === 'number' && deduction.fullScore >= 0 ? deduction.fullScore : 20;
  const deductPerHighPercent = typeof deduction.deductPerHighPercent === 'number' && deduction.deductPerHighPercent >= 0 ? deduction.deductPerHighPercent : 0.6;
  const deductPerLowPercent = typeof deduction.deductPerLowPercent === 'number' && deduction.deductPerLowPercent >= 0 ? deduction.deductPerLowPercent : 0.3;
  const minScore = typeof deduction.minScore === 'number' && deduction.minScore >= 0 ? deduction.minScore : 0;

  const validRules: ValidRule[] = [];
  if (Array.isArray(raw.validRules)) {
    for (const r of raw.validRules) {
      if (r && typeof r === 'object' && VALID_ACTIONS.includes(r.action)) {
        validRules.push({
          id: r.id || `ai-${Math.random().toString(36).slice(2, 8)}`,
          minCount: typeof r.minCount === 'number' ? r.minCount : 2,
          maxCount: typeof r.maxCount === 'number' ? r.maxCount : 999,
          action: r.action,
          params: r.params || {},
        });
      }
    }
  }

  return {
    algorithm,
    deduction: { fullScore, deductPerHighPercent, deductPerLowPercent, minScore },
    validRules,
  };
}

export async function parseRuleText(text: string, apiKey: string, endpoint: string): Promise<ParseResult | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

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

  try {
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
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      throw new Error(`API请求失败: ${response.status}${errorBody ? ` - ${errorBody}` : ''}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return validateParseResult(parsed);
      }
    } catch {
      // 解析失败
    }

    return null;
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error('API 请求超时，请检查网络连接');
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}