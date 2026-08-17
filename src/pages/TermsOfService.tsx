/**
 * TODO(O-06, legal review required before ship): the copy below is a DRAFT
 * transcribed verbatim from the redesign handoff mockup ("Redesign Legal
 * pages.dc.html", frame L1). It has not been reviewed by a lawyer. Do not
 * treat this as final legal text — see handoff\a-to-z.md open question O-06.
 */
import { useEffect } from 'react';
import { LegalReader, type LegalSection } from '@/pages/legal/reader';
import { usePageMeta } from '@/hooks/usePageMeta';

const SECTIONS: LegalSection[] = [
  {
    n: '01',
    title: 'Who can use ShikshAQ',
    short: 'Anyone 18 or over, and students under 18 with a guardian’s knowledge.',
    body: 'Students below 18 are welcome to browse and read papers, but the contact and account features are meant to be used with a parent or guardian aware of it. Teachers must be 18 or over and must list themselves — not be listed by someone else.',
  },
  {
    n: '02',
    title: 'What we do, and what we do not',
    short: 'We introduce you to teachers. Everything after that is between you and them.',
    body: 'We publish teacher listings, help you find them, and hand you to WhatsApp. We do not set fees, schedule classes, supervise teaching, guarantee results, or take responsibility for what happens in a class.',
    bullets: [
      'We are not an employment agency and teachers are not our employees.',
      'We do not mediate fee disputes, though we will remove a teacher who behaves badly.',
      'We do not promise that any teacher is available, or that anyone will reply.',
    ],
  },
  {
    n: '03',
    title: 'Fees and money',
    short: 'Your fee is yours. We take nothing from it, ever.',
    body: 'Teachers set their own rate and keep all of it. We never process payments, so please do not send money through ShikshAQ or to anyone claiming to collect on our behalf. If someone asks you to pay ShikshAQ, that is a scam — tell us.',
  },
  {
    n: '04',
    title: 'Listing as a teacher',
    short: 'Be truthful, keep it current, and expect a human to read it.',
    body: 'Everything on your profile must be true: your name, your qualifications, your years of experience, the subjects and boards you actually teach. We read every application and may ask for another document before publishing. We can unpublish a listing that turns out to be inaccurate.',
    bullets: [
      'Do not list someone else, or use a photo that is not you.',
      'Keep your rate and availability current — stale listings get quiet, then hidden.',
      'You are responsible for your own tax and legal obligations.',
    ],
  },
  {
    n: '05',
    title: 'Past papers',
    short: 'The papers belong to the schools that set them. We host them for reading only.',
    body: 'Papers are shared by students and hosted for revision. Reading is free and requires an account. Downloading, reposting or selling them is not allowed. Any school can ask us to remove a paper and we do it the same day, no argument.',
  },
  {
    n: '06',
    title: 'Reviews',
    short: 'Only people who actually contacted a teacher can review them, and teachers cannot edit reviews.',
    body: 'A review can only be left after a contact is recorded. We remove reviews that contain abuse, personal contact details, or an attempt to pull business off the platform — but we do not remove an honest bad review because a teacher asked.',
  },
  {
    n: '07',
    title: 'Ending it',
    short: 'You can delete your account whenever. We can close one that harms other people.',
    body: 'Delete your account from the account screen and your listing disappears from search immediately. We may suspend an account for false information, harassment, or trying to charge for something we give away free. Where we can, we tell you why first.',
  },
];

export default function TermsOfService() {
  usePageMeta(
    'Terms of Service | Shikshaq',
    'The terms that govern your use of Shikshaq, the free tutor-student matchmaking platform connecting students with verified tuition teachers in Kolkata.'
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <LegalReader
      pill="plain English, no clauses"
      pillTone="brand"
      h1="What you agree to"
      lede="ShikshAQ is a place to find a teacher and read past papers. We introduce people; we are not a tuition agency, an employer, or a party to the classes you arrange."
      updated="Last updated 12 August 2026 · we tell you on WhatsApp when this changes"
      accent="brand"
      summary={[
        { head: 'Free to use', text: 'For students, guardians and teachers. No listing fee, no commission, no premium tier.', tone: 'bone' },
        { head: 'We do not take the money', text: 'Fees are settled directly between you and the teacher. We never invoice or hold a deposit.', tone: 'brand' },
        { head: 'We verify, we do not vouch', text: 'We check ID and degree. We cannot guarantee anyone’s teaching.', tone: 'muted' },
        { head: 'You can leave', text: 'Delete your account whenever. Teachers can unlist in one tap.', tone: 'mint' },
      ]}
      sections={SECTIONS}
      footHead="Something here unclear?"
      footBody="Ask us in normal words and we will answer in normal words. If a clause needs to change, we would rather rewrite it than argue about it."
    />
  );
}
