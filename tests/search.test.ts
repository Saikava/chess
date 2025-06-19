import { Board } from '../src/engine/board';
import { searchSharpMove } from '../src/engine/search';

describe('sharp search', () => {
  test('captures hanging rook', () => {
    const b = Board.fromFEN('4k3/8/8/8/4r3/8/4R3/4K3 w - - 0 1');
    const move = searchSharpMove(b);
    expect(move).not.toBeNull();
    if (move) {
      expect(move.from).toBe(b.index('e2'));
      expect(move.to).toBe(b.index('e4'));
    }
  });

  test('checkmates when possible', () => {
    const b = Board.fromFEN('4k3/8/8/8/8/8/4R3/4K3 w - - 0 1');
    const move = searchSharpMove(b);
    expect(move).not.toBeNull();
    if (move) {
      expect(move.from).toBe(b.index('e2'));
      expect(move.to).toBe(b.index('e8'));
    }
  });
});
