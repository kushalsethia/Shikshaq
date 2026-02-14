import { Link } from 'react-router-dom';

interface SubjectCardProps {
  name: string;
  slug: string;
  imageUrl?: string;
}

export function SubjectCard({ name, slug }: SubjectCardProps) {
  return (
    <Link
      to={`/all-tuition-teachers-in-kolkata?subject=${slug}`}
      className="group"
    >
      <div className="rounded-2xl border-4 border-white bg-white py-4 px-2 flex items-center justify-center text-center min-h-[56px] hover:bg-muted/30 transition-colors">
        <h3 className="font-semibold text-foreground text-sm group-hover:text-foreground/80 transition-colors leading-tight">
          {name}
        </h3>
      </div>
    </Link>
  );
}
