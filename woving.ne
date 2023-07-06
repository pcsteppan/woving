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
    {%
      data => {console.log('expression: ', JSON.stringify(data)); return data[0]}
    %}

postfix     
  -> 
    postfix ("!" | "|") 
    {%
      data => {console.log('postfix: ', data); return ast('postfix', data[1][0], data[0], null, null)}
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
  | group  
    {% id %}
  | step_array 
    {% id %}

seq 		  
  ->
    ( "1" | "2" | "3" | "4" )
    {%
      data => {console.log('n: ', data, '->', Number(data[0])); return Number(data[0])}
    %} 
  | seq ( "1" | "2" | "3" | "4" )
    {%
      data => {console.log('seq n:', data, '->', Number(data.join(""))); return Number(data.join(""))}
    %}

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

# Precedence:
#   group
#   step_array
#   binary
#   postfix

# Precedence example:
#   [/142/:2]
