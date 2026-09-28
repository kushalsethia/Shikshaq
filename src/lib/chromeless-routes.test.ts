import { describe, expect, it } from 'vitest';

import { isChromelessPath, isFooterlessPath } from './chromeless-routes';

describe('isFooterlessPath', () => {
  it('drops the footer and pre-footer on the paper checker only', () => {
    expect(isFooterlessPath('/checker')).toBe(true);
    expect(isFooterlessPath('/checker/')).toBe(true);
    expect(isFooterlessPath('/')).toBe(false);
    expect(isFooterlessPath('/past-papers')).toBe(false);
    expect(isFooterlessPath('/checkers')).toBe(false);
  });

  it('keeps the checker out of the chromeless list, so its top nav stays', () => {
    expect(isChromelessPath('/checker')).toBe(false);
  });
});
