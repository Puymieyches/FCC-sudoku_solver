'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const { coordinate, value, puzzle } = req.body;

      if (!coordinate || !value || !puzzle) {
        return res.json({ error: 'Required field(s) missing'});
      }

      const stringValidation = solver.validate(puzzle);
      if (stringValidation.error) {
        return res.json({ error : stringValidation.error });
      }

      const isValidCoordinate = solver.coordinateCheck(coordinate);
      if (!isValidCoordinate.valid) {
        return res.json({ error: isValidCoordinate.error });
      }

      const numregex = /^[1-9]$/;
      if (!numregex.test(value)) {
        return res.json({ error : 'Invalid value' });
      }          
      
      let row = coordinate[0].toUpperCase();
      const rowTable = {
        "A": 0,
        "B": 1,
        "C": 2,
        "D": 3,
        "E": 4,
        "F": 5,
        "G": 6,
        "H": 7,
        "I": 8
      }
      row = rowTable[row];
      const column = parseInt(coordinate[1]) - 1;

      const grid = solver.createGrid(puzzle);
      const valueInGrid = grid[row][column];
      if (value === valueInGrid) {
        return res.json({ valid: true });
      }

      const rowCheck = solver.checkRowPlacement(puzzle, row, column, value);
      const colCheck = solver.checkColPlacement(puzzle, row, column, value);
      const regionCheck = solver.checkRegionPlacement(puzzle, row, column, value);

      let errorArray = [];
      if (!rowCheck) {
        errorArray.push("row");
      }
      if (!colCheck) {
        errorArray.push("column");
      }
      if (!regionCheck) {
        errorArray.push("region");
      }

      if (errorArray.length > 0) {
        return res.json({ valid: false, conflict: errorArray });
      }
      return res.json({ valid: true });
             
    });
    
  app.route('/api/solve')
    .post((req, res) => {

      const puzzleString = req.body.puzzle;

      if (!puzzleString) {
        return res.json({ error: 'Required field missing' });
      }

      const validation = solver.validate(puzzleString);
      if (!validation) {
        return res.json({ error: validation.error });
      }

      const solution = solver.solve(puzzleString);
      if (solution.error) {
        return res.json({ error: solution.error });
      }
      return res.json({solution});
      
    });
};
