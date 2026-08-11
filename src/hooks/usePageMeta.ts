import { useEffect } from 'react';

const DEFAULT_TITLE = 'Shikshaq - Find Tuition Teachers in Kolkata';
const DEFAULT_DESCRIPTION =
  'Find verified tuition teachers in Kolkata for free. Search by subject, class, board, and area. Connect directly with local tutors for CBSE, ICSE, IGCSE, IB, State Board — no commission, no middlemen.';

/**
 * Sets a page-specific title and meta description, restoring the defaults on
 * unmount.
 *
 * index.html ships one title/description for the whole app, so any route that
 * doesn't set its own ends up duplicating the homepage's — which stops it
 * ranking for its own terms. Canonicals are handled separately by
 * <CanonicalTag>.
 */
export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title;

    const metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (metaDesc) metaDesc.setAttribute('content', description);

    // og:title / og:description should match, otherwise shares show homepage copy.
    const ogTitle = document.querySelector('meta[property="og:title"]') as HTMLMetaElement | null;
    if (ogTitle) ogTitle.setAttribute('content', title);
    const ogDesc = document.querySelector('meta[property="og:description"]') as HTMLMetaElement | null;
    if (ogDesc) ogDesc.setAttribute('content', description);

    return () => {
      document.title = DEFAULT_TITLE;
      if (metaDesc) metaDesc.setAttribute('content', DEFAULT_DESCRIPTION);
      if (ogTitle) ogTitle.setAttribute('content', DEFAULT_TITLE);
      if (ogDesc) ogDesc.setAttribute('content', DEFAULT_DESCRIPTION);
    };
  }, [title, description]);
}
