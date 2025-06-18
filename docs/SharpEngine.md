# Sharp Move Engine

The goal of the sharp move engine is to select moves that give the opponent as few safe replies as possible. Rather than merely maximizing evaluation, the engine attempts to force difficult positions where any mistake can be punished. A "sharp" move increases tactical pressure and limits the opponent's non‐losing choices.

## Candidate Search Strategies

- **Minimax with non-losing reply count**: Extend standard minimax search to also track how many replies keep the evaluation within an acceptable range for the opponent. Moves that lead to fewer safe replies score higher.
- **Selective deepening**: Increase search depth in lines where the opponent has very few non-losing continuations while pruning quieter branches earlier.
- **Iterative deepening**: Repeatedly search to greater depths while using the best move from the previous iteration as a guide. This allows time management and can improve the move ordering for sharper play.
- **Quiescence search**: Continue exploring tactical sequences (captures, checks and threats) to avoid missing forcing moves that maintain the sharp nature of the position.
- **Move ordering heuristics**: Prioritize moves that create immediate threats or limit the opponent's options so that the engine evaluates forcing lines earlier in the search tree.

## Implementation in TypeScript and WebAssembly

The project is intended to be implemented primarily in TypeScript. A pure TypeScript implementation allows easy integration with web applications and rapid development. For performance‐critical parts of the search, the engine can optionally leverage WebAssembly. The core algorithms can be written in languages that compile to WebAssembly (such as Rust or AssemblyScript) and exposed to the TypeScript codebase.

### TypeScript Roles

- Game representation (board, moves and legality checks).
- Search control logic, including iterative deepening and heuristics.
- Integration with user interfaces and potential online play.

### Potential WebAssembly Roles

- Computationally intensive evaluation functions.
- Move generation and position hashing.
- Future performance optimizations when TypeScript alone is insufficient.

Combining TypeScript for flexibility with WebAssembly for speed offers a path to a fast and portable sharp move engine.
