export type Category = 'fr-ca' | 'darija' | 'code-switch' | 'noise';
export interface Fixture {
  id: string;
  category: Category;
  reference: string;
  condition: string | null;
}

export const thresholds: Record<Category, number> = {
  'fr-ca': 0.15, darija: 0.25, 'code-switch': 0.25, noise: 0.30
};

/** The reviewed Markdown is the single source of fixture text. */
export function parseFixtures(markdown: string): Fixture[] {
  const fixtures: Fixture[] = [];
  const groups = { FQ: ['fr-ca', 15], DJ: ['darija', 15], CS: ['code-switch', 10], NZ: ['noise', 10] } as const;
  for (const line of markdown.split(/\r?\n/u)) {
    const cells = line.split('|').map(cell => cell.trim());
    const match = /^(FQ|DJ|CS|NZ)(\d{2})$/u.exec(cells[1] ?? '');
    if (!match) continue;
    const prefix = match[1] as keyof typeof groups;
    const [category, count] = groups[prefix];
    const number = Number(match[2]);
    const noise = prefix === 'NZ';
    const reference = cells[noise ? 4 : 3];
    if (number < 1 || number > count || !reference || cells.length !== (noise ? 6 : 5)) {
      throw new Error('INVALID_FIXTURE_ROW');
    }
    if (fixtures.some(f => f.id === cells[1])) throw new Error('DUPLICATE_FIXTURE');
    fixtures.push({ id: cells[1], category, reference,
      condition: noise ? `${cells[2]} — ${cells[3]}` : null });
  }
  if (fixtures.length !== 50) throw new Error('EXPECTED_50_FIXTURES');
  return fixtures;
}
