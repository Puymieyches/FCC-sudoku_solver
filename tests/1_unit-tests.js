const chai = require('chai');
const assert = chai.assert;

import { puzzlesAndSolutions } from '../controllers/puzzle-strings.js';
const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();
let validPuzzleString = puzzlesAndSolutions[0][0];
let validPuzzleSolution = puzzlesAndSolutions[0][1];

suite('Unit Tests', () => {
    suite('Input', () => {
        test('Logic handles a valid puzzle string of 81 characters', function() {
            const result = solver.validate(validPuzzleString);
            assert.isTrue(result.valid, 'puzzle string is valid');
        });
        test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function() {
            const invalidTestString = "a.b..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
            const result = solver.validate(invalidTestString);
            assert.isFalse(result.valid, 'puzzle string is valid');
        });
        test('Logic handles a puzzle string that is not 81 characters in length', function() {
            const invalidTestString = "123abc";
            const result = solver.validate(invalidTestString);
            assert.isFalse(result.valid, 'puzzle string is valid');
        });
    suite('Check Placement', () => {
        test('Logic handles a valid row placement', function() {
            const row = 0;
            const column = 1;
            const value = 3;
            const result = solver.checkRowPlacement(validPuzzleString, row, column, value);
            assert.isTrue(result, 'value should be valid for the row');
        })
        test('Logic handles an invalid row placement', function() {
            const row = 0;
            const column = 1;
            const value = 1;
            const result = solver.checkRowPlacement(validPuzzleString, row, column, value);
            assert.isFalse(result, 'value should be invalid for the row');
        })
        test('Logic handles a valid column placement', function() {
            const row = 1;
            const column = 0;
            const value = 5;
            const result = solver.checkColPlacement(validPuzzleString, row, column, value);
            assert.isTrue(result, 'value should be valid for the column');
        })
        test('Logic handles an invalid column placement', function() {
            const row = 1;
            const column = 0;
            const value = 1;
            const result = solver.checkColPlacement(validPuzzleString, row, column, value);
            assert.isFalse(result, 'value should be invalid for the column');
        })
        test('Logic handles an invalid column placement', function() {
            const row = 0;
            const column = 1;
            const value = 3;
            const result = solver.checkRegionPlacement(validPuzzleString, row, column, value);
            assert.isTrue(result, 'value should be valid for the region');
        })
        test('Logic handles an invalid column placement', function() {
            const row = 0;
            const column = 1;
            const value = 1;
            const result = solver.checkRegionPlacement(validPuzzleString, row, column, value);
            assert.isFalse(result, 'value should be invalid for the region');
        })
    })
    suite('Solvers', () => {
        test('Valid puzzle strings pass the solver', function() {
            const result = solver.solve(validPuzzleString);
            assert.notProperty(result, 'error', 'Puzzle string should not return an error');
        })
        test('Invalid puzzle strings fail the solver', function() {
            const invalidTestString = "a.b..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
            const result = solver.solve(invalidTestString);
            assert.property(result, 'error', 'Puzzle string should return an error');
        })
        test('Solver returns the expected solution for an incomplete puzzle', function() {
            const result = solver.solve(validPuzzleString);
            assert.equal(result, validPuzzleSolution, 'Input string is solved')
        })
    })
    })
});
