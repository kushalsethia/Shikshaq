import type { Game } from '@/lib/games';
import { CrosswordGame } from './CrosswordGame';
import { FillGame } from './FillGame';
import { MatchingGame } from './MatchingGame';
import { WordSearchGame } from './WordSearchGame';
import './games.css';

/* One puzzle, playable. Each game takes a puzzle already made and checked by src/lib/games, and calls `onNext` from
   its "Next puzzle" banner once it is solved. */

export function GameView({ game, onNext }: { game: Game; onNext: () => void }) {
  if (game.type === 'matching') return <MatchingGame g={game} onNext={onNext} />;
  if (game.type === 'fill') return <FillGame g={game} onNext={onNext} />;
  if (game.type === 'wordsearch') return <WordSearchGame g={game} onNext={onNext} />;
  return <CrosswordGame g={game} onNext={onNext} />;
}
