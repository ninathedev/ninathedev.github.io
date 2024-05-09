class Piece {
  constructor(type, isWhite, position) {
    this.type = type;
    this.isWhite = isWhite;
    this.position = position;
  }

  getType() {
    const types = ["pawn", "rook", "knight", "bishop", "queen", "king"];
    return types[this.type];
  }

  move(newPosition) {
    if (this.type === 0 && (newPosition[0] === 0 || newPosition[0] === 7)) {
      this.type = 4;
    }
    this.position = newPosition;
  }

  getPosition() {
    return this.position;
  }

  getAvailableMoves(board, isSimulated) {
    isSimulated = isSimulated || false;
    const availableMoves = [];
    const availMoves = [];
    const [row, col] = this.position;

    switch (this.getType()) {
      case "pawn":
        const direction = !this.isWhite ? -1 : 1; // Direction depends on the pawn's color

        // Check if the square in front of the pawn is empty
        if (board[row + direction][col] === null) {
          availableMoves.push([row + direction, col]);

          // Pawns can move two squares forward on their first move
          if ((this.isWhite && row === 1) || (!this.isWhite && row === 6)) {
            if (board[row + 2 * direction][col] === null) {
              availableMoves.push([row + 2 * direction, col]);
            }
          }
        }

        // Check for possible captures diagonally
        if (col > 0 && board[row + direction][col - 1] !== null && board[row + direction][col - 1].isWhite !== this.isWhite) {
          availableMoves.push([row + direction, col - 1]);
        }
        if (col < 7 && board[row + direction][col + 1] !== null && board[row + direction][col + 1].isWhite !== this.isWhite) {
          availableMoves.push([row + direction, col + 1]);
        }
        break;

      case "rook":
        // Horizontal moves
        for (let i = col - 1; i >= 0; i--) {
          if (board[row][i] === null) {
            availableMoves.push([row, i]);
          } else {
            if (board[row][i].isWhite !== this.isWhite) {
              availableMoves.push([row, i]);
            }
            break;
          }
        }
        for (let i = col + 1; i < 8; i++) {
          if (board[row][i] === null) {
            availableMoves.push([row, i]);
          } else {
            if (board[row][i].isWhite !== this.isWhite) {
              availableMoves.push([row, i]);
            }
            break;
          }
        }
        // Vertical moves
        for (let i = row - 1; i >= 0; i--) {
          if (board[i][col] === null) {
            availableMoves.push([i, col]);
          } else {
            if (board[i][col].isWhite !== this.isWhite) {
              availableMoves.push([i, col]);
            }
            break;
          }
        }
        for (let i = row + 1; i < 8; i++) {
          if (board[i][col] === null) {
            availableMoves.push([i, col]);
          } else {
            if (board[i][col].isWhite !== this.isWhite) {
              availableMoves.push([i, col]);
            }
            break;
          }
        }
        break;

      case "knight":
        const knightMoves = [
          [row - 2, col - 1], [row - 2, col + 1], [row - 1, col - 2], [row - 1, col + 2],
          [row + 1, col - 2], [row + 1, col + 2], [row + 2, col - 1], [row + 2, col + 1]
        ];
        for (const [r, c] of knightMoves) {
          if (r >= 0 && r < 8 && c >= 0 && c < 8 && (board[r][c] === null || board[r][c].isWhite !== this.isWhite)) {
            availableMoves.push([r, c]);
          }
        }
        break;

      case "bishop":
        // Diagonal moves
        for (let i = 1; row + i < 8 && col + i < 8; i++) {
          if (board[row + i][col + i] === null) {
            availableMoves.push([row + i, col + i]);
          } else {
            if (board[row + i][col + i].isWhite !== this.isWhite) {
              availableMoves.push([row + i, col + i]);
            }
            break;
          }
        }
        for (let i = 1; row + i < 8 && col - i >= 0; i++) {
          if (board[row + i][col - i] === null) {
            availableMoves.push([row + i, col - i]);
          } else {
            if (board[row + i][col - i].isWhite !== this.isWhite) {
              availableMoves.push([row + i, col - i]);
            }
            break;
          }
        }
        for (let i = 1; row - i >= 0 && col + i < 8; i++) {
          if (board[row - i][col + i] === null) {
            availableMoves.push([row - i, col + i]);
          } else {
            if (board[row - i][col + i].isWhite !== this.isWhite) {
              availableMoves.push([row - i, col + i]);
            }
            break;
          }
        }
        for (let i = 1; row - i >= 0 && col - i >= 0; i++) {
          if (board[row - i][col - i] === null) {
            availableMoves.push([row - i, col - i]);
          } else {
            if (board[row - i][col - i].isWhite !== this.isWhite) {
              availableMoves.push([row - i, col - i]);
            }
            break;
          }
        }
        break;

      case "queen":
        // Combine bishop and rook moves
        // Rook-like moves
        for (let i = col - 1; i >= 0; i--) {
          if (board[row][i] === null) {
            availableMoves.push([row, i]);
          } else {
            if (board[row][i].isWhite !== this.isWhite) {
              availableMoves.push([row, i]);
            }
            break;
          }
        }
        for (let i = col + 1; i < 8; i++) {
          if (board[row][i] === null) {
            availableMoves.push([row, i]);
          } else {
            if (board[row][i].isWhite !== this.isWhite) {
              availableMoves.push([row, i]);
            }
            break;
          }
        }
        for (let i = row - 1; i >= 0; i--) {
          if (board[i][col] === null) {
            availableMoves.push([i, col]);
          } else {
            if (board[i][col].isWhite !== this.isWhite) {
              availableMoves.push([i, col]);
            }
            break;
          }
        }
        for (let i = row + 1; i < 8; i++) {
          if (board[i][col] === null) {
            availableMoves.push([i, col]);
          } else {
            if (board[i][col].isWhite !== this.isWhite) {
              availableMoves.push([i, col]);
            }
            break;
          }
        }
        // Bishop-like moves
        for (let i = 1; row + i < 8 && col + i < 8; i++) {
          if (board[row + i][col + i] === null) {
            availableMoves.push([row + i, col + i]);
          } else {
            if (board[row + i][col + i].isWhite !== this.isWhite) {
              availableMoves.push([row + i, col + i]);
            }
            break;
          }
        }
        for (let i = 1; row + i < 8 && col - i >= 0; i++) {
          if (board[row + i][col - i] === null) {
            availableMoves.push([row + i, col - i]);
          } else {
            if (board[row + i][col - i].isWhite !== this.isWhite) {
              availableMoves.push([row + i, col - i]);
            }
            break;
          }
        }
        for (let i = 1; row - i >= 0 && col + i < 8; i++) {
          if (board[row - i][col + i] === null) {
            availableMoves.push([row - i, col + i]);
          } else {
            if (board[row - i][col + i].isWhite !== this.isWhite) {
              availableMoves.push([row - i, col + i]);
            }
            break;
          }
        }
        for (let i = 1; row - i >= 0 && col - i >= 0; i++) {
          if (board[row - i][col - i] === null) {
            availableMoves.push([row - i, col - i]);
          } else {
            if (board[row - i][col - i].isWhite !== this.isWhite) {
              availableMoves.push([row - i, col - i]);
            }
            break;
          }
        }
        break;

      case "king":
        const kingMoves = [
          [row - 1, col - 1], [row - 1, col], [row - 1, col + 1],
          [row, col - 1], [row, col + 1],
          [row + 1, col - 1], [row + 1, col], [row + 1, col + 1]
        ];
        for (const [r, c] of kingMoves) {
          if (r >= 0 && r < 8 && c >= 0 && c < 8 && (board[r][c] === null || board[r][c].isWhite !== this.isWhite)) {
            availableMoves.push([r, c]);
          }
        }
        break;
    }

    // Filter out moves that put the king in check
    if (!isSimulated) {
      for (const move of availableMoves) {
        const newBoard = this.simulateMove(board, [row, col], move);
        if (!this.isKingChecked(newBoard, this.isWhite)) {
          availMoves.push(move);
        }
      }
    } else {
      return availableMoves;
    }

    return availMoves;
  }

  clone() {
    return new Piece(this.type, this.isWhite, this.position.slice());
  }

  copyBoard(board) {
    let newBoard = [];

    for (let i in board) {
      let newRow = [];
      for (let j in board[i]) {
        if (board[i][j] === null) newRow.push(null);
        else newRow.push(board[i][j].clone());
      }
      newBoard.push(newRow);
    }

    return newBoard;
  }

  simulateMove(board, from, to) {
    // Create a deep copy of the board
    const newBoard = this.copyBoard(board);

    // Get the piece at the 'from' position
    const piece = newBoard[from[0]][from[1]];

    // Move the piece to the 'to' position
    if (piece.getAvailableMoves(board, true).some(move => move[0] === to[0] && move[1] === to[1])) {
      newBoard[to[0]][to[1]] = piece;
      newBoard[from[0]][from[1]] = null;
    }

    // Update the position of the moved piece
    piece.move(to);
    return newBoard;
  }

  move(newPosition) {
    this.position = newPosition;
  }

  isKingChecked(board, isWhite) {
    // Find the position of the king
    let kingPosition;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece == null) continue;
        if (piece.isWhite == isWhite && piece.type == 5) {
          kingPosition = [row, col];
          break;
        }
      }
    }
  
    // Check if any opponent's piece threatens the king
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const piece = board[i][j];
        if (piece && piece.isWhite !== isWhite && piece.type !== 5) {
          const availableMoves = piece.getAvailableMoves(board, true);
          for (const move of availableMoves) {
            if (move[0] === kingPosition[0] && move[1] === kingPosition[1]) {
              return true; // King is checked
            }
          }
        }
      }
    }
  
    return false; // King is not checked
  }
  
}