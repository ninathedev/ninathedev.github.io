const scores = {
  pawn: 1,
  knight: 3,
  bishop: 3,
  rook: 5,
  queen: 9,
  king: 1000
}

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
    // minimax: board, depth, isMaximizing
    return minimax(board, 3, false);
  }
}

function minimax(board, depth, isMaximizing) {

}