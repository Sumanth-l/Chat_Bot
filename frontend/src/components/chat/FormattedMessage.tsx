import type { ReactNode } from 'react';

const greekAndMathCommands: Record<string, string> = {
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', epsilon: 'ε', theta: 'θ',
  lambda: 'λ', mu: 'μ', pi: 'π', rho: 'ρ', sigma: 'σ', phi: 'φ', omega: 'ω',
  Gamma: 'Γ', Delta: 'Δ', Theta: 'Θ', Lambda: 'Λ', Pi: 'Π', Sigma: 'Σ', Phi: 'Φ', Omega: 'Ω',
  times: '×', cdot: '·', div: '÷', pm: '±', neq: '≠', le: '≤', leq: '≤', ge: '≥', geq: '≥',
  approx: '≈', equiv: '≡', infty: '∞',rightarrow: '→', leftarrow: '←', degree: '°',
  sin: 'sin', cos: 'cos', tan: 'tan', log: 'log', ln: 'ln', sum: '∑', prod: '∏', int: '∫',
};

const superscriptMap: Record<string, string> = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '+': '⁺', '-': '⁻', n: 'ⁿ', i: 'ⁱ' };
const subscriptMap: Record<string, string> = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉', '+': '₊', '-': '₋', i: 'ᵢ', n: 'ₙ' };

function formatMath(source: string) {
  return source
    .replace(/\\(?:left|right)\b/g, '')
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1)/($2)')
    .replace(/\\sqrt\{([^{}]+)\}/g, '√($1)')
    .replace(/\\(?:mathrm|text|operatorname)\{([^{}]+)\}/g, '$1')
    .replace(/\\([A-Za-z]+)|\\([{}])/g, (_match, command: string | undefined, brace: string | undefined) => {
      if (brace) return brace;
      if (command === 'quad' || command === 'qquad') return ' ';
      return greekAndMathCommands[command!] ?? command;
    })
    .replace(/\\[,;!]/g, ' ')
    .replace(/\^\{?([0-9a-z+-]+)\}?/gi, (_match, value: string) => [...value].map((character) => superscriptMap[character] ?? character).join(''))
    .replace(/_\{?([0-9a-z+-]+)\}?/gi, (_match, value: string) => [...value].map((character) => subscriptMap[character] ?? character).join(''))
    .replace(/[{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function InlineMath({ expression, display = false }: { expression: string; display?: boolean }) {
  const Tag = display ? 'div' : 'span';
  return (
    <Tag
      role="math"
      aria-label={expression}
      className={display
        ? 'my-5 block overflow-x-auto border-l-4 border-[#2563EB] bg-blue-50/70 px-5 py-4 font-serif text-lg italic text-blue-950'
        : 'mx-0.5 inline-block rounded-sm bg-blue-50 px-1.5 font-serif italic text-blue-950'}
    >
      {formatMath(expression)}
    </Tag>
  );
}

function renderInline(source: string, keyPrefix: string): ReactNode[] {
  const tokenPattern = /(`[^`\n]+`|\$\$[^$]+\$\$|\$[^$\n]+\$|\*\*[^*]+\*\*|__[^_]+__|~~[^~]+~~|\*[^*\n]+\*|_[^_\n]+_|\[[^\]]+\]\([^)]+\))/g;
  const nodes: ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = tokenPattern.exec(source)) !== null) {
    if (match.index > cursor) nodes.push(source.slice(cursor, match.index));
    const token = match[0];
    const key = `${keyPrefix}-${index++}`;

    if (token.startsWith('`')) {
      nodes.push(<code key={key} className="rounded-sm border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-[0.9em] text-blue-900">{token.slice(1, -1)}</code>);
    } else if (token.startsWith('$$')) {
      nodes.push(<InlineMath key={key} expression={token.slice(2, -2)} />);
    } else if (token.startsWith('$')) {
      nodes.push(<InlineMath key={key} expression={token.slice(1, -1)} />);
    } else if (token.startsWith('**') || token.startsWith('__')) {
      nodes.push(<strong key={key} className="font-bold text-slate-950">{renderInline(token.slice(2, -2), key)}</strong>);
    } else if (token.startsWith('~~')) {
      nodes.push(<del key={key}>{renderInline(token.slice(2, -2), key)}</del>);
    } else if (token.startsWith('*') || token.startsWith('_')) {
      nodes.push(<em key={key}>{renderInline(token.slice(1, -1), key)}</em>);
    } else {
      const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
      if (!link) nodes.push(token);
      else {
        const [, label, destination] = link;
        const safeUrl = /^(https?:|mailto:)/i.test(destination) ? destination : null;
        nodes.push(safeUrl
          ? <a key={key} href={safeUrl} target="_blank" rel="noreferrer" className="font-semibold text-blue-700 underline decoration-blue-300 underline-offset-2 hover:text-blue-900">{label}</a>
          : label);
      }
    }
    cursor = match.index + token.length;
  }

  if (cursor < source.length) nodes.push(source.slice(cursor));
  return nodes;
}

function isBlockStart(lines: string[], index: number) {
  const line = lines[index].trim();
  return /^(#{1,6})\s+/.test(line)
    || /^```/.test(line)
    || /^\s*>/.test(line)
    || /^(?:[-*_]\s*){3,}$/.test(line)
    || /^\s*(?:[-+*]|\d+[.)])\s+/.test(line)
    || (line.startsWith('$$') && (line.endsWith('$$') || lines.slice(index + 1).some((item) => item.trim().endsWith('$$'))))
    || (index + 1 < lines.length && line.includes('|') && /^\s*\|?\s*:?-{3,}/.test(lines[index + 1]));
}

function cellText(cell: string) {
  return cell.trim().replace(/^:?-+:?$/, '').trim();
}

function splitTableRow(line: string) {
  return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(cellText);
}

export default function FormattedMessage({ content }: { content: string }) {
  const lines = content.replace(/\r\n?/g, '\n').split('\n');
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) { index++; continue; }

    if (line.startsWith('```')) {
      const language = line.slice(3).trim();
      const code: string[] = [];
      index++;
      while (index < lines.length && !lines[index].trim().startsWith('```')) code.push(lines[index++]);
      if (index < lines.length) index++;
      blocks.push(
        <div key={`code-${index}`} className="my-5 overflow-hidden border-2 border-slate-800 bg-[#0F172A] text-slate-100 shadow-[3px_3px_0_#111827]">
          {language && <div className="border-b border-slate-700 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">{language}</div>}
          <pre className="overflow-x-auto p-4 text-[12px] leading-6 sm:text-[13px]"><code>{code.join('\n')}</code></pre>
        </div>,
      );
      continue;
    }

    if (line.startsWith('$$')) {
      const expression = line.slice(2).endsWith('$$')
        ? line.slice(2, -2)
        : (() => {
          const contentLines = [line.slice(2)];
          index++;
          while (index < lines.length && !lines[index].includes('$$')) contentLines.push(lines[index++]);
          if (index < lines.length) contentLines.push(lines[index].slice(0, lines[index].indexOf('$$')));
          return contentLines.join(' ');
        })();
      blocks.push(<InlineMath key={`math-${index}`} expression={expression} display />);
      index++;
      continue;
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      const classes = level <= 2
        ? 'mt-7 mb-3 text-xl font-black tracking-[-0.045em] text-slate-950 first:mt-0 sm:text-2xl'
        : 'mt-6 mb-2.5 text-base font-extrabold tracking-[-0.025em] text-slate-950 first:mt-0 sm:text-lg';
      blocks.push(<h3 key={`heading-${index}`} className={classes}>{renderInline(heading[2], `heading-${index}`)}</h3>);
      index++;
      continue;
    }

    if (/^(?:[-*_]\s*){3,}$/.test(line)) {
      blocks.push(<hr key={`rule-${index}`} className="my-6 border-0 border-t-2 border-slate-200" />);
      index++;
      continue;
    }

    if (line.startsWith('>')) {
      const quote: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith('>')) quote.push(lines[index++].trim().replace(/^>\s?/, ''));
      blocks.push(<blockquote key={`quote-${index}`} className="my-4 border-l-4 border-[#2563EB] bg-slate-50 py-2 pl-4 text-slate-700">{quote.map((item, quoteIndex) => <p key={quoteIndex} className="my-1">{renderInline(item, `quote-${index}-${quoteIndex}`)}</p>)}</blockquote>);
      continue;
    }

    const listItem = /^\s*((?:[-+*])|(\d+)[.)])\s+(.*)$/.exec(lines[index]);
    if (listItem) {
      const ordered = Boolean(listItem[2]);
      const items: string[] = [];
      while (index < lines.length) {
        const currentItem = /^\s*((?:[-+*])|(\d+)[.)])\s+(.*)$/.exec(lines[index]);
        if (!currentItem || Boolean(currentItem[2]) !== ordered) break;
        items.push(currentItem[3]);
        index++;
      }
      const List = ordered ? 'ol' : 'ul';
      blocks.push(<List key={`list-${index}`} className={`my-4 space-y-2 pl-6 marker:text-[#2563EB] ${ordered ? 'list-decimal' : 'list-disc'}`}>{items.map((item, itemIndex) => <li key={itemIndex} className="pl-1 leading-7">{renderInline(item, `list-${index}-${itemIndex}`)}</li>)}</List>);
      continue;
    }

    if (index + 1 < lines.length && line.includes('|') && /^\s*\|?\s*:?-{3,}/.test(lines[index + 1])) {
      const headers = splitTableRow(line);
      index += 2;
      const rows: string[][] = [];
      while (index < lines.length && lines[index].includes('|') && lines[index].trim()) rows.push(splitTableRow(lines[index++]));
      blocks.push(<div key={`table-${index}`} className="my-5 overflow-x-auto border-2 border-slate-200"><table className="w-full border-collapse text-left text-sm"><thead className="bg-slate-100"><tr>{headers.map((cell, cellIndex) => <th key={cellIndex} className="border-b-2 border-slate-300 px-3 py-2.5 font-extrabold">{renderInline(cell, `table-head-${index}-${cellIndex}`)}</th>)}</tr></thead><tbody>{rows.map((row, rowIndex) => <tr key={rowIndex} className="odd:bg-white even:bg-slate-50">{headers.map((_, cellIndex) => <td key={cellIndex} className="border-b border-slate-200 px-3 py-2.5">{renderInline(row[cellIndex] ?? '', `table-${index}-${rowIndex}-${cellIndex}`)}</td>)}</tr>)}</tbody></table></div>);
      continue;
    }

    const paragraph = [line];
    index++;
    while (index < lines.length && lines[index].trim() && !isBlockStart(lines, index)) paragraph.push(lines[index++].trim());
    blocks.push(<p key={`paragraph-${index}`} className="my-3 leading-7 text-slate-800 first:mt-0 last:mb-0">{renderInline(paragraph.join(' '), `paragraph-${index}`)}</p>);
  }

  return <div className="assistant-markdown min-w-0">{blocks}</div>;
}
