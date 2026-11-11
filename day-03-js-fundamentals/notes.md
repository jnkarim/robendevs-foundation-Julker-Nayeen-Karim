## JS Essentials

### How JS Executes Code

```
const name = "Barcelone";

console.log(name);
```

- JS Engine plays the role from start to finsh(parsing, syntax check, AST creation -> Execution Context creation -> var creation, value adding, print in console) to execute this code on Browser.
    - Chrome -> V8
    - Firefox -> SpiderMonkey

```
JavaScript Code
      |
      v
JavaScript Engine
      |
      v
Parse the Code
      |
      v
Execute the Code
```
**AST(Abstract Syntax Tree)**: AST is a tree shaped structure that explains the relationship between code and it's meaning. Structure of JS code.

```
Program
  |
  |---- VariableDeclaration
  |         |
  |         |---- id: name
  |         |---- init: "Barcelona"
  |
  |---- ExpressionStatement
            |
            |---- CallExpression
                      |
                      |---- console.log
                      |---- name
```

**Parser**: Creating AST from code

*Execution Context*:
- It is the environment where JS code is evaluated & excuted 
- 2 types: Global and Function

At first Global Execution Context is build when JS program starts executing.

When any function is called, a new execution context is created for that function call.

```
function first() {
  console.log("First");
}

function second() {
  first();
  console.log("Second");
}

second();
```

JS uses Call Stack in here. Call stack follows LIFO principal.

```
       Call Stack

       +---------+
       |  first  |  <- Last entered
       +---------+
       | second  |
       +---------+
       | Global  |
       +---------+
```

Call Stack follows synchornous execution principal.

---