const scores = {
  pawn: 1,
  knight: 3,
  bishop: 3,
  rook: 5,
  queen: 1000,
  king: 100000
};

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
  if (depth === 0) return [0, 0, scoreBoard(board, isMaximizing)];

  const allAvailableMoves = getAllAvailableMoves(board, isMaximizing);
  if (isMaximizing) {
    let bestScore = -Infinity;
    let moves = [];
    for (let move of allAvailableMoves) {
      const testBoard = Piece.copyBoard(board);
      const [piece, [row, col]] = move;
      testBoard[piece.getPosition()[0]][piece.getPosition()[1]] = null;
      piece.move([row, col]);
      testBoard[row][col] = piece;
      moves.push([piece, [row, col], minimax(testBoard, depth - 1, isMaximizing)[2]]);
      if (minimax(testBoard, depth - 1, isMaximizing)[2] > bestScore) bestScore = minimax(testBoard, depth - 1, isMaximizing)[2];
    }

    for (let i = 0; i < moves.length; i++) {
      if (moves[i][2] === bestScore) return moves[i];
    }
  } else {
    let bestScore = Infinity;
    let moves = [];
    for (let move of allAvailableMoves) {
      const testBoard = Piece.copyBoard(board);
      const [piece, [row, col]] = move;
      testBoard[piece.getPosition()[0]][piece.getPosition()[1]] = null;
      piece.move([row, col]);
      testBoard[row][col] = piece;
      moves.push([piece, [row, col], minimax(testBoard, depth - 1, isMaximizing)[2]]);
      if (minimax(testBoard, depth - 1, isMaximizing)[2] < bestScore) bestScore = minimax(testBoard, depth - 1, isMaximizing)[2];
    }

    for (let i = 0; i < moves.length; i++) {
      if (moves[i][2] === bestScore) return moves[i];
    }
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