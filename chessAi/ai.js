function getBestMove(board) {
  // Returns the best move for the AI.
  // returns an array [piece, [row, col]]
  // where piece is the piece object to move
  // and [row, col] is the new position of the piece

  // to start off, just move a random piece to a random spot
  const pieces = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece !== null && piece.isWhite && piece.getAvailableMoves(board).length > 0) {
        pieces.push(piece);
      }
    }
  }
  const piece = pieces[Math.floor(Math.random() * pieces.length)];
  if (!piece) return null;
  else {
    const moves = piece.getAvailableMoves(board);
    const move = moves[Math.floor(Math.random() * moves.length)];
    return [piece, move];
  }
}