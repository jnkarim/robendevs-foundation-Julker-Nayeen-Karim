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
- 2 types: **Global** and **Function**

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

```
function multiply(a, b) {
    return a * b;
}

function square(n) {
    return multiply(n, n);
}

square(4);
```

### Execution Sequence

1. Global Execution Context is created.
2. `square(4)` is called.
3. `square()` is added to the Call Stack.
4. `multiply(4, 4)` is called.
5. `multiply()` is added to the Call Stack.
6. `multiply()` returns `16`.
7. `multiply()` is removed from the Call Stack.
8. `square()` finishes and is removed from the Call Stack.

**Finally:** Only the Global Execution Context remains in the Call Stack.

---
## JIT Compiled Language

JavaScript needs a JavaScript Engine to execute code.

Examples of JavaScript Engines:
- **V8** – Chrome and Node.js
- **SpiderMonkey** – Firefox

### How V8 Works

1. **Source Code:** We write JavaScript code.
2. **Parser:** Converts the code into an AST (Abstract Syntax Tree).
3. **Ignition:** Converts the AST into bytecode and executes it.
4. **TurboFan:** Optimizes frequently executed code and converts it into machine code.

### What is JIT?

JIT stands for **Just-In-Time Compilation**.

It means the JavaScript Engine executes code and optimizes frequently used parts while the program is running.
---

When JS creates an Execution Context, it doesnot starts executing codes immediatly. It has 2 phases:
1) Memory Creation Phase
2) Code Execution Phase

### (1) Memory Creation Phase:

Before Executing, memory is created at first
```
var name = "James";
var age = 25;

function greet() {
  console.log("Hello");
}
```

JS first sees declarations(var, func)
```
| Declaration | Initial value |
|--------|--------|
| name | undefined |
| age | undefined |
| greet | Function definition |
```

- assingment or console log will not execute first
- let and const just gets reserved on memory, but not initializaed like var

### (2) Code Execution Phase:
- var gets value, function calls gets Function Execution Context.

### Overall:
```
Global Execution Context
          |
          v
  Memory Creation Phase
          |
          v
  Code Execution Phase
          |
          v
       greet()
          |
          v
Function Execution Context
          |
          v
  Its own Memory Creation
          |
          v
  Its own Code Execution

```

Like Global, Function call has it's own 2 phases too- Memory Creation & Code Execution
      - In Memory Creation, local variables of that function, gets space(memory allocation)


## Hoisting
- A JS behaviour where var and func declaration are processed before executing the code.
- JavaScript creates an Execution Context before running code and reserves memory for variables and functions.

```
| Declaration | Memory Creation Phase |
|---|---|
| `var` | initialized with `undefined`|
| `let` | Uninitialized |
| `const` | Uninitialized|
| Function Declaration | whole function is available |
```

# var is Function-Scoped

`var` belongs to the entire function, not just the block `{}` where it is declared.

### Example

```js
function test() {
  if (true) {
    var name = "Messi";
  }

  console.log(name);
}

test();
```

- name is declared inside the if block.
- But var does not follow block scope ({}).
- It belongs to the entire function.
- So, it can be accessed outside the if block.

- let declaration is reserved in Memory Creation Phase, but not initialized. So, if we try to access it, because of Temporal Dead Zone it gives ReferenceError.

Code:
```
greet();

function greet() {
  console.log("Hello");
}
```

Output:
```
Hello
```

The reason is the definition of Function Declaration becomes available in Memory Creation Phase.


## Scope

- Scope tells us from where var can be accessed.

### (1) Global Scope
### (2) Function Scope
### (3) Block Scope
      -  var doesnot follows this. It is function-scoped.
      ```
            if (true) {
      let age = 25;
      const name = "Rahim";
      }

      console.log(age);  // ReferenceError
      console.log(name); // ReferenceError
      ```

- Scope Chain
- Flow of Scope Chain: Self Scope -> Parent Scope -> Global Scope
- Lower scope can access vars from Higher scope; but Higher Scope can't access Lower.

## Closure
- How can an inner function retain access to variables from its outer scope even after the outer function has finished executing.

```
function multiplier(factor){

      return function number(num){
            return num * factor;
      }

}

let twice = multiplier(2);

twice(2);
```

- Here 2 is the outer scope value for twice.
- Meaning how can an inner function access variables from its outer scope even after the outer function has finished executing.

---

## Function 

### (1) Function Expression:
- Assigning an Function to a variable.

```
const greet = function() {
  console.log("Hello");
};

greet();
```

### (2) Arrow Function:

- An Arrow Function is a syntax for writing a Function Expression.
- It is not hoisted itself.

```
const greet = () => {
  console.log("Hello");
};

greet();
```
### (3) Callback Function

A callback function is a function passed as an argument to another function and executed later.

### Example

```js
function greet(callback) {
    console.log("Hello");

    callback();
}

function sayBye() {
    console.log("Goodbye");
}

greet(sayBye);
```

## Memory Management: Stack vs Heap

JavaScript uses memory to store data while a program runs.

For easy understanding, think of memory as two parts:

### 1. Stack
- Stores primitive values and references to objects (simplified model).
- Stores function execution data.
- When a function finishes, its stack frame is removed.

### 2. Heap
Stores larger or dynamically created data, such as:
- Objects
- Arrays
- Functions
- Closures

### Example

```text
Stack                 Heap
+---------+           +----------------+
|  user   | --------> | name: "Karim"  |
+---------+           | age: 25        |
                      +----------------+