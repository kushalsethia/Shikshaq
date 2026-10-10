import { useQueryClient } from '@tanstack/react-query';
import { QuestionsPage } from '@/pages/Questions';
import { DummyBanner } from '@/dummy/DummyBanner';
import { DUMMY_TEACHER, sharedFakeGameApi } from '@/dummy/game-questions-fake-api';
import { GAME_KEYS } from '@/lib/game-questions/api';

/* /questions in dummy mode (D75): the real page against the made-up question bank, signed in as a made-up teacher.
   What you send waits on /hod?tab=questions (dummy) and, once approved, is playable on /revise (dummy). Test builds
   only, reached solely through the PREVIEW_TOOLS-gated lazy import in pages/Questions.tsx. */

export default function QuestionsDummy() {
  const qc = useQueryClient();
  const banner = (
    <div className="mb-3">
      <DummyBanner leaveTo="/questions?dummy=0">
        Signed in as {DUMMY_TEACHER.name}.{' '}
        <button
          type="button"
          className="font-bold underline underline-offset-2"
          onClick={() => {
            sharedFakeGameApi.reset();
            void qc.invalidateQueries({ queryKey: GAME_KEYS.all('dummy') });
          }}
        >
          Start over
        </button>
      </DummyBanner>
    </div>
  );
  return <QuestionsPage api={sharedFakeGameApi} dummy banner={banner} dummyName={DUMMY_TEACHER.name} />;
}
