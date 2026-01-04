import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

// Admin password from environment variable
// Set VITE_ADMIN_PASSWORD in your .env.local file (not committed to git)
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || '';

export default function AdminRecommendations() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    // Check if admin password is stored in sessionStorage
    const storedAuth = sessionStorage.getItem('admin_authenticated');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
      fetchRecommendations();
    } else {
      setLoading(false);
    }
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if admin password is configured
    if (!ADMIN_PASSWORD) {
      setPasswordError('Admin password not configured. Please set VITE_ADMIN_PASSWORD in your .env.local file.');
      return;
    }
    
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setPasswordError('');
      fetchRecommendations();
    } else {
      setPasswordError('Incorrect password');
      setAdminPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
    setAdminPassword('');
    setRecommendations([]);
  };

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

  // Show password prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container py-16">
          <div className="max-w-md mx-auto">
            <div className="bg-card rounded-3xl p-8 border border-border shadow-sm">
              <div className="text-center mb-6">
                <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h1 className="text-2xl font-serif text-foreground mb-2">
                  Admin Access
                </h1>
                <p className="text-muted-foreground">
                  Enter the admin password to view recommendations
                </p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="adminPassword">Admin Password</Label>
                  <Input
                    id="adminPassword"
                    type="password"
                    value={adminPassword}
                    onChange={(e) => {
                      setAdminPassword(e.target.value);
                      setPasswordError('');
                    }}
                    placeholder="Enter admin password"
                    className={passwordError ? 'border-destructive' : ''}
                    autoFocus
                  />
                  {passwordError && (
                    <p className="text-sm text-destructive">{passwordError}</p>
                  )}
                </div>

                <Button type="submit" className="w-full">
                  Access Admin Panel
                </Button>
              </form>

              <div className="mt-6 text-center">
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-8">
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container py-8">
        {/* Back Button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-2">
              Teacher Recommendations
            </h1>
            <p className="text-muted-foreground">
              View and manage teacher recommendations submitted through the form.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            size="sm"
            className="gap-2"
          >
            <Lock className="w-4 h-4" />
            Logout
          </Button>
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

