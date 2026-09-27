export const NORMALIZATION_VERSION = 'p0-fixtures-v1';

/** Deliberately narrow, published number lexicon for the locked FQ10/DJ10 corpus.
 * No translation, accent stripping or Arabic letter folding is performed.
 */
export function normalizeForWer(text: string): string[] {
  const normalized = text.normalize('NFKC').toLowerCase()
    .replace(/[٠-٩]/gu, digit => String(digit.charCodeAt(0) - 0x660))
    .replace(/[۰-۹]/gu, digit => String(digit.charCodeAt(0) - 0x6f0))
    .replace(/\p{P}/gu, ' ').trim();
  if (!normalized) return [];
  return normalized.split(/\s+/u).map(word => ['dix', 'عشرة', 'العشرة'].includes(word) ? '10' : word);
}

export function wordErrorRate(reference: string, hypothesis: string) {
  const ref = normalizeForWer(reference);
  const hyp = normalizeForWer(hypothesis);
  if (!ref.length || ref.length > 2000 || hyp.length > 2000) throw new Error('WER_TOKEN_LIMIT');
  type Cell = { substitutions: number; deletions: number; insertions: number; errors: number };
  let previous: Cell[] = Array.from({ length: hyp.length + 1 }, (_, n) =>
    ({ substitutions: 0, deletions: 0, insertions: n, errors: n }));
  for (let i = 1; i <= ref.length; i++) {
    const current: Cell[] = [{ substitutions: 0, deletions: i, insertions: 0, errors: i }];
    for (let j = 1; j <= hyp.length; j++) {
      if (ref[i - 1] === hyp[j - 1]) { current.push(previous[j - 1]); continue; }
      const sub = previous[j - 1];
      const del = previous[j];
      const ins = current[j - 1];
      // Stable tie break: substitution, deletion, insertion.
      const candidates = [
        { ...sub, substitutions: sub.substitutions + 1, errors: sub.errors + 1 },
        { ...del, deletions: del.deletions + 1, errors: del.errors + 1 },
        { ...ins, insertions: ins.insertions + 1, errors: ins.errors + 1 }
      ];
      current.push(candidates.reduce((best, cell) => cell.errors < best.errors ? cell : best));
    }
    previous = current;
  }
  return { ...previous[hyp.length], referenceWords: ref.length, hypothesisWords: hyp.length,
    wer: previous[hyp.length].errors / ref.length };
}
