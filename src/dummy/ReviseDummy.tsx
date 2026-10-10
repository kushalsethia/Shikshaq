import { RevisePage } from '@/pages/Revise';
import { DummyBanner } from '@/dummy/DummyBanner';
import { sharedFakeGameApi } from '@/dummy/game-questions-fake-api';

/* /revise in dummy mode (D75): the real page against the made-up question bank, as a made-up class 7 student (so it
   starts on class 7, the way a real student's profile would). Questions approved on /hod?tab=questions (dummy) show up
   here. Test builds only, reached solely through the PREVIEW_TOOLS-gated lazy import in pages/Revise.tsx. */

export default function ReviseDummy() {
  const banner = (
    <div className="mb-3">
      <DummyBanner leaveTo="/revise?dummy=0">A made-up class 7 student.</DummyBanner>
    </div>
  );
  return <RevisePage api={sharedFakeGameApi} dummy banner={banner} dummyGrade="7" />;
}
