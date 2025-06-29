// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

  const ast = (type, op, l, r, v) => {
    return {
      type: type,
      op: op,
      left: l,
      right: r,
    }
  }

  const numberAst = (number) => {
    return {
      type: 'number',
      op: null,
      left: number,
      right: null,
    }
  }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "expression", "symbols": ["expression", "join", "expression"], "postprocess":  
        data => ast('join', null, data[0], data[2])
            },
    {"name": "expression", "symbols": ["postfix"], "postprocess": id},
    {"name": "join", "symbols": [{"literal":" "}]},
    {"name": "join", "symbols": [{"literal":"+"}]},
    {"name": "postfix$subexpression$1", "symbols": [{"literal":"!"}]},
    {"name": "postfix$subexpression$1", "symbols": [{"literal":"|"}]},
    {"name": "postfix$subexpression$1", "symbols": [{"literal":"?"}]},
    {"name": "postfix", "symbols": ["postfix", "postfix$subexpression$1"], "postprocess": 
        data => ast('postfix', data[1][0], data[0], null)
            },
    {"name": "postfix", "symbols": ["binary"], "postprocess": id},
    {"name": "binary", "symbols": ["binary", {"literal":":"}, "seq"], "postprocess": 
        data => ast('binary', data[1], data[0], data[2])
            },
    {"name": "binary", "symbols": ["seq"], "postprocess": id},
    {"name": "seq$subexpression$1", "symbols": [{"literal":"1"}]},
    {"name": "seq$subexpression$1", "symbols": [{"literal":"2"}]},
    {"name": "seq$subexpression$1", "symbols": [{"literal":"3"}]},
    {"name": "seq$subexpression$1", "symbols": [{"literal":"4"}]},
    {"name": "seq$subexpression$1", "symbols": [{"literal":"5"}]},
    {"name": "seq$subexpression$1", "symbols": [{"literal":"6"}]},
    {"name": "seq$subexpression$1", "symbols": [{"literal":"7"}]},
    {"name": "seq$subexpression$1", "symbols": [{"literal":"8"}]},
    {"name": "seq$subexpression$1", "symbols": [{"literal":"9"}]},
    {"name": "seq$subexpression$1", "symbols": [{"literal":"a"}]},
    {"name": "seq$subexpression$1", "symbols": [{"literal":"b"}]},
    {"name": "seq$subexpression$1", "symbols": [{"literal":"c"}]},
    {"name": "seq$subexpression$1", "symbols": [{"literal":"d"}]},
    {"name": "seq$subexpression$1", "symbols": [{"literal":"e"}]},
    {"name": "seq$subexpression$1", "symbols": [{"literal":"f"}]},
    {"name": "seq", "symbols": ["seq$subexpression$1"], "postprocess": 
        data => {
          const char = data[0][0]; // data[0] is the array from the subexpression, [0] gets the actual string
          // Convert hex characters to their numeric values for internal use, but return the character
          if (char >= 'a' && char <= 'f') {
            return char;
          }
          return Number(char);
        }
            },
    {"name": "seq$subexpression$2", "symbols": [{"literal":"1"}]},
    {"name": "seq$subexpression$2", "symbols": [{"literal":"2"}]},
    {"name": "seq$subexpression$2", "symbols": [{"literal":"3"}]},
    {"name": "seq$subexpression$2", "symbols": [{"literal":"4"}]},
    {"name": "seq$subexpression$2", "symbols": [{"literal":"5"}]},
    {"name": "seq$subexpression$2", "symbols": [{"literal":"6"}]},
    {"name": "seq$subexpression$2", "symbols": [{"literal":"7"}]},
    {"name": "seq$subexpression$2", "symbols": [{"literal":"8"}]},
    {"name": "seq$subexpression$2", "symbols": [{"literal":"9"}]},
    {"name": "seq$subexpression$2", "symbols": [{"literal":"a"}]},
    {"name": "seq$subexpression$2", "symbols": [{"literal":"b"}]},
    {"name": "seq$subexpression$2", "symbols": [{"literal":"c"}]},
    {"name": "seq$subexpression$2", "symbols": [{"literal":"d"}]},
    {"name": "seq$subexpression$2", "symbols": [{"literal":"e"}]},
    {"name": "seq$subexpression$2", "symbols": [{"literal":"f"}]},
    {"name": "seq", "symbols": ["seq$subexpression$2", "seq"], "postprocess": 
        data => ast('join', null, numberAst(data[0][0]), data[1], null)
            },
    {"name": "seq", "symbols": ["groups", "seq"], "postprocess": 
        data => ast('join', null, data[0], data[1])
            },
    {"name": "seq", "symbols": ["groups"], "postprocess": id},
    {"name": "groups", "symbols": ["step_array"], "postprocess": id},
    {"name": "groups", "symbols": ["group"], "postprocess": id},
    {"name": "step_array", "symbols": [{"literal":"/"}, "expression", {"literal":"/"}], "postprocess": 
        data => ast('step_array', null, data[1], null)
            },
    {"name": "group", "symbols": [{"literal":"["}, "expression", {"literal":"]"}], "postprocess": 
        data => data[1]
            }
]
  , ParserStart: "expression"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
