import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Phone, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { formatDistanceToNow } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { SURFACE_TOKENS, MODE_TOKENS } from '@/utils/searchFacets';
import {
  AdminConsole,
  AdminStatTiles,
  AdminTile,
  AdminPill,
  adminRowStyle,
  adminRowListStyle,
  adminPrimaryBtnStyle,
  adminSecondaryBtnStyle,
  adminFieldStyle,
  adminToast,
  useAdminGuard,
  useReviewerNames,
  type AdminPillTone,
} from '@/components/AdminConsole';

interface Recommendation {
  id: string;
  user_id: string | null;
  recommender_name: string;
  recommender_contact: string;
  teacher_name: string;
  teacher_contact: string;
  status: 'pending' | 'contacted' | 'onboarded' | 'rejected';
  notes: string | null;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}

const TINT = { bg: MODE_TOKENS.teachers.tintBg, text: MODE_TOKENS.teachers.tintText }; // #FFF4E8 / #B35900 per spec

export default function AdminRecommendations() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  const [busyId, setBusyId] = useState<string | null>(null);

  async function fetchRecommendations() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('teacher_recommendations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (import.meta.env.DEV) {
          console.error('Error fetching recommendations:', error);
        }
        adminToast('Failed to load recommendations');
        return;
      }

      const VALID_STATUSES: Recommendation['status'][] = ['pending', 'contacted', 'onboarded', 'rejected'];
      const normalized: Recommendation[] = (data || []).map((row) => ({
        ...row,
        status: (VALID_STATUSES as string[]).includes(row.status)
          ? (row.status as Recommendation['status'])
          : 'pending',
      }));

      setRecommendations(normalized);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error:', error);
      }
      adminToast('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  }

  const { isAdmin, checkingAdmin } = useAdminGuard(user, {
    onGranted: fetchRecommendations,
  });
  const reviewerNames = useReviewerNames(recommendations.map((r) => r.approved_by));

  useEffect(() => {
    if (!checkingAdmin) setLoading(false);
  }, [checkingAdmin]);

  const handleEdit = (rec: Recommendation) => {
    setEditingId(rec.id);
    setEditStatus(rec.status);
    setEditNotes(rec.notes || '');
  };

  const handleSave = async (id: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('teacher_recommendations')
        .update({
          status: editStatus,
          notes: editNotes,
          approved_by: user.id,
          approved_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        console.error('Error updating recommendation:', error);
        adminToast('Failed to update. You may need to update via Supabase Dashboard.');
        return;
      }

      adminToast('Recommendation updated');
      setEditingId(null);
      fetchRecommendations();
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error:', error);
      }
      adminToast('Failed to update recommendation');
    }
  };

  // Quick one-click status change — same update call as handleSave, just
  // scoped to the status field, for the row's default Contact/Dismiss actions.
  const handleQuickStatus = async (id: string, status: Recommendation['status']) => {
    if (!user) return;
    const previous = recommendations.find((r) => r.id === id)?.status;
    try {
      setBusyId(id);
      setRecommendations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));

      const { error } = await supabase
        .from('teacher_recommendations')
        .update({ status, approved_by: user.id, approved_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        if (import.meta.env.DEV) {
          console.error('Error updating recommendation:', error);
        }
        if (previous) {
          setRecommendations((prev) => prev.map((r) => (r.id === id ? { ...r, status: previous } : r)));
        }
        adminToast('Failed to update recommendation');
        return;
      }

      adminToast(status === 'contacted' ? 'Marked as contacted' : 'Recommendation dismissed');
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error:', error);
      }
      if (previous) {
        setRecommendations((prev) => prev.map((r) => (r.id === id ? { ...r, status: previous } : r)));
      }
      adminToast('Failed to update recommendation');
    } finally {
      setBusyId(null);
    }
  };

  const pillTone = (status: Recommendation['status']): AdminPillTone => {
    switch (status) {
      case 'onboarded':
        return 'settled';
      case 'rejected':
        return 'destructive';
      case 'contacted':
        return 'flagged';
      default:
        return 'pending';
    }
  };

  const pendingCount = recommendations.filter((r) => r.status === 'pending').length;

  // Show loading state while checking admin status
  if (checkingAdmin || loading) {
    return (
      <div className="min-h-screen" style={{ background: SURFACE_TOKENS.shell }}>
        <Navbar />
        <div className="container pt-6 sm:pt-8 pb-8 md:pt-8">
          <div className="animate-pulse">
            <div className="h-8 w-48 rounded mb-8" style={{ background: SURFACE_TOKENS.mutedFill }} />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 rounded-2xl" style={{ background: SURFACE_TOKENS.field, boxShadow: '0 0 0 1px rgba(0,0,0,.06)' }} />
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
      <div className="min-h-screen" style={{ background: SURFACE_TOKENS.shell }}>
        <Navbar />
        <main className="container pt-6 sm:pt-8 pb-16 md:pt-16">
          <div className="max-w-md mx-auto">
            <div className="p-8 text-center" style={{ background: SURFACE_TOKENS.field, borderRadius: 24, boxShadow: '0 0 0 1px rgba(0,0,0,.06)' }}>
              <Lock className="w-12 h-12 mx-auto mb-4" style={{ color: SURFACE_TOKENS.textTertiary }} />
              <h1 className="mb-2" style={{ fontSize: 'clamp(20px,2.6vw,26px)', fontWeight: 700, color: SURFACE_TOKENS.textPrimary }}>
                Sign In Required
              </h1>
              <p className="mb-6" style={{ color: SURFACE_TOKENS.textSecondary }}>
                You need to sign in to access the admin panel.
              </p>
              <Link to="/auth">
                <Button>Sign In</Button>
              </Link>
              <div className="mt-6">
                <Link
                  to="/"
                  className="text-sm transition-colors"
                  style={{ color: SURFACE_TOKENS.textSecondary }}
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
      <div className="min-h-screen" style={{ background: SURFACE_TOKENS.shell }}>
        <Navbar />
        <main className="container pt-6 sm:pt-8 pb-8 md:pt-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="mb-4" style={{ fontSize: 'clamp(23px,3vw,32px)', fontWeight: 700, color: SURFACE_TOKENS.textPrimary }}>Access Denied</h1>
            <p className="mb-6" style={{ color: SURFACE_TOKENS.textSecondary }}>
              You need to be an admin to access this page.
            </p>
            <Link to="/">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <AdminConsole
      activeTab="recommendations"
      title="Recommended teachers"
      subtitle="Teachers suggested by students. Contact, verify, then invite."
      tint={TINT}
      tabCount={pendingCount}
    >
      {recommendations.length > 0 && (
        <AdminStatTiles
          stats={[
            { label: 'Total', value: recommendations.length },
            { label: 'Pending', value: recommendations.filter((r) => r.status === 'pending').length },
            { label: 'Contacted', value: recommendations.filter((r) => r.status === 'contacted').length },
            { label: 'Onboarded', value: recommendations.filter((r) => r.status === 'onboarded').length },
          ]}
        />
      )}
      {recommendations.length === 0 ? (
        <div className="text-center py-16" style={{ background: SURFACE_TOKENS.field, borderRadius: 16, boxShadow: '0 0 0 1px rgba(0,0,0,.06)' }}>
          <p style={{ color: SURFACE_TOKENS.textSecondary }}>No recommendations yet.</p>
        </div>
      ) : (
        <div style={adminRowListStyle}>
          {recommendations.map((rec) => {
            const initials = rec.teacher_name?.trim().charAt(0).toUpperCase() || '?';
            const isEditing = editingId === rec.id;
            return (
              <div key={rec.id} style={{ ...adminRowStyle, alignItems: isEditing ? 'flex-start' : 'center' }}>
                <AdminTile tint={TINT}>{initials}</AdminTile>
                <div style={{ flex: '1 1 220px', minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 15.5, fontWeight: 600, color: SURFACE_TOKENS.textPrimary }}>
                      {rec.teacher_name}
                    </span>
                    <AdminPill tone={pillTone(rec.status)}>
                      {rec.status.charAt(0).toUpperCase() + rec.status.slice(1)}
                    </AdminPill>
                  </div>
                  <p style={{ marginTop: 4, fontSize: 13, lineHeight: 1.5, color: SURFACE_TOKENS.textTertiary }}>
                    Recommended by {rec.recommender_name} &middot;{' '}
                    <a href={`tel:${rec.teacher_contact}`} className="hover:underline" style={{ color: SURFACE_TOKENS.textTertiary }}>
                      <Phone className="w-3 h-3 inline -mt-0.5 mr-1" />
                      {rec.teacher_contact}
                    </a>
                    {rec.approved_at && (
                      <> &middot; Reviewed by {rec.approved_by ? (reviewerNames[rec.approved_by] || 'an admin') : 'an admin'}, {formatDistanceToNow(new Date(rec.approved_at), { addSuffix: true })}</>
                    )}
                  </p>

                  {isEditing && (
                    <div className="mt-4 space-y-4" style={{ maxWidth: 520 }}>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block" style={{ color: SURFACE_TOKENS.textSecondary }}>
                            Status
                          </label>
                          <Select value={editStatus} onValueChange={setEditStatus}>
                            <SelectTrigger className="h-auto border-0" style={adminFieldStyle}>
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
                          <label className="text-sm font-medium mb-2 block" style={{ color: SURFACE_TOKENS.textSecondary }}>
                            Notes
                          </label>
                          <Textarea
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            placeholder="Add notes..."
                            rows={3}
                            className="border-0"
                            style={adminFieldStyle}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <button onClick={() => handleSave(rec.id)} style={adminPrimaryBtnStyle}>
                          Save
                        </button>
                        <button onClick={() => setEditingId(null)} style={adminSecondaryBtnStyle}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {!isEditing && (
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => handleQuickStatus(rec.id, 'contacted')}
                      disabled={busyId === rec.id}
                      style={adminPrimaryBtnStyle}
                      className="disabled:opacity-60"
                    >
                      Contact
                    </button>
                    <button
                      onClick={() => handleQuickStatus(rec.id, 'rejected')}
                      disabled={busyId === rec.id}
                      style={adminSecondaryBtnStyle}
                      className="disabled:opacity-60"
                    >
                      Dismiss
                    </button>
                    <button onClick={() => handleEdit(rec)} style={adminSecondaryBtnStyle}>
                      Edit
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AdminConsole>
  );
}
