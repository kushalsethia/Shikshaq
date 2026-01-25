import { Link, useLocation } from 'react-router-dom';
import { Home, Search, HelpCircle, Menu, X, LogIn, Heart, Shield, GraduationCap, Users, MessageSquare, ThumbsUp, Mail, ExternalLink } from 'lucide-react';
import { WhatsAppIcon, InstagramIcon } from '@/components/BrandIcons';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '@/components/Logo';
import { getWhatsAppLink } from '@/utils/whatsapp';

export function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const { user, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<'student' | 'guardian' | 'teacher' | null>(null);

  // Check if user is an admin and get their role
  useEffect(() => {
    async function checkAdminStatusAndRole() {
      if (!user) {
        setIsAdmin(false);
        setUserRole(null);
        return;
      }

      try {
        // Check admin status
        const { data: adminData, error: adminError } = await supabase
          .from('admins')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();

        if (adminError) {
          console.log('Error checking admin status:', adminError.message);
          setIsAdmin(false);
        } else if (adminData && adminData.id === user.id) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }

        // Get user role from profiles
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          console.log('Error fetching profile:', profileError.message);
          setUserRole(null);
        } else if (profileData) {
          setUserRole(profileData.role as 'student' | 'guardian' | 'teacher');
        } else {
          setUserRole(null);
        }
      } catch (error) {
        console.error('Error:', error);
        setIsAdmin(false);
        setUserRole(null);
      }
    }

    checkAdminStatusAndRole();
  }, [user]);

  // Handle scroll detection for collapsing main navbar on mobile
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = Math.max(0, window.scrollY); // Prevent negative values
      const previousScrollY = lastScrollY.current;
      
      // Use hysteresis with smoother thresholds
      // Scrolling down: trigger at 10px (slightly higher to prevent immediate jump)
      // Scrolling up: hide when back at top (0px) but keep state until fully at top
      if (scrollPosition > previousScrollY) {
        // Scrolling down
        setIsScrolled(scrollPosition > 10);
      } else if (scrollPosition < previousScrollY) {
        // Scrolling up - only hide when fully at top
        setIsScrolled(scrollPosition > 0);
      }
      // If scrollPosition === previousScrollY, keep current state
      
      lastScrollY.current = scrollPosition;
    };

    // Check initial scroll position
    lastScrollY.current = Math.max(0, window.scrollY);
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/all-tuition-teachers-in-kolkata', label: 'Browse', icon: Search },
    { path: '/more', label: 'Help', icon: HelpCircle },
  ];

  const isActive = (path: string) => location.pathname === path;
  const isBrowsePage = location.pathname === '/all-tuition-teachers-in-kolkata';
  // Check if we're on a subject page (pattern: /{subject}-tuition-teachers-in-kolkata)
  const isSubjectPage = /^\/[^\/]+-tuition-teachers-in-kolkata$/.test(location.pathname);

  return (
    <>
      <header className={`${isScrolled && !isBrowsePage && !isSubjectPage ? 'md:sticky fixed' : 'sticky'} top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 transition-transform duration-300 ease-in-out ${
        isScrolled && !isBrowsePage && !isSubjectPage ? 'md:translate-y-0 -translate-y-full' : ''
      }`}>
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-16">
            {/* Logo */}
            <Logo size="md" />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 bg-muted/50 rounded-full p-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${isActive(item.path) ? 'nav-link-active' : 'hover:bg-muted'}`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Side - Mobile and Desktop */}
          <div className="flex items-center gap-3">
            <Link
              to="/join"
              className="hidden md:block text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
            >
              Join as a teacher
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || ''} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="text-muted-foreground text-sm">
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {userRole === 'student' && (
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard/student" className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        Student Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {userRole === 'guardian' && (
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard/guardian" className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Guardian Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/liked-teachers" className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Favourite Teachers
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin/recommendations" className="flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Recommendations
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/comments" className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Comments
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/upvotes" className="flex items-center gap-2">
                          <ThumbsUp className="w-4 h-4" />
                          Upvotes
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/feedback" className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Feedback
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="text-destructive">
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm" className="gap-2">
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign in</span>
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <DropdownMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 md:hidden">
                <DropdownMenuItem asChild>
                  <Link to="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Home
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/all-tuition-teachers-in-kolkata" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Browse
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/faq" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" />
                    FAQ
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/join" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Join as a teacher
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="px-2 py-1.5">
                  <div className="flex items-center gap-3 justify-center">
                    <a
                      href="mailto:join.shikshaq@gmail.com"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 rounded-lg hover:bg-muted transition-colors"
                      aria-label="Gmail"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                    <a
                      href="https://instagram.com/shikshaq.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 rounded-lg hover:bg-muted transition-colors"
                      aria-label="Instagram"
                    >
                      <InstagramIcon className="w-5 h-5" />
                    </a>
                    <a
                      href={getWhatsAppLink('8240980312')}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 rounded-lg hover:bg-muted transition-colors"
                      aria-label="WhatsApp"
                    >
                      <WhatsAppIcon className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </div>
    </header>

    {/* Mobile Floating Navigation Bar - Below Main Navbar */}
    {isBrowsePage || isSubjectPage ? (
      <div className="md:hidden sticky top-16 z-40 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-around h-14">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
                  isActive(item.path)
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    ) : (
      <div className={`md:hidden fixed left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm transition-all duration-300 ease-in-out ${
        isScrolled ? 'top-0' : 'top-16'
      }`}>
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-around h-14">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
                  isActive(item.path)
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    )}
    </>
  );
}
