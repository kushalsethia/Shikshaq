/**
 * TODO(O-06, legal review required before ship): the copy below is a DRAFT
 * transcribed verbatim from the redesign handoff mockup ("Redesign Legal
 * pages.dc.html", frame L2). It has not been reviewed by a lawyer. Do not
 * treat this as final legal text — see handoff\a-to-z.md open question O-06.
 */
import { useEffect } from 'react';
import { LegalReader, type LegalSection } from '@/pages/legal/reader';
import { usePageMeta } from '@/hooks/usePageMeta';

const SECTIONS: LegalSection[] = [
  {
    n: '01',
    title: 'What we collect',
    short: 'Your name, your number or email, and what you searched for.',
    body: 'For students and guardians: name, WhatsApp number or email, the searches you run and the teachers you save or contact. For teachers: the same, plus the professional details you publish and the ID and degree documents you upload for verification.',
  },
  {
    n: '02',
    title: 'Why we collect it',
    short: 'To connect you with a teacher, and to keep the listings honest.',
    body: 'Your number lets a teacher reply to you. Your saves and contacts let you pick up where you left off. Verification documents let us check that a teacher is who they say they are — that is the only reason we ask for them.',
  },
  {
    n: '03',
    title: 'Who sees what',
    short: 'Teachers see your name and number only after you message them. Admins see verification documents. Nobody else sees either.',
    body: 'Your searches and saved teachers are private to you. Teacher verification documents are visible only to the two of us who run ShikshAQ, are never published, and are never shared with another teacher or a school.',
    bullets: [
      'Reviews show your first name and class — never your number.',
      'Paper reading history is private; teachers cannot see it.',
      'We do not show your exact address anywhere, only your locality.',
    ],
  },
  {
    n: '04',
    title: 'What we do not do',
    short: 'No selling, no renting, no ad networks, no coaching-centre lead lists.',
    body: 'We have been asked to sell "parent leads" and we have said no every time. There is no version of ShikshAQ where your number becomes someone’s marketing list.',
  },
  {
    n: '05',
    title: 'How long we keep it',
    short: 'While your account is open, plus a short window after you delete it.',
    body: 'Delete your account and we remove your profile and contact details within seven days. Verification documents are deleted as soon as a decision is made — approved or not. We keep a minimal record that a decision happened, for the audit log.',
  },
  {
    n: '06',
    title: 'Your rights',
    short: 'Ask for your data, correct it, or have it deleted — by WhatsApp is fine.',
    body: 'You do not need a formal letter. Message us and we will send everything we hold about you within a week, fix anything wrong, or delete it. If you want your reviews removed along with your account, say so and they go too.',
  },
  {
    n: '07',
    title: 'Children',
    short: 'Students under 18 are welcome, with a guardian aware of it.',
    body: 'We do not knowingly collect a phone number from a child without a guardian involved. If you are a parent and want your child’s data removed, tell us and it is done that day.',
  },
];

export default function PrivacyPolicy() {
  usePageMeta(
    'Privacy Policy | Shikshaq',
    'How Shikshaq collects, uses, and protects your personal data when you search for or list as a tuition teacher in Kolkata.'
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <LegalReader
      pill="what we hold, and why"
      pillTone="blue"
      h1="What we know about you"
      lede="Short version: your phone number is the only sensitive thing we hold, we never sell it, and it is shown to a teacher only when you choose to message them."
      updated="Last updated 12 August 2026 · written to be read, not skimmed"
      accent="blue"
      summary={[
        { head: 'We never sell data', text: 'Not to coaching centres, not to advertisers, not to anyone. There is no data business here.', tone: 'blue' },
        { head: 'Your number stays hidden', text: 'It is shown to a teacher only when you tap WhatsApp yourself.', tone: 'bone' },
        { head: 'No ad trackers', text: 'We count page views to know what is used. No advertising pixels.', tone: 'muted' },
        { head: 'Delete means delete', text: 'Ask us and it goes, including your reviews if you want them gone.', tone: 'mint' },
      ]}
      sections={SECTIONS}
      footHead="Want your data, or want it gone?"
      footBody="Ask on WhatsApp or by email. We will send you everything we hold within a week, or delete it — your choice, and no questions asked."
    />
  );
}
