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

  getIsWhite() {
    return this.isWhite;
  }

  move(newPosition) {
    this.position = newPosition;
  }

  getPosition() {
    return this.position;
  }

  getAvailableMoves(board) {
    const availableMoves = [];
    const [row, col] = this.position;

    // Define the rules for each piece type
    switch (this.getType()) {
      case "pawn":
        // Implement the logic for pawn moves
        if (this.isWhite) {
          // White pawn moves
          if (row === 1) {
        // First move, can move 1 or 2 steps forward
        if (board[row + 1][col] === null) {
          availableMoves.push([row + 1, col]);
          if (board[row + 2][col] === null) {
            availableMoves.push([row + 2, col]);
          }
        }
          } else {
        // Regular move, can move 1 step forward
        if (board[row + 1][col] === null) {
          availableMoves.push([row + 1, col]);
        }
          }
          // Capture moves
          if (col > 0 && board[row + 1][col - 1] !== null && board[row + 1][col - 1].isWhite !== this.isWhite) {
        availableMoves.push([row + 1, col - 1]);
          }
          if (col < 7 && board[row + 1][col + 1] !== null && board[row + 1][col + 1].isWhite !== this.isWhite) {
        availableMoves.push([row + 1, col + 1]);
          }
          // Promotion
          if (row === 6) {
        // Check if pawn reaches the eighth rank
        if (board[row + 1][col] === null) {
          availableMoves.push([row + 1, col]);
          this.type = 4;
        }
          }
        } else {
          // Black pawn moves
          if (row === 6) {
        // First move, can move 1 or 2 steps forward
        if (board[row - 1][col] === null) {
          availableMoves.push([row - 1, col]);
          if (board[row - 2][col] === null) {
            availableMoves.push([row - 2, col]);
          }
        }
          } else {
        // Regular move, can move 1 step forward
        if (board[row - 1][col] === null) {
          availableMoves.push([row - 1, col]);
        }
          }
          // Capture moves
          if (col > 0 && board[row - 1][col - 1] !== null && board[row - 1][col - 1].isWhite !== this.isWhite) {
        availableMoves.push([row - 1, col - 1]);
          }
          if (col < 7 && board[row - 1][col + 1] !== null && board[row - 1][col + 1].isWhite !== this.isWhite) {
        availableMoves.push([row - 1, col + 1]);
          }
          // Promotion
          if (row === 1) {
        // Check if pawn reaches the first rank
        if (board[row - 1][col] === null) {
          availableMoves.push([row - 1, col]);
          this.type = 4;
        }
          }
        }
        break;
      case "rook":
        // Implement the logic for rook moves
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
        // Implement the logic for knight moves
        const knightMoves = [
          [row - 2, col - 1],
          [row - 2, col + 1],
          [row - 1, col - 2],
          [row - 1, col + 2],
          [row + 1, col - 2],
          [row + 1, col + 2],
          [row + 2, col - 1],
          [row + 2, col + 1]
        ];
        for (const [r, c] of knightMoves) {
          if (r >= 0 && r < 8 && c >= 0 && c < 8) {
            if (board[r][c] === null || board[r][c].isWhite !== this.isWhite) {
              availableMoves.push([r, c]);
            }
          }
        }
        break;
      case "bishop":
        // Implement the logic for bishop moves
        // Diagonal moves
        let i = row - 1;
        let j = col - 1;
        while (i >= 0 && j >= 0) {
          if (board[i][j] === null) {
            availableMoves.push([i, j]);
          } else {
            if (board[i][j].isWhite !== this.isWhite) {
              availableMoves.push([i, j]);
            }
            break;
          }
          i--;
          j--;
        }
        i = row - 1;
        j = col + 1;
        while (i >= 0 && j < 8) {
          if (board[i][j] === null) {
            availableMoves.push([i, j]);
          } else {
            if (board[i][j].isWhite !== this.isWhite) {
              availableMoves.push([i, j]);
            }
            break;
          }
          i--;
          j++;
        }
        i = row + 1;
        j = col - 1;
        while (i < 8 && j >= 0) {
          if (board[i][j] === null) {
            availableMoves.push([i, j]);
          } else {
            if (board[i][j].isWhite !== this.isWhite) {
              availableMoves.push([i, j]);
            }
            break;
          }
          i++;
          j--;
        }
        i = row + 1;
        j = col + 1;
        while (i < 8 && j < 8) {
          if (board[i][j] === null) {
            availableMoves.push([i, j]);
          } else {
            if (board[i][j].isWhite !== this.isWhite) {
              availableMoves.push([i, j]);
            }
            break;
          }
          i++;
          j++;
        }
        break;
        case "queen":
          // Implement the logic for queen moves
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
          // Diagonal moves
          let r = row - 1;
          let c = col - 1;
          while (r >= 0 && c >= 0) {
            if (board[r][c] === null) {
              availableMoves.push([r, c]);
            } else {
              if (board[r][c].isWhite !== this.isWhite) {
                availableMoves.push([r, c]);
              }
              break;
            }
            r--;
            c--;
          }
          r = row - 1;
          c = col + 1;
          while (r >= 0 && c < 8) {
            if (board[r][c] === null) {
              availableMoves.push([r, c]);
            } else {
              if (board[r][c].isWhite !== this.isWhite) {
                availableMoves.push([r, c]);
              }
              break;
            }
            r--;
            c++;
          }
          r = row + 1;
          c = col - 1;
          while (r < 8 && c >= 0) {
            if (board[r][c] === null) {
              availableMoves.push([r, c]);
            } else {
              if (board[r][c].isWhite !== this.isWhite) {
                availableMoves.push([r, c]);
              }
              break;
            }
            r++;
            c--;
          }
          r = row + 1;
          c = col + 1;
          while (r < 8 && c < 8) {
            if (board[r][c] === null) {
              availableMoves.push([r, c]);
            } else {
              if (board[r][c].isWhite !== this.isWhite) {
                availableMoves.push([r, c]);
              }
              break;
            }
            r++;
            c++;
          }
          break;
        
      case "king":
        // Implement the logic for king moves
        const kingMoves = [
          [row - 1, col - 1],
          [row - 1, col],
          [row - 1, col + 1],
          [row, col - 1],
          [row, col + 1],
          [row + 1, col - 1],
          [row + 1, col],
          [row + 1, col + 1]
        ];
        for (const [r, c] of kingMoves) {
          if (r >= 0 && r < 8 && c >= 0 && c < 8) {
            if (board[r][c] === null || board[r][c].isWhite !== this.isWhite) {
              availableMoves.push([r, c]);
            }
          }
        }
        break;
      default:
        break;
    }
    
    return availableMoves;
  }

  move(newPosition) {
    this.position = newPosition;
  }
}