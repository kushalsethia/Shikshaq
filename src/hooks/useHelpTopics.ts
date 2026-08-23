import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface HelpTopic {
  title: string;
  body: string;
}

// Fallback topics, used until page_content carries a page_type support can
// edit for this page (see the Help.tsx handoff report — the live table's
// CHECK constraint only allows 'general' | 'subject' | 'board' |
// 'subject_board' today, one active row each, so it can't yet hold six
// standalone topic rows). Copy matches the design handoff's own sample copy.
// short/body split from a single stored paragraph: short is the bold
// one-line answer, body is the rest of the explanation.
const FALLBACK_TOPICS: HelpTopic[] = [
  { title: 'Finding a teacher', body: 'Use the search bar in Teachers mode: pick a subject, a class and board, and an area.|Filters stay as removable chips above the results so you can loosen one at a time.' },
  { title: 'Contacting a teacher', body: 'Open a profile and use Contact via WhatsApp.|Your number is never shared with the teacher until you message them yourself.' },
  { title: 'Reading past papers', body: 'Switch the search to Papers mode, or open Past Papers from the navigation.|Papers open in a reader on Shikshaq, and the page is watermarked to your account.' },
  { title: 'Contributing a paper', body: 'Send us the paper through the contribute link on the Past Papers page.|Nothing publishes until an admin has reviewed and published it deliberately.' },
  { title: 'Getting a paper removed', body: 'Schools can use the removal link on any paper or in the reader header.|We unpublish first, which is immediate and reversible.' },
  { title: 'Joining as a teacher', body: 'Apply through Join as a teacher.|It is a four-step form and there is no listing fee, ever.' },
];

/** Handoff HP-004: the "Guides" panel's source data — a real, admin-editable
 *  `page_content` query (extracted from Help.tsx so FAQ.tsx can share the
 *  same live guides rather than a second hardcoded copy). */
export function useHelpTopics(): HelpTopic[] {
  const [topics, setTopics] = useState<HelpTopic[]>(FALLBACK_TOPICS);

  useEffect(() => {
    async function fetchTopics() {
      const { data } = await supabase
        .from('page_content')
        .select('heading, full_content')
        .eq('page_type', 'help_topic')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (data && data.length > 0) {
        setTopics(data.map((row) => ({ title: row.heading, body: row.full_content })));
      }
    }
    fetchTopics();
  }, []);

  return topics;
}

/** A stored topic body is "short|rest" — short is the one-line answer, rest
 *  is the fuller explanation. The Guides panel wants them as one paragraph. */
export function topicToGuideBody(body: string): string {
  const [short, ...restParts] = body.split('|');
  const rest = restParts.join(' ').trim();
  return rest ? `${short.trim()} ${rest}` : short.trim();
}
