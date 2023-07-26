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
      value: v
    }
  }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "postfix$subexpression$1", "symbols": [{"literal":"!"}]},
    {"name": "postfix$subexpression$1", "symbols": [{"literal":"|"}]},
    {"name": "postfix", "symbols": ["postfix", "postfix$subexpression$1"], "postprocess": 
        data => ast('postfix', data[1][0], data[0], null, null)
            },
    {"name": "postfix", "symbols": ["binary"], "postprocess": id},
    {"name": "postfix", "symbols": ["postfix", {"literal":" "}, "postfix"], "postprocess":  
        data => ast('join', null, data[0], data[2], null)
            },
    {"name": "binary", "symbols": ["binary", {"literal":":"}, "seq"], "postprocess": 
        data => ast('binary', data[1], data[0], data[2], null)
            },
    {"name": "binary", "symbols": ["seq"], "postprocess": id},
    {"name": "seq$subexpression$1", "symbols": [{"literal":"1"}]},
    {"name": "seq$subexpression$1", "symbols": [{"literal":"2"}]},
    {"name": "seq$subexpression$1", "symbols": [{"literal":"3"}]},
    {"name": "seq$subexpression$1", "symbols": [{"literal":"4"}]},
    {"name": "seq", "symbols": ["seq$subexpression$1"], "postprocess": 
        data => Number(data[0])
            },
    {"name": "seq$subexpression$2", "symbols": [{"literal":"1"}]},
    {"name": "seq$subexpression$2", "symbols": [{"literal":"2"}]},
    {"name": "seq$subexpression$2", "symbols": [{"literal":"3"}]},
    {"name": "seq$subexpression$2", "symbols": [{"literal":"4"}]},
    {"name": "seq", "symbols": ["seq$subexpression$2", "seq"], "postprocess": 
        data => ast('join', null, Number(data[0]), data[1], null)
            },
    {"name": "seq", "symbols": ["groups"], "postprocess": id},
    {"name": "groups", "symbols": ["groups", "postfix"], "postprocess": 
        data => ast('join', null, data[0], data[1], null)
            },
    {"name": "groups", "symbols": ["step_array"], "postprocess": id},
    {"name": "groups", "symbols": ["group"], "postprocess": id},
    {"name": "step_array", "symbols": [{"literal":"/"}, "postfix", {"literal":"/"}], "postprocess": 
        data => ast('step_array', null, null, null, data[1])
            },
    {"name": "group", "symbols": [{"literal":"["}, "postfix", {"literal":"]"}], "postprocess": 
        data => data[1]
            }
]
  , ParserStart: "postfix"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
