import { AdminTeamPage } from '@/pages/admin/team';
import { dummyTeamDashboardApi } from '@/dummy/team-dashboard-fake-api';

/** Dummy-mode wrapper for /admin/team?dummy=1 (D75). No sign-in, no real
 *  admin check, the in-memory fake API above. */
export default function AdminTeamDummy() {
  return (
    <AdminTeamPage
      api={dummyTeamDashboardApi}
      dummy
      banner={
        <div className="bg-brand px-6 py-2 text-center text-[13px] font-semibold text-foreground">
          TEST BUILD -- dummy data, no sign-in
        </div>
      }
    />
  );
}
