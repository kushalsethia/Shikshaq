import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChangesChip, ChangesPanel, ChangesSection, MarksInsideHint, QuestionChips, ToolsRow, ToolsToolbar, toolTooltip } from '@/components/checker/TypedBits';
import { PartCard } from '@/components/checker/PartCard';
import { OtherParts, otherPartsCount } from '@/components/checker/CheckerBits';
import { assembleQuestionContext, type ContextRow } from '@/lib/checker-context';
import { PanelTabs, PrintedFrame, TypedFrame } from '@/components/checker/Panels';
import { CHECKER_TOOLS } from '@/lib/checker-tools';

// Rendered with renderToStaticMarkup (no jsdom in this project's tests). The
// open/closed behaviour of the changes section is client state, so what is
// pinned here is what is on screen to begin with and the words used.

const noop = () => undefined;

describe('the two panels cannot be mixed up', () => {
  const typed = renderToStaticMarkup(<TypedFrame>x</TypedFrame>);
  const printed = renderToStaticMarkup(
    <PrintedFrame tourId="picture">
      x
    </PrintedFrame>,
  );

  it('labels the typed side as typed by the computer, in a plain neutral card', () => {
    expect(typed).toContain('Typed by the computer');
    expect(typed).toContain('What the computer typed');
    expect(typed).not.toContain('border-brand');
  });

  it('frames the printed side strongly and says it is a photo of the printed paper', () => {
    expect(printed).toContain('Photo of the printed paper');
    expect(printed).toContain('The printed paper');
    expect(printed).toContain('border-2 border-brand');
    expect(printed).toContain('data-tour="picture"');
  });

  it('uses radii from the scale, concentric: 20 outside, 10 inside', () => {
    expect(printed).toContain('rounded-[20px]');
    expect(printed).toContain('rounded-[10px]');
  });

  it('has two big tabs for a phone, Typed and Printed, that only show below lg', () => {
    const html = renderToStaticMarkup(<PanelTabs value="printed" onChange={noop} />);
    expect(html).toContain('role="tablist"');
    expect(html).toContain('lg:hidden');
    expect(html).toMatch(/aria-selected="true"[^>]*id="verify-tab-printed"|id="verify-tab-printed"[^>]*aria-selected="true"/);
    expect(html).toContain('Typed');
    expect(html).toContain('Printed');
  });
});

describe('question number and marks chips', () => {
  it('shows them as chips outside Fix mode', () => {
    const html = renderToStaticMarkup(
      <QuestionChips number="5(ii)" marks={2} editing={false} numberDraft="" marksDraft="" onNumber={noop} onMarks={noop} marksInvalid={false} />,
    );
    expect(html).toContain('Question 5(ii)');
    expect(html).toContain('2 marks');
    expect(html).not.toContain('<input');
  });

  it('says 1 mark, not 1 marks, and says plainly when there is none', () => {
    const one = renderToStaticMarkup(
      <QuestionChips number={null} marks={1} editing={false} numberDraft="" marksDraft="" onNumber={noop} onMarks={noop} marksInvalid={false} />,
    );
    expect(one).toContain('1 mark<');
    expect(one).toContain('No question number');
    const none = renderToStaticMarkup(
      <QuestionChips number="3" marks={null} editing={false} numberDraft="" marksDraft="" onNumber={noop} onMarks={noop} marksInvalid={false} />,
    );
    expect(none).toContain('No marks');
  });

  it('turns into labelled boxes in Fix mode', () => {
    const html = renderToStaticMarkup(
      <QuestionChips number="5" marks={2} editing numberDraft="5" marksDraft="2" onNumber={noop} onMarks={noop} marksInvalid={false} />,
    );
    expect(html).toContain('Question number');
    expect(html).toContain('Marks');
    expect((html.match(/<input/g) ?? []).length).toBe(2);
  });
});

describe('marks inside the text hint', () => {
  it('shows the hint and a Move marks out button when the marks are inside the text', () => {
    const html = renderToStaticMarkup(<MarksInsideHint body="Find x. [3]" currentMarks="" onMove={noop} />);
    expect(html).toContain('The marks are inside the text. Move them to the Marks box.');
    expect(html).toContain('Move marks out');
    expect(html).toContain('[3]');
  });

  it('says when the Marks box disagrees', () => {
    const html = renderToStaticMarkup(<MarksInsideHint body="Find x. [3]" currentMarks="2" onMove={noop} />);
    expect(html).toContain('The box says 2 now.');
  });

  it('shows nothing when the text has no marks token', () => {
    expect(renderToStaticMarkup(<MarksInsideHint body="Find x." currentMarks="3" onMove={noop} />)).toBe('');
    expect(renderToStaticMarkup(<MarksInsideHint body="(i) one [2] (ii) two [1]" currentMarks="" onMove={noop} />)).toBe('');
  });
});

describe('the tools row', () => {
  const html = renderToStaticMarkup(
    <ToolsRow active={null} available={{ fix: true, split: true, formula: true, or: false }} onPick={noop} />,
  );

  it('always shows all four tools, labelled in words', () => {
    for (const label of ['Fix the words', 'Split into two questions', 'Edit a formula', 'This is just the OR']) {
      expect(html).toContain(label);
    }
    expect((html.match(/data-testid="tool-/g) ?? []).length).toBe(4);
  });

  it('gives each tool a one line explanation as a tooltip, and the reason when it does not apply', () => {
    for (const t of CHECKER_TOOLS) {
      const text = t.id === 'or' ? t.unavailable : t.hint;
      expect(html).toContain(`title="${text}"`);
    }
  });

  it('keeps a tool that does not apply pressable (it explains itself) but marks it disabled for screen readers', () => {
    const or = html.slice(html.indexOf('data-testid="tool-or"') - 200, html.indexOf('data-testid="tool-or"') + 600);
    expect(or).toContain('aria-disabled="true"');
    expect(or).not.toMatch(/\sdisabled=""/);
  });

  it('makes every tool a real 44px target', () => {
    expect((html.match(/min-h-\[44px\]/g) ?? []).length).toBeGreaterThanOrEqual(4);
  });
});

describe('what the computer changed', () => {
  it('renders nothing for an older question with no change log and no first reading', () => {
    expect(renderToStaticMarkup(<ChangesSection source={{ page: 3 }} rawOcr={null} />)).toBe('');
    expect(renderToStaticMarkup(<ChangesSection source={null} rawOcr={undefined} />)).toBe('');
  });

  it('is there, collapsed and counted, when the pipeline wrote a change log', () => {
    const html = renderToStaticMarkup(
      <ChangesSection source={{ edit_log: [{ kind: 'joined_lines' }, { kind: 'fixed_ocr_word', from: 'rn', to: 'm' }] }} rawOcr="first reading" />,
    );
    expect(html).toContain('What the computer changed');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('>2<');
    // Closed to begin with: neither the list nor the first reading is on screen yet.
    expect(html).not.toContain('Joined broken lines');
    expect(html).not.toContain('first reading</');
  });

  it('is there for a question that only has a first reading', () => {
    expect(renderToStaticMarkup(<ChangesSection source={null} rawOcr="raw words" />)).toContain('What the computer changed');
  });
});

describe('wiring in the verify screen and the practice round', () => {
  const read = (p: string) => readFileSync(resolve(__dirname, p), 'utf8');
  const screen = read('./VerifyScreen.tsx');
  const practice = read('../../pages/CheckerPractice.tsx');

  it('uses the two frames, the phone tabs, the part card, the tools and the changes chip', () => {
    // The practice round keeps the older pieces (the tools row with its hint line, the full changes section).
    for (const piece of ['<TypedFrame', '<PrintedFrame', '<PanelTabs', '<QuestionChips', '<MarksInsideHint']) {
      expect(screen, piece).toContain(piece);
      expect(practice, piece).toContain(piece);
    }
    for (const piece of ['<PartCard', '<ToolsToolbar', '<ChangesChip', '<ChangesPanel', '<OtherParts', '<ShortcutsPopover', '<RulesInfo']) {
      expect(screen, piece).toContain(piece);
    }
    for (const piece of ['<ToolsRow', '<ChangesSection']) {
      expect(practice, piece).toContain(piece);
      expect(screen, piece).not.toContain(piece);
    }
  });

  it('opens on the typed words on a phone, and goes back to them on every new question', () => {
    // QA 2026-10-11 finding 6: on the Printed tab the words being checked were
    // hidden, and Looks right worked without them on screen.
    expect(screen).toContain("useState<PanelId>('typed')");
    // 12 Oct 2026 (bento ask): the tile you were on now stays for the next question,
    // except Fix, which goes back to the words (tileForNextQuestion, checker-bento.test.ts).
    expect(screen).toMatch(/setPanel\(\(p\) => tileForNextQuestion\(p\)\);\s+setShowPage\(false\)/);
    expect(practice).toContain("useState<PanelId>('typed')");
  });

  it('keeps Looks right, Fix it, Ask the HOD, Skip and Undo in the sticky footer', () => {
    const footer = screen.slice(screen.indexOf('Action footer'));
    for (const label of ['Looks right', 'Fix it', 'Ask the HOD', 'Skip this question', '{undoButton}']) {
      expect(footer).toContain(label);
    }
    expect(footer).toContain('sticky bottom-0');
  });

  it('draws the highlight only on the whole page, through the page viewer', () => {
    expect(screen).toContain('source={question.source}');
  });
});

describe('the tools toolbar', () => {
  const html = renderToStaticMarkup(
    <ToolsToolbar active="fix" available={{ fix: true, split: true, formula: true, or: false }} onPick={noop} />,
  );

  it('has an icon and a short label for each of the four tools', () => {
    for (const short of ['Fix words', 'Split', 'Formula', 'Just the OR']) expect(html).toContain(short);
    expect((html.match(/data-testid="tool-/g) ?? []).length).toBe(4);
    // One icon per button, drawn by the icon library and hidden from screen readers.
    expect((html.match(/<svg[^>]*aria-hidden="true"/g) ?? []).length).toBe(4);
  });

  it('names each tool in full for a screen reader, while the visible label is short', () => {
    for (const t of CHECKER_TOOLS) expect(html).toContain(`aria-label="${t.label}"`);
    expect(html).toContain('aria-label="Split into two questions"');
  });

  it('puts the long name and the key in the tooltip', () => {
    expect(toolTooltip('fix', true)).toMatch(/^Fix the words\. .* Key: F\.$/);
    expect(toolTooltip('split', true)).toMatch(/^Split into two questions\. .* Key: S\.$/);
    expect(toolTooltip('formula', true)).not.toContain('Key:');
    // A tool that does not apply says why instead.
    expect(toolTooltip('or', false)).toContain('only for a row that is nothing but the word OR');
    for (const t of CHECKER_TOOLS) expect(html).toContain(`title="${toolTooltip(t.id, t.id !== 'or')}"`);
  });

  it('is at least 44px tall and shows which tool is open', () => {
    expect((html.match(/min-h-\[52px\]/g) ?? []).length).toBe(4);
    const fix = html.slice(html.indexOf('data-testid="tool-fix"') - 60, html.indexOf('data-testid="tool-split"'));
    expect(fix).toContain('aria-pressed="true"');
    expect(fix).toContain('bg-panel');
    expect(html.match(/aria-pressed="false"/g)).toHaveLength(3);
  });

  it('keeps a tool that does not apply pressable but marked disabled for screen readers', () => {
    const or = html.slice(html.indexOf('data-testid="tool-or"') - 60);
    expect(or).toContain('aria-disabled="true"');
    expect(or).not.toMatch(/\sdisabled=""/);
  });

  it('has no hint line and no Tools label eating a row', () => {
    expect(html).not.toContain('id="tool-hint"');
    expect(html).not.toContain('Point at a tool');
  });
});

describe('the part card is one card that edits in place', () => {
  const read = renderToStaticMarkup(<PartCard mode="read" body="Find the value of x." options={null} changesChip={<i>chip</i>} />);
  const edit = renderToStaticMarkup(
    <PartCard mode="edit" body="Find the value of x." options={null} changesChip={<i>chip</i>} editFooter={<b>footer</b>} />,
  );

  it('reads as a card with the Typed by the computer badge on it and the words large', () => {
    expect(read).toContain('data-testid="part-card"');
    expect(read).toContain('data-mode="read"');
    expect(read).toContain('Typed by the computer');
    // The words go through MathText (which may scramble glyphs for capture protection), so only the wrapper is pinned.
    expect(read).toContain('break-words text-[18px]');
    expect(read).not.toContain('Editing');
    expect(read).not.toContain('<textarea');
  });

  it('turns into the editor in the same card: same text, an Editing badge, a ring, the footer attached', () => {
    expect((edit.match(/data-testid="part-card"/g) ?? []).length).toBe(1);
    expect(edit).toContain('data-mode="edit"');
    expect(edit).toContain('Editing');
    expect(edit).toContain('Typed by the computer');
    expect(edit).toContain('ring-2 ring-brand');
    expect(edit).toContain('<textarea');
    expect(edit).toContain('footer');
    // The same words are on the page once: no second box with a copy.
    expect(edit.split('Find the value of x.').length - 1).toBe(1);
  });

  it('shows Show code as a small text link and keeps the changes chip on the same card', () => {
    expect(edit).toContain('data-testid="show-code"');
    expect(edit).toMatch(/data-testid="show-code"[^>]*underline|underline[^>]*data-testid="show-code"/);
    expect(edit).toContain('chip');
    expect(read).toContain('chip');
  });

  it('turns into the place to choose a split in the same card', () => {
    const split = renderToStaticMarkup(
      <PartCard mode="split" body="a b" options={null} splitBody={<u>pick</u>} splitFooter={<s>preview</s>} />,
    );
    expect(split).toContain('data-mode="split"');
    expect(split).toContain('Splitting');
    expect(split).toContain('pick');
    expect(split).toContain('preview');
    expect((split.match(/data-testid="part-card"/g) ?? []).length).toBe(1);
  });
});

describe('the changes chip', () => {
  const source = { edit_log: [{ kind: 'joined_lines' }, { kind: 'fixed_ocr_word', from: 'rn', to: 'm' }] };

  it('is a small counted chip, closed to begin with, and nothing when there is nothing to show', () => {
    const html = renderToStaticMarkup(<ChangesChip source={source} rawOcr="first" open={false} onToggle={noop} />);
    expect(html).toContain('What the computer changed');
    expect(html).toContain('>2<');
    expect(html).toContain('aria-expanded="false"');
    expect(renderToStaticMarkup(<ChangesChip source={{ page: 3 }} rawOcr={null} open={false} onToggle={noop} />)).toBe('');
    expect(renderToStaticMarkup(<ChangesPanel source={{ page: 3 }} rawOcr={null} />)).toBe('');
  });

  it('opens a scrolling list inline', () => {
    const html = renderToStaticMarkup(<ChangesPanel source={source} rawOcr="first" />);
    expect(html).toContain('Joined broken lines');
    expect(html).toContain('max-h-48 overflow-y-auto');
  });
});

describe('the rest of the question is folded away under the card', () => {
  const rows: ContextRow[] = [
    { id: 'p', ord: 1, display_number: '3', number_path: '3', body: 'Read the passage.', options: null, source: null, is_current: false, is_parent: true, depth: 0 },
    { id: 'a', ord: 2, display_number: '(a)', number_path: '3.a', body: '(a) Name the river.', options: null, source: null, is_current: false, is_parent: false, depth: 1 },
    { id: 'b', ord: 3, display_number: '(b)', number_path: '3.b', body: '(b) Where does it rise?', options: null, source: null, is_current: true, is_parent: false, depth: 1 },
  ];
  const ctx = assembleQuestionContext(rows, 'b')!;

  it('counts the other parts and starts closed, with none of their words on screen', () => {
    expect(otherPartsCount(ctx)).toBe(2);
    const html = renderToStaticMarkup(<OtherParts context={ctx} />);
    expect(html).toContain('Other parts of this question');
    expect(html).toContain('(2)');
    expect(html).toContain('aria-expanded="false"');
    expect(html).not.toContain('Name the river');
    expect(html).not.toContain('Read the passage');
    expect(html).not.toContain('Where does it rise');
  });

  it('counts a single other part too', () => {
    const lone = assembleQuestionContext([{ ...rows[2], id: 'z' }, { ...rows[1], id: 'y', is_current: false }], 'z')!;
    expect(otherPartsCount(lone)).toBe(1);
    expect(renderToStaticMarkup(<OtherParts context={lone} />)).toContain('(1)');
  });
});

describe('the verify screen puts the computer text first', () => {
  const screen = readFileSync(resolve(__dirname, './VerifyScreen.tsx'), 'utf8');
  const left = screen.slice(screen.indexOf('const leftContent'), screen.indexOf('/* ----', screen.indexOf('const leftContent')));

  it('stacks the part card, then the tools, then the context', () => {
    const order = ['{partCard}', '{tools}', '{details}'].map((p) => left.indexOf(p));
    expect(order.every((i) => i > 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
    // Only rare alerts come before the card.
    expect(left.indexOf('{alerts}')).toBeLessThan(left.indexOf('{partCard}'));
  });

  it('shows the part card without the surrounding parts list, which is a folded disclosure', () => {
    expect(screen).toContain('<OtherParts context={context}');
    expect(screen).not.toContain('<WholeQuestion');
    expect(screen).not.toContain('The part you are checking</p>');
  });

  it('no longer has a second editor box or the three line rules callout', () => {
    expect(screen).not.toContain('const fixEditor');
    expect(screen).not.toContain('<BodyEditor');
    expect(screen).not.toContain('FIX_RULE_NOTE');
    expect(screen).toContain('FIX_RULE_LINE');
  });

  it('keeps the tools docked at the foot of the tile while the card is long', () => {
    expect(screen).toContain('sticky bottom-0 z-[1]');
    expect(screen).toContain('data-testid="tools-dock"');
  });
});

describe('the action bar', () => {
  const screen = readFileSync(resolve(__dirname, './VerifyScreen.tsx'), 'utf8');
  const bar = screen.slice(screen.indexOf('const actionBar ='), screen.indexOf('const incomingBar'));

  it('gives each button its icon and its tone', () => {
    expect(bar).toMatch(/tone=\{blank[\s\S]*?<Check /);
    expect(bar).toMatch(/tone="dark"[\s\S]*?<Pencil /);
    expect(bar).toMatch(/tone="outline"[\s\S]*?<CircleHelp /);
    expect(bar).toMatch(/tone="muted"[\s\S]*?<SkipForward /);
    expect(screen).toContain('<Undo2 ');
  });

  it('collapses the long keyboard hint line into a "?" button that opens the shortcuts', () => {
    expect(bar).toContain('<ShortcutsPopover');
    expect(screen).not.toContain('shortcutHint(');
    expect(screen).not.toContain('Esc cancels');
  });
});
