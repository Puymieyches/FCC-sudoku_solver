class SudokuSolver {

  createGrid(puzzleString) {
    let grid = [];
    for (let i = 0; i < 81; i += 9) {
      grid.push(puzzleString.slice(i, i + 9).split(''));
    }
    return grid;
  }

  coordinateCheck(coordinateString) {
    if (coordinateString.length !== 2) {
      return { valid: false, error: 'Invalid coordinate' };
    }
    
    const regex = /^[a-iA-I][1-9]$/;

    if (!regex.test(coordinateString)) {
      return { valid: false, error: 'Invalid coordinate' };
    }
    return { valid: true };
  }

  validate(puzzleString) {
    
    const regex = /^[1-9.]+$/g;
    const validChars = regex.test(puzzleString);
    if (!validChars) {
      return { valid: false, error: 'Invalid characters in puzzle' };
    }
    
    if (puzzleString.length !== 81) {
      return { valid: false, error: 'Expected puzzle to be 81 characters long' };
    }

    let grid = this.createGrid(puzzleString);
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] !== '.') {
          let value = grid[row][col];
          grid[row][col] = '.'; // Temporarily remove to check placement
          if (!this.isValid(grid, row, col, value)) {
            return { valid: false, error: 'Puzzle cannot be solved' };
          }
          grid[row][col] = value; // Put the value back
        }
      }
    }

    return { valid: true };

  }

  checkRowPlacement(puzzleString, row, column, value) {
    const grid = this.createGrid(puzzleString);
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] == value) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const grid = this.createGrid(puzzleString);
    for (let r = 0; r < 9; r++) {
      if (grid[r][column] == value) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const grid = this.createGrid(puzzleString);
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(column / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[i + startRow][j + startCol] == value) {
          return false;
        }
      }
    }
    return true;
  }

  solveSudoku(grid) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === '.') {
          for (let num = 1; num <= 9; num++) {
            if (this.isValid(grid, row, col, `${num}`)) {
              grid[row][col] = `${num}`;
              
              if (this.solveSudoku(grid)) {
                return true;
              }
              
              grid[row][col] = '.'; // backtrack
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  isValid(grid, row, col, num) {
    return this.checkRowPlacement(grid.flat().join(''), row, col, num) &&
           this.checkColPlacement(grid.flat().join(''), row, col, num) &&
           this.checkRegionPlacement(grid.flat().join(''), row, col, num);
  }

  solve(puzzleString) {
    const validation = this.validate(puzzleString);
    if (!validation.valid) {
      return { error: validation.error };
    }

    let grid = this.createGrid(puzzleString);


    
    if (this.solveSudoku(grid)) {
      return grid.flat().join('');  // Convert 2D grid back to string
    } else {
      return { error: "Puzzle cannot be solved" };
    } 
  }
}

module.exports = SudokuSolver;

