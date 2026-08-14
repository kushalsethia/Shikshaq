/**
 * Token-only section divider. Colours come from the semantic palette (DESIGN_SYSTEM.md §2) —
 * never from caller-supplied literals. The SVG is clipped by its own wrapper (`overflow-hidden`,
 * `w-full`, `block`), so it can never widen the page at 375px.
 */
type DividerSurface = 'background' | 'card' | 'muted';

interface WaveDividerProps {
  /** The surface the wave itself is drawn in — i.e. the section it leads into. */
  fill?: DividerSurface;
  /** The surface behind the wave — i.e. the section it leads out of. */
  surface?: DividerSurface;
  /** Flip vertically when the wave leads upward instead of downward. */
  inverted?: boolean;
}

const FILL: Record<DividerSurface, string> = {
  background: 'fill-background',
  card: 'fill-card',
  muted: 'fill-muted',
};

const BG: Record<DividerSurface, string> = {
  background: 'bg-background',
  card: 'bg-card',
  muted: 'bg-muted',
};

export function WaveDivider({ fill = 'card', surface = 'background', inverted = false }: WaveDividerProps) {
  return (
    <div aria-hidden="true" className={`block h-12 w-full max-w-full overflow-hidden leading-none ${BG[surface]}`}>
      <svg
        viewBox="0 0 1200 48"
        preserveAspectRatio="none"
        focusable="false"
        className={`block h-full w-full align-bottom ${inverted ? '-scale-y-100' : ''}`}
      >
        <path
          className={FILL[fill]}
          d="M0,24 Q15,12 30,24 T60,24 T90,24 T120,24 T150,24 T180,24 T210,24 T240,24 T270,24 T300,24 T330,24 T360,24 T390,24 T420,24 T450,24 T480,24 T510,24 T540,24 T570,24 T600,24 T630,24 T660,24 T690,24 T720,24 T750,24 T780,24 T810,24 T840,24 T870,24 T900,24 T930,24 T960,24 T990,24 T1020,24 T1050,24 T1080,24 T1110,24 T1140,24 T1170,24 T1200,24 L1200,48 L0,48 Z"
        />
      </svg>
    </div>
  );
}
