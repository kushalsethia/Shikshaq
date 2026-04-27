import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const SUGGESTIONS = [
  { label: "Browse all teachers", href: "/all-tuition-teachers-in-kolkata" },
  { label: "Find a Maths tutor", href: "/maths-tuition-teachers-in-kolkata" },
  { label: "Find a Science tutor", href: "/science-tuition-teachers-in-kolkata" },
  { label: "CBSE teachers", href: "/cbse-ncert-tuition-teachers-in-kolkata" },
  { label: "Join as a teacher", href: "/join" },
];

const NotFound = () => {
  const location = useLocation();
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    if (import.meta.env.DEV) {
      console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    }
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <div className="text-center max-w-md">
        <button
          onClick={() => setClicks(c => c + 1)}
          className="text-8xl font-bold tracking-tight select-none transition-transform active:scale-95 cursor-default block mx-auto mb-2"
          aria-label="404"
          style={{ lineHeight: 1 }}
        >
          {clicks >= 5 ? "🎓" : "404"}
        </button>

        <p className="mb-2 text-xl font-semibold text-foreground">
          {clicks >= 5 ? "You found the Easter egg!" : "Page not found"}
        </p>
        <p className="mb-8 text-sm text-muted-foreground">
          {clicks >= 5
            ? "Now go find a great teacher instead."
            : `"${location.pathname}" doesn't exist. Maybe it moved, or it never was.`}
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline transition-colors"
        >
          ← Return home
        </Link>

        <div className="mt-10 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide font-semibold">
            Maybe you were looking for
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((s) => (
              <Link
                key={s.href}
                to={s.href}
                className="text-xs px-3 py-1.5 rounded-full bg-background border border-border text-foreground/80 hover:text-foreground hover:border-foreground/40 transition-colors"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
