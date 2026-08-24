import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { hasSeenOnboarding, markOnboardingSeen } from "@/lib/onboarding";
import { getSubjectPalette } from "@/lib/subject-palette";
import { WhatsAppIcon } from "@/components/BrandIcons";
import { Logo } from "@/components/Logo";

/* Handoff OB-001 — first-open welcome screen (Welcome Screen Redesign.dc.html).
   Full-screen, not a route, shown once per browser behind hasSeenOnboarding().
   Both actions dismiss (markOnboardingSeen()) and the screen never returns —
   this is a hype/welcome moment, not a router: the old three-destination
   picker (Find a teacher / Read papers / I teach) is gone, per the entry's
   full replacement of this component's content and behaviour. */

function useOnboardingCounts(enabled: boolean) {
  return useQuery({
    queryKey: ["onboarding", "counts"],
    enabled,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const [mathsRes, icseRes, ballygungeRes, class10Res, papersRes, teachersRes] = await Promise.all([
        supabase.from("teachers_list").select("id", { count: "exact", head: true }).ilike("subjects", "%Maths%"),
        supabase.from("Shikshaqmine").select("id", { count: "exact", head: true }).ilike('"School Boards Catered"', "%ICSE%"),
        supabase.from("Shikshaqmine").select("id", { count: "exact", head: true }).ilike("Area", "%Ballygunge%"),
        supabase.from("teachers_list").select("id", { count: "exact", head: true }).ilike("classes", "%10%"),
        supabase.from("papers").select("id", { count: "exact", head: true }).eq("is_published", true),
        supabase.from("teachers_list").select("id", { count: "exact", head: true }),
      ]);
      return {
        maths: mathsRes.count ?? null,
        icse: icseRes.count ?? null,
        ballygunge: ballygungeRes.count ?? null,
        class10: class10Res.count ?? null,
        papers: papersRes.count ?? null,
        teachers: teachersRes.count ?? null,
      };
    },
  });
}

export function OnboardingModal() {
  const [open, setOpen] = useState(false);
  const counts = useOnboardingCounts(open);

  useEffect(() => {
    if (!hasSeenOnboarding()) {
      setOpen(true);
    }
  }, []);

  const dismiss = () => {
    markOnboardingSeen();
    setOpen(false);
  };

  if (!open) return null;

  const maths = getSubjectPalette("Maths");
  const science = getSubjectPalette("Science");
  const c = counts.data;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-brand" role="dialog" aria-modal="true" aria-label="Welcome to ShikshAQ">
      <div className="flex h-14 items-center justify-between px-5">
        {/* filter:brightness(0) — fully monochrome black, distinct from
            Logo's own onDark (white-invert) or default (dark ink + orange
            accent dot) treatments. */}
        <Logo size="nav" className="tap-44 [&_img]:[filter:brightness(0)]" ariaLabel="Shikshaq home" priority />
        <button
          type="button"
          onClick={dismiss}
          aria-label="Skip"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[rgba(31,31,31,.14)] text-[#1F1F1F]"
        >
          <X className="h-4 w-4" strokeWidth={2.25} aria-hidden />
        </button>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center px-5">
        <h1 className="font-display text-[58px] font-black leading-[0.9] tracking-[-0.06em] text-[#FCFAF7]">
          Search,<br />
          shortlist,<br />
          <span className="inline-block -mx-2 rounded-[6px] bg-[#FCFAF7] px-2 text-[#1F1F1F]">message.</span><br />
          No agent<br />
          in between.
        </h1>

        {/* Handoff OB-001 point 3: five tilted stickers around the headline. */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {c?.maths != null && c.maths > 0 && (
            <span
              className="absolute left-[6%] top-[18%] h-[34px] rotate-[7deg] items-center whitespace-nowrap rounded-full px-[15px] text-[13.5px] font-extrabold shadow-[0_8px_22px_rgba(0,0,0,.14)] motion-reduce:rotate-0 lg:rotate-0"
              style={{ backgroundColor: maths.tint, color: maths.text, display: "inline-flex" }}
            >
              Maths · {c.maths}
            </span>
          )}
          {c?.icse != null && c.icse > 0 && (
            <span
              className="absolute right-[8%] top-[30%] h-[34px] rotate-[-6deg] items-center whitespace-nowrap rounded-full bg-panel px-[15px] text-[13.5px] font-extrabold text-background shadow-[0_8px_22px_rgba(0,0,0,.14)] motion-reduce:rotate-0 lg:rotate-0"
              style={{ display: "inline-flex" }}
            >
              ICSE · {c.icse}
            </span>
          )}
          {c?.ballygunge != null && c.ballygunge > 0 && (
            <span
              className="absolute left-[10%] bottom-[26%] h-[34px] rotate-[5deg] items-center whitespace-nowrap rounded-full bg-card px-[15px] text-[13.5px] font-extrabold text-foreground shadow-[0_8px_22px_rgba(0,0,0,.14)] motion-reduce:rotate-0 lg:rotate-0"
              style={{ display: "inline-flex" }}
            >
              Ballygunge · {c.ballygunge}
            </span>
          )}
          {c?.class10 != null && c.class10 > 0 && (
            <span
              className="absolute right-[6%] bottom-[12%] h-[34px] rotate-[-4deg] items-center whitespace-nowrap rounded-full px-[15px] text-[13.5px] font-extrabold shadow-[0_8px_22px_rgba(0,0,0,.14)] motion-reduce:rotate-0 lg:rotate-0"
              style={{ backgroundColor: science.tint, color: science.text, display: "inline-flex" }}
            >
              Class 10 · {c.class10}
            </span>
          )}
          {c?.papers != null && c.papers > 0 && (
            <span
              className="absolute left-[22%] top-[46%] h-[34px] rotate-[6deg] items-center whitespace-nowrap rounded-full bg-brand-blue-subtle px-[15px] text-[13.5px] font-extrabold text-brand-blue-deep shadow-[0_8px_22px_rgba(0,0,0,.14)] motion-reduce:rotate-0 lg:rotate-0"
              style={{ display: "inline-flex" }}
            >
              {c.papers} free papers
            </span>
          )}
          <span
            className="absolute right-[14%] top-[58%] flex h-8 w-8 rotate-[6deg] items-center justify-center rounded-full bg-whatsapp text-whatsapp-text motion-reduce:rotate-0 lg:rotate-0"
          >
            <WhatsAppIcon className="h-4 w-4" />
          </span>
        </div>
      </div>

      <div className="px-5 pb-8">
        {c?.teachers != null && c.teachers > 0 && (
          <p className="mb-4 text-center text-[14.5px] leading-[1.5] text-[rgba(31,31,31,.7)]">
            {c.teachers} verified tutors in Kolkata. Free to search, free to contact.
          </p>
        )}
        <button
          type="button"
          onClick={dismiss}
          className="flex h-[58px] w-full items-center justify-center gap-2 rounded-full bg-card text-[16px] font-extrabold text-foreground transition-transform duration-tap hover:-translate-y-0.5 active:scale-[0.97]"
        >
          Get started
          <ArrowRight className="h-[18px] w-[18px]" aria-hidden />
        </button>
        <button
          type="button"
          onClick={dismiss}
          className="mt-2 flex h-11 w-full items-center justify-center text-[14px] font-semibold text-[rgba(31,31,31,.6)]"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
