import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { BOARDS, STATES, SUBJECTS } from './details';

/**
 * The database checks every chapter ID against the board and subject it was sent with (game_codes_match in the
 * migration), so its lists must be exactly the ones the page uses to make the IDs.
 */
describe('the database knows the same codes (20261010120000_game_questions.sql)', () => {
  it('lists every board and subject with the code the site gives it', () => {
    const sql = readFileSync('supabase/migrations/20261010120000_game_questions.sql', 'utf8');
    const list = (name: string) => {
      const m = sql.match(new RegExp(`${name}\\(name, code\\) as \\(values([\\s\\S]*?)\\n  \\)`));
      return [...(m?.[1] ?? '').matchAll(/\('((?:[^']|'')+)', '([A-Z]+)'\)/g)].map((x) => `${x[1].replace(/''/g, "'")}=${x[2]}`);
    };
    expect(list('boards')).toEqual([...BOARDS.map((b) => `${b.name}=${b.code}`), ...STATES.map((s) => `${s.name} State Board=${s.code}`)]);
    expect(list('subjects')).toEqual(SUBJECTS.map((s) => `${s.name}=${s.code}`));
  });
});
