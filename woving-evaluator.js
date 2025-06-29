function evaluate(ast) {
    if (!ast) {
        return '';
    }

    if (Number.isInteger(ast)) {
        return ast.toString();
    }

    if (typeof ast === 'string' || ast instanceof String) {
        return ast;
    } switch (ast.type) {
        case "binary":
            return repeat(evaluate(ast.left), parseHexToNumber(evaluate(ast.right)));
        case "join":
            return join(evaluate(ast.left), evaluate(ast.right));
        case "step_array":
            return stepArray(evaluate(ast.left));
        case "postfix":
            switch (ast.op) {
                case ("|"):
                    return sym(evaluate(ast.left));
                case ("!"):
                    return pointSym(evaluate(ast.left));
                case ("?"):
                    return randomKeep(evaluate(ast.left));
            }
            break;
        case "number": {
            return ast.left.toString();
        }
        default:
            throw ("Error with: " + JSON.stringify(ast));
    }
}

// :
function repeat(value, repeat) {
    if (repeat > 100) {
        repeat = 1;
        console.warn('repeat value greater than 100, setting back to 1 since, well, yeah.');
    }

    return (Array(repeat + 1).join(value));
}

// /.../
function stepArray(value) {
    if (!value || value === '') {
        return '';
    }

    const valueStr = value.toString();

    if (valueStr.length === 1) {
        return valueStr;
    }

    const stepArr = [];

    // Helper function to convert hex digit to numeric value for comparison
    const getHexValue = (char) => {
        if (char >= '1' && char <= '9') return parseInt(char);
        if (char >= 'a' && char <= 'f') return char.charCodeAt(0) - 'a'.charCodeAt(0) + 10;
        return 0; // fallback
    };

    // Helper function to get next/previous hex digit
    const getHexChar = (value) => {
        if (value >= 1 && value <= 9) return value.toString();
        if (value >= 10 && value <= 15) return String.fromCharCode('a'.charCodeAt(0) + value - 10);
        return '';
    };

    for (let i = 1; i < valueStr.length; i++) {
        const start = valueStr[i - 1];
        const end = valueStr[i];
        const startVal = getHexValue(start);
        const endVal = getHexValue(end);

        if (startVal < endVal) {
            for (let j = startVal; j < endVal; j++) {
                stepArr.push(getHexChar(j));
            }
        } else if (startVal > endVal) {
            for (let j = startVal; j > endVal; j--) {
                stepArr.push(getHexChar(j));
            }
        } else {
            stepArr.push(start);
        }
    }

    stepArr.push(valueStr[valueStr.length - 1]);

    return arrToStr(stepArr);
}

// |
function sym(value) {
    return arrToStr([value, Array.from(value.toString()).reverse().join("")]);
}

// !
function pointSym(value) {
    const valueArr = Array.from(value.toString());
    const valueLen = valueArr.length;

    if (valueLen === 1) {
        return value;
    }

    const result = valueArr.slice(0, valueLen - 1);
    const mirroredPart = result.slice().reverse();
    result.push(valueArr[valueLen - 1]);
    return arrToStr(result.concat(mirroredPart));
}

// ?
function randomKeep(value) {
    return Math.random() < 0.5 ? value.toString() : '';
}

// Helper function to parse hex string to number
function parseHexToNumber(hexStr) {
    if (!hexStr || hexStr === '') return 0;

    // Convert hex string to number
    let result = 0;
    for (let i = 0; i < hexStr.length; i++) {
        const char = hexStr[i];
        let digitValue;
        if (char >= '1' && char <= '9') {
            digitValue = parseInt(char);
        } else if (char >= 'a' && char <= 'f') {
            digitValue = char.charCodeAt(0) - 'a'.charCodeAt(0) + 10;
        } else {
            continue; // skip invalid characters
        }
        result = result * 16 + digitValue;
    }
    return result;
}

function join(a, b) {
    return arrToStr([a, b]);
}

function arrToStr(arr) {
    return (arr.join(""));
}

module.exports = evaluate;