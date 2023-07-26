const nearley = require("nearley");
const woving = require("./woving.js");
const evaluate = require('./woving-evaluator.js');

const createParser = (input) => {
	const parsed = new nearley.Parser(nearley.Grammar.fromCompiled(woving)).feed(input);
	// if (parsed.results.length > 1) {
	// 	console.log('ambiguous grammar, found multiple parsings: ' + parse.results.join("\r\nparse:\r\n"));
	// }
	return parsed.results[0];
};
const parse = (input) => evaluate(createParser(input));

module.exports = { createParser, parse };
