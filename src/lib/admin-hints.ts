/* The one copy file for the admin area: what each group, page, button, tile
   and column means, in plain words. Every page reads its wording from here so
   the same thing is never described two ways.

   Rules (a test in admin-hints.test.ts enforces them): no em or en dashes, no
   internal codes or table names, every page has a purpose and a button list,
   every nav page has a one-line description. */

export type AdminPageKey =
  | 'library'
  | 'ready'
  | 'submissions'
  | 'student-queue'
  | 'admin-queue'
  | 'checker-log'
  | 'checkers'
  | 'applications'
  | 'teachers'
  | 'reviews'
  | 'activity'
  | 'feedback'
  | 'team'
  | 'pipeline'
  | 'audit';

export type AdminGroupKey = 'papers' | 'checking' | 'teachers' | 'site';

export interface AdminGroupCopy {
  key: AdminGroupKey;
  label: string;
  /** One line, shown under the group's tabs. */
  blurb: string;
  pages: AdminPageKey[];
}

export const ADMIN_GROUPS: AdminGroupCopy[] = [
  {
    key: 'papers',
    label: 'Papers',
    blurb: 'The past papers on the site: what is live, what is waiting to go live, and papers sent in by students.',
    pages: ['library', 'ready', 'submissions'],
  },
  {
    key: 'checking',
    label: 'Checking',
    blurb: 'The people and queues that check every question before visitors see it.',
    pages: ['student-queue', 'admin-queue', 'checker-log', 'checkers'],
  },
  {
    key: 'teachers',
    label: 'Teachers',
    blurb: 'Teachers who want to join, teachers already on the site, and what parents say about them.',
    pages: ['applications', 'teachers', 'reviews'],
  },
  {
    key: 'site',
    label: 'Site',
    blurb: 'How the site is doing, feedback from visitors, who has admin access, and a record of every change.',
    pages: ['activity', 'feedback', 'team', 'pipeline', 'audit'],
  },
];

export interface ButtonCopy {
  label: string;
  does: string;
}

export interface AdminPageCopy {
  key: AdminPageKey;
  /** The tab label. */
  label: string;
  path: string;
  /** One line under the tab (hover, and the map of the admin). */
  short: string;
  /** "What this page is for", one or two sentences. */
  purpose: string;
  /** What is supposed to happen here, as a short sentence. */
  flow: string;
  buttons: ButtonCopy[];
}

export const ADMIN_PAGES: Record<AdminPageKey, AdminPageCopy> = {
  library: {
    key: 'library',
    label: 'Library',
    path: '/admin/library',
    short: 'Every paper on the site. Find one, fix it, hide it or bring it back.',
    purpose:
      'Every past paper in the library, live or hidden. Use it to find a paper, see how far its checking has got, open it to fix a question, or hide it from visitors.',
    flow: 'Pick a view, find the paper, then open it. Hidden papers say why they were hidden.',
    buttons: [
      { label: 'History', does: 'Shows every change made to the paper, with who made it. You can undo most changes from there.' },
      { label: 'Edit', does: 'Opens the paper to change its details or any question. Changes are saved as a draft first.' },
      { label: 'Hide', does: 'Takes the paper off the site straight away. You must give a reason, which stays on the paper.' },
      { label: 'Restore', does: 'Puts a hidden paper back on the site.' },
    ],
  },
  ready: {
    key: 'ready',
    label: 'Ready to go live',
    path: '/admin/paper-approvals',
    short: 'Papers that finished checking and wait for your yes before visitors see them.',
    purpose:
      'New papers are never published automatically. When every question on a paper has been checked, it waits here. You read it as visitors will, fix anything, and approve it. Papers already live that still need your yes are here too.',
    flow: 'Open a paper marked Ready, read it, then approve it. A paper with open questions cannot be approved yet. Switch to Already decided to see what was approved or rejected, by whom and why.',
    buttons: [
      { label: 'Review', does: 'Opens the paper. From there you can fix questions, set one aside, and approve the paper.' },
    ],
  },
  submissions: {
    key: 'submissions',
    label: 'Student uploads',
    path: '/admin/papers',
    short: 'Papers students sent in through the site, and the uploaded papers that are live.',
    purpose:
      'Papers that students uploaded themselves. Open each one to read it and decide. Uploads that are live are listed too, and can be taken down. This is separate from the Library, which holds the checked papers.',
    flow: 'Open an upload marked Pending, read it, then approve or reject it.',
    buttons: [
      { label: 'Review or View', does: 'Opens the upload so you can read it and decide. View is for uploads already decided.' },
      { label: 'Open', does: 'Shows a live paper on the site in a new tab.' },
      { label: 'Unpublish', does: 'Takes a live upload off the site. You give a reason.' },
    ],
  },
  'student-queue': {
    key: 'student-queue',
    label: 'Student queue',
    path: '/checker',
    short: 'The screen students use to check questions. Open it to try it yourself.',
    purpose:
      'This is the checking screen your student checkers use, one question at a time with a picture of the page. It opens in the same site so you can try it exactly as they see it.',
    flow: 'Open it, check a question, and your work is logged like anyone else.',
    buttons: [],
  },
  'admin-queue': {
    key: 'admin-queue',
    label: 'Admin queue',
    path: '/admin/admin-queue',
    short: 'Questions the checking could not settle, waiting for an admin to decide.',
    purpose:
      'Questions that neither the AI nor a student could settle land here. Each shows the picture of the page it came from and, in words, why it was flagged. Decide each one: it is right, it needs a fix, or it should be set aside.',
    flow: 'Work down a paper at a time. Every decision is logged and can be undone from the paper history.',
    buttons: [
      { label: 'Pass', does: 'Says the question is correct as it stands. It then counts as checked.' },
      { label: 'Edit', does: 'Lets you correct the question number, marks, words or answer choices. Each save is kept as a new version.' },
      { label: 'Set aside', does: 'Keeps the question off the site. You give a reason. The paper still goes live with an empty card in its place.' },
    ],
  },
  'checker-log': {
    key: 'checker-log',
    label: 'Checker log',
    path: '/admin/checker-log',
    short: 'What each checker did, day by day.',
    purpose:
      'A record of every action your checkers took: who, how many questions, and what they did with them. Use it to see who is active and to look into a single decision.',
    flow: 'Pick a person or a day to see exactly what was done.',
    buttons: [{ label: 'Open a person', does: 'Shows that person\'s actions, newest first.' }],
  },
  checkers: {
    key: 'checkers',
    label: 'Checkers',
    path: '/admin/checkers',
    short: 'Who is allowed to check papers. Search for a person and add them here.',
    purpose:
      'The list of people allowed to open the checking screen. To add someone, search by their name or email: they must have signed up on Shikshaq first. Removing someone stops their access but keeps everything they already checked.',
    flow: 'Search, press Add next to the right person, and they can check papers straight away.',
    buttons: [
      { label: 'Add', does: 'Lets that person open the checking screen. They need to reload the site once.' },
      { label: 'Remove', does: 'Stops them opening the checking screen. Their earlier work stays.' },
    ],
  },
  applications: {
    key: 'applications',
    label: 'Applications',
    path: '/admin/approvals',
    short: 'Teachers who applied to join. Approve or turn down each one.',
    purpose:
      'New teacher applications. Open one to read the details and documents, then approve or reject it. A count on the tab shows how many are waiting.',
    flow: 'Work from the top. Open an application to decide.',
    buttons: [
      { label: 'Approve', does: 'Accepts the application.' },
      { label: 'Reject', does: 'Turns the application down. You write the reason first.' },
    ],
  },
  teachers: {
    key: 'teachers',
    label: 'Teachers',
    path: '/admin/teachers',
    short: 'Teachers already on the site. Edit a profile, pause or bring one back.',
    purpose:
      'Every teacher on the site. Use it to correct a profile, or pause a teacher so parents stop seeing them for a while.',
    flow: 'Find the teacher, then edit or pause. Pausing never deletes anything.',
    buttons: [
      { label: 'Edit', does: 'Changes the teacher\'s profile details.' },
      { label: 'Pause or Unpause', does: 'Pause hides the teacher from parents without deleting anything. Unpause shows them again.' },
    ],
  },
  reviews: {
    key: 'reviews',
    label: 'Reviews',
    path: '/admin/reviews',
    short: 'What parents wrote about teachers, and teachers they recommended.',
    purpose:
      'Comments about teachers wait here before they show on the site, and so do teachers that parents recommended. Publish the good comments, remove the rest, and follow up on recommendations.',
    flow: 'Work from the top. A count on the tab shows how many are waiting.',
    buttons: [
      { label: 'Publish', does: 'Shows the comment on the teacher\'s page.' },
      { label: 'Remove', does: 'Takes a published comment off the site.' },
      { label: 'Mark as contacted', does: 'Records that you reached out about a recommended teacher.' },
      { label: 'Dismiss', does: 'Closes a recommendation you will not follow up.' },
      { label: 'Convert to application', does: 'Turns a recommendation into a teacher application.' },
    ],
  },
  activity: {
    key: 'activity',
    label: 'Activity',
    path: '/admin/activity',
    short: 'What visitors and checkers did on the site lately.',
    purpose: 'A live view of what is happening on the site: who visited, what they searched for and which parts they used.',
    flow: 'Read only. Nothing here changes anything.',
    buttons: [],
  },
  feedback: {
    key: 'feedback',
    label: 'Feedback',
    path: '/admin/feedback',
    short: 'Ratings and comments visitors left about the site.',
    purpose: 'Star ratings and comments that visitors left about the site as a whole, newest first. This is not about one teacher.',
    flow: 'Read only. Nothing here changes anything.',
    buttons: [],
  },
  team: {
    key: 'team',
    label: 'Team',
    path: '/admin/team',
    short: 'Who has admin access and how each person is doing.',
    purpose: 'The people who work on the site and how much each has done lately.',
    flow: 'Read only. Nothing here changes anything.',
    buttons: [],
  },
  pipeline: {
    key: 'pipeline',
    label: 'Pipeline',
    path: '/admin/pipeline',
    short: 'How far each batch of papers has got, from scan to live.',
    purpose:
      'Follow papers as they move from a scanned file to a live page: read by the AI, checked by students, waiting for you, live. Use it to see where papers are piling up.',
    flow: 'Read only. The numbers update when you reload.',
    buttons: [],
  },
  audit: {
    key: 'audit',
    label: 'Audit log',
    path: '/admin/audit',
    short: 'A record of every change an admin made, with who and when.',
    purpose: 'Every admin action is written here with the person, the time and what changed. Use it to find out who did something.',
    flow: 'Read only. Nothing here changes anything.',
    buttons: [],
  },
};

export const PAGE_ORDER: AdminPageKey[] = ADMIN_GROUPS.flatMap((g) => g.pages);

/** The group a page belongs to. */
export function groupOf(page: AdminPageKey): AdminGroupCopy {
  return ADMIN_GROUPS.find((g) => g.pages.includes(page)) as AdminGroupCopy;
}

/** Info tips for tiles, chips and columns. Keyed by a short name each page
 *  picks; kept here so a word means the same thing everywhere. */
export const TIPS = {
  // Library views
  'view.live': 'On the site now and every question has been checked.',
  'view.needs_review': 'On the site, or waiting to be, but some questions are not checked yet.',
  'view.hidden': 'Not visible to visitors. The reason it was hidden is shown on the row.',
  'view.with_students': 'Has questions waiting in the student checking queue.',
  'view.with_admin': 'Has questions waiting for an admin in the Admin queue.',
  'view.ready': 'Every question is checked and the paper is waiting in Ready to go live for your yes.',
  'view.incomplete': 'The paper has a note saying something is missing from it, such as a page.',
  'view.all': 'Every paper, whatever its state.',
  // Library columns
  'col.school': 'The school the paper came from.',
  'col.subject': 'The subject printed on the paper.',
  'col.class': 'The class the paper is set for.',
  'col.year': 'The year the paper was sat.',
  'col.progress': 'Questions checked out of the questions on the paper.',
  'col.to_check': 'Questions on the paper nobody has checked yet.',
  'col.status': 'Live means visitors can see it. Hidden means they cannot.',
  'col.why_hidden': 'The reason the person who hid the paper gave.',
  // Admin queue
  'queue.questions': 'Questions waiting for an admin decision across all papers.',
  'queue.papers': 'How many different papers those questions belong to.',
  'queue.shown': 'How many are on this page of the list.',
  // Ready to go live
  'ready.waiting': 'Papers that finished checking and are waiting for you.',
  'ready.ready': 'Papers with no open questions. These can be approved now.',
  'ready.open': 'Papers that still have questions to pass or set aside. They cannot be approved yet.',
  'ready.live': 'Papers already on the site that have not had your yes yet.',
  'col.ready.paper': 'The paper\'s board, class, subject and year.',
  'col.ready.questions': 'Questions passed, still open, and set aside on this paper.',
  'col.ready.ai': 'What the AI did with the questions before any person looked.',
  'col.ready.waiting': 'How long the paper has been waiting for you.',
  'col.ready.state': 'Ready can be approved now. A number means that many questions are still open.',
  'col.decided.result': 'Approved means it went live. Rejected means it was sent back and is not on the site.',
  'col.decided.by': 'The admin who made the decision.',
  'col.decided.when': 'When the decision was made.',
  'col.decided.note': 'The note the admin left with the decision.',
  // Checkers
  'col.checker': 'The person allowed to check papers.',
  'col.added': 'When they were given access.',
  'col.today': 'Questions they checked today.',
  'col.total': 'Questions they checked since they were added.',
  'checkers.count': 'People who can open the checking screen right now.',
  'checkers.search': 'Type at least two letters of a name or email. Only people who have signed up on Shikshaq show up.',
} as const;

export type TipKey = keyof typeof TIPS;
