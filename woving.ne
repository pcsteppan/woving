@{%
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
%}

expression  
  -> 
    expression " " expression
    {% 
      data => ast('join', null, data[0], data[2])
    %}
  | postfix 
    {% id %}

postfix     
  -> 
    postfix ("!" | "|") 
    {%
      data => ast('postfix', data[1][0], data[0], null)
    %}
  | binary 
    {% id %}

binary      
  -> 
    binary ":" seq
    {%
      data => ast('binary', data[1], data[0], data[2])
    %} 
  | seq  
    {% id %}

seq 		  
  ->
    ( "1" | "2" | "3" | "4" )
    {%
      data => Number(data[0])
    %} 
  | ( "1" | "2" | "3" | "4" ) seq
    {%
      data => ast('join', null, numberAst(data[0]), data[1], null)
    %}
  | groups seq
    {%
      data => ast('join', null, data[0], data[1])
    %}
  | groups
    {% id %}

groups 
  ->
    step_array 
    {% id %}
  | group
    {% id %}

step_array	
  -> 
    "/" expression "/"
    {%
      data => ast('step_array', null, data[1], null)
    %}

group		    
  -> 
    "[" expression "]"
    {%
      data => data[1]
    %}
