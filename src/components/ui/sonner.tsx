import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";
import { Check, X } from "lucide-react";
import { useIsChromelessRoute } from "@/components/layout/AppShell";

type ToasterProps = React.ComponentProps<typeof Sonner>;

/* Handoff O-010: a 32x32 rounded-[10px] status tile per toast kind — sonner's
 * `icons` prop swaps its default glyph for these globally, so every call
 * site (toast.success(...)/toast.error(...)) gets it for free. */
function StatusTile({ tone }: { tone: "success" | "error" }) {
  return (
    <span
      className="flex h-8 w-8 flex-none items-center justify-center rounded-[10px]"
      style={{ backgroundColor: tone === "success" ? "var(--mint-solid)" : "#F9E2E2" }}
    >
      {tone === "success" ? (
        <Check className="h-4 w-4" style={{ color: "#08301D" }} strokeWidth={2.5} aria-hidden="true" />
      ) : (
        <X className="h-4 w-4" style={{ color: "#8C2A2A" }} strokeWidth={2.5} aria-hidden="true" />
      )}
    </span>
  );
}

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();
  // Handoff O-010: bottom-[150px] on routes with a bottom nav (never covers
  // the nav pill), bottom-6 on chromeless routes. `offset` takes a per-side
  // object — passing a bare number offsets all four sides, which would also
  // crush the toast's horizontal room.
  const chromeless = useIsChromelessRoute();
  const bottomOffset = chromeless ? 24 : 150;

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-center"
      visibleToasts={1}
      offset={{ bottom: bottomOffset, left: 16, right: 16 }}
      mobileOffset={{ bottom: bottomOffset, left: 16, right: 16 }}
      icons={{
        success: <StatusTile tone="success" />,
        error: <StatusTile tone="error" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "group toast flex w-[356px] max-w-[calc(100vw_-_24px)] items-center gap-3 rounded-[20px] bg-panel p-[14px_16px] text-[14px] font-semibold text-[#FCFAF7] shadow-[0_14px_34px_rgba(0,0,0,.32)]",
          description: "text-background/70",
          actionButton:
            "!ml-auto !flex-none !h-9 !rounded-full !bg-white/[0.12] !px-3 !text-[13px] !font-bold !text-background",
          cancelButton: "!ml-auto !flex-none !h-9 !rounded-full !bg-white/[0.12] !px-3 !text-[13px] !font-bold !text-background",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
