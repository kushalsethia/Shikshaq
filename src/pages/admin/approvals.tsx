import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, XCircle, Search, Loader2 } from 'lucide-react';
import { toast as sonnerToast } from 'sonner';
import { useAuth } from '@/lib/auth-context';
import { recordAdminAction } from '@/lib/audit';
import { formatDistanceToNow } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
  Textarea,
} from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { validateImageSrc } from '@/utils/imageSanitizer';
import { useAdminGuard, useReviewerNames, AdminGuardErrorState } from '@/components/AdminConsole';
import { AdminHeader, AdminAuditNote, buildAdminNav } from '@/pages/admin/shell';
import {
  AdminTable,
  AdminPanelHeader,
  AdminStatusPill,
  type AdminTableColumn,
  type AdminTableRow,
  type AdminStatus,
} from '@/pages/admin/AdminTable';
import { BentoPanel, BentoStack } from '@/components/layout/PageContainer';
import { useAdminSectionCounts } from '@/pages/admin/useAdminSectionCounts';

/* Handoff 09i AD-001..004 — "Approvals". Ported from the legacy
   src/pages/AdminApplications.tsx (614 lines): same teacher_applications
   queries, the same approve_teacher_application RPC, and the same reject
   mutation + recordAdminAction calls. The old AdminRail/AdminToolbar
   sidebar shell is gone — this page renders the AdminHeader pill-tab row
   and its own BentoPanel content, per the actual handoff spec (not the
   superseded S7 rail). */

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

export default function AdminApprovals() {
  const { user, profile } = useAuth();
  const actorName = profile?.full_name || user?.email || 'an admin';
  const signedInName = actorName;
  const [applications, setApplications] = useState<TeacherApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<TeacherApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<TeacherApplication | null>(null);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [rejectReason, setRejectReason] = useState('');
  const [showReject, setShowReject] = useState(false);

  const { isAdmin, checkingAdmin, error: adminGuardError, retry: retryAdminGuard } = useAdminGuard(user, {
    onGranted: fetchApplications,
    redirectOnDenied: true,
  });
  const reviewerNames = useReviewerNames(applications.map((a) => a.reviewed_by));
  const sectionCounts = useAdminSectionCounts();

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
        if (import.meta.env.DEV) console.error('Error fetching applications:', error);
        sonnerToast.error('Failed to load applications');
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
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error:', error);
      sonnerToast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let filtered = applications;

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

    filtered = [...filtered].sort((a, b) => {
      const diff = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return sortOrder === 'newest' ? -diff : diff;
    });

    setFilteredApplications(filtered);
  }, [searchQuery, applications, sortOrder]);

  const handleApprove = async (applicationId: string) => {
    if (!user) return;
    try {
      setProcessingId(applicationId);
      const { error } = await supabase.rpc('approve_teacher_application', {
        application_id: applicationId,
        admin_id: user.id,
      });

      if (error) {
        if (import.meta.env.DEV) console.error('Error approving application:', error);
        sonnerToast.error('Failed to approve application');
        return;
      }

      const approvedApp = applications.find((a) => a.id === applicationId);
      void recordAdminAction({
        actorId: user.id,
        actorName,
        action: 'approve',
        targetType: 'teacher_application',
        targetId: applicationId,
        targetLabel: approvedApp?.name || 'teacher',
      });
      sonnerToast.success(`"${approvedApp?.name || 'Application'}" approved`);
      await fetchApplications();
      setSelectedApplication(null);
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error:', error);
      sonnerToast.error('Failed to approve application');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (applicationId: string, reason?: string) => {
    if (!user) return;
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
        if (import.meta.env.DEV) console.error('Error rejecting application:', error);
        sonnerToast.error('Failed to reject application');
        return;
      }

      const rejectedApp = applications.find((a) => a.id === applicationId);
      void recordAdminAction({
        actorId: user.id,
        actorName,
        action: 'reject',
        targetType: 'teacher_application',
        targetId: applicationId,
        targetLabel: rejectedApp?.name || 'teacher',
        reason: reason || null,
      });
      sonnerToast.success(`"${rejectedApp?.name || 'Application'}" rejected`);
      await fetchApplications();
      setSelectedApplication(null);
      setShowReject(false);
      setRejectReason('');
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error:', error);
      sonnerToast.error('Failed to reject application');
    } finally {
      setProcessingId(null);
    }
  };

  const applicationStatus = (status: TeacherApplication['status']): AdminStatus => {
    switch (status) {
      case 'approved':
        return 'live';
      case 'rejected':
        return 'hidden';
      default:
        return 'pending';
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

  const nav = buildAdminNav('approvals', { approvals: sectionCounts.approvals ?? pendingCount, reviews: sectionCounts.reviews });

  if (checkingAdmin || loading) {
    return (
      <BentoStack className="min-h-screen bg-muted">
        <AdminHeader nav={nav} signedInEmail={user?.email ?? signedInName} />
        <BentoPanel fill="card" className="px-[18px] py-[18px]">
          <div className="animate-pulse space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 rounded-2xl bg-muted" />
            ))}
          </div>
        </BentoPanel>
        <AdminAuditNote />
      </BentoStack>
    );
  }

  if (adminGuardError) return <AdminGuardErrorState onRetry={retryAdminGuard} />;

  if (!isAdmin) return null;

  const applicationColumns: AdminTableColumn[] = [
    { key: 'applicant', label: 'Applicant', width: '1.8fr' },
    { key: 'contact', label: 'Contact', width: '1.4fr' },
    { key: 'subjects', label: 'Subjects', width: '1.6fr' },
    { key: 'area', label: 'Area', width: '1fr' },
    { key: 'submitted', label: 'Submitted', width: '1fr' },
    { key: 'docs', label: 'Docs', width: '1fr' },
    { key: 'status', label: 'Status', width: '1fr' },
  ];

  const applicationRows: AdminTableRow[] = filteredApplications.map((application) => {
    const subjects = [application.subjects, application.classes_taught_for_backend]
      .filter(Boolean)
      .join(' · ') || 'N/A';
    const docsLabel = application.hero_image_url ? 'Photo + refs' : application.reference_name ? 'Refs only' : 'None';
    return {
      id: application.id,
      cells: [
        application.name,
        `+91 ${application.phone_number} · ${getTextedStatusLabel(application.texted_status)}`,
        subjects,
        application.location_v2 || 'N/A',
        formatDistanceToNow(new Date(application.created_at), { addSuffix: true }),
        docsLabel,
        <AdminStatusPill
          key="status"
          status={applicationStatus(application.status)}
          label={application.status.charAt(0).toUpperCase() + application.status.slice(1)}
        />,
      ],
      actions: [
        {
          label: application.status === 'pending' ? 'Review' : 'View docs',
          tone: 'primary',
          onClick: () => setSelectedApplication(application),
        },
      ],
    };
  });

  const searchSlot = (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-label" aria-hidden />
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
    <BentoStack className="min-h-screen bg-muted">
      <AdminHeader nav={nav} signedInEmail={user?.email ?? signedInName} />

      <BentoPanel fill="card" className="px-[18px] py-[18px]">
        <AdminPanelHeader title="Applications" meta={`${pendingCount} waiting`} />

        <div className="mb-4 flex flex-wrap items-center gap-2 px-[18px]">
          {searchSlot}
          {sortSlot}
        </div>

        {filteredApplications.length === 0 ? (
          <div className="rounded-2xl bg-muted p-12 text-center">
            <p className="text-sm text-warm-label">
              {searchQuery.trim()
                ? `No applications match "${searchQuery.trim()}".`
                : 'No applications waiting on review.'}
            </p>
            {searchQuery.trim() ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-3 text-sm font-semibold text-brand underline-offset-2 hover:underline"
              >
                Clear search
              </button>
            ) : null}
          </div>
        ) : (
          <AdminTable columns={applicationColumns} rows={applicationRows} />
        )}
      </BentoPanel>

      <AdminAuditNote />

      <Dialog
        open={!!selectedApplication}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedApplication(null);
            setShowReject(false);
            setRejectReason('');
          }
        }}
      >
        <DialogContent aria-describedby={undefined} className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[20px] p-6">
          {selectedApplication && (
            <>
              <div className="mb-6 flex items-center justify-between gap-4">
                <DialogTitle className="text-xl font-bold text-foreground">{selectedApplication.name}</DialogTitle>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-2 text-sm font-semibold text-foreground">Basic Information</h3>
                  <div className="space-y-1.5 text-[13.5px] text-warm-prose">
                    <div><strong className="text-foreground">Name:</strong> {selectedApplication.name}</div>
                    <div><strong className="text-foreground">Email:</strong> {selectedApplication.email}</div>
                    <div><strong className="text-foreground">Phone:</strong> +91 {selectedApplication.phone_number}</div>
                    <div><strong className="text-foreground">Sir/Ma'am:</strong> {selectedApplication.sir_maam}</div>
                    {selectedApplication.reference_name && (
                      <div><strong className="text-foreground">Reference Name:</strong> {selectedApplication.reference_name}</div>
                    )}
                    {selectedApplication.reference_number && (
                      <div><strong className="text-foreground">Reference Number:</strong> +91 {selectedApplication.reference_number}</div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-sm font-semibold text-foreground">Teaching Details</h3>
                  <div className="space-y-1.5 text-[13.5px] text-warm-prose">
                    <div><strong className="text-foreground">Subjects:</strong> {selectedApplication.subjects || 'N/A'}</div>
                    <div><strong className="text-foreground">Classes:</strong> {selectedApplication.classes_taught_for_backend || 'N/A'}</div>
                    <div><strong className="text-foreground">Boards:</strong> {selectedApplication.school_boards_catered || 'N/A'}</div>
                    <div><strong className="text-foreground">Location:</strong> {selectedApplication.location_v2 || 'N/A'}</div>
                    <div><strong className="text-foreground">Mode:</strong> {selectedApplication.mode_of_teaching || 'N/A'}</div>
                  </div>
                </div>

                {selectedApplication.description && (
                  <div className="md:col-span-2">
                    <h3 className="mb-2 text-sm font-semibold text-foreground">Description</h3>
                    <p className="text-[13.5px] text-warm-prose">{selectedApplication.description}</p>
                  </div>
                )}

                {selectedApplication.qualifications_etc && (
                  <div className="md:col-span-2">
                    <h3 className="mb-2 text-sm font-semibold text-foreground">Qualifications</h3>
                    <p className="text-[13.5px] text-warm-prose">{selectedApplication.qualifications_etc}</p>
                  </div>
                )}

                {selectedApplication.hero_image_url && (
                  <div className="md:col-span-2">
                    <h3 className="mb-2 text-sm font-semibold text-foreground">Hero Image / Docs</h3>
                    <img
                      src={validateImageSrc(selectedApplication.hero_image_url)}
                      alt="Hero"
                      className="h-48 w-full max-w-md rounded-2xl object-cover shadow-border"
                    />
                  </div>
                )}

                <div className="md:col-span-2">
                  <h3 className="mb-2 text-sm font-semibold text-foreground">Status</h3>
                  <div className="space-y-1 text-[13.5px] text-warm-prose">
                    <div><strong className="text-foreground">Status:</strong> {selectedApplication.status}</div>
                    <div><strong className="text-foreground">Applied:</strong> {new Date(selectedApplication.created_at).toLocaleString()}</div>
                    {selectedApplication.reviewed_at && (
                      <div>
                        <strong className="text-foreground">Reviewed:</strong> {new Date(selectedApplication.reviewed_at).toLocaleString()}
                        {selectedApplication.reviewed_by && (
                          <> by {reviewerNames[selectedApplication.reviewed_by] || 'an admin'}</>
                        )}
                      </div>
                    )}
                    {selectedApplication.rejection_reason && (
                      <div><strong className="text-foreground">Rejection Reason:</strong> {selectedApplication.rejection_reason}</div>
                    )}
                  </div>
                </div>

                {selectedApplication.status === 'pending' && (
                  <div className="flex flex-col gap-3 border-t border-warm-hairline pt-4 md:col-span-2">
                    {showReject ? (
                      <div className="flex flex-col gap-2">
                        <label htmlFor="reject-reason" className="text-[13px] font-semibold text-foreground">
                          Reason (required, the teacher can read this)
                        </label>
                        <Textarea
                          id="reject-reason"
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Explain why this application is being rejected..."
                          className="min-h-[80px]"
                        />
                        <div className="flex gap-2">
                          <Button
                            variant="destructive"
                            disabled={!rejectReason.trim() || processingId === selectedApplication.id}
                            onClick={() => handleReject(selectedApplication.id, rejectReason.trim())}
                          >
                            {processingId === selectedApplication.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                            Confirm rejection
                          </Button>
                          <Button variant="outline" onClick={() => { setShowReject(false); setRejectReason(''); }}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          disabled={processingId === selectedApplication.id}
                          onClick={() => handleApprove(selectedApplication.id)}
                        >
                          {processingId === selectedApplication.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                          Approve Application
                        </Button>
                        <Button variant="outline" onClick={() => setShowReject(true)}>
                          <XCircle className="h-4 w-4" />
                          Reject Application
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </BentoStack>
  );
}
