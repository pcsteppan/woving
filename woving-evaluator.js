function evaluate(ast) {
    if (Number.isInteger(ast)) {
        return ast.toString();
    }

    switch (ast.type) {
        case ("binary"):
            return repeat(evaluate(ast.left), Number(evaluate(ast.right)));
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

// :
function repeat(value, repeat) {
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

    for (let i = 1; i < valueStr.length; i++) {
        const start = valueStr[i - 1];
        const end = valueStr[i];

        if (start < end) {
            for (let j = start; j < end; j++) {
                stepArr.push(j);
            }
        } else if (start > end) {
            for (let j = start; j > end; j--) {
                stepArr.push(j);
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

function arrToStr(arr) {
    return (arr.join(""));
}

module.exports = evaluate;