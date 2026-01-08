import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Clock, MessageCircle, BadgeCheck, Heart } from 'lucide-react';
import { useLikes } from '@/lib/likes-context';
import { useAuth } from '@/lib/auth-context';
import { getWhatsAppLink } from '@/utils/whatsapp';
import { TeacherComments } from '@/components/TeacherComments';


interface Teacher {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  bio: string | null;
  experience_years: number | null;
  location: string | null;
  whatsapp_number: string | null;
  is_verified: boolean;
  subjects: { name: string; slug: string } | null;
  subjects_text?: string | null; // The subjects text field from teachers_list
  subjects_from_shikshaq?: string | null; // The "Subjects" field from Shikshaqmine table
  classes?: string | null; // The classes text field from teachers_list
  classes_taught?: string | null; // The "Classes Taught" field from Shikshaqmine table
  sir_maam?: string | null; // The "Sir/Ma'am?" field from Shikshaqmine table
  area?: string | null; // The "Area" field from Shikshaqmine table
  boards_taught?: string | null; // The "School Boards Catered" field from Shikshaqmine table
  class_size?: string | null; // The "Class Size (Group/ Solo)" field from Shikshaqmine table
  mode_of_teaching?: string | null; // The "Mode of Teaching" field from Shikshaqmine table
}

export default function TeacherProfile() {
  const { slug } = useParams<{ slug: string }>();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { isLiked, toggleLike } = useLikes();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTeacher() {
      if (!slug) return;

      // Fetch teacher from teachers_list
      const { data: teacherData } = await supabase
        .from('teachers_list')
        .select('*, subjects(name, slug)')
        .eq('slug', slug)
        .maybeSingle();

      // Fetch all data from Shikshaqmine table
      let sirMaam = null;
      let subjectsFromShikshaq = null;
      let classesTaught = null;
      let area = null;
      let boardsTaught = null;
      let classSize = null;
      let modeOfTeaching = null;
      if (teacherData) {
        try {
          const { data: shikshaqData, error } = await supabase
            .from('Shikshaqmine')
            .select('*')
            .eq('Slug', slug)
            .maybeSingle();
          
          if (shikshaqData && !error) {
            // Access the columns with special characters
            sirMaam = (shikshaqData as any)["Sir/Ma'am?"];
            subjectsFromShikshaq = (shikshaqData as any)["Subjects"];
            classesTaught = (shikshaqData as any)["Classes Taught"];
            area = (shikshaqData as any)["Area"];
            boardsTaught = (shikshaqData as any)["School Boards Catered"];
            classSize = (shikshaqData as any)["Class Size (Group/ Solo)"];
            modeOfTeaching = (shikshaqData as any)["Mode of Teaching"];
            console.log('Found data from Shikshaqmine:', { 
              sirMaam, 
              subjects: subjectsFromShikshaq,
              classesTaught: classesTaught,
              area: area,
              boardsTaught: boardsTaught,
              classSize: classSize,
              modeOfTeaching: modeOfTeaching
            });
          } else if (error) {
            console.warn('Error fetching from Shikshaqmine:', error);
          }
        } catch (err) {
          console.warn('Error accessing Shikshaqmine table:', err);
        }
      }

      if (teacherData) {
        // Add all the data to the teacher object
        setTeacher({
          ...teacherData,
          sir_maam: sirMaam,
          subjects_from_shikshaq: subjectsFromShikshaq,
          classes_taught: classesTaught,
          area: area,
          boards_taught: boardsTaught,
          class_size: classSize,
          mode_of_teaching: modeOfTeaching,
        } as Teacher);
      }
      setLoading(false);
    }

    fetchTeacher();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-muted rounded mb-8" />
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-[4/5] bg-muted rounded-3xl" />
              <div className="space-y-4">
                <div className="h-10 w-3/4 bg-muted rounded" />
                <div className="h-6 w-1/4 bg-muted rounded" />
                <div className="h-24 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-serif text-foreground mb-4">Teacher not found</h1>
          <p className="text-muted-foreground mb-6">
            The teacher you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/browse">
            <Button>Browse all teachers</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8">
        {/* Back Button */}
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all teachers
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          {/* Image */}
          <div className="relative">
            <div className="sticky top-24">
              {teacher.image_url ? (
                <img
                  src={teacher.image_url}
                  alt={teacher.name}
                  className="w-full aspect-[4/5] object-cover rounded-3xl shadow-xl"
                />
              ) : (
                <div className="w-full aspect-[4/5] bg-gradient-to-br from-muted to-accent flex items-center justify-center rounded-3xl shadow-xl">
                  <span className="text-6xl font-serif text-muted-foreground">
                    {teacher.name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                {teacher.is_verified && (
                  <div className="bg-card/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5">
                    <BadgeCheck className="w-4 h-4 text-badge-science" />
                    <span className="text-sm font-medium">Verified</span>
                  </div>
                )}
                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    if (!user) {
                      navigate('/auth');
                      return;
                    }
                    await toggleLike(teacher.id);
                  }}
                  className="p-3 rounded-full bg-card/90 backdrop-blur-sm hover:bg-card transition-colors"
                  aria-label={isLiked(teacher.id) ? 'Remove from favourites' : 'Add to favourites'}
                >
                  <Heart
                    className={`w-6 h-6 transition-colors ${
                      isLiked(teacher.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-foreground/70 hover:text-red-500'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="py-4">
            {/* Subject Badge */}
            {teacher.subjects && (
              <Link
                to={`/browse?subject=${teacher.subjects.slug}`}
                className="inline-block mb-4"
              >
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                  {teacher.subjects.name}
                </span>
              </Link>
            )}

            <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-4">
              {(() => {
                const sirMaam = teacher.sir_maam;
                if (!sirMaam) return teacher.name;
                
                const sirMaamLower = String(sirMaam).toLowerCase().trim();
                if (sirMaamLower === 'sir' || sirMaamLower.includes('sir')) {
                  return `${teacher.name} Sir`;
                } else if (sirMaamLower === "ma'am" || sirMaamLower === "maam" || sirMaamLower.includes("ma'am")) {
                  return `${teacher.name} Ma'am`;
                }
                return teacher.name;
              })()}
            </h1>

            {/* Quick Info */}
            <div className="flex flex-wrap gap-4 mb-6">
              {teacher.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{teacher.location}</span>
                </div>
              )}
              {teacher.experience_years && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{teacher.experience_years}+ years experience</span>
                </div>
              )}
            </div>

            {/* He/She teaches section */}
            <div className="mb-6">
              {(() => {
                // Get gender from Shikshaqmine table (sir_maam field)
                const sirMaam = teacher.sir_maam;
                const nameLower = teacher.name.toLowerCase();
                
                let pronoun = 'She'; // Default to "She"
                let possessive = 'Her'; // Default to "Her"
                
                if (sirMaam) {
                  // Use the Shikshaqmine table field
                  const sirMaamLower = String(sirMaam).toLowerCase().trim();
                  if (sirMaamLower === 'sir' || sirMaamLower.includes('sir')) {
                    pronoun = 'He';
                    possessive = 'His';
                  } else if (sirMaamLower === "ma'am" || sirMaamLower === "maam" || sirMaamLower.includes("ma'am")) {
                    pronoun = 'She';
                    possessive = 'Her';
                  }
                } else {
                  // Fallback to name-based detection if Shikshaqmine data not found
                  const hasSir = nameLower.includes('sir');
                  const hasMr = nameLower.includes('mr') || nameLower.includes('mr.');
                  if (hasSir || hasMr) {
                    pronoun = 'He';
                    possessive = 'His';
                  }
                }
                
                // Get subjects from Shikshaqmine table first, then fallback to other sources
                const subjectsList = teacher.subjects_from_shikshaq
                  ? teacher.subjects_from_shikshaq.split(',').map((s: string) => s.trim()).filter((s: string) => s)
                  : (teacher as any).subjects_text 
                  ? (teacher as any).subjects_text.split(',').map((s: string) => s.trim()).filter((s: string) => s)
                  : teacher.subjects 
                  ? [teacher.subjects.name]
                  : [];
                
                return (
                  <>
                    {subjectsList.length > 0 && (
                      <>
                        <p className="text-sm text-muted-foreground mb-3">{pronoun} teaches</p>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {subjectsList.map((subject: string, index: number) => (
                            <span
                              key={index}
                              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                );
              })()}

              {/* To students of section */}
              {(() => {
                // Get classes from Shikshaqmine table first, then fallback to teachers_list
                const classesData = teacher.classes_taught || (teacher as any).classes;
                
                if (classesData) {
                  const classesList = classesData.split(',').map((cls: string) => cls.trim()).filter((cls: string) => cls);
                  
                  if (classesList.length > 0) {
                    return (
                      <>
                        <p className="text-sm text-muted-foreground mb-3">to students of</p>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {classesList.map((cls: string, index: number) => (
                            <span
                              key={index}
                              className="px-3 py-1.5 rounded-lg text-sm font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
                            >
                              {cls}
                            </span>
                          ))}
                        </div>
                      </>
                    );
                  }
                }
                return null;
              })()}
            </div>

            {/* Tuition centre location section */}
            {(() => {
              const sirMaam = teacher.sir_maam;
              const nameLower = teacher.name.toLowerCase();
              
              let possessive = 'Her'; // Default to "Her"
              
              if (sirMaam) {
                const sirMaamLower = String(sirMaam).toLowerCase().trim();
                if (sirMaamLower === 'sir' || sirMaamLower.includes('sir')) {
                  possessive = 'His';
                }
              } else {
                const hasSir = nameLower.includes('sir');
                const hasMr = nameLower.includes('mr') || nameLower.includes('mr.');
                if (hasSir || hasMr) {
                  possessive = 'His';
                }
              }

              const areaData = teacher.area;
              
              if (areaData) {
                return (
                  <div className="mb-8">
                    <p className="text-sm text-foreground mb-3">
                      <span className="font-serif">{possessive}</span>{' '}
                      <span className="px-2 py-1 rounded-md bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 text-sm font-medium">
                        Tuition centre(s)
                      </span>{' '}
                      <span className="font-serif">are located in</span>
                    </p>
                    <div className="w-full px-4 py-3 rounded-lg bg-muted text-foreground border border-border">
                      {areaData}
                    </div>
                  </div>
                );
              }
              return null;
            })()}


            {/* Additional Details Section */}
            {(teacher.boards_taught || teacher.class_size || teacher.mode_of_teaching) && (
              <div className="mb-8">
                <h3 className="text-lg font-serif text-foreground mb-6">Here are some more details:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Boards taught */}
                  {teacher.boards_taught && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Boards taught</h4>
                      <div className="px-4 py-3 rounded-lg bg-muted text-foreground border border-border">
                        {teacher.boards_taught}
                      </div>
                    </div>
                  )}

                  {/* Class Size */}
                  {teacher.class_size && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Class Size</h4>
                      <div className="px-4 py-3 rounded-lg bg-muted text-foreground border border-border">
                        {teacher.class_size}
                      </div>
                    </div>
                  )}

                  {/* Mode of teaching */}
                  {teacher.mode_of_teaching && (
                    <div className="md:col-span-2">
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Mode of teaching</h4>
                      <div className="px-4 py-3 rounded-lg bg-muted text-foreground border border-border">
                        {teacher.mode_of_teaching}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h3 className="font-medium text-foreground mb-2">Interested in classes?</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Reach out directly to discuss class timings, fees, and more.
              </p>
              {user ? (
                <a
                  href={getWhatsAppLink(teacher.whatsapp_number)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Contact via WhatsApp
                  </Button>
                </a>
              ) : (
                <Button 
                  className="w-full gap-2" 
                  onClick={() => navigate('/auth')}
                >
                  <MessageCircle className="w-4 h-4" />
                  Sign in to contact
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Comments Section */}
        {teacher && <TeacherComments teacherId={teacher.id} />}
      </main>

      <Footer />
    </div>
  );
}
