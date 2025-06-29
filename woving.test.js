const nearley = require("nearley");
const woving = require("./woving.js");
const evaluateString = require('./woving-evaluator.js');

// Test configuration
const RANDOM_TEST_ITERATIONS = 50;

// Create a Parser object from our grammar.

const createParser = (input) => new nearley.Parser(nearley.Grammar.fromCompiled(woving)).feed(input).results[0];
const expectEvaluationOf = (input) => {
    const parse = createParser(input);
    const expr = evaluateString(parse);
    return expect(expr);
}

const expectProbabilisticEvaluationOf = (input, regex, iterations = RANDOM_TEST_ITERATIONS) => {
    for (let i = 0; i < iterations; i++) {
        expectEvaluationOf(input).toMatch(regex);
    }
};

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
        expectEvaluationOf('[2341 2:3 3:3 4:3 1:4 2341]|')
            .toBe('234122233344411112341143211114443332221432');
    });

    test('example 2, threading of "Stars of Bethlehem"', () => {
        expectEvaluationOf('/14//12132434/14/14/1!')
            .toBe('12341212323434141234143214143432321214321');
    });

    test('example 2 symmetried twice', () => {
        expectEvaluationOf('[/14//12132434/14/14/1!!]')
            .toBe('123412123234341412341432141434323212143212341212323434141234143214143432321214321');
    });

    test('example 3, threading of "Diadem", multiple expressions in groups', () => {
        expectEvaluationOf('[/14/:2 1232! 434! 12!]!')
            .toBe('123412341232321434341212143434123232143214321')
    })

    test('example 4, threading of "Rings and Chains"', () => {
        expectEvaluationOf('[/41/4! 14! /43423121/ 41214! 12]!')
            .toBe('43214123414143432321214121412141214121412141212323434141432141234')
    })
});

describe('Handles ? operator correctly:', () => {
    test('parses single ? operator', () => {
        expectProbabilisticEvaluationOf('1?', /^(1|)$/);
    });

    test('? operator with sequences', () => {
        expectProbabilisticEvaluationOf('123?', /^(123|)$/);
    });

    test('? operator with groups', () => {
        expectProbabilisticEvaluationOf('[123]?', /^(123|)$/);
    });

    test('? operator with step arrays', () => {
        expectProbabilisticEvaluationOf('/12/?', /^(12|)$/);
    });

    test('multiple ? operators', () => {
        expectProbabilisticEvaluationOf('1? 2?', /^(12|1|2|)$/);
    });

    test('? operator with other postfix operators', () => {
        expectProbabilisticEvaluationOf('123?!', /^(12321|1|)$/);
    });

    test('? operator followed by ! operator', () => {
        expectProbabilisticEvaluationOf('123!?', /^(12321|)$/);
    });

    test('? operator in complex expressions', () => {
        expectProbabilisticEvaluationOf('[1? 2?]!', /^(121|1|2|)$/);
    });

    test('statistical distribution test', () => {
        let keepCount = 0;
        let dropCount = 0;
        const iterations = 1000;

        for (let i = 0; i < iterations; i++) {
            const result = createParser('1?');
            const evaluated = evaluateString(result);
            if (evaluated === '1') {
                keepCount++;
            } else if (evaluated === '') {
                dropCount++;
            }
        }

        // Should be roughly 50/50 distribution (allowing for 20% variance)
        const keepRatio = keepCount / iterations;
        expect(keepRatio).toBeGreaterThan(0.3);
        expect(keepRatio).toBeLessThan(0.7);
        expect(keepCount + dropCount).toBe(iterations);
    }); test('? operator precedence with binary operators', () => {
        // 1:2? should be (1:2)? not 1:(2?)
        expectProbabilisticEvaluationOf('1:2?', /^(11|)$/);
    });
});

describe('Handles joins correctly:', () => {
    test('single space', () => {
        expectEvaluationOf('1 2:2').toBe('122');
    });

    test('single plus', () => {
        expectEvaluationOf('1+2:2').toBe('122');
    });

    test('multi space expression', () => {
        expectEvaluationOf('1:4 2:4 3:4 4:4').toBe('1111222233334444');
    });

    test('mixed multi space expression', () => {
        expectEvaluationOf('1:4+2:4 3:4+4:4').toBe('1111222233334444');
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

    test('parses nested groups with postfixes', () => {
        expectEvaluationOf('[1[23]4!]').toBe('1234321');
    });

    test('parses step-array and postfix operators within groups correctly', () => {
        expectEvaluationOf('[/2/ 1!]!')
            .toBe('212');
    })
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

    test('doesn\'t break on high repeat patterns', () => {
        expectEvaluationOf('1:111').toBe('1');
    })
})