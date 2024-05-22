const scores = {
  pawn: 1,
  knight: 3,
  bishop: 3,
  rook: 5,
  queen: 1000,
  king: 100000
};

function getBestMove(board, depth, isMaximizing) {
  const moves = getAllAvailableMoves(board, isMaximizing);
  let bestValue = isMaximizing ? -Infinity : Infinity;
  let bestMove;

  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    const newBoard = makeMove(board, move);
    const value = minimax(newBoard, depth, !isMaximizing, -Infinity, Infinity);
    if (isMaximizing ? value > bestValue : value < bestValue) {
      bestValue = value;
      bestMove = move;
    }
  }

  return bestMove;
}

function gameIsOver(board) {
  // Check for checkmate
  if (isCheckmate(board)) {
    return true;
  }

  // Check for stalemate
  if (isStalemate(board)) {
    return true;
  }

  // Check for insufficient material
  if (isInsufficientMaterial(board)) {
    return true;
  }

  // If none of the above conditions are met, the game is not over
  return false;
}

function isCheckmate(board, currentPlayer) {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      let piece = board[row][col];
      if (piece && piece.color === currentPlayer) {
        let moves = piece.getAvailableMoves(board);
        for (let move of moves) {
          let newBoard = makeMove(board, piece, move);
          if (!isInCheck(newBoard, currentPlayer)) {
            return false;
          }
        }
      }
    }
  }
  return true;
}

function isStalemate(board) {
  // TODO: Implement stalemate logic
  // Return true if the current player is in stalemate, otherwise return false
  // You can use the existing functions to check for stalemate conditions
  const isWhite = true; // Assuming the current player is white
  const moves = getAllAvailableMoves(board, isWhite);
  
  // Check if there are no available moves for the current player
  if (moves.length === 0) {
    return true;
  }
  
  return false;
}

function isInsufficientMaterial(board) {
  // TODO: Implement insufficient material logic
  // Return true if there is insufficient material on the board to force a checkmate, otherwise return false
  // You can use the existing functions to check for insufficient material conditions
  // For example, if there are only kings left on the board, it's considered insufficient material
  const pieces = Object.values(board.flat()).filter(piece => piece !== null);
  
  // Check if there are only kings left on the board
  if (pieces.length === 2 && pieces.every(piece => piece.type === 'king')) {
    return true;
  }
  
  return false;
}

function evaluateBoard(board) {
  // TODO: Implement board evaluation logic
  // Return a numerical value representing the evaluation of the board position
  // You can assign scores to each piece type using the 'scores' object
  let score = 0;
  
  // Iterate over the board and calculate the score based on the pieces
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece) {
        const pieceScore = scores[piece.getType()];
        score += piece.isWhite ? -pieceScore : pieceScore;
      }
    }
  }
  
  return score;
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

function minimax(board, depth, isMaximizing, alpha, beta) {
  if (depth === 0 || gameIsOver(board)) {
    return evaluateBoard(board);
  }

  const moves = getAllAvailableMoves(board, isMaximizing);
  let bestValue;

  if (!isMaximizing) {
    bestValue = -Infinity;
    for (let move of moves) {
      const newBoard = makeMove(board, move);
      const value = minimax(newBoard, depth - 1, !isMaximizing, alpha, beta);
      bestValue = Math.max(bestValue, value);
      alpha = Math.max(alpha, value);
      if (beta <= alpha) {
        break; // Alpha-beta pruning
      }
    }
  } else {
    bestValue = Infinity;
    for (let move of moves) {
      const newBoard = makeMove(board, move);
      const value = minimax(newBoard, depth - 1, !isMaximizing, alpha, beta);
      bestValue = Math.min(bestValue, value);
      beta = Math.min(beta, value);
      if (beta <= alpha) {
        break; // Alpha-beta pruning
      }
    }
  }

  return bestValue;
}

function makeMove(board, move) {
  // Create a deep copy of the board
  const newBoard = Piece.copyBoard(board);

  // Get the start and end positions from the move
  console.log(move);
  const [start, end] = move;

  // Get the piece from the start position
  const piece = newBoard[start.row][start.col];

  // Move the piece to the end position
  newBoard[end[0]][end[1]] = piece;

  // Remove the piece from the start position
  newBoard[start.row][start.col] = null;

  // Return the new board
  return newBoard;
}