import { Board } from '../engine/board';
import { searchSharpMove } from '../engine/search';

const startFEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

function boardToFEN(b: Board): string {
  let fen = '';
  for (let r = 0; r < 8; r++) {
    let empty = 0;
    for (let f = 0; f < 8; f++) {
      const p = b.pieceAt(r * 8 + f);
      if (p) {
        if (empty > 0) {
          fen += empty;
          empty = 0;
        }
        fen += p;
      } else {
        empty++;
      }
    }
    if (empty > 0) fen += empty;
    if (r !== 7) fen += '/';
  }
  return fen + ` ${b.turn} - - 0 1`;
}

window.addEventListener('DOMContentLoaded', () => {
  const boardEl = document.getElementById('board') as any;
  const moveEl = document.getElementById('move') as HTMLElement;

  const board = Board.fromFEN(startFEN);
  const move = searchSharpMove(board);
  let moveText = 'none';
  let displayBoard = board;

  if (move) {
    moveText = `${board.algebraic(move.from)} → ${board.algebraic(move.to)}`;
    displayBoard = board.makeMove(move);
  }

  boardEl.position = boardToFEN(displayBoard);
  moveEl.textContent = `Engine move: ${moveText}`;
});
