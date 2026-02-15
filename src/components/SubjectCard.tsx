import { Link } from 'react-router-dom';
import { validateImageSrc } from '@/utils/imageSanitizer';

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
      <div className="rounded-2xl border-2 border-transparent hover:border-border py-4 px-2 flex flex-col items-center justify-center text-center gap-2 transition-colors" style={{ backgroundColor: '#fcfbf8' }}>
        {icon && (
          <img src={icon ? validateImageSrc(icon) : ''} alt={name} className="w-10 h-10 object-contain" />
        )}
        <h3 className="font-semibold text-foreground text-sm group-hover:text-foreground/80 transition-colors leading-tight">
          {name}
        </h3>
      </div>
    </Link>
  );
}
