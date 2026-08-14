import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { usePageMeta } from '@/hooks/usePageMeta';
import { supabase } from '@/integrations/supabase/client';

const PRINCIPLES = [
  { title: 'No commission, ever', body: 'Fees are agreed directly between you and the teacher. We never sit in the middle of a payment.' },
  { title: 'Direct contact', body: 'Enquiries reach the teacher on WhatsApp. No lead credits, no bidding for students.' },
  { title: 'Built for Kolkata', body: 'We were students in this city. The platform is built for how tuition actually works here.' },
  { title: 'No paid placement', body: 'Real reviews from real students, and no teacher can pay to rank higher in results.' },
];

export default function About() {
  usePageMeta(
    'About Shikshaq | Free tuition teacher matching in Kolkata',
    'Shikshaq is a free platform connecting Kolkata students with verified tuition teachers directly, with no commission and no middlemen.'
  );

  const navigate = useNavigate();
  const [stats, setStats] = useState({ teachers: null as number | null, papers: null as number | null, schools: null as number | null });

  useEffect(() => {
    async function fetchStats() {
      const [teachersRes, papersRes, schoolsRes] = await Promise.all([
        supabase.from('teachers_list').select('id', { count: 'exact', head: true }),
        supabase.from('papers').select('id', { count: 'exact', head: true }).eq('is_published', true),
        supabase.from('papers').select('school').eq('is_published', true),
      ]);
      const distinctSchools = schoolsRes.data ? new Set(schoolsRes.data.map((p) => p.school)).size : null;
      setStats({
        teachers: teachersRes.count ?? null,
        papers: papersRes.count ?? null,
        schools: distinctSchools,
      });
    }
    fetchStats();
  }, []);

  const aboutStats = [
    { n: stats.teachers, label: 'Verified teachers listed', bg: '#FFF4E8', color: '#B35900' },
    { n: stats.papers, label: 'Past papers, free to read', bg: '#EDEEFF', color: '#2E3AD6' },
    { n: stats.schools, label: 'Kolkata schools represented', bg: '#F0EAE2', color: '#1F1F1F' },
    { n: 0, label: 'Commission taken, ever', bg: '#E6F4E6', color: '#1B5E20', prefix: '₹' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F9F5F1' }}>
      <Navbar />
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: 'clamp(28px,5vw,56px) clamp(16px,3vw,28px) 56px' }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#B35900' }}>About us</p>
        <h1 style={{ marginTop: 12, maxWidth: '20ch', fontSize: 'clamp(30px,4.6vw,52px)', lineHeight: 0.98, fontWeight: 400, letterSpacing: '-.05em' }}>
          Tuition in Kolkata, <span style={{ fontWeight: 800 }}>without the middleman</span>.
        </h1>
        <p style={{ marginTop: 20, maxWidth: '62ch', fontSize: 17, lineHeight: 1.65, color: '#7B736B' }}>
          Shikshaq started because finding a tuition teacher in this city runs on word of mouth, and word of mouth runs out fast. We list teachers, students contact them directly, and no money passes through us.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14, marginTop: 36 }}>
          {aboutStats.map((st) => (
            <div key={st.label} style={{ padding: 24, borderRadius: 20, background: st.bg }}>
              <div style={{ fontSize: 'clamp(28px,3.4vw,38px)', fontWeight: 800, letterSpacing: '-.04em', color: st.color }}>
                {st.n == null ? '-' : `${st.prefix || ''}${st.n.toLocaleString('en-IN')}`}
              </div>
              <div style={{ marginTop: 6, fontSize: 13.5, fontWeight: 500, color: st.color }}>{st.label}</div>
            </div>
          ))}
        </div>

        <h2 style={{ marginTop: 52, fontSize: 'clamp(23px,3vw,32px)', fontWeight: 700 }}>What we hold to</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: 16, marginTop: 20 }}>
          {PRINCIPLES.map((pr) => (
            <div key={pr.title} style={{ padding: 24, borderRadius: 20, background: '#FCFAF7', boxShadow: '0 0 0 1px rgba(0,0,0,.06)' }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 9 }}>{pr.title}</h3>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: '#7B736B' }}>{pr.body}</p>
            </div>
          ))}
        </div>

        <p style={{ marginTop: 52, fontSize: 14, fontWeight: 600, color: '#B35900' }}>Where this comes from</p>
        <h2 style={{ marginTop: 10, fontSize: 'clamp(23px,3vw,32px)', fontWeight: 700 }}>How this started</h2>
        <div style={{ marginTop: 20, padding: 'clamp(20px,3vw,32px)', borderRadius: 20, background: '#FCFAF7', borderLeft: '4px solid #FF8000', boxShadow: '0 0 0 1px rgba(0,0,0,.06)', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <p style={{ fontSize: 17, lineHeight: 1.65, color: '#7B736B', maxWidth: '62ch' }}>
            Word of mouth is a fine way to find a teacher, right up until you're new to the area or don't have the right group chat to ask in. Shikshaq doesn't try to replace that network, it just makes it searchable, by subject, grade and location, so it stops mattering whose cousin you happen to know.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.65, color: '#7B736B', maxWidth: '62ch' }}>
            The past papers exist for a similar reason. They were already circulating as scanned PDFs and forwarded chats; putting them in one place, free to read, just means fewer dead ends before an exam.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.65, color: '#7B736B', maxWidth: '62ch' }}>
            The four things we hold to, above, aren't a mission statement so much as the rules the product actually runs on. The numbers at the top of this page are what following those rules has produced so far, and we'd rather show you those than a row of team photos before we're ready to put real names to them.
          </p>
        </div>

        <div style={{ marginTop: 48, padding: 'clamp(24px,3vw,36px)', borderRadius: 24, background: '#1B1A18', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
          <div>
            <h3 style={{ fontSize: 'clamp(20px,2.4vw,26px)', fontWeight: 700, color: '#F9F5F1' }}>Know a teacher worth listing?</h3>
            <p style={{ marginTop: 8, maxWidth: '46ch', fontSize: 14.5, lineHeight: 1.6, color: 'rgba(249,245,241,.6)' }}>
              Recommend them and we will reach out. Most of our best teachers came in this way.
            </p>
          </div>
          <button
            onClick={() => navigate('/recommend-teacher')}
            className="hover:opacity-90 hover:-translate-y-0.5 active:scale-[0.97] transition-[opacity,transform] duration-150"
            style={{ flex: 'none', minHeight: 50, padding: '15px 24px', borderRadius: 12, background: '#FF8000', color: '#1B1A18', fontSize: 15, fontWeight: 700 }}
          >
            Recommend a teacher
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
