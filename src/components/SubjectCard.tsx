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
      to={`/all-tuition-teachers-in-kolkata?subject=${slug}`}
      className="group"
    >
      <div className="rounded-2xl border-4 border-white overflow-hidden">
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
        
        {/* Subject Name - Inside the bordered card */}
        <div className="py-2.5 bg-white">
          <h3 className="font-semibold text-foreground text-sm group-hover:text-foreground/80 transition-colors px-3">
            {name}
          </h3>
        </div>
      </div>
    </Link>
  );
}
