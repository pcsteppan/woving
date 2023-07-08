@{%
  const ast = (type, op, l, r, v) => {
    return {
      type: type,
      op: op,
      left: l,
      right: r,
      value: v
    }
  }
%}

expression  
  -> 
    postfix 
    {% id %}

postfix     
  -> 
    postfix ("!" | "|") 
    {%
      data => ast('postfix', data[1][0], data[0], null, null)
    %}
  | binary 
    {% id %}

binary      
  -> 
    binary ":" seq
    {%
      data => ast('binary', data[1], data[0], data[2], null)
    %} 
  | seq  
    {% id %}

seq 		  
  ->
    ( "1" | "2" | "3" | "4" )
    {%
      data => Number(data[0])
    %} 
  | ( "1" | "2" | "3" | "4" ) seq # this could be a join potentially
    {%
      data => ast('join', null, Number(data[0]), data[1], null)
    %}
  | groups
    {% id %}

groups 
  ->
    groups expression
    {%
      data => ast('join', null, data[0], data[1], null)
    %}
  | step_array 
    {% id %}
  | group
    {% id %}

step_array	
  -> 
    "/" expression "/"
    {%
      data => ast('step_array', null, null, null, data[1])
    %}

group		    
  -> 
    "[" expression "]"
    {%
      data => data[1]
    %}

