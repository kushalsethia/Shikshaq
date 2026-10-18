import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';

import { PracticeRound } from '@/pages/CheckerPractice';
import { createPracticeApi } from '@/lib/checker-practice';

describe('practice round screen', () => {
  const html = renderToStaticMarkup(
    <MemoryRouter>
      <PracticeRound api={createPracticeApi()} onRestart={() => undefined} />
    </MemoryRouter>,
  );

  it('has no Undo last button (owner, 18 Oct 2026)', () => {
    expect(html).not.toContain('practice-undo');
    expect(html).not.toContain('Undo last');
  });

  it('starts on the first question of eleven', () => {
    expect(html).toContain('Question 1 of 11');
  });
});
