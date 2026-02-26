import { Link } from 'react-router-dom';

interface SubjectCardProps {
  name: string;
  slug: string;
  /** Icon as React node (e.g. Lucide icon) - used for subject cards */
  iconComponent?: React.ReactNode;
  index?: number;
  isVisible?: boolean;
}

export function SubjectCard({ name, slug, iconComponent, index = 0, isVisible = false }: SubjectCardProps) {
  const iconDelay = (index * 60) + 300;

  return (
    <Link
      to={`/all-tuition-teachers-in-kolkata?subject=${slug}`}
      className="group active:scale-95 transition-transform duration-150"
    >
      <div className="rounded-2xl border-2 border-transparent hover:border-border py-4 px-2 flex flex-col items-center justify-center text-center gap-2 transition-colors" style={{ backgroundColor: '#fcfbf8' }}>
        {iconComponent && (
          <span
            className={`flex items-center justify-center text-foreground ${isVisible ? 'animate-icon-bounce' : ''}`}
            style={isVisible ? { animationDelay: `${iconDelay}ms` } : undefined}
          >
            {iconComponent}
          </span>
        )}
        <h3 className="font-semibold text-foreground text-sm group-hover:text-foreground/80 transition-colors leading-tight">
          {name}
        </h3>
      </div>
    </Link>
  );
}
