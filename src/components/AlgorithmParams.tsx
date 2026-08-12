import React, { useState } from 'react';
import { useConfigStore } from '../stores/configStore';
import { parseRuleText } from '../utils/aiParse';

export function AlgorithmParams() {
  const {
    algorithm, kEnabled, kValue,
    trimHighPercent, trimLowPercent,
    removeHighestN, nthLowest,
    q1Weight, k1, k2, maxPrice, customBasePrice,
    setAlgorithm, setKEnabled, setKValue,
    setTrimHighPercent, setTrimLowPercent,
    setRemoveHighestN, setNthLowest,
    setQ1Weight, setK1, setK2, setMaxPrice, setCustomBasePrice,
    setDeduction, setValidRules,
    theme, apiKey, apiEndpoint,
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
        setAlgorithm(result.algorithm);
        setKEnabled(result.kEnabled);
        setKValue(result.kValue);
        setTrimHighPercent(result.trimHighPercent);
        setTrimLowPercent(result.trimLowPercent);
        setRemoveHighestN(result.removeHighestN);
        setNthLowest(result.nthLowest);
        setQ1Weight(result.q1Weight);
        setK1(result.k1);
        setK2(result.k2);
        setMaxPrice(result.maxPrice);
        setDeduction(result.deduction);
        setValidRules(result.validRules);
      } else {
        setParseError('解析失败，请检查 API 配置或原文格式');
      }
    } catch (err) {
      setParseError(`解析出错: ${err instanceof Error ? err.message : '未知错误'}`);
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className={`rounded-2xl p-6 space-y-5 border ${isDark ? 'bg-[#2A2A2A] border-[#3A3A3A]' : 'bg-[#F5EFE0] border-[#E8DCC8]'}`}>
      {/* 装饰条 */}
      <div className="flex items-center gap-5">
        <div className={`w-1.5 h-4.5 rounded-[3px] flex-shrink-0 ${isDark ? 'bg-[#A89880]' : 'bg-[#D4C4A8]'}`} />
        <h3 className={`font-semibold text-[15px] ${isDark ? 'text-[#E8E0D0]' : 'text-text'}`}>
          {algorithm === 'trimmed_mean' && '去极值平均法 · 参数配置'}
          {algorithm === 'remove_highest' && '去最高平均法 · 参数配置'}
          {algorithm === 'second_lowest' && '次低报价法 · 参数配置'}
          {algorithm === 'weighted_limit' && '随机权重法 · 参数配置'}
          {algorithm === 'arithmetic_mean' && '算术平均法 · 参数配置'}
          {algorithm === 'custom' && '手动指定 · 参数配置'}
          {algorithm === 'ai_parse' && 'AI 智能解析'}
          {algorithm === 'lowest_price' && '最低价法 · 参数配置'}
          {algorithm === 'double_average' && '二次平均法 · 参数配置'}
        </h3>
      </div>

      {/* K值设置 */}
      <div className="flex items-center gap-4">
        <span className={`text-[13px] ${isDark ? 'text-[#A89880]' : 'text-text-secondary'}`}>启用 K 值调整</span>
        <button
          onClick={() => setKEnabled(!kEnabled)}
          className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 cursor-pointer ${
            kEnabled ? 'bg-primary' : isDark ? 'bg-[#3A3A3A]' : 'bg-border-light'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform flex items-center justify-center ${
              kEnabled ? 'translate-x-5' : ''
            }`}
          />
        </button>
      </div>

      {kEnabled && (
        <div>
          <label className="block text-text-secondary text-xs mb-1">K 值 (基准价 × K)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="2"
            value={kValue}
            onChange={(e) => setKValue(parseFloat(e.target.value) || 0)}
            className={`input-field w-full text-sm ${isDark ? 'bg-[#1A1A1A] border-[#3A3A3A] text-[#E8E0D0]' : ''}`}
          />
        </div>
      )}

      {/* 去极值平均法参数 */}
      {algorithm === 'trimmed_mean' && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-text-secondary text-xs mb-1">去掉最高 (%)</label>
            <input
              type="number"
              step="1"
              min="0"
              max="50"
              value={trimHighPercent}
              onChange={(e) => setTrimHighPercent(parseFloat(e.target.value) || 0)}
              className={`input-field w-full text-sm ${isDark ? 'bg-[#1A1A1A] border-[#3A3A3A] text-[#E8E0D0]' : ''}`}
            />
          </div>
          <div>
            <label className="block text-text-secondary text-xs mb-1">去掉最低 (%)</label>
            <input
              type="number"
              step="1"
              min="0"
              max="50"
              value={trimLowPercent}
              onChange={(e) => setTrimLowPercent(parseFloat(e.target.value) || 0)}
              className={`input-field w-full text-sm ${isDark ? 'bg-[#1A1A1A] border-[#3A3A3A] text-[#E8E0D0]' : ''}`}
            />
          </div>
        </div>
      )}

      {/* 去最高平均法参数 */}
      {algorithm === 'remove_highest' && (
        <div>
          <label className="block text-text-secondary text-xs mb-1">去掉最高 N 个报价</label>
          <input
            type="number"
            step="1"
            min="1"
            max="10"
            value={removeHighestN}
            onChange={(e) => setRemoveHighestN(parseFloat(e.target.value) || 1)}
            className="input-field w-full text-sm"
          />
        </div>
      )}

      {/* 次低报价法参数 */}
      {algorithm === 'second_lowest' && (
        <div>
          <label className="block text-text-secondary text-xs mb-1">取第 N 低报价</label>
          <input
            type="number"
            step="1"
            min="2"
            max="10"
            value={nthLowest}
            onChange={(e) => setNthLowest(parseFloat(e.target.value) || 2)}
            className="input-field w-full text-sm"
          />
        </div>
      )}

      {/* 随机权重法参数 */}
      {algorithm === 'weighted_limit' && (
        <>
          <div>
            <label className="block text-text-secondary text-xs mb-1">Q1 权重 (%)</label>
            <input
              type="number"
              step="1"
              min="0"
              max="100"
              value={q1Weight}
              onChange={(e) => setQ1Weight(parseFloat(e.target.value) || 0)}
              className={`input-field w-full text-sm ${isDark ? 'bg-[#1A1A1A] border-[#3A3A3A] text-[#E8E0D0]' : ''}`}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-text-secondary text-xs mb-1">K1</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="2"
                value={k1}
                onChange={(e) => setK1(parseFloat(e.target.value) || 0)}
                className={`input-field w-full text-sm ${isDark ? 'bg-[#1A1A1A] border-[#3A3A3A] text-[#E8E0D0]' : ''}`}
              />
            </div>
            <div>
              <label className="block text-text-secondary text-xs mb-1">K2</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="2"
                value={k2}
                onChange={(e) => setK2(parseFloat(e.target.value) || 0)}
                className={`input-field w-full text-sm ${isDark ? 'bg-[#1A1A1A] border-[#3A3A3A] text-[#E8E0D0]' : ''}`}
              />
            </div>
          </div>
          <div>
            <label className="block text-text-secondary text-xs mb-1">最高限价</label>
            <input
              type="number"
              step="1"
              min="0"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseFloat(e.target.value) || 0)}
              className={`input-field w-full text-sm ${isDark ? 'bg-[#1A1A1A] border-[#3A3A3A] text-[#E8E0D0]' : ''}`}
            />
          </div>
        </>
      )}

      {/* 手动指定参数 */}
      {algorithm === 'custom' && (
        <div>
          <label className="block text-text-secondary text-xs mb-1">自定义基准价</label>
          <input
            type="number"
            step="1"
            min="0"
            value={customBasePrice}
            onChange={(e) => setCustomBasePrice(parseFloat(e.target.value) || 0)}
            className="input-field w-full text-sm"
          />
        </div>
      )}

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
            解析后自动填充算法参数，请在右侧预览确认
          </p>
        </div>
      )}
    </div>
  );
}
