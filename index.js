const nearley = require("nearley");
const woving = require("./woving.js");
const evaluate = require('./woving-evaluator.js');

const createParser = (input) => new nearley.Parser(nearley.Grammar.fromCompiled(woving)).feed(input).results[0];
const parse = (input) => evaluate(createParser(input));

module.exports = parse;
