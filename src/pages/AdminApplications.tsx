import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { ArrowLeft, CheckCircle, XCircle, Search, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { recordAdminAction } from '@/lib/audit';
import { Link } from 'react-router-dom';
import { Footer } from '@/components/Footer';
import { formatDistanceToNow } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { validateImageSrc } from '@/utils/imageSanitizer';
import { SURFACE_TOKENS, MODE_TOKENS } from '@/utils/searchFacets';
import {
  AdminConsole,
  AdminAuditFootnote,
  AdminStatTiles,
  adminFieldStyle,
  adminPanelStyle,
  adminPrimaryBtnStyle,
  adminSecondaryBtnStyle,
  adminDestructiveBtnStyle,
  adminToast,
  useAdminGuard,
  useReviewerNames,
} from '@/components/AdminConsole';
import {
  AdminTable,
  type AdminTableColumn,
  type AdminTableRow,
  type AdminPillTone as AdminStatePillTone,
} from '@/pages/admin/AdminTable';

interface TeacherApplication {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  sir_maam: 'Sir' | "Ma'am";
  subjects: string | null;
  classes_taught_for_backend: string | null;
  school_boards_catered: string | null;
  location_v2: string | null;
  students_home_areas: string | null;
  tutors_home_areas: string | null;
  mode_of_teaching: string | null;
  class_size: string | null;
  description: string | null;
  qualifications_etc: string | null;
  years_started_teaching: string | null;
  featured_subject: string | null;
  whatsapp_link: string | null;
  hero_image_url: string | null;
  reference_name: string | null;
  reference_number: string | null;
  mou_consent: boolean;
  mou_consent_timestamp: string | null;
  status: 'pending' | 'approved' | 'rejected';
  texted_status: 'not_texted' | 'texted' | 'follow_up';
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

const TINT = { bg: MODE_TOKENS.teachers.tintBg, text: MODE_TOKENS.teachers.tintText }; // teachers tint tokens per spec

export default function AdminApplications() {
  const { user, profile } = useAuth();
  const actorName = profile?.full_name || user?.email || 'an admin';
  const [applications, setApplications] = useState<TeacherApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<TeacherApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<TeacherApplication | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const { isAdmin, checkingAdmin } = useAdminGuard(user, {
    onGranted: fetchApplications,
    redirectOnDenied: true,
  });
  const reviewerNames = useReviewerNames(applications.map((a) => a.reviewed_by));

  useEffect(() => {
    if (!checkingAdmin) setLoading(false);
  }, [checkingAdmin]);

  async function fetchApplications() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('teacher_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (import.meta.env.DEV) {
          console.error('Error fetching applications:', error);
        }
        adminToast('Failed to load applications');
        return;
      }

      const VALID_APP_STATUSES: TeacherApplication['status'][] = ['pending', 'approved', 'rejected'];
      const VALID_TEXTED_STATUSES: TeacherApplication['texted_status'][] = ['not_texted', 'texted', 'follow_up'];
      const normalized: TeacherApplication[] = (data || []).map((row) => ({
        ...row,
        sir_maam: row.sir_maam === 'Sir' || row.sir_maam === "Ma'am" ? row.sir_maam : 'Sir',
        status: (VALID_APP_STATUSES as string[]).includes(row.status)
          ? (row.status as TeacherApplication['status'])
          : 'pending',
        texted_status: (VALID_TEXTED_STATUSES as string[]).includes(row.texted_status)
          ? (row.texted_status as TeacherApplication['texted_status'])
          : 'not_texted',
      }));

      setApplications(normalized);
      setFilteredApplications(normalized);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error:', error);
      }
      adminToast('Failed to load applications');
    } finally {
      setLoading(false);
    }
  }

  // Filter applications
  useEffect(() => {
    let filtered = applications;

    // Apply status filter
    if (filter === 'pending') {
      filtered = filtered.filter(app => app.status === 'pending');
    } else if (filter === 'approved') {
      filtered = filtered.filter(app => app.status === 'approved');
    } else if (filter === 'rejected') {
      filtered = filtered.filter(app => app.status === 'rejected');
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.name?.toLowerCase().includes(query) ||
          app.email?.toLowerCase().includes(query) ||
          app.phone_number?.includes(query) ||
          app.reference_name?.toLowerCase().includes(query) ||
          app.reference_number?.includes(query)
      );
    }

    // Apply sort — created_at is a real, always-present column.
    filtered = [...filtered].sort((a, b) => {
      const diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return sortOrder === 'newest' ? -diff : diff;
    });

    setFilteredApplications(filtered);
  }, [searchQuery, filter, applications, sortOrder]);

  const handleApprove = async (applicationId: string) => {
    if (!user) {
      adminToast('You must be logged in to approve applications');
      return;
    }

    try {
      setProcessingId(applicationId);

      // Call the approve function
      const { data, error } = await supabase.rpc('approve_teacher_application', {
        application_id: applicationId,
        admin_id: user.id,
      });

      if (error) {
        if (import.meta.env.DEV) {
          console.error('Error approving application:', error);
        }
        adminToast(error.message || 'Failed to approve application');
        return;
      }

      adminToast('Application approved. Teacher profile created.');
      const approvedApp = applications.find((a) => a.id === applicationId);
      if (user) {
        void recordAdminAction({
          actorId: user.id,
          actorName,
          action: 'approve',
          targetType: 'teacher_application',
          targetId: applicationId,
          targetLabel: approvedApp?.name || 'teacher',
        });
      }
      await fetchApplications();
      setSelectedApplication(null);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error:', error);
      }
      adminToast('An unexpected error occurred');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (applicationId: string, reason?: string) => {
    if (!user) {
      adminToast('You must be logged in to reject applications');
      return;
    }

    try {
      setProcessingId(applicationId);

      const { error } = await supabase
        .from('teacher_applications')
        .update({
          status: 'rejected',
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          rejection_reason: reason || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', applicationId);

      if (error) {
        if (import.meta.env.DEV) {
          console.error('Error rejecting application:', error);
        }
        adminToast('Failed to reject application');
        return;
      }

      adminToast('Application rejected');
      const rejectedApp = applications.find((a) => a.id === applicationId);
      if (user) {
        void recordAdminAction({
          actorId: user.id,
          actorName,
          action: 'reject',
          targetType: 'teacher_application',
          targetId: applicationId,
          targetLabel: rejectedApp?.name || 'teacher',
          reason: reason || null,
        });
      }
      await fetchApplications();
      setSelectedApplication(null);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error:', error);
      }
      adminToast('An unexpected error occurred');
    } finally {
      setProcessingId(null);
    }
  };

  const handleTextedStatusChange = async (applicationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('teacher_applications')
        .update({ texted_status: newStatus })
        .eq('id', applicationId);

      if (error) {
        if (import.meta.env.DEV) {
          console.error('Error updating texted status:', error);
        }
        adminToast('Failed to update texted status');
        return;
      }

      setApplications(prev =>
        prev.map(app =>
          app.id === applicationId ? { ...app, texted_status: newStatus as TeacherApplication['texted_status'] } : app
        )
      );
      adminToast('Texted status updated');
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error:', error);
      }
      adminToast('Failed to update texted status');
    }
  };

  const applicationStateTone = (status: TeacherApplication['status']): AdminStatePillTone => {
    switch (status) {
      case 'approved':
        return 'ok';
      case 'rejected':
        return 'bad';
      default:
        return 'wait';
    }
  };

  const getTextedStatusLabel = (status: string) => {
    switch (status) {
      case 'texted': return 'Texted';
      case 'follow_up': return 'Follow Up';
      default: return 'Not Texted';
    }
  };

  const pendingCount = applications.filter((a) => a.status === 'pending').length;
  const approvedCount = applications.filter((a) => a.status === 'approved').length;
  const rejectedCount = applications.filter((a) => a.status === 'rejected').length;

  if (checkingAdmin || loading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: SURFACE_TOKENS.shell }}>
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 w-48 rounded mb-8" style={{ background: SURFACE_TOKENS.mutedFill }} />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 rounded-2xl" style={{ background: SURFACE_TOKENS.field, boxShadow: '0 0 0 1px rgba(0,0,0,.06)' }} />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: SURFACE_TOKENS.shell }}>
        <main className="flex-1 flex items-center justify-center container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="mb-4" style={{ fontSize: 'clamp(23px,3vw,32px)', fontWeight: 700, color: SURFACE_TOKENS.textPrimary }}>Access Denied</h1>
            <p className="mb-6" style={{ color: SURFACE_TOKENS.textSecondary }}>
              You need to be an admin to access this page.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2"
              style={{ background: SURFACE_TOKENS.ink, color: '#fff', borderRadius: 12, padding: '11px 18px', fontSize: 13.5, fontWeight: 600 }}
            >
              <ArrowLeft className="w-4 h-4" />
              Go Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const applicationColumns: AdminTableColumn[] = [
    { key: 'applicant', label: 'Applicant', width: '2.2fr' },
    { key: 'teaches', label: 'Teaches', width: '1.6fr' },
    { key: 'area', label: 'Area', width: '1fr' },
    { key: 'state', label: 'State', width: '1fr' },
    { key: 'actions', label: '', width: '140px' },
  ];

  const applicationRows: AdminTableRow[] = filteredApplications.map((application) => {
    const initials = application.name?.trim().charAt(0).toUpperCase() || '?';
    const teaches = [application.subjects, application.classes_taught_for_backend]
      .filter(Boolean)
      .join(' · ') || 'N/A';
    return {
      id: application.id,
      initial: initials,
      title: application.name,
      subtitle: `+91 ${application.phone_number} · ${getTextedStatusLabel(application.texted_status)}`,
      cells: [teaches, application.location_v2 || 'N/A'],
      tone: applicationStateTone(application.status),
      tag: application.status.charAt(0).toUpperCase() + application.status.slice(1),
      actionLabel: 'Review',
      onAction: () => setSelectedApplication(application),
    };
  });

  const searchSlot = (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: SURFACE_TOKENS.textTertiary }} aria-hidden />
      <input
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by name, email, phone, or reference..."
        aria-label="Search applications"
        className="h-11 w-[280px] rounded-full bg-muted pl-9 pr-4 text-sm text-foreground placeholder:text-warm-label outline-none transition-shadow duration-150 focus-visible:ring-2 focus-visible:ring-brand"
      />
    </div>
  );

  const sortSlot = (
    <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as 'newest' | 'oldest')}>
      <SelectTrigger className="h-11 w-[150px] rounded-full border-0 bg-muted text-sm font-semibold">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Newest first</SelectItem>
        <SelectItem value="oldest">Oldest first</SelectItem>
      </SelectContent>
    </Select>
  );

  return (
    <AdminConsole
      activeTab="applications"
      title="Teacher applications"
      subtitle="Verify qualifications and references before a profile goes live."
      tint={TINT}
      tabCount={pendingCount}
      search={searchSlot}
      sort={sortSlot}
    >
      <AdminStatTiles
        stats={[
          { label: 'Total', value: applications.length },
          { label: 'Pending', value: pendingCount },
          { label: 'Approved', value: approvedCount },
          { label: 'Rejected', value: rejectedCount },
        ]}
      />

      {/* Filters — search + sort now live in the toolbar (top-right, desktop). This mobile-visible
          search box keeps the same functionality below lg:. */}
      <div className="mb-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 lg:hidden">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: SURFACE_TOKENS.textTertiary }} />
          <Input
            type="text"
            placeholder="Search by name, email, phone, or reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-auto border-0"
            style={adminFieldStyle}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={filter === f ? adminPrimaryBtnStyle : adminSecondaryBtnStyle}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Applications table */}
      {filteredApplications.length === 0 ? (
        <div className="text-center" style={{ ...adminPanelStyle, padding: 48 }}>
          <p style={{ color: SURFACE_TOKENS.textTertiary, fontSize: 14.5 }}>No applications found</p>
        </div>
      ) : (
        <AdminTable columns={applicationColumns} rows={applicationRows} />
      )}

      <AdminAuditFootnote />

      {/* Application Detail Modal */}
      <Dialog open={!!selectedApplication} onOpenChange={(open) => { if (!open) setSelectedApplication(null); }}>
        <DialogContent aria-describedby={undefined}
          className="max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          style={{ ...adminPanelStyle, padding: 24 }}
        >
          {selectedApplication && (
          <>
            <div className="flex items-center justify-between mb-6 gap-4">
              <DialogTitle style={{ fontSize: 'clamp(19px,2.4vw,24px)', fontWeight: 700, color: SURFACE_TOKENS.textPrimary }}>{selectedApplication.name}</DialogTitle>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="mb-2" style={{ fontSize: 13.5, fontWeight: 600, color: SURFACE_TOKENS.textPrimary }}>Basic Information</h3>
                <div className="space-y-1.5" style={{ fontSize: 13.5, color: SURFACE_TOKENS.textBody }}>
                  <div><strong style={{ color: SURFACE_TOKENS.textPrimary }}>Name:</strong> {selectedApplication.name}</div>
                  <div><strong style={{ color: SURFACE_TOKENS.textPrimary }}>Email:</strong> {selectedApplication.email}</div>
                  <div><strong style={{ color: SURFACE_TOKENS.textPrimary }}>Phone:</strong> +91 {selectedApplication.phone_number}</div>
                  <div><strong style={{ color: SURFACE_TOKENS.textPrimary }}>Sir/Ma'am:</strong> {selectedApplication.sir_maam}</div>
                  {selectedApplication.reference_name && (
                    <div><strong style={{ color: SURFACE_TOKENS.textPrimary }}>Reference Name:</strong> {selectedApplication.reference_name}</div>
                  )}
                  {selectedApplication.reference_number && (
                    <div><strong style={{ color: SURFACE_TOKENS.textPrimary }}>Reference Number:</strong> +91 {selectedApplication.reference_number}</div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="mb-2" style={{ fontSize: 13.5, fontWeight: 600, color: SURFACE_TOKENS.textPrimary }}>Teaching Details</h3>
                <div className="space-y-1.5" style={{ fontSize: 13.5, color: SURFACE_TOKENS.textBody }}>
                  <div><strong style={{ color: SURFACE_TOKENS.textPrimary }}>Subjects:</strong> {selectedApplication.subjects || 'N/A'}</div>
                  <div><strong style={{ color: SURFACE_TOKENS.textPrimary }}>Classes:</strong> {selectedApplication.classes_taught_for_backend || 'N/A'}</div>
                  <div><strong style={{ color: SURFACE_TOKENS.textPrimary }}>Boards:</strong> {selectedApplication.school_boards_catered || 'N/A'}</div>
                  <div><strong style={{ color: SURFACE_TOKENS.textPrimary }}>Location:</strong> {selectedApplication.location_v2 || 'N/A'}</div>
                  <div><strong style={{ color: SURFACE_TOKENS.textPrimary }}>Mode:</strong> {selectedApplication.mode_of_teaching || 'N/A'}</div>
                  <div><strong style={{ color: SURFACE_TOKENS.textPrimary }}>Structure of classes:</strong> {selectedApplication.class_size ? selectedApplication.class_size.replace(/\bSolo\b/g, 'One-on-one') : 'N/A'}</div>
                </div>
              </div>

              {selectedApplication.description && (
                <div className="md:col-span-2">
                  <h3 className="mb-2" style={{ fontSize: 13.5, fontWeight: 600, color: SURFACE_TOKENS.textPrimary }}>Description</h3>
                  <p style={{ fontSize: 13.5, color: SURFACE_TOKENS.textBody }}>{selectedApplication.description}</p>
                </div>
              )}

              {selectedApplication.qualifications_etc && (
                <div className="md:col-span-2">
                  <h3 className="mb-2" style={{ fontSize: 13.5, fontWeight: 600, color: SURFACE_TOKENS.textPrimary }}>Qualifications</h3>
                  <p style={{ fontSize: 13.5, color: SURFACE_TOKENS.textBody }}>{selectedApplication.qualifications_etc}</p>
                </div>
              )}

              {selectedApplication.hero_image_url && (
                <div className="md:col-span-2">
                  <h3 className="mb-2" style={{ fontSize: 13.5, fontWeight: 600, color: SURFACE_TOKENS.textPrimary }}>Hero Image</h3>
                  <img
                    src={selectedApplication.hero_image_url ? validateImageSrc(selectedApplication.hero_image_url) : ''}
                    alt="Hero"
                    className="w-full max-w-md h-48 object-cover"
                    style={{ borderRadius: 14, boxShadow: `0 0 0 1px ${SURFACE_TOKENS.hairline}` }}
                  />
                </div>
              )}

              <div className="md:col-span-2">
                <h3 className="mb-2" style={{ fontSize: 13.5, fontWeight: 600, color: SURFACE_TOKENS.textPrimary }}>Status</h3>
                <div className="space-y-1" style={{ fontSize: 13.5, color: SURFACE_TOKENS.textBody }}>
                  <div><strong style={{ color: SURFACE_TOKENS.textPrimary }}>Status:</strong> {selectedApplication.status}</div>
                  <div><strong style={{ color: SURFACE_TOKENS.textPrimary }}>MOU Consent:</strong> {selectedApplication.mou_consent ? 'Yes' : 'No'}</div>
                  <div><strong style={{ color: SURFACE_TOKENS.textPrimary }}>Applied:</strong> {new Date(selectedApplication.created_at).toLocaleString()}</div>
                  {selectedApplication.reviewed_at && (
                    <div>
                      <strong style={{ color: SURFACE_TOKENS.textPrimary }}>Reviewed:</strong> {new Date(selectedApplication.reviewed_at).toLocaleString()}
                      {selectedApplication.reviewed_by && (
                        <> by {reviewerNames[selectedApplication.reviewed_by] || 'an admin'}</>
                      )}
                    </div>
                  )}
                  {selectedApplication.rejection_reason && (
                    <div><strong style={{ color: SURFACE_TOKENS.textPrimary }}>Rejection Reason:</strong> {selectedApplication.rejection_reason}</div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                <h3 className="mb-2" style={{ fontSize: 13.5, fontWeight: 600, color: SURFACE_TOKENS.textPrimary }}>Texted Status</h3>
                <div onClick={(e) => e.stopPropagation()}>
                  <Select
                    value={selectedApplication.texted_status}
                    onValueChange={(value) => {
                      handleTextedStatusChange(selectedApplication.id, value);
                      setSelectedApplication({ ...selectedApplication, texted_status: value as TeacherApplication['texted_status'] });
                    }}
                  >
                    <SelectTrigger className="w-full sm:w-[200px] h-auto border-0" style={adminFieldStyle}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="not_texted">Not Texted</SelectItem>
                      <SelectItem value="texted">Texted</SelectItem>
                      <SelectItem value="follow_up">Follow Up</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedApplication.status === 'pending' && (
                <div className="md:col-span-2 flex gap-2 pt-4" style={{ borderTop: `1px solid ${SURFACE_TOKENS.hairline}` }}>
                  <button
                    onClick={() => handleApprove(selectedApplication.id)}
                    disabled={processingId === selectedApplication.id}
                    style={adminPrimaryBtnStyle}
                    className="disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {processingId === selectedApplication.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    Approve Application
                  </button>
                  <button
                    onClick={() => handleReject(selectedApplication.id)}
                    disabled={processingId === selectedApplication.id}
                    style={adminDestructiveBtnStyle}
                    className="disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject Application
                  </button>
                </div>
              )}
            </div>
          </>
          )}
        </DialogContent>
      </Dialog>
    </AdminConsole>
  );
}
