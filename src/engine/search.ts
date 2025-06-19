import { Board, Move, Color } from './board';

const PIECE_VALUES: Record<string, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
};

/** Evaluate a board by simple material count. Positive is good for White. */
export function evaluateMaterial(board: Board): number {
  let score = 0;
  for (const p of board.pieces) {
    if (!p) continue;
    const val = PIECE_VALUES[p.toLowerCase()];
    score += p === p.toUpperCase() ? val : -val;
  }
  return score;
}

function countSafeReplies(b: Board, original: Color): number {
  const replies = b.generateLegalMoves();
  const mult = original === 'w' ? 1 : -1;
  let safe = 0;
  for (const m of replies) {
    const nb = b.makeMove(m);
    const sc = evaluateMaterial(nb) * mult;
    if (sc <= 0) safe++;
  }
  return safe;
}

/**
 * Search for the move that gives the opponent the fewest safe replies.
 */
export function searchSharpMove(board: Board): Move | null {
  const moves = board.generateLegalMoves();
  if (moves.length === 0) return null;
  let best: Move | null = null;
  let minSafe = Infinity;
  for (const m of moves) {
    const nb = board.makeMove(m);
    const safe = countSafeReplies(nb, board.turn === 'w' ? 'b' : 'w');
    if (safe < minSafe) {
      minSafe = safe;
      best = m;
    }
  }
  return best;
}
