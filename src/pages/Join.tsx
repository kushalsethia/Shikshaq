import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Link } from 'react-router-dom';
import { usePageMeta } from '@/hooks/usePageMeta';

const BENEFITS = [
  {
    title: 'No commission fees',
    body: 'Fees are agreed between you and the family. We never sit in the middle of a payment.',
  },
  {
    title: 'Direct student contact',
    body: 'Enquiries reach you on WhatsApp. No lead credits, no bidding for students.',
  },
  {
    title: 'Empathy',
    body: 'We were students in this city. The platform is built for how tuition actually works in Kolkata.',
  },
  {
    title: 'Values',
    body: 'Real reviews from real students, and no paid placement in results. Ever.',
  },
];

export default function Join() {
  usePageMeta(
    'Join as a Tuition Teacher in Kolkata | Shikshaq',
    'List yourself as a tuition teacher in Kolkata for free. Reach students near you directly. No commission, no middlemen, no platform fees. Apply to join Shikshaq today.'
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F9F5F1' }}>
      <Navbar />

      <main style={{ maxWidth: 1000, margin: '0 auto', padding: 'clamp(28px,5vw,56px) clamp(16px,3vw,28px) 56px' }}>
        <h1 style={{ fontSize: 'clamp(28px,4.4vw,48px)', lineHeight: 1, fontWeight: 700, maxWidth: '18ch', color: '#1F1F1F' }}>
          Teach on Shikshaq. <span style={{ color: '#FF8000' }}>Keep every rupee.</span>
        </h1>

        <p style={{ marginTop: 18, maxWidth: '56ch', fontSize: 'clamp(15px,1.6vw,17px)', lineHeight: 1.6, color: '#7B736B' }}>
          We list local tuition teachers, students contact you directly on WhatsApp, and we take nothing from what you charge. There is no listing fee either.
        </p>

        <Link
          to="/join/apply"
          className="hover:opacity-90 active:scale-[0.97] transition-[opacity,transform] duration-150"
          style={{ display: 'inline-flex', alignItems: 'center', minHeight: 44, marginTop: 24, padding: '15px 24px', borderRadius: 12, background: '#1F1F1F', color: '#fff', fontSize: 15, fontWeight: 600 }}
        >
          Apply to be listed
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, marginTop: 36 }}>
          {BENEFITS.map((b) => (
            <div key={b.title} style={{ padding: 24, borderRadius: 20, background: '#FCFAF7', boxShadow: '0 0 0 1px rgba(0,0,0,.06)' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 9, color: '#1F1F1F' }}>{b.title}</h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: '#7B736B' }}>{b.body}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
