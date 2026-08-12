import { CalcResult, UnitScore } from '../types';

export function exportCSV(result: CalcResult, unitScores?: UnitScore[]): void {
  const BOM = '\uFEFF';
  const includeTotal = !!unitScores && unitScores.length > 0;
  const headers = ['排名', '单位名称', '报价', '是否有效', '偏差率(%)', '价格得分', ...(includeTotal ? ['商务得分', '技术得分', '总分'] : []), '与基准价差'];
  const rows = result.rankings.map((r) => {
    const us = includeTotal ? unitScores!.find((u) => u.unitId === r.unit.id) : null;
    return [
      r.rank,
      r.unit.name,
      r.unit.price,
      r.unit.isValid ? '有效' : '无效',
      r.deviationPercent,
      r.score,
      ...(includeTotal ? [us?.businessScore ?? 0, us?.technicalScore ?? 0, us ? parseFloat((us.priceScore + us.businessScore + us.technicalScore).toFixed(2)) : ''] : []),
      r.priceDiff,
    ];
  });

  const csv = BOM + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `投标报价结果_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportMarkdown(result: CalcResult, unitScores?: UnitScore[]): void {
  const includeTotal = !!unitScores && unitScores.length > 0;
  const lines: string[] = [
    `# 投标报价测算结果`,
    '',
    `**基准价：** ${result.basePrice.toLocaleString()}  |  **A 值：** ${result.aValue.toLocaleString()}  |  **有效家数：** ${result.effectiveCount}`,
    '',
    `| 排名 | 单位名称 | 报价 | 是否有效 | 偏差率(%) | 价格得分 ${includeTotal ? '| 商务得分 | 技术得分 | 总分 ' : ''}| 与基准价差 |`,
    `|:---:|:---|---:|:---:|---:|---:${includeTotal ? '|:---:|:---:|:---:' : ''}|---:|`,
  ];
  for (const r of result.rankings) {
    const rankBadge = r.rank === 1 ? '🥇' : r.rank === 2 ? '🥈' : r.rank === 3 ? '🥉' : `#${r.rank}`;
    const us = includeTotal ? unitScores!.find((u) => u.unitId === r.unit.id) : null;
    const totalStr = us ? parseFloat((us.priceScore + us.businessScore + us.technicalScore).toFixed(2)) : '';
    lines.push(
      `| ${rankBadge} ${r.rank} | ${r.unit.name || '未命名'} | ${r.unit.price.toLocaleString()} | ${r.unit.isValid ? '有效' : '无效'} | ${r.deviationPercent > 0 ? '+' : ''}${r.deviationPercent}% | **${r.score}** ${includeTotal ? `| ${us?.businessScore ?? 0} | ${us?.technicalScore ?? 0} | **${totalStr}** ` : ''}| ${r.priceDiff > 0 ? '+' : ''}${r.priceDiff.toLocaleString()} |`
    );
  }
  lines.push('');
  const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `投标报价结果_${new Date().toISOString().slice(0, 10)}.md`;
  a.click();
  URL.revokeObjectURL(url);
}