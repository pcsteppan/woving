const nearley = require("nearley");
const grammar = require("./grammar.js");
const util = require('util');

// Create a Parser object from our grammar.
const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

// Parse something!
parser.feed("/123:2/!");

let parsing = parser.results[0];
if (parser.results.length > 1) {
	console.warn('warning more than one parsing: found ' + parser.results.length + ' parsings');
}

console.log('done parsing');

const result = evaluate(parser.results[0]);
console.log('RESULT');
console.log(result);

function evaluate(ast) {
	console.log(ast);
	console.log('evaluating... ', util.inspect(ast, false, 10));

	if (Number.isInteger(ast)) {
		return ast;
	}

	switch (ast.type) {
		case ("binary"):
			return repeat(evaluate(ast.left), evaluate(ast.right));
		case ("step_array"):
			return stepArray(evaluate(ast.value));
		case ("postfix"):
			switch (ast.op) {
				case ("|"):
					return sym(evaluate(ast.left));
				case ("!"):
					return pointSym(evaluate(ast.left));
			}
			break;
		default:
			throw ("Error with: " + JSON.stringify(ast));
	}
}

function repeat(value, repeat) {
	return Number(Array(repeat + 1).join(value));
}

function stepArray(value) {
	return value;
}

function sym(value) {
	return arrToNum([value, Array.from(value.toString()).reverse().join("")])
}

function pointSym(value) {
	const valueArr = Array.from(value.toString());
	const valueLen = valueArr.length;

	if (valueLen === 1) {
		return value;
	}

	const result = valueArr.slice(0, valueLen - 1);
	const mirroredPart = result.slice().reverse();
	result.push(valueArr[valueLen - 1]);
	return arrToNum(result.concat(mirroredPart));
}

function arrToNum(arr) {
	return Number(arr.join(""));
}
