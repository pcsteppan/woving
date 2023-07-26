const nearley = require("nearley");
const woving = require("./woving.js");
const evaluateString = require('./woving-evaluator.js');

// Create a Parser object from our grammar.

const createParser = (input) => new nearley.Parser(nearley.Grammar.fromCompiled(woving)).feed(input).results[0];
const expectEvaluationOf = (input) => {
    const parse = createParser(input);
    const expr = evaluateString(parse);
    return expect(expr);
}

describe('Parses symbols correctly when used in isolation.', () => {
    test('parses single number as identity', () => {
        expectEvaluationOf('1').toBe('1');
    });

    test('parses number sequence as identity', () => {
        expectEvaluationOf('1234').toBe('1234');
    });

    test('parses basic repeat correctly', () => {
        expectEvaluationOf('12:2').toBe('1212');
    });

    test('parses basic group correctly', () => {
        expectEvaluationOf('[1234]').toBe('1234');
    });

    test('parses basic symmetry operator \'|\' usage correctly', () => {
        expectEvaluationOf('1234|').toBe('12344321');
    });

    test('parses basic point symmetry operator \'!\' usage correctly', () => {
        expectEvaluationOf('1234!').toBe('1234321');
    });

    test('parses step array group /.../ correctly', () => {
        expectEvaluationOf('/414241/').toBe('43212343234321');
    });
});

describe('Precedence is correct between:', () => {
    test('postfix and binary operators; Binary ops have greater precendence.', () => {
        expectEvaluationOf('1:2!')
            .toBe('111');
    });

    test('binary operators and sequences; Sequences have greater precedence.', () => {
        expectEvaluationOf('12:2')
            .toBe('1212');
    });

    test('groups and operators; Groups have greater precedence.', () => {
        // group [1|] is evaluated first to be '11'
        // then 11:2 is evaluated to 11 repeated twice, '1111'
        expectEvaluationOf('[1|]:2')
            .toBe('1111');
    });

    test('subgroups and groups; Subgroups have greater precedence.', () => {
        // subgroup of [1:2] evalutes to '11'
        // then 1:11 is evaluated to 1 repeated eleven times
        expectEvaluationOf('[1:[1:2]]')
            .toBe('11111111111');
    });
});

describe('Real examples: ', () => {
    test('example 1, treadling of "Stars of Bethlehem"', () => {
        expectEvaluationOf('2341[2:3][3:3][4:3][1:4]2341|')
            .toBe('234122233344411112341143211114443332221432');
    });

    test('example 2, threading of "Stars of Bethlehem"', () => {
        expectEvaluationOf('/14//12132434/14/14/1!')
            .toBe('12341212323434141234143214143432321214321');
    });
});

describe('Handles "spaces" correctly:', () => {
    test('single space', () => {
        expectEvaluationOf('1 2:2').toBe('122');
    });

    test('multi space expression', () => {
        expectEvaluationOf('1:4 2:4 3:4 4:4').toBe('1111222233334444');
    });
});

describe('Handles multi-operator expressions:', () => {
    test('parses double "!" operator', () => {
        expectEvaluationOf('123!!').toBe('123212321');
    });

    test('parses triple "!" operator', () => {
        expectEvaluationOf('123!!!').toBe('12321232123212321');
    });

    test('parses step-array with double "!" operator', () => {
        expectEvaluationOf('/14/!!').toBe('1234321234321');
    });

    test('parses step-array followed by number with double "!" operator', () => {
        expectEvaluationOf('/14/1!!').toBe('12341432123414321');
    });
});

describe('Handles various edge cases:', () => {
    test('parses empty string as valid', () => {
        expectEvaluationOf('').toBe('');
    });

    test('parses simple non-step step array group /.../ correctly', () => {
        expectEvaluationOf('/11/').toBe('11');
    });

    test('parses multi-expressions', () => {
        expectEvaluationOf('[1][2]').toBe('12');
    });

    test('parses redundant nested expressions', () => {
        expectEvaluationOf('[[1234]]').toBe('1234');
    });

    test('parses non-redundant nested expressions', () => {
        expectEvaluationOf('[1[23]4]').toBe('1234');
    });
})