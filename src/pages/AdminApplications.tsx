import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, CheckCircle, XCircle, Clock, Search, Loader2, User, Mail, Phone, FileText } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { validateImageSrc } from '@/utils/imageSanitizer';

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
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export default function AdminApplications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<TeacherApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<TeacherApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<TeacherApplication | null>(null);

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
          .maybeSingle();

        if (error) {
          if (import.meta.env.DEV) {
            console.error('Error checking admin status:', error);
          }
          setIsAdmin(false);
        } else if (data && data.id === user.id) {
          setIsAdmin(true);
          fetchApplications();
        } else {
          if (import.meta.env.DEV) {
            console.log('User is not an admin');
          }
          setIsAdmin(false);
          navigate('/');
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Error:', error);
        }
        setIsAdmin(false);
        navigate('/');
      } finally {
        setCheckingAdmin(false);
        setLoading(false);
      }
    }

    checkAdminStatus();
  }, [user, navigate]);

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
        toast.error('Failed to load applications');
        return;
      }

      setApplications(data || []);
      setFilteredApplications(data || []);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error:', error);
      }
      toast.error('Failed to load applications');
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

    setFilteredApplications(filtered);
  }, [searchQuery, filter, applications]);

  const handleApprove = async (applicationId: string) => {
    if (!user) {
      toast.error('You must be logged in to approve applications');
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
        toast.error(error.message || 'Failed to approve application');
        return;
      }

      toast.success('Application approved successfully! Teacher profile created.');
      await fetchApplications();
      setSelectedApplication(null);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error:', error);
      }
      toast.error('An unexpected error occurred');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (applicationId: string, reason?: string) => {
    if (!user) {
      toast.error('You must be logged in to reject applications');
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
        toast.error('Failed to reject application');
        return;
      }

      toast.success('Application rejected');
      await fetchApplications();
      setSelectedApplication(null);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error:', error);
      }
      toast.error('An unexpected error occurred');
    } finally {
      setProcessingId(null);
    }
  };

  if (checkingAdmin || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/admin" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Admin
          </Link>
          <h1 className="text-3xl font-sans">Teacher Applications</h1>
          <p className="text-muted-foreground mt-2">Review and approve teacher onboarding applications</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-card border rounded-lg p-4 mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search by name, email, phone, or reference..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={filter === 'pending' ? 'default' : 'outline'}
                onClick={() => setFilter('pending')}
                size="sm"
              >
                Pending
              </Button>
              <Button
                variant={filter === 'approved' ? 'default' : 'outline'}
                onClick={() => setFilter('approved')}
                size="sm"
              >
                Approved
              </Button>
              <Button
                variant={filter === 'rejected' ? 'default' : 'outline'}
                onClick={() => setFilter('rejected')}
                size="sm"
              >
                Rejected
              </Button>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <div className="bg-card border rounded-lg p-12 text-center">
              <p className="text-muted-foreground">No applications found</p>
            </div>
          ) : (
            filteredApplications.map((application) => (
              <div
                key={application.id}
                className="bg-card border rounded-lg p-6 hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => setSelectedApplication(application)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-sans">{application.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        application.status === 'pending' ? 'bg-yellow-500/20 text-yellow-600' :
                        application.status === 'approved' ? 'bg-green-500/20 text-green-600' :
                        'bg-red-500/20 text-red-600'
                      }`}>
                        {application.status === 'pending' && <Clock className="w-3 h-3 inline mr-1" />}
                        {application.status === 'approved' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                        {application.status === 'rejected' && <XCircle className="w-3 h-3 inline mr-1" />}
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {application.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        +91 {application.phone_number}
                      </div>
                      {application.reference_name && (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Reference: {application.reference_name}
                        </div>
                      )}
                      {application.reference_number && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Ref. Number: +91 {application.reference_number}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Applied {formatDistanceToNow(new Date(application.created_at), { addSuffix: true })}
                    </div>
                  </div>
                  {application.status === 'pending' && (
                    <div className="flex gap-2 ml-4" onClick={(e) => e.stopPropagation()}>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(application.id)}
                        disabled={processingId === application.id}
                        className="gap-2"
                      >
                        {processingId === application.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(application.id)}
                        disabled={processingId === application.id}
                        className="gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Application Detail Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedApplication(null)}>
            <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-sans">{selectedApplication.name}</h2>
                <Button variant="ghost" size="sm" onClick={() => setSelectedApplication(null)}>Close</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Basic Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Name:</strong> {selectedApplication.name}</div>
                    <div><strong>Email:</strong> {selectedApplication.email}</div>
                    <div><strong>Phone:</strong> +91 {selectedApplication.phone_number}</div>
                    <div><strong>Sir/Ma'am:</strong> {selectedApplication.sir_maam}</div>
                    {selectedApplication.reference_name && (
                      <div><strong>Reference Name:</strong> {selectedApplication.reference_name}</div>
                    )}
                    {selectedApplication.reference_number && (
                      <div><strong>Reference Number:</strong> +91 {selectedApplication.reference_number}</div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Teaching Details</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Subjects:</strong> {selectedApplication.subjects || 'N/A'}</div>
                    <div><strong>Classes:</strong> {selectedApplication.classes_taught_for_backend || 'N/A'}</div>
                    <div><strong>Boards:</strong> {selectedApplication.school_boards_catered || 'N/A'}</div>
                    <div><strong>Location:</strong> {selectedApplication.location_v2 || 'N/A'}</div>
                    <div><strong>Mode:</strong> {selectedApplication.mode_of_teaching || 'N/A'}</div>
                    <div><strong>Structure of classes:</strong> {selectedApplication.class_size ? selectedApplication.class_size.replace(/\bSolo\b/g, 'One-on-one') : 'N/A'}</div>
                  </div>
                </div>

                {selectedApplication.description && (
                  <div className="md:col-span-2">
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-sm">{selectedApplication.description}</p>
                  </div>
                )}

                {selectedApplication.qualifications_etc && (
                  <div className="md:col-span-2">
                    <h3 className="font-semibold mb-2">Qualifications</h3>
                    <p className="text-sm">{selectedApplication.qualifications_etc}</p>
                  </div>
                )}

                {selectedApplication.hero_image_url && (
                  <div className="md:col-span-2">
                    <h3 className="font-semibold mb-2">Hero Image</h3>
                    <img
                      src={selectedApplication.hero_image_url ? validateImageSrc(selectedApplication.hero_image_url) : ''}
                      alt="Hero"
                      className="w-full max-w-md h-48 object-cover rounded-lg border"
                    />
                  </div>
                )}

                <div className="md:col-span-2">
                  <h3 className="font-semibold mb-2">Status</h3>
                  <div className="text-sm space-y-1">
                    <div><strong>Status:</strong> {selectedApplication.status}</div>
                    <div><strong>MOU Consent:</strong> {selectedApplication.mou_consent ? 'Yes' : 'No'}</div>
                    <div><strong>Applied:</strong> {new Date(selectedApplication.created_at).toLocaleString()}</div>
                    {selectedApplication.reviewed_at && (
                      <div><strong>Reviewed:</strong> {new Date(selectedApplication.reviewed_at).toLocaleString()}</div>
                    )}
                    {selectedApplication.rejection_reason && (
                      <div><strong>Rejection Reason:</strong> {selectedApplication.rejection_reason}</div>
                    )}
                  </div>
                </div>

                {selectedApplication.status === 'pending' && (
                  <div className="md:col-span-2 flex gap-2 pt-4 border-t">
                    <Button
                      onClick={() => handleApprove(selectedApplication.id)}
                      disabled={processingId === selectedApplication.id}
                      className="gap-2"
                    >
                      {processingId === selectedApplication.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      Approve Application
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleReject(selectedApplication.id)}
                      disabled={processingId === selectedApplication.id}
                      className="gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject Application
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

