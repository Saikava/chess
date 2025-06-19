export type Color = 'w' | 'b';
export type Piece =
  | 'P'
  | 'N'
  | 'B'
  | 'R'
  | 'Q'
  | 'K'
  | 'p'
  | 'n'
  | 'b'
  | 'r'
  | 'q'
  | 'k';

export interface Move {
  from: number; // 0-63
  to: number;
}

/** Basic chess board representation and move generation */
export class Board {
  pieces: (Piece | null)[];
  turn: Color;

  constructor(pieces: (Piece | null)[], turn: Color) {
    this.pieces = pieces.slice();
    this.turn = turn;
  }

  static fromFEN(fen: string): Board {
    const parts = fen.trim().split(/\s+/);
    const boardPart = parts[0];
    const turn: Color = parts[1] as Color;
    const rows = boardPart.split('/');
    const pieces: (Piece | null)[] = [];
    for (const row of rows) {
      for (const ch of row) {
        if (ch >= '1' && ch <= '8') {
          const empty = parseInt(ch, 10);
          for (let i = 0; i < empty; i++) pieces.push(null);
        } else {
          pieces.push(ch as Piece);
        }
      }
    }
    return new Board(pieces, turn);
  }

  clone(): Board {
    return new Board(this.pieces.slice(), this.turn);
  }

  index(square: string): number {
    const file = square.charCodeAt(0) - 97;
    const rank = parseInt(square[1], 10);
    return (8 - rank) * 8 + file;
  }

  algebraic(index: number): string {
    const file = index % 8;
    const rank = 8 - Math.floor(index / 8);
    return String.fromCharCode(97 + file) + rank;
  }

  pieceAt(i: number): Piece | null {
    return this.pieces[i];
  }

  setPiece(i: number, p: Piece | null) {
    this.pieces[i] = p;
  }

  makeMove(m: Move): Board {
    const nb = this.clone();
    const p = nb.pieceAt(m.from);
    nb.setPiece(m.from, null);
    if (p) nb.setPiece(m.to, p);
    nb.turn = this.turn === 'w' ? 'b' : 'w';
    return nb;
  }

  generateLegalMoves(): Move[] {
    const pseudo = this.generatePseudoMoves(this.turn);
    const legal: Move[] = [];
    for (const m of pseudo) {
      const nb = this.makeMove(m);
      const kingIndex = nb.pieces.findIndex(
        (p) => p === (this.turn === 'w' ? 'K' : 'k')
      );
      if (kingIndex === -1) continue;
      if (!nb.isSquareAttacked(kingIndex, this.turn === 'w' ? 'b' : 'w')) {
        legal.push(m);
      }
    }
    return legal;
  }

  generatePseudoMoves(color: Color): Move[] {
    const moves: Move[] = [];
    for (let i = 0; i < 64; i++) {
      const p = this.pieceAt(i);
      if (!p) continue;
      const isWhite = p === p.toUpperCase();
      if ((color === 'w') !== isWhite) continue;
      switch (p.toLowerCase()) {
        case 'p':
          this.pawnMoves(i, color, moves);
          break;
        case 'n':
          this.knightMoves(i, color, moves);
          break;
        case 'b':
          this.sliderMoves(i, color, moves, [-9, -7, 7, 9]);
          break;
        case 'r':
          this.sliderMoves(i, color, moves, [-8, -1, 1, 8]);
          break;
        case 'q':
          this.sliderMoves(i, color, moves, [-9, -7, 7, 9, -8, -1, 1, 8]);
          break;
        case 'k':
          this.kingMoves(i, color, moves);
          break;
      }
    }
    return moves;
  }

  pawnMoves(index: number, color: Color, moves: Move[]) {
    const dir = color === 'w' ? -8 : 8;
    const startRank = color === 'w' ? 6 : 1; // board[0] is rank8
    const forward = index + dir;
    if (forward >= 0 && forward < 64 && !this.pieces[forward]) {
      moves.push({ from: index, to: forward });
      if (Math.floor(index / 8) === startRank) {
        const dbl = index + dir * 2;
        if (!this.pieces[dbl]) moves.push({ from: index, to: dbl });
      }
    }
    const file = index % 8;
    for (const df of [-1, 1]) {
      const tf = file + df;
      if (tf < 0 || tf > 7) continue;
      const target = index + dir + df;
      if (target < 0 || target >= 64) continue;
      const tp = this.pieces[target];
      if (tp && ((color === 'w') !== (tp === tp.toUpperCase()))) {
        moves.push({ from: index, to: target });
      }
    }
  }

  knightMoves(index: number, color: Color, moves: Move[]) {
    const file = index % 8;
    const rank = Math.floor(index / 8);
    const offsets = [
      [-2, -1],
      [-2, 1],
      [-1, -2],
      [-1, 2],
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1],
    ];
    for (const [dr, df] of offsets) {
      const r = rank + dr;
      const f = file + df;
      if (r < 0 || r > 7 || f < 0 || f > 7) continue;
      const idx = r * 8 + f;
      const tp = this.pieces[idx];
      if (!tp || ((color === 'w') !== (tp === tp.toUpperCase()))) {
        moves.push({ from: index, to: idx });
      }
    }
  }

  sliderMoves(index: number, color: Color, moves: Move[], dirs: number[]) {
    for (const dir of dirs) {
      let to = index + dir;
      while (to >= 0 && to < 64) {
        const fromFile = index % 8;
        const toFile = to % 8;
        if (Math.abs(toFile - fromFile) > 1 && Math.abs(dir) === 1) break;
        if (Math.abs(toFile - fromFile) > 0 && Math.abs(dir) === 8) break;
        const tp = this.pieces[to];
        if (!tp) {
          moves.push({ from: index, to });
        } else {
          if ((color === 'w') !== (tp === tp.toUpperCase())) {
            moves.push({ from: index, to });
          }
          break;
        }
        if (Math.abs(dir) === 1 && (toFile === 0 && dir === -1 || toFile === 7 && dir === 1)) break;
        if (Math.abs(dir) === 8 && ((dir === -8 && to < 8) || (dir === 8 && to >= 56))) break;
        to += dir;
      }
    }
  }

  kingMoves(index: number, color: Color, moves: Move[]) {
    const file = index % 8;
    const rank = Math.floor(index / 8);
    for (let dr = -1; dr <= 1; dr++) {
      for (let df = -1; df <= 1; df++) {
        if (dr === 0 && df === 0) continue;
        const r = rank + dr;
        const f = file + df;
        if (r < 0 || r > 7 || f < 0 || f > 7) continue;
        const idx = r * 8 + f;
        const tp = this.pieces[idx];
        if (!tp || ((color === 'w') !== (tp === tp.toUpperCase()))) {
          moves.push({ from: index, to: idx });
        }
      }
    }
  }

  isSquareAttacked(index: number, by: Color): boolean {
    const pseudo = this.generatePseudoMoves(by);
    return pseudo.some((m) => m.to === index);
  }
}
