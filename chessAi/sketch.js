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
    const check = isKingInCheck(findKingPosition(board, selectedPiece.isWhite), board)
    const moves = selectedPiece.getAvailableMoves(board, check);
    fill(0, 255, 0, 100);
    for (const move of moves) {
      const [row, col] = move;
      rect(col * squareSize, row * squareSize, squareSize, squareSize);
    }
  }

  // Check if the king is in check
  const kingPosition2 = findKingPosition(board, false);
  if (isKingInCheck(kingPosition2, board, false)) {
    const [row, col] = kingPosition2;
    fill(255, 0, 0, 100);
    rect(col * squareSize, row * squareSize, squareSize, squareSize);
  }
}

function mouseClicked() {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;
  const squareSize = width / 8;
  const col = Math.floor(mouseX / squareSize);
  const row = Math.floor(mouseY / squareSize);

  const clickedPiece = board[row][col];

  if (selectedPiece === null && clickedPiece !== null) {
    if (clickedPiece.isWhite === false) selectedPiece = clickedPiece;
  }

  if (selectedPiece !== null && selectedPiece.getAvailableMoves(board).some(move => move[0] === row && move[1] === col)) {
    board[selectedPiece.getPosition()[0]][selectedPiece.getPosition()[1]] = null;
    selectedPiece.move([row, col]);
    // check if a pawn has reached the end of the board
    if (selectedPiece.type === 0 && (row === 0 || row === 7)) {
      selectedPiece.type = 4;
    }
    board[row][col] = selectedPiece;
    selectedPiece = null;
    const best = getBestMove(board, 4, true);
    if (best) {
      const [piece, move] = best;
      board[piece.getPosition()[0]][piece.getPosition()[1]] = null;
      piece.move(move);
      board[move[0]][move[1]] = piece;

      // check if a pawn has reached the end of the board
      if (piece.type === 0 && (move[0] === 0 || move[0] === 7)) {
        piece.type = 4;
      }

      if (getAllAvailableMoves(board, true).length === 0) {
        document.getElementById("msg").innerHTML = "You lost!";
      }
    } else {
      document.getElementById("msg").innerHTML = "You win!";
    }
  }

  if (selectedPiece !== null) {
    if (clickedPiece !== null && clickedPiece.isWhite === selectedPiece.isWhite) {
      selectedPiece = clickedPiece;
    } else {
      selectedPiece = null;
    }
  }
}

// Helper function to find the position of the king
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

// Helper function to check if the king is in check
function isKingInCheck(kingPosition, board2, isWhite) {
  if (kingPosition === null) return false;

  const [kingRow, kingCol] = kingPosition;
  const opponentColor = !board2[kingRow][kingCol].isWhite ? !board2[kingRow][kingCol].isWhite : findKingPosition(board2, isWhite);

  // Check if any opponent piece can attack the king
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board2[row][col];
      if (piece !== null && piece.isWhite === opponentColor) {
        const moves = piece.getAvailableMoves(board2);
        for (const move of moves) {
          if (move[0] === kingRow && move[1] === kingCol) {
            return true;
          }
        }
      }
    }
  }

  return false;
}

const scoring = {
  0: 20, // pawn
  1: 50, // rook
  2: 100, // knight
  3: 50, // bishop
  4: 1000, // queen
  5: 10000 // king
};
