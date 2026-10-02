import { useState } from 'react';
import { AdminPaperApprovalsPage } from '@/pages/admin/paper-approvals';
import { sharedFakeApprovalApi } from '@/dummy/approval-fake-api';
import { DummyBanner } from '@/dummy/DummyBanner';

/* /admin/paper-approvals in dummy mode (D75): the real page against made-up
   papers, no sign-in and no real admin check. Test builds only, reached
   solely through the PREVIEW_TOOLS-gated lazy import in
   admin/paper-approvals.tsx. */

export default function AdminPaperApprovalsDummy() {
  const [api] = useState(sharedFakeApprovalApi);
  return <AdminPaperApprovalsPage api={api} dummy banner={<DummyBanner leaveTo="/admin/paper-approvals?dummy=0" />} />;
}
