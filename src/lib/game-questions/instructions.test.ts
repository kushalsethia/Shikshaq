import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { BOARDS } from './details';
import { format, MAX_ANSWER, MAX_QUESTION, missing } from './format';
import { COLUMNS, DIFFICULTIES } from './rows';

/**
 * The instructions chatbots read at /questions (src/content/game-question-instructions.html) must agree with what the
 * page really does, or a teacher pastes a chatbot's reply and gets a screen of red underlines. And they must reach
 * chatbots: scripts/prerender.ts writes them as the body of /questions, in the #prerender block that src/main.tsx
 * removes before React starts, so people never see them.
 */
const read = (path: string) => readFileSync(path, 'utf8');
const html = read('src/content/game-question-instructions.html');
const page = read('src/pages/Questions.tsx');
const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
const unescape = (s: string) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
const block = (id: string) => unescape(html.match(new RegExp(`<pre id="${id}"><code>([\\s\\S]*?)</code></pre>`))![1]);

describe('the chatbot instructions agree with the code', () => {
  it('list the columns the site writes, in order', () => {
    expect(html).toContain(`<code>${COLUMNS.join(', ')}</code>`);
  });

  it('explain the IDs the site makes, with real examples', () => {
    const rows = format(block('example')).rows;
    expect(text).toContain(`for example ${rows[0].chapter_id} for CBSE, class 10, Science, chapter 1, and ${rows[0].chapter_id}T02 for its topic 2`);
  });

  it('name every board the site knows', () => {
    for (const b of BOARDS) expect(text, b.name).toContain(b.name);
    expect(text).toContain('Maharashtra State Board');
  });

  it('state the length limits the site enforces', () => {
    expect(text).toContain(`at most ${MAX_ANSWER} characters and ideally 1 to 3 words`);
    expect(text).toContain(`is at most ${MAX_QUESTION} characters`);
    expect(text).toContain(`Every answer is short (at most ${MAX_ANSWER} characters) and every question at most ${MAX_QUESTION} characters`);
  });

  it('name exactly the difficulty values the site accepts', () => {
    for (const d of DIFFICULTIES) expect(html).toContain(`<code>${d}</code>`);
    expect(text).toContain(DIFFICULTIES.join(', ').replace(/, (\w+)$/, ' or $1'));
  });

  it('give a format template that the site reads with every detail', () => {
    const { rows, issues } = format(block('format'));
    expect(issues).toEqual([]);
    expect(rows.map((r) => [r.topic_id, r.board, r.class, r.subject, r.chapter_no, r.topic_no, r.question_no, r.difficulty])).toEqual([
      ['CBSE10SCI01T01', 'CBSE', 10, 'Science', 1, 1, 1, 'easy'],
      ['CBSE10SCI01T01', 'CBSE', 10, 'Science', 1, 1, 2, null],
      ['CBSE10SCI01T02', 'CBSE', 10, 'Science', 1, 2, 1, 'medium'],
    ]);
  });

  it('give a worked example that the site reads cleanly, with nothing missing', () => {
    const { rows, issues } = format(block('example'));
    expect(issues).toEqual([]);
    expect(rows).toHaveLength(12);
    expect(missing(rows)).toEqual({ board: 0, class: 0, subject: 0, chapter: 0, topic: 0, id: 0 });
    expect(new Set(rows.map((r) => `${r.topic_id} ${r.topic}`))).toEqual(
      new Set(['CBSE10SCI01T01 Chemical Equations', 'CBSE10SCI01T02 Types of Chemical Reactions', 'CBSE10SCI01T03 Effects of Oxidation in Everyday Life']),
    );
    // the example is written exactly as the site would store it
    expect(rows.every((r) => block('example').includes(`Topic ${r.topic_no}: ${r.topic}`) && block('example').includes(`Chapter 1: ${r.chapter}`))).toBe(true);
    expect(rows.every((r) => r.difficulty && r.answer.length <= 30)).toBe(true);
    expect(text).toContain(`Chapter 1, ${rows[0].chapter}`);
  });

  it('name the box and buttons the user really sees', () => {
    for (const label of ['Questions', 'Download CSV', 'Download JSON']) {
      expect(page).toMatch(new RegExp(`>\\s*${label}\\s*<`));
      expect(text).toContain(label);
    }
    expect(page).toContain("'Send'");
    expect(text).toContain('press Send to send the questions to your HOD');
    // signing in is the site's own (Google, or email and password), so the instructions just say "sign in"
    expect(page).toContain("'Sign in to send'");
    expect(text).toContain('open the site, sign in and paste it into the Questions box');
    expect(text).not.toMatch(/Google/);
  });

  it('follow their own rules: no answer inside its question, and no yes/no answers', () => {
    for (const id of ['format', 'example']) {
      for (const r of format(block(id)).rows) {
        expect(r.question.toLowerCase(), r.question).not.toContain(r.answer.toLowerCase());
        expect(r.answer).not.toMatch(/^(yes|no)$/i);
      }
    }
  });

  it('use no em or en dashes (site copy)', () => {
    expect(html).not.toMatch(/[–—]/);
  });
});

describe('the guide for people', () => {
  it('has an example that the site reads with no warnings and nothing missing', () => {
    const guide = read('src/components/game-questions/Guide.tsx');
    const sample = guide.match(/<pre data-guide-sample=""[^>]*>\{`([\s\S]*?)`\}<\/pre>/)![1];
    const { rows, issues } = format(sample);
    expect(issues).toEqual([]);
    expect(rows.length).toBeGreaterThan(2);
    expect(missing(rows)).toEqual({ board: 0, class: 0, subject: 0, chapter: 0, topic: 0, id: 0 });
  });
});

describe('people see the page, chatbots see the instructions', () => {
  const prerender = read('scripts/prerender.ts');

  it('prerender.ts writes /questions with this file as its body', () => {
    expect(prerender).toContain("const GAME_QUESTION_INSTRUCTIONS = path.join(__dirname, '..', 'src', 'content', 'game-question-instructions.html');");
    const write = prerender.match(/write\('\/questions', \{([\s\S]*?)\n {2}\}\);/);
    expect(write, "write('/questions', ...) in siteRoutes").not.toBeNull();
    expect(write![1]).toContain("body: fs.readFileSync(GAME_QUESTION_INSTRUCTIONS, 'utf8')");
    expect(write![1]).toContain('...GAME_PAGES_META.questions');
  });

  it('the body lands beside #root in #prerender, which the app removes before React starts', () => {
    expect(prerender).toContain('`<div id="root"></div>\\n<div id="prerender">${meta.body}</div>`');
    expect(read('src/main.tsx')).toContain('document.getElementById("prerender")?.remove();');
    // and the page's own copy of the format is the one in the instructions
    expect(html).toContain('<h1>Instructions for AI assistants</h1>');
  });

  it('the page tells chatbots to fetch /questions', () => {
    expect(page).toContain('${window.location.origin}/questions and follow the instructions on that page');
  });
});
