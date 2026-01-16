import { Link, useLocation } from 'react-router-dom';
import { Home, Search, HelpCircle, Menu, X, LogIn, Heart, Shield, GraduationCap, Users, MessageSquare, ThumbsUp, Mail, Instagram, MessageCircle, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
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

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/browse', label: 'Browse', icon: Search },
    { path: '/help', label: 'Help', icon: HelpCircle },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
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

          {/* Right Side */}
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
            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Hamburger Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="nav-link hover:bg-muted"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
              <Link
                to="/help#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="nav-link hover:bg-muted"
              >
                <HelpCircle className="w-4 h-4" />
                FAQ
              </Link>
              <a
                href="mailto:join.shikshaq@gmail.com"
                onClick={() => setMobileMenuOpen(false)}
                className="nav-link hover:bg-muted"
              >
                <Mail className="w-4 h-4" />
                Gmail
              </a>
              <a
                href="https://www.instagram.com/shikshaq.in"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="nav-link hover:bg-muted"
              >
                <Instagram className="w-4 h-4" />
                Instagram
              </a>
              <a
                href={getWhatsAppLink('8240980312')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="nav-link hover:bg-muted"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
              <Link
                to="/join"
                onClick={() => setMobileMenuOpen(false)}
                className="nav-link hover:bg-muted"
              >
                <ExternalLink className="w-4 h-4" />
                Join as a teacher
              </Link>
              <Link
                to="/recommend-teacher"
                onClick={() => setMobileMenuOpen(false)}
                className="nav-link hover:bg-muted"
              >
                <ExternalLink className="w-4 h-4" />
                Recommend a teacher
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>

    {/* Mobile Sticky Navigation Bar - Below Main Navbar */}
    <div className="md:hidden sticky top-16 z-40 bg-background border-b border-border/50">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-around h-14">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
                isActive(item.path)
                  ? 'text-foreground border-b-2 border-foreground'
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
    </>
  );
}
