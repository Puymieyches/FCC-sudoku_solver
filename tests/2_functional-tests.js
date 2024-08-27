const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    suite('POST /api/solve', () => {
        test('Solve a puzzle with valid puzzle string', function(done) {
            const validString = puzzlesAndSolutions[0][0];
            const expectedOutput = puzzlesAndSolutions[0][1];
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: validString })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.property(res.body, 'solution');
                    assert.equal(res.body.solution, expectedOutput, 'Should match')
                    done();
                });
        });
        test('Solve a puzzle with missing puzzle string', function(done) {
            chai.request(server)
                .post('/api/solve')
                .send({})
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.equal(res.body.error, 'Required field missing', 'Should return the error')
                    done();
                });
        });
        test('Solve a puzzle with invalid characters', function(done) {
            const invalidCharString = "a.b..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: invalidCharString })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.equal(res.body.error, 'Invalid characters in puzzle', 'Should return the error')
                    done();
                });
        });
        test('Solve a puzzle with incorrect length', function(done) {
            const invalidCharString = "123..."
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: invalidCharString })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.equal(res.body.error, 'Expected puzzle to be 81 characters long', 'Should return the error')
                    done();
                });
        });
        test('Solve a puzzle that cannot be solved', function(done) {
            const invalidCharString = "111......222......333......444......555......666......777......888......999......";
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: invalidCharString })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.equal(res.body.error, 'Puzzle cannot be solved', 'Should return the error')
                    done();
                });
        });
    })
    suite('POST /api/check', () => {
        test('Check a puzzle placement with all fields', function(done) {
            const coordinate = 'A2';
            const value = '3';
            const puzzle = puzzlesAndSolutions[0][0];
            chai.request(server)
                .post('/api/check')
                .send({ coordinate: coordinate , value: value, puzzle: puzzle })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.property(res.body, 'valid');
                    assert.isTrue(res.body.valid, 'placement should be valid');
                    done();
                });
        });
        test('Check a puzzle placement with single placement conflict', function(done) {
            const coordinate = 'A2';
            const value = '4';
            const puzzle = puzzlesAndSolutions[0][0];
            chai.request(server)
                .post('/api/check')
                .send({ coordinate: coordinate , value: value, puzzle: puzzle })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.property(res.body, 'valid');
                    assert.isFalse(res.body.valid, 'placement should be invalid');
                    assert.property(res.body, 'conflict', 'should be present');
                    assert.isArray(res.body.conflict);
                    assert.lengthOf(res.body.conflict, 1, 'Should have 1 conflict');
                    done();
                });
        });
        test('Check a puzzle placement with multiple placement conflicts', function(done) {
            const coordinate = 'B1';
            const value = '1';
            const puzzle = puzzlesAndSolutions[0][0];
            chai.request(server)
                .post('/api/check')
                .send({ coordinate: coordinate , value: value, puzzle: puzzle })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.property(res.body, 'valid');
                    assert.isFalse(res.body.valid, 'placement should be invalid');
                    assert.property(res.body, 'conflict', 'should be present');
                    assert.isArray(res.body.conflict);
                    assert.isAtLeast(res.body.conflict.length, 2, 'Should have at least 2 conflicts');
                    done();
                });
        });
        test('Check a puzzle placement with all placement conflicts', function(done) {
            const coordinate = 'B1';
            const value = '1';
            const puzzle = puzzlesAndSolutions[0][0];
            chai.request(server)
                .post('/api/check')
                .send({ coordinate: coordinate , value: value, puzzle: puzzle })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.property(res.body, 'valid');
                    assert.isFalse(res.body.valid, 'placement should be invalid');
                    assert.property(res.body, 'conflict', 'should be present');
                    assert.isArray(res.body.conflict);
                    assert.equal(res.body.conflict.length, 3, 'Should have all 3 conflicts');
                    done();
                });
        });
        test('Check a puzzle placement with missing required fields', function(done) {
            const coordinate = '';
            const value = '1';
            const puzzle = puzzlesAndSolutions[0][0];
            chai.request(server)
                .post('/api/check')
                .send({ coordinate: coordinate , value: value, puzzle: puzzle })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Required field(s) missing');
                    done();
                });
        });
        test('Check a puzzle placement with invalid characters', function(done) {
            const coordinate = 'B1';
            const value = '1';
            const invalidCharPuzzle = "a.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
            chai.request(server)
                .post('/api/check')
                .send({ coordinate: coordinate , value: value, puzzle: invalidCharPuzzle })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Invalid characters in puzzle');
                    done();
                });
        });
        test('Check a puzzle placement with incorrect length', function(done) {
            const coordinate = 'B1';
            const value = '1';
            const invalidCharPuzzle = ".5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
            chai.request(server)
                .post('/api/check')
                .send({ coordinate: coordinate , value: value, puzzle: invalidCharPuzzle })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
                    done();
                });
        });
        test('Check a puzzle placement with invalid placement coordinate', function(done) {
            const coordinate = 'B11';
            const value = '1';
            const invalidCharPuzzle = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
            chai.request(server)
                .post('/api/check')
                .send({ coordinate: coordinate , value: value, puzzle: invalidCharPuzzle })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Invalid coordinate');
                    done();
                });
        });
        test('Check a puzzle placement with invalid placement value', function(done) {
            const coordinate = 'B1';
            const value = '11';
            const invalidCharPuzzle = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
            chai.request(server)
                .post('/api/check')
                .send({ coordinate: coordinate , value: value, puzzle: invalidCharPuzzle })
                .end(function(err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Invalid value');
                    done();
                });
        });             
    })
});

