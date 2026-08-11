import React from 'react';
import { useConfigStore } from '../stores/configStore';

export function AlgorithmParams() {
  const { config, setConfig } = useConfigStore();
  const {
    algorithm,
    kEnabled,
    kValue,
    trimHighPercent,
    trimLowPercent,
    removeHighestN,
    nthLowest,
    q1Weight,
    k1,
    k2,
    maxPrice,
    customBasePrice,
  } = config;

  const update = (partial: Partial<typeof config>) => setConfig(partial);

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      <h3 className="font-semibold text-text text-sm">算法参数</h3>

      {/* K值设置 */}
      <div className="flex items-center justify-between">
        <span className="text-text-secondary text-sm">启用 K 值调整</span>
        <button
          onClick={() => update({ kEnabled: !kEnabled })}
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
            onChange={(e) => update({ kValue: parseFloat(e.target.value) || 0 })}
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
                onChange={(e) => update({ trimHighPercent: parseFloat(e.target.value) || 0 })}
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
                onChange={(e) => update({ trimLowPercent: parseFloat(e.target.value) || 0 })}
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
            onChange={(e) => update({ removeHighestN: parseFloat(e.target.value) || 1 })}
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
            onChange={(e) => update({ nthLowest: parseFloat(e.target.value) || 2 })}
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
              onChange={(e) => update({ q1Weight: parseFloat(e.target.value) || 0 })}
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
                onChange={(e) => update({ k1: parseFloat(e.target.value) || 0 })}
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
                onChange={(e) => update({ k2: parseFloat(e.target.value) || 0 })}
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
              onChange={(e) => update({ maxPrice: parseFloat(e.target.value) || 0 })}
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
            onChange={(e) => update({ customBasePrice: parseFloat(e.target.value) || 0 })}
            className="input-field w-full text-sm"
          />
        </div>
      )}

      {/* AI 解析 */}
      {algorithm === 'ai_parse' && (
        <div>
          <label className="block text-text-secondary text-xs mb-1">上传招标文件或粘贴文本</label>
          <textarea
            rows={4}
            placeholder="请粘贴招标文件中的报价计算方法描述，AI 将自动解析并配置参数..."
            className="input-field w-full text-sm resize-none"
          />
          <button
            onClick={() => console.log('handleParse placeholder')}
            className="mt-2 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            AI 智能解析
          </button>
        </div>
      )}
    </div>
  );
}
