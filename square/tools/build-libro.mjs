// Builds square/libro.json from square/capitoli/*.md (front matter + Markdown body), sorted by "ordine".
// Run: node square/tools/build-libro.mjs   (the GitHub workflow runs it after every edit)
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'capitoli');

function parse(src) {
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { fm: {}, body: src };
  const fm = {};
  // join folded YAML lines (indented continuation lines) to their key
  const raw = [];
  for (const line of m[1].split(/\r?\n/)) {
    if (/^\s+\S/.test(line) && raw.length) raw[raw.length - 1] += ' ' + line.trim(); else raw.push(line);
  }
  for (const line of raw) {
    const k = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!k) continue;
    let v = k[2].trim();
    if (v === '' || v === '~' || v === 'null') { fm[k[1]] = ''; continue; }
    if (/^[>|][-+]?$/.test(v)) v = '';
    if (/^".*"$/.test(v)) v = JSON.parse(v);
    else if (/^'.*'$/.test(v)) v = v.slice(1, -1).replace(/''/g, "'");
    else if (v === 'true' || v === 'false') v = v === 'true';
    else if (/^-?\d+(\.\d+)?$/.test(v)) v = Number(v);
    fm[k[1]] = v;
  }
  return { fm, body: m[2] };
}

const items = readdirSync(dir).filter(f => f.endsWith('.md')).map(f => {
  const { fm, body } = parse(readFileSync(join(dir, f), 'utf8'));
  return { file: f, ...fm, body };
}).filter(x => x.bozza !== true)
  .sort((a, b) => (Number(a.ordine) || 0) - (Number(b.ordine) || 0) || a.file.localeCompare(b.file));

writeFileSync(join(root, 'libro.json'), JSON.stringify({ generato: new Date().toISOString(), parti: items }, null, 1));
console.log(`libro.json: ${items.length} parti`);
