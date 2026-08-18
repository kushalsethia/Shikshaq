import { useState } from 'react';
import { GraduationCap, FileText, Users, ShieldAlert, Mail, MapPin, ArrowRight } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { PreFooter } from '@/components/layout/PreFooter';
import { PageContainer, BottomNavSpacer } from '@/components/layout/PageContainer';
import { AnnotatedStatement } from '@/components/marketing/annotated-statement';
import { NumberedHeading } from '@/components/ui/numbered-heading';
import { Chip } from '@/components/ui/chip';
import { Field, FieldInput, FieldTextarea, useBlurValidation } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { WhatsAppIcon } from '@/components/BrandIcons';
import { usePageMeta } from '@/hooks/usePageMeta';
import { getWhatsAppLink } from '@/utils/whatsapp';
import { toast } from 'sonner';

// S22 — new route. Same annotation device as About (C-058) so the two pages
// read as a pair (changelog C-059): a statement + rising dome, tilted pills,
// an orange band with the direct contact details, then a reason-first form.
//
// There is no backend "contact" table in this codebase (checked: only
// teacher_recommendations exists), so "send it" composes a mailto: to
// ngo.aquaterra@gmail.com with the reason pre-filled in the subject line, per the
// changelog note ("reason chip pre-fills the subject line") — it does not
// silently do nothing, and it does not invent a fake success state that isn't
// backed by a real send.
//
// DO NOT change this address to hello@shikshaq.in, hello@shikshaq.com,
// join.shikshaq@gmail.com, or support@shikshaq.com. Every one of those
// appeared somewhere in this codebase at some point (including in this exact
// file) and got consolidated here on the OWNER'S EXPLICIT confirmation mid-
// session: "ngo.aquaterra@gmail.com is the real email ID." The design
// handoff's contact-01-mobile.png export shows hello@shikshaq.in — that PNG
// predates the correction and is wrong for this one specific fact. A design
// export is not authoritative over the person who owns the inbox.
const REASONS = [
  { id: 'teacher', label: 'Finding a teacher', icon: GraduationCap },
  { id: 'paper', label: 'A paper or takedown', icon: FileText },
  { id: 'list', label: 'I teach, list me', icon: Users },
  { id: 'wrong', label: 'Something is wrong', icon: ShieldAlert },
] as const;

type ReasonId = (typeof REASONS)[number]['id'];

export default function Contact() {
  usePageMeta(
    'Contact ShikshAQ | Talk to a real person',
    // Was 178 chars, truncated in the SERP snippet. 149 now.
    'Reach the two people who run ShikshAQ directly for teacher search, paper takedowns, or listing yourself. A real person replies, usually the same day.'
  );

  const [reason, setReason] = useState<ReasonId>('teacher');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const nameField = useBlurValidation(name, (v) => (v.trim() ? undefined : 'Tell us your name'));
  const contactField = useBlurValidation(contact, (v) =>
    v.trim() ? undefined : 'A WhatsApp number or email so we can reply'
  );
  const messageField = useBlurValidation(message, (v) => (v.trim() ? undefined : 'What do you need?'));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nameField.onBlur();
    contactField.onBlur();
    messageField.onBlur();
    if (!nameField.isValid || !contactField.isValid || !messageField.isValid) return;

    const reasonLabel = REASONS.find((r) => r.id === reason)?.label ?? 'General';
    const subject = encodeURIComponent(`ShikshAQ — ${reasonLabel}`);
    const body = encodeURIComponent(
      `Name: ${name}\nReach me on: ${contact}\n\n${message}`
    );
    window.location.href = `mailto:ngo.aquaterra@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
    toast.success('Opening your email app to send this to ngo.aquaterra@gmail.com');
  };

  const statement = (
    <>
      {/* ONE copy of the phrase, with the line breaks doing the work.
          `display:none` does NOT remove text from textContent or from the
          accessible name, so the previous approach — two copies, one hidden per
          breakpoint — made the h1 read "Don't hesitate to ask us.to ask us." at
          BOTH sizes, in the accessible name and in any search snippet.
          Only the <br>s are breakpoint-conditional now:
            mobile   Don't / hesitate / to ask / us.
            desktop  Don't hesitate / to ask us.        */}
      Don&rsquo;t
      <br className="lg:hidden" /> hesitate
      <br /> to ask
      <br className="lg:hidden" /> us.
    </>
  );

  return (
    <div className="min-h-screen bg-background">

      <main>
        <PageContainer as="section" className="pt-6 sm:pt-10 lg:pt-14">
          <AnnotatedStatement
            statement={statement}
            align="center"
            className="px-[18px] py-6 lg:px-10 lg:py-14"
            pills={[
              { label: 'a real person replies', anchor: 'top-left', tone: 'brand', tilt: -9, dot: false },
              { label: 'same day, usually', anchor: 'top-right', tone: 'bone', tilt: 7 },
              {
                label: 'or just WhatsApp',
                anchor: 'bottom-left',
                tone: 'whatsapp',
                tilt: 5,
                dot: false,
                icon: <WhatsAppIcon className="h-[13px] w-[13px]" />,
              },
              { label: 'papers takedowns too', anchor: 'bottom-right', tone: 'indigo', tilt: -5 },
            ]}
          />

          {/* the rising dome — a purely decorative echo of the F5/mockup device,
              built from the same tokens as everything else on the page.
              mt-5 (not a negative pull-up) on mobile: the annotation pills sit
              flush with the statement block's own bottom edge (see
              annotated-statement.tsx), so a negative margin here pulled the
              dome up far enough to bury the bottom-anchored "or just
              WhatsApp" / "papers takedowns too" pills underneath it. Desktop's
              much taller display-type box gives the same -46px plenty of
              clearance, so only the mobile value changes. */}
          <div className="relative -mx-4 mt-5 h-[140px] overflow-hidden sm:-mx-6 lg:-mx-8 lg:-mt-[46px] lg:h-[190px]" aria-hidden="true">
            <span className="absolute left-[-14%] right-[-14%] top-0 h-[420px] rounded-t-full bg-brand" />
            <div className="absolute left-0 right-0 top-[64px] flex justify-center gap-[22px] lg:top-[82px] lg:gap-10">
              <span className="relative h-[80px] w-[58px] rounded-full bg-card lg:h-[132px] lg:w-[96px]">
                <span className="absolute left-[26px] top-[46px] h-[22px] w-[22px] rounded-full bg-panel lg:left-[44px] lg:top-[76px] lg:h-9 lg:w-9" />
              </span>
              <span className="relative h-[80px] w-[58px] rounded-full bg-card lg:h-[132px] lg:w-[96px]">
                <span className="absolute left-[22px] top-[46px] h-[22px] w-[22px] rounded-full bg-panel lg:left-9 lg:top-[76px] lg:h-9 lg:w-9" />
              </span>
            </div>
          </div>
        </PageContainer>

        {/* orange band */}
        <div className="bg-brand px-4 py-[8px] pb-[26px] text-brand-foreground sm:px-6 lg:px-8 lg:py-3 lg:pb-11">
          <PageContainer className="!px-0 lg:grid lg:grid-cols-[0.7fr_1.3fr] lg:gap-12 lg:items-start">
            <div>
              <span className="mb-[6px] block text-[11px] font-extrabold uppercase tracking-[0.1em] text-brand-foreground/75">
                write to us
              </span>
              <a
                href="mailto:ngo.aquaterra@gmail.com"
                className="block font-display text-[20px] font-black tracking-[-0.03em] text-brand-foreground lg:text-2xl"
              >
                ngo.aquaterra@gmail.com
              </a>
              <span className="mt-[14px] hidden text-[15px] leading-[1.6] text-brand-foreground/90 lg:block">
                Mon to Sat, 10 am &ndash; 8 pm
                <br />
                Kolkata, West Bengal
              </span>
            </div>
            <p className="mt-4 text-[16px] leading-[1.55] text-brand-foreground lg:mt-0 lg:text-[22px] lg:leading-[1.45]">
              We are two people, not a call centre. Tell us what you are looking for &mdash; a
              subject, a class, an area &mdash; and we will point you at the teachers worth
              messaging.{' '}
              <span className="lg:inline">
                If you are a school asking us to take a paper down, say so in the first line and
                it happens the same day.
              </span>
            </p>
          </PageContainer>
        </div>

        {/* form + direct lines */}
        <PageContainer as="section" className="pt-6 sm:pt-8 lg:grid lg:grid-cols-[1.25fr_0.75fr] lg:gap-10 lg:pt-11">
          <div>
            <NumberedHeading
              line1="Send us a note"
              ordinal="01"
              line2="four fields, no login"
              className="mb-[14px]"
            />

            <form onSubmit={handleSubmit} className="flex flex-col gap-[14px]">
              <div className="flex flex-wrap gap-2">
                {REASONS.map((r) => {
                  const on = reason === r.id;
                  return (
                    <Chip
                      key={r.id}
                      type="button"
                      tone={on ? 'solid' : 'facet'}
                      size={40}
                      icon={<r.icon className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />}
                      aria-pressed={on}
                      onClick={() => setReason(r.id)}
                    >
                      {r.label}
                    </Chip>
                  );
                })}
              </div>

              <div className="grid gap-[14px] sm:grid-cols-2">
                <Field label="Your name" error={nameField.error} required>
                  {(cp) => (
                    <FieldInput
                      {...cp}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={nameField.onBlur}
                      placeholder="Priya Sharma"
                    />
                  )}
                </Field>
                <Field label="WhatsApp number or email" error={contactField.error} required>
                  {(cp) => (
                    <FieldInput
                      {...cp}
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      onBlur={contactField.onBlur}
                      placeholder="+91 …"
                    />
                  )}
                </Field>
              </div>

              <Field label="What do you need?" error={messageField.error} required>
                {(cp) => (
                  <FieldTextarea
                    {...cp}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onBlur={messageField.onBlur}
                    placeholder="Class 10 ICSE Maths, somewhere near Ballygunge, evenings after 6…"
                  />
                )}
              </Field>

              <div className="flex flex-wrap items-center gap-[18px]">
                <Button type="submit" variant="primary" size={52} className="w-full sm:w-auto">
                  Send it
                  <ArrowRight className="h-[17px] w-[17px]" aria-hidden="true" />
                </Button>
                <span className="max-w-[40ch] text-[13px] leading-[1.55] text-warm-label">
                  Goes straight to the two people who run ShikshAQ. No newsletter, and we never
                  pass your number to a teacher without asking.
                </span>
              </div>
              {sent ? (
                <p role="status" className="text-body-secondary text-brand-deep">
                  Your email app should be open now &mdash; send it from there and we&rsquo;ll reply.
                </p>
              ) : null}
            </form>
          </div>

          <div className="mt-6 flex flex-col gap-3 lg:mt-0">
            <a
              href={getWhatsAppLink('8240980312')}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[44px] items-center gap-[14px] rounded-[20px] bg-whatsapp p-[16px] text-whatsapp-text transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-[13px] bg-card/90">
                <WhatsAppIcon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[11.5px] font-bold uppercase tracking-[0.07em] text-whatsapp-text/70">
                  WhatsApp us
                </div>
                <div className="mt-[2px] text-[15px] font-bold lg:text-[16px]">+91 82409 80312</div>
              </div>
              <ArrowRight className="h-4 w-4 flex-none" aria-hidden="true" />
            </a>

            <a
              href="mailto:ngo.aquaterra@gmail.com"
              className="flex min-h-[44px] items-center gap-[14px] rounded-[20px] bg-card p-[16px] text-foreground shadow-border transition-transform duration-150 hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-[13px] bg-muted">
                <Mail className="h-[19px] w-[19px]" strokeWidth={2} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[11.5px] font-bold uppercase tracking-[0.07em] text-warm-label">Email</div>
                <div className="mt-[2px] text-[15px] font-bold lg:text-[16px]">ngo.aquaterra@gmail.com</div>
              </div>
              <ArrowRight className="h-4 w-4 flex-none text-warm-label" aria-hidden="true" />
            </a>

            <div className="flex min-h-[44px] items-center gap-[14px] rounded-[20px] bg-card p-[16px] text-foreground shadow-border">
              <span className="flex h-11 w-11 flex-none items-center justify-center rounded-[13px] bg-muted">
                <MapPin className="h-[19px] w-[19px]" strokeWidth={2} aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[11.5px] font-bold uppercase tracking-[0.07em] text-warm-label">Where we are</div>
                <div className="mt-[2px] text-[15px] font-bold lg:text-[16px]">Kolkata, West Bengal</div>
              </div>
            </div>

            <div className="mt-[6px] rounded-[22px] bg-panel p-[22px] text-background">
              <span className="mb-3 inline-flex h-[26px] items-center whitespace-nowrap rounded-full bg-card px-[11px] text-[11.5px] font-bold text-foreground">
                before you write
              </span>
              <p className="text-[14.5px] leading-[1.65] text-background/78">
                Fees, verification, how papers are hosted and what we do with your number are all
                answered in{' '}
                <a href="/faq" className="text-brand-blue underline-offset-4 hover:underline">
                  Help &amp; FAQ
                </a>
                .
              </p>
            </div>
          </div>
        </PageContainer>

        <PageContainer as="section" className="py-8 sm:py-12">
          <PreFooter variant="B1" />
        </PageContainer>
        <BottomNavSpacer />
      </main>

      <Footer />
    </div>
  );
}
