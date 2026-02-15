import { Link } from 'react-router-dom';

interface SubjectCardProps {
  name: string;
  slug: string;
  imageUrl?: string;
  icon?: string;
}

export function SubjectCard({ name, slug, icon }: SubjectCardProps) {
  return (
    <Link
      to={`/all-tuition-teachers-in-kolkata?subject=${slug}`}
      className="group"
    >
      <div className="rounded-2xl border-2 border-border bg-card py-4 px-2 flex flex-col items-center justify-center text-center gap-2 hover:bg-muted/30 transition-colors">
        {icon && (
          <img src={icon} alt={name} className="w-10 h-10 object-contain" />
        )}
        <h3 className="font-semibold text-foreground text-sm group-hover:text-foreground/80 transition-colors leading-tight">
          {name}
        </h3>
      </div>
    </Link>
  );
}
