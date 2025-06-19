import { Board } from '../src/engine/board';

describe('move generation', () => {
  test('starting position has 20 legal moves', () => {
    const b = Board.fromFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    const moves = b.generateLegalMoves();
    expect(moves.length).toBe(20);
  });

  test('pawn moves from e2', () => {
    const b = Board.fromFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    const idx = b.index('e2');
    const pawnMoves = b.generateLegalMoves().filter(m => m.from === idx).map(m => b.algebraic(m.to));
    expect(pawnMoves.sort()).toEqual(['e3','e4']);
  });
});
