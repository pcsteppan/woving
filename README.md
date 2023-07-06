*this is a work in progress*

# woving

*woving* is a domain specific pattern language, or notation system, for writing concise loom draft instructions. It implements features commonly found in weaving, like repetition and symmetry, into the language itself.\
todo: add example here

## getting set up locally

1. install nearley.js with ```npm install -g nearley```
2. Compile the woving.ne file (which contains the grammar for the language) with ```nearleyc woving.ne -o woving.js```
3. install node packages ```npm install```
4. run the test suite with ```npm test```
