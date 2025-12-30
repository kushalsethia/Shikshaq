import { Link } from 'react-router-dom';
import { getSubjectImage } from '@/utils/subject-images';

interface SubjectCardProps {
  name: string;
  slug: string;
  imageUrl?: string;
}

export function SubjectCard({ name, slug, imageUrl }: SubjectCardProps) {
  // Use database image if available, otherwise try to get local image, otherwise show placeholder
  const localImage = getSubjectImage(name, slug);
  const displayImage = imageUrl || localImage;

  return (
    <Link
      to={`/browse?subject=${slug}`}
      className="group relative overflow-hidden rounded-2xl bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="aspect-square overflow-hidden">
        {displayImage ? (
          <img
            src={displayImage}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-accent to-muted flex items-center justify-center">
            <span className="text-3xl font-serif text-muted-foreground">
              {name.charAt(0)}
            </span>
          </div>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/80 to-transparent p-4">
        <h3 className="font-medium text-primary-foreground">{name}</h3>
      </div>
    </Link>
  );
}
