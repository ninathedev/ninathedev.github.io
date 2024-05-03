let selectedPiece = null;

let board = [
  [new Piece(1, true, [0, 0]), new Piece(2, true, [0, 1]), new Piece(3, true, [0, 2]), new Piece(4, true, [0, 3]), new Piece(5, true, [0, 4]), new Piece(3, true, [0, 5]), new Piece(2, true, [0, 6]), new Piece(1, true, [0, 7])],
  [new Piece(0, true, [1, 0]), new Piece(0, true, [1, 1]), new Piece(0, true, [1, 2]), new Piece(0, true, [1, 3]), new Piece(0, true, [1, 4]), new Piece(0, true, [1, 5]), new Piece(0, true, [1, 6]), new Piece(0, true, [1, 7])],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [new Piece(0, false, [6, 0]), new Piece(0, false, [6, 1]), new Piece(0, false, [6, 2]), new Piece(0, false, [6, 3]), new Piece(0, false, [6, 4]), new Piece(0, false, [6, 5]), new Piece(0, false, [6, 6]), new Piece(0, false, [6, 7])],
  [new Piece(1, false, [7, 0]), new Piece(2, false, [7, 1]), new Piece(3, false, [7, 2]), new Piece(4, false, [7, 3]), new Piece(5, false, [7, 4]), new Piece(3, false, [7, 5]), new Piece(2, false, [7, 6]), new Piece(1, false, [7, 7])]
];

let pieceImages = [];

function preload() {
  for (let j = 0; j < 6; j++) {
    pieceImages.push(loadImage(`pics/dark/${j}.png`));
  }
  for (let i = 0; i < 6; i++) {
    pieceImages.push(loadImage(`pics/light/${i}.png`));
  }
  
}

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255);
  noStroke();

  const squareSize = width / 8;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const x = col * squareSize;
      const y = row * squareSize;

      if ((row + col) % 2 === 0) {
        fill(220);
      } else {
        fill(128);
      }

      rect(x, y, squareSize, squareSize);

      if (board[row][col] !== null) {
        const pieceImg = pieceImages[board[row][col].type + (board[row][col].isWhite ? 0 : 6)];
        image(pieceImg, x, y, squareSize, squareSize);
      }
    }
  }

  if (selectedPiece !== null) {
    const moves = selectedPiece.getAvailableMoves(board);
    fill(0, 255, 0, 100);
    for (const move of moves) {
      const [row, col] = move;
      rect(col * squareSize, row * squareSize, squareSize, squareSize);
    }
  }
}

function mouseClicked() {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;
  const squareSize = width / 8;
  const col = Math.floor(mouseX / squareSize);
  const row = Math.floor(mouseY / squareSize);

  const clickedPiece = board[row][col];

  if (selectedPiece === null && clickedPiece !== null) {
    selectedPiece = clickedPiece;
  }

  if (selectedPiece !== null && selectedPiece.getAvailableMoves(board).some(move => move[0] === row && move[1] === col)) {
    board[selectedPiece.getPosition()[0]][selectedPiece.getPosition()[1]] = null;
    selectedPiece.move([row, col]);
    board[row][col] = selectedPiece;
    selectedPiece = null;
    doBestMove();
  }

  if (selectedPiece !== null) {
    if (clickedPiece !== null && clickedPiece.isWhite === selectedPiece.isWhite) {
      selectedPiece = clickedPiece;
    } else {
      selectedPiece = null;
    }
  }
}

const scoring = {
  0: 20, // pawn
  1: 50, // rook
  2: 100, // knight
  3: 50, // bishop
  4: 1000, // queen
  5: 10000 // king
};

function doBestMove(isMaximizing = false) {
  const bestMove = getBestMove(board, 5, true); // Set isMaximizing to true for black
  if (bestMove === null) return;
  const [start, end] = bestMove;
  board[end[0]][end[1]] = board[start[0]][start[1]];
  board[start[0]][start[1]] = null;
  
  // Check if the king is in danger after the move
  const kingPosition = findKingPosition(board, !isMaximizing);
  const isKingInDanger = isSquareAttacked(kingPosition, board, isMaximizing);
  
  if (isKingInDanger) {
    // If the king is in danger, undo the move and try another one
    board[start[0]][start[1]] = board[end[0]][end[1]];
    board[end[0]][end[1]] = null;
    doBestMove();
  }
}

function findKingPosition(board, isWhite) {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece !== null && piece.type === 5 && piece.isWhite === isWhite) {
        return [row, col];
      }
    }
  }
  return null;
}

function isSquareAttacked(position, board, isAttackingWhite) {
  const [row, col] = position;
  
  // Check if any opponent piece can attack the square
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (piece !== null && piece.isWhite !== isAttackingWhite) {
        const moves = piece.getAvailableMoves(board);
        for (const move of moves) {
          if (move[0] === row && move[1] === col) {
            return true;
          }
        }
      }
    }
  }
  
  return false;
}


function getBestMove(board, depth, isMaximizing) {
  const moves = getAllMoves(board, isMaximizing);
  let bestMove = null;
  let bestScore = isMaximizing ? -Infinity : Infinity;

  for (const move of moves) {
    const [start, end] = move;
    const piece = board[start[0]][start[1]];
    const oldPiece = board[end[0]][end[1]];

    board[end[0]][end[1]] = piece;
    board[start[0]][start[1]] = null;

    const score = minimax(board, depth - 1, !isMaximizing, -Infinity, Infinity);

    board[end[0]][end[1]] = oldPiece;
    board[start[0]][start[1]] = piece;

    if (isMaximizing) {
      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    } else {
      if (score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
  }

  return bestMove;
}

function minimax(board, depth, isMaximizing, alpha, beta) {
  if (depth === 0) {
    return evaluateBoard(board, isMaximizing);
  }

  const moves = getAllMoves(board, isMaximizing);
  let bestScore = isMaximizing ? -Infinity : Infinity;

  for (const move of moves) {
    const [start, end] = move;
    const piece = board[start[0]][start[1]];
    const oldPiece = board[end[0]][end[1]];

    board[end[0]][end[1]] = piece;
    board[start[0]][start[1]] = null;

    const score = minimax(board, depth - 1, !isMaximizing, alpha, beta);

    board[end[0]][end[1]] = oldPiece;
    board[start[0]][start[1]] = piece;

    if (isMaximizing) {
      bestScore = max(bestScore, score);
      alpha = max(alpha, score);
    } else {
      bestScore = min(bestScore, score);
      beta = min(beta, score);
    }

    if (beta <= alpha) {
      break;
    }
  }

  return bestScore;
}

function evaluateBoard(board, isMaximizing) {
  let score = 0;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece === null) continue;
      const pieceScore = scoring[piece.type];
      score += piece.isWhite === isMaximizing ? pieceScore : -pieceScore;
    }
  }

  return score;
}

function getAllMoves(board, isMaximizing) {
  const moves = [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece === null || piece.isWhite !== isMaximizing) continue;
      const availableMoves = piece.getAvailableMoves(board);
      for (const move of availableMoves) {
        moves.push([[row, col], move]);
      }
    }
  }

  return moves;
}
