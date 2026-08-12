import React, { useState } from 'react';
import { useConfigStore } from '../stores/configStore';
import { parseRuleText } from '../utils/aiParse';

const ALGORITHM_DESCRIPTIONS: Record<string, string> = {
  low_price_priority: '低价优先法：满足磋商文件要求且最后磋商报价最低的报价为基准价，其价格分为满分。其他供应商得分=(基准价／最后磋商报价)×价格分。',
  average_price: '平均价计法：满足磋商文件要求且最后磋商报价的平均值为基准价。供应商得分=((基准价-|基准价-最终报价|)/基准价)×价格分。',
  gradient_method: '基准价梯度法：评标基准价=技术评审得分前两名的投标单位报价的算数平均值。报价≤基准价：得分=(1-|报价-基准价|/基准价)×标准分；报价>基准价：得分×0.95。',
  conventional_method: '基准价常规法：评标基准价为满足磋商文件要求的平均报价。价格评分=(评标基准价格/评标价格)×满分，保留两位小数。',
  ai_parse: 'AI智能解析：粘贴招标文件原文，AI自动识别并配置报价计算方法与扣分参数。',
};

export function AlgorithmParams() {
  const {
    algorithm, deduction, setDeduction,
    setValidRules,
    theme, apiKey, apiEndpoint,
    showAlgorithmDesc, setShowAlgorithmDesc,
  } = useConfigStore();
  const [parseText, setParseText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState('');
  const isDark = theme === 'dark';

  const handleParse = async () => {
    const text = parseText.trim();
    if (!text) {
      setParseError('请先粘贴招标文件内容');
      return;
    }
    if (!apiKey) {
      setParseError('请先在设置（右上角⚙️）中配置 API Key');
      return;
    }
    if (!apiEndpoint) {
      setParseError('请先在设置中配置 API 端点');
      return;
    }

    setIsParsing(true);
    setParseError('');

    try {
      const result = await parseRuleText(text, apiKey, apiEndpoint);
      if (result) {
        setDeduction(result.deduction);
        setValidRules(result.validRules);
        setShowAlgorithmDesc(false);
      } else {
        setParseError('解析失败，请检查 API 配置或原文格式');
      }
    } catch (err) {
      setParseError(`解析出错: ${err instanceof Error ? err.message : '未知错误'}`);
    } finally {
      setIsParsing(false);
    }
  };

  const desc = ALGORITHM_DESCRIPTIONS[algorithm] || '';

  return (
    <div className={`rounded-2xl p-6 space-y-5 border ${isDark ? 'bg-[#2A2A2A] border-[#3A3A3A]' : 'bg-[#F5EFE0] border-[#E8DCC8]'}`}>
      {/* 标题栏 + 折叠说明按钮 */}
      <div className="flex items-center gap-4">
        <div className={`w-1.5 h-4.5 rounded-[3px] flex-shrink-0 ${isDark ? 'bg-[#A89880]' : 'bg-[#D4C4A8]'}`} />
        <h3 className={`font-semibold text-[15px] flex-1 ${isDark ? 'text-[#E8E0D0]' : 'text-text'}`}>
          价格评分配置
        </h3>
        <button
          onClick={() => setShowAlgorithmDesc(!showAlgorithmDesc)}
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
            showAlgorithmDesc
              ? 'bg-[#C43A31] text-white'
              : isDark ? 'bg-[#3A3A3A] text-[#A89880] hover:text-white' : 'bg-[#F0E8D5] text-text-secondary hover:text-text'
          }`}
          title={showAlgorithmDesc ? '收起说明' : '展开说明'}
        >
          <i className={`ri-question-line text-base transition-transform ${showAlgorithmDesc ? 'rotate-45' : ''}`}></i>
        </button>
      </div>

      {/* 算法说明（可折叠） */}
      {showAlgorithmDesc && desc && (
        <div className={`rounded-xl px-4 py-3 text-sm ${isDark ? 'bg-[#1A1A1A] text-[#A89880]' : 'bg-[#FBF7EF] text-text-secondary'}`}>
          {desc}
        </div>
      )}

      {/* 价格满分设置 */}
      <div>
        <label className={`block text-xs mb-1 ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>
          价格满分 (分)
        </label>
        <input
          type="number"
          step="1"
          min="0"
          value={deduction.fullScore}
          onChange={(e) => setDeduction({ ...deduction, fullScore: parseFloat(e.target.value) || 0 })}
          className={`input-field w-full text-sm ${isDark ? 'bg-[#1A1A1A] border-[#3A3A3A] text-[#E8E0D0]' : ''}`}
        />
      </div>

      {/* AI 解析 */}
      {algorithm === 'ai_parse' && (
        <div>
          <label className={`block text-xs mb-1 ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>粘贴招标文件或规则原文</label>
          <textarea
            value={parseText}
            onChange={(e) => setParseText(e.target.value)}
            rows={4}
            placeholder="请粘贴招标文件中的报价计算方法描述，AI 将自动解析并配置参数..."
            className={`input-field w-full text-sm resize-none ${isDark ? 'bg-[#1A1A1A] border-[#3A3A3A] text-[#E8E0D0]' : ''}`}
          />
          <button
            onClick={handleParse}
            disabled={isParsing}
            className={`mt-2 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isDark ? 'bg-primary hover:bg-primary-hover text-white' : 'bg-[#C43A31] hover:bg-[#A83028] text-white'
            }`}
          >
            {isParsing ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 animate-spin">
                  <path d="M12 2a10 10 0 0 1 10 10h-3l4 4-4 4v-3a7 7 0 1 0-7 7v-3l4 4 4-4-4-4v3a10 10 0 1 1-10-10z"/>
                </svg>
                AI 解析中...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5"/>
                </svg>
                AI 智能解析
              </>
            )}
          </button>
          {parseError && (
            <p className={`mt-2 text-sm ${isDark ? 'text-red-400' : 'text-[#C43A31]'}`}>{parseError}</p>
          )}
          <p className={`mt-1 text-xs ${isDark ? 'text-[#A89880]/60' : 'text-text-secondary/60'}`}>
            解析后自动填充评分参数
          </p>
        </div>
      )}
    </div>
  );
}
