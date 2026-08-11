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
  } = useConfigStore();
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState('');

  const handleParse = async () => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement | null;
    const text = textarea?.value || '';
    if (!text) return;

    const { apiKey, apiEndpoint } = useConfigStore.getState();
    if (!apiKey) {
      setParseError('请先在设置中配置 API Key');
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
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <h3 className="font-semibold text-text text-sm">算法参数</h3>

      {/* K值设置 */}
      <div className="flex items-center justify-between">
        <span className="text-text-secondary text-sm">启用 K 值调整</span>
        <button
          onClick={() => setKEnabled(!kEnabled)}
          className={`relative w-11 h-6 rounded-full transition-colors ${
            kEnabled ? 'bg-primary' : 'bg-border-light'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
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
            className="input-field w-full text-sm"
          />
        </div>
      )}

      {/* 去极值平均法参数 */}
      {algorithm === 'trimmed_mean' && (
        <>
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
                className="input-field w-full text-sm"
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
                className="input-field w-full text-sm"
              />
            </div>
          </div>
        </>
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
              className="input-field w-full text-sm"
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
                className="input-field w-full text-sm"
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
                className="input-field w-full text-sm"
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
              className="input-field w-full text-sm"
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
          <label className="block text-text-secondary text-xs mb-1">上传招标文件或粘贴文本</label>
          <textarea
            ref={(el) => {
              if (el) {
                const ta = el;
                Object.assign(ta, { _autosize: true });
              }
            }}
            rows={4}
            placeholder="请粘贴招标文件中的报价计算方法描述，AI 将自动解析并配置参数..."
            className="input-field w-full text-sm resize-none"
          />
          <button
            onClick={handleParse}
            disabled={isParsing}
            className="mt-2 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isParsing ? (
              <>
                <i className="ri-loader-4-line animate-spin w-4 h-4"></i>
                解析中...
              </>
            ) : (
              <>
                <i className="ri-file-text-line"></i>
                AI 智能解析
              </>
            )}
          </button>
          {parseError && (
            <p className="mt-2 text-sm text-red-500">{parseError}</p>
          )}
        </div>
      )}
    </div>
  );
}
