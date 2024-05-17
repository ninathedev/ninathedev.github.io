const scores = {
  pawn: 1,
  knight: 3,
  bishop: 3,
  rook: 5,
  queen: 1000,
  king: 0
};

function getBestMove(board, depth, isWhite) {
  const moves = getAllAvailableMoves(board, isWhite);
  let bestMove = null;
  let bestScore = -Infinity;
  for (const move of moves) {
    const [piece, [row, col]] = move;
    const oldPiece = board[row][col];
    board[row][col] = piece;
    board[piece.row][piece.col] = null;
    piece.row = row;
    piece.col = col;
    const score = minimax(board, depth - 1, false);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
    board[row][col] = oldPiece;
    board[piece.row][piece.col] = piece;
    piece.row = piece.row;
    piece.col = piece.col;
  }
  return bestMove;
}

function getAllAvailableMoves(board, isWhite) {
  const moves = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (!board[row][col]) continue;
      const piece = board[row][col];
      if (piece && piece.isWhite === isWhite) {
        const availableMoves = piece.getAvailableMoves(board);
        availableMoves.forEach(move => {
          moves.push([piece, move]);
        });
      }
    }
  }
  return moves;
}

function minimax(board, depth, isMaximizing) {
  if (depth === 0) return scoreBoard(board, isMaximizing);

  const moves = getAllAvailableMoves(board, isMaximizing);
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (const move of moves) {
      const [piece, [row, col]] = move;
      const oldPiece = board[row][col];
      board[row][col] = piece;
      board[piece.row][piece.col] = null;
      piece.row = row;
      piece.col = col;
      const score = minimax(board, depth - 1, false);
      bestScore = Math.max(score, bestScore);
      board[row][col] = oldPiece;
      board[piece.row][piece.col] = piece;
      piece.row = piece.row;
      piece.col = piece.col;
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (const move of moves) {
      const [piece, [row, col]] = move;
      const oldPiece = board[row][col];
      board[row][col] = piece;
      board[piece.row][piece.col] = null;
      piece.row = row;
      piece.col = col;
      const score = minimax(board, depth - 1, true);
      bestScore = Math.min(score, bestScore);
      board[row][col] = oldPiece;
      board[piece.row][piece.col] = piece;
      piece.row = piece.row;
      piece.col = piece.col;
    }
    return bestScore;
  }
}

function scoreBoard(board, isMaximizing) {
  let score = 0;
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece !== null) {
        if (piece.isWhite === isMaximizing) score += scores[piece.getType()];
        else score -= scores[piece.getType()];
      }
    }
  }
  return score;
}