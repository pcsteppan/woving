const nearley = require("nearley");
const woving = require("./woving.js");
const evaluate = require('./woving-evaluator.js');

// Create a Parser object from our grammar.

var createParser = (input) => new nearley.Parser(nearley.Grammar.fromCompiled(woving)).feed(input).results[0];

test('parses empty string as valid', () => {
    const parse = createParser('');
    const expr = evaluate(parse);
    // expect(expr).toBe("");?
});

test('parses single number as identity', () => {
    const parse = createParser('1');
    const expr = evaluate(parse);
    expect(expr).toBe('1');
});

test('parses number sequence as identity', () => {
    const parse = createParser('1234');
    const expr = evaluate(parse);
    expect(expr).toBe('1234');
});

test('parses basic repeat correctly', () => {
    const parse = createParser('12:2');
    const expr = evaluate(parse);
    expect(expr).toBe('1212');
});

test('parses basic group correctly', () => {
    const parse = createParser('[1234]');
    const expr = evaluate(parse);
    expect(expr).toBe('1234');
});

test('parses basic symmetry operator \'|\' usage correctly', () => {
    const parse = createParser('1234|');
    const expr = evaluate(parse);
    expect(expr).toBe('12344321');
});

test('parses basic point symmetry operator \'!\' usage correctly', () => {
    const parse = createParser('1234!');
    const expr = evaluate(parse);
    expect(expr).toBe('1234321');
});

test('parses simple non-step step array group /.../ correctly', () => {
    const parse = createParser('/11/');
    const expr = evaluate(parse);
    expect(expr).toBe('11');
});

test('parses simple step array group /.../ correctly', () => {
    const parse = createParser('/14/');
    const expr = evaluate(parse);
    expect(expr).toBe('1234');
});

test('parses step array group /.../ correctly', () => {
    const parse = createParser('/414241/');
    const expr = evaluate(parse);
    expect(expr).toBe('43212343234321');
});

test('parses multi-expressions', () => {
    const parse = createParser('[1][2]');
    const expr = evaluate(parse);
    expect(expr).toBe('12');
});

test('parses redundant nested expressions', () => {
    const parse = createParser('[[1234]]');
    const expr = evaluate(parse);
    expect(expr).toBe('1234');
});

test('parses non-redundant nested expressions', () => {
    const parse = createParser('[1[23]4]');
    const expr = evaluate(parse);
    expect(expr).toBe('1234');
});

test('parses real example 1', () => {
    const parse = createParser('2341[2:3][3:3][4:3][1:4]2341|');
    const expr = evaluate(parse);
    expect(expr).toBe('234122233344411112341143211114443332221432');
})

test('parses real example 2', () => {
    const parse = createParser('/14//12132434/14/14/1!');
    const expr = evaluate(parse);
    expect(expr).toBe('12341212323434141234143214143432321214321');
})