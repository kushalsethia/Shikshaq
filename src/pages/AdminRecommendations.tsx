import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, XCircle, Clock, User, Phone, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface Recommendation {
  id: string;
  user_id: string | null;
  recommender_name: string;
  recommender_contact: string;
  teacher_name: string;
  teacher_contact: string;
  status: 'pending' | 'contacted' | 'onboarded' | 'rejected';
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export default function AdminRecommendations() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');

  async function fetchRecommendations() {
    try {
      const { data, error } = await supabase
        .from('teacher_recommendations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching recommendations:', error);
        toast.error('Failed to load recommendations');
        return;
      }

      setRecommendations(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  }

  // Check if current user is an admin
  useEffect(() => {
    async function checkAdminStatus() {
      if (!user) {
        setCheckingAdmin(false);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('admins')
          .select('id')
          .eq('id', user.id)
          .maybeSingle(); // Use maybeSingle instead of single to handle "not found" gracefully

        if (error) {
          // Error querying (table might not exist or RLS issue)
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } else if (data && data.id === user.id) {
          // User is an admin
          setIsAdmin(true);
          fetchRecommendations();
        } else {
          // User is not an admin
          console.log('User is not an admin');
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setCheckingAdmin(false);
        setLoading(false);
      }
    }

    checkAdminStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleEdit = (rec: Recommendation) => {
    setEditingId(rec.id);
    setEditStatus(rec.status);
    setEditNotes(rec.notes || '');
  };

  const handleSave = async (id: string) => {
    try {
      // Note: This will only work if RLS allows updates
      // You may need to use service role key or update RLS policy
      const { error } = await supabase
        .from('teacher_recommendations')
        .update({
          status: editStatus,
          notes: editNotes,
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating recommendation:', error);
        toast.error('Failed to update. You may need to update via Supabase Dashboard.');
        return;
      }

      toast.success('Recommendation updated successfully');
      setEditingId(null);
      fetchRecommendations();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update recommendation');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'onboarded':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'contacted':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'onboarded':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'contacted':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  // Show loading state while checking admin status
  if (checkingAdmin || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container pt-32 sm:pt-[120px] pb-8 md:pt-8">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-muted rounded mb-8" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded-lg" />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show sign-in prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container pt-32 sm:pt-[120px] pb-16 md:pt-16">
          <div className="max-w-md mx-auto">
            <div className="bg-card rounded-3xl p-8 border border-border shadow-sm text-center">
              <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-serif text-foreground mb-2">
                Sign In Required
              </h1>
              <p className="text-muted-foreground mb-6">
                You need to sign in to access the admin panel.
              </p>
              <Link to="/auth">
                <Button>Sign In</Button>
              </Link>
              <div className="mt-6">
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 inline mr-2" />
                  Back to home
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show access denied if user is not an admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container pt-32 sm:pt-[120px] pb-16 md:pt-16">
          <div className="max-w-md mx-auto">
            <div className="bg-card rounded-3xl p-8 border border-border shadow-sm text-center">
              <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-serif text-foreground mb-2">
                Access Denied
              </h1>
              <p className="text-muted-foreground mb-6">
                You don't have admin privileges to access this page.
              </p>
              <Link to="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container pt-32 sm:pt-[120px] pb-8 md:pt-8">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-2">
            Teacher Recommendations
          </h1>
          <p className="text-muted-foreground">
            View and manage teacher recommendations submitted through the form.
          </p>
        </div>

        {/* Recommendations List */}
        {recommendations.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-border">
            <p className="text-muted-foreground">No recommendations yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-shadow"
              >
                {editingId === rec.id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">
                          Status
                        </label>
                        <Select value={editStatus} onValueChange={setEditStatus}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="onboarded">Onboarded</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground mb-2 block">
                          Notes
                        </label>
                        <Textarea
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          placeholder="Add notes..."
                          rows={3}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleSave(rec.id)} size="sm">
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditingId(null)}
                        size="sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-serif text-foreground">
                            {rec.teacher_name}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              rec.status
                            )}`}
                          >
                            {getStatusIcon(rec.status)}
                            {rec.status.charAt(0).toUpperCase() + rec.status.slice(1)}
                          </span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground mb-1">Teacher Contact</p>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              <a
                                href={`tel:${rec.teacher_contact}`}
                                className="text-foreground hover:underline"
                              >
                                {rec.teacher_contact}
                              </a>
                            </div>
                          </div>
                          <div>
                            <p className="text-muted-foreground mb-1">Recommended by</p>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <span className="text-foreground">{rec.recommender_name}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              <a
                                href={`tel:${rec.recommender_contact}`}
                                className="text-foreground hover:underline text-sm"
                              >
                                {rec.recommender_contact}
                              </a>
                            </div>
                          </div>
                        </div>
                        {rec.notes && (
                          <div className="mt-4 p-3 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">Notes:</p>
                            <p className="text-sm text-foreground">{rec.notes}</p>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(rec)}
                        className="ml-4"
                      >
                        Edit
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Submitted: {new Date(rec.created_at).toLocaleString()}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

