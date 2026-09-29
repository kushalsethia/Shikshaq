import { useState } from 'react';
import { cn } from '@/lib/utils';
import { stepZoom, PAGE_ZOOM_STEPS } from '@/lib/checker-page';

/**
 * The whole scanned page, zoomable. At zoom 1 the page fits the width of its
 * panel (so at 375px a whole A4 page is readable-small and nothing scrolls
 * sideways); the buttons widen the image and the panel scrolls both ways to
 * pan. Deliberately not pinch-to-zoom on the image itself: that fights the
 * browser's own page zoom on a phone.
 */
export function PageImageViewer({
  src,
  alt,
  note,
  onError,
}: {
  src: string;
  alt: string;
  note: string;
  onError: () => void;
}) {
  const [zoom, setZoom] = useState<number>(PAGE_ZOOM_STEPS[0]);
  const atMin = zoom <= PAGE_ZOOM_STEPS[0];
  const atMax = zoom >= PAGE_ZOOM_STEPS[PAGE_ZOOM_STEPS.length - 1];

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-brand-subtle px-3 py-2">
        <p className="min-w-0 flex-1 text-[14px] font-semibold leading-snug text-foreground">{note}</p>
        <div className="flex items-center gap-1" role="group" aria-label="Zoom the page">
          <ZoomButton label="Zoom out" disabled={atMin} onClick={() => setZoom((z) => stepZoom(z, 'out'))}>
            -
          </ZoomButton>
          <span className="w-10 text-center text-[12px] tabular-nums text-warm-secondary" aria-live="polite">
            {Math.round(zoom * 100)}%
          </span>
          <ZoomButton label="Zoom in" disabled={atMax} onClick={() => setZoom((z) => stepZoom(z, 'in'))}>
            +
          </ZoomButton>
        </div>
      </div>
      <div
        className="max-h-[56vh] w-full overflow-auto rounded-[14px] bg-white lg:max-h-[68vh]"
        tabIndex={0}
        aria-label="The scanned page. Scroll to move around."
      >
        <img
          key={src}
          src={src}
          alt={alt}
          onError={onError}
          draggable={false}
          style={{ width: `${zoom * 100}%`, maxWidth: 'none' }}
          className="block h-auto"
        />
      </div>
    </div>
  );
}

function ZoomButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'tap-44 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[20px] font-semibold leading-none text-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-40',
      )}
    >
      {children}
    </button>
  );
}
