/* Titles and descriptions of /questions and /revise, shared by the pages (usePageMeta) and scripts/prerender.ts, so
   the prerendered HTML says what React renders. */

export const GAME_PAGES_META = {
  questions: {
    title: 'Write questions for the question bank | Shikshaq',
    description:
      'Teachers write short questions and answers for a chapter, check them, and send them to their HOD. Approved questions become revision puzzles for students.',
  },
  revise: {
    title: 'Revise with puzzles: crossword, word search, matching | Shikshaq',
    description:
      'Pick your class, subject, chapter and the topics you studied, then play a short puzzle made from questions teachers wrote and HODs approved. Free.',
  },
} as const;
