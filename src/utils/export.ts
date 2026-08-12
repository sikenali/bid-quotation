import { CalcResult } from '../types';

export function exportCSV(result: CalcResult): void {
  const BOM = '\uFEFF';
  const headers = ['排名', '单位名称', '报价', '是否有效', '偏差率(%)', '得分', '与基准价差'];
  const rows = result.rankings.map((r) => [
    r.rank,
    r.unit.name,
    r.unit.price,
    r.unit.isValid ? '有效' : '无效',
    r.deviationPercent,
    r.score,
    r.priceDiff,
  ]);

  const csv = BOM + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `投标报价结果_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportMarkdown(result: CalcResult): void {
  const lines: string[] = [
    `# 投标报价测算结果`,
    '',
    `**基准价：** ${result.basePrice.toLocaleString()}  |  **A 值：** ${result.aValue.toLocaleString()}  |  **有效家数：** ${result.effectiveCount}`,
    '',
    '| 排名 | 单位名称 | 报价 | 是否有效 | 偏差率(%) | 得分 | 与基准价差 |',
    '|:---:|:---|---:|:---:|---:|---:|---:|',
  ];
  for (const r of result.rankings) {
    const rankBadge = r.rank === 1 ? '🥇' : r.rank === 2 ? '🥈' : r.rank === 3 ? '🥉' : `#${r.rank}`;
    lines.push(
      `| ${rankBadge} ${r.rank} | ${r.unit.name || '未命名'} | ${r.unit.price.toLocaleString()} | ${r.unit.isValid ? '有效' : '无效'} | ${r.deviationPercent > 0 ? '+' : ''}${r.deviationPercent}% | **${r.score}** | ${r.priceDiff > 0 ? '+' : ''}${r.priceDiff.toLocaleString()} |`
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

