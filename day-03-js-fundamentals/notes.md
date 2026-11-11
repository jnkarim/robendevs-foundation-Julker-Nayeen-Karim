# JavaScript Essentials

A beginner-friendly guide to how JavaScript works, manages memory, handles functions, and runs asynchronous code.

## Contents

1. [How JavaScript Executes Code](#1-how-javascript-executes-code)
2. [AST and Parser](#2-ast-and-parser)
3. [Execution Context](#3-execution-context)
4. [Call Stack](#4-call-stack)
5. [Execution Context Phases](#5-execution-context-phases)
6. [Hoisting](#6-hoisting)
7. [Scope and Scope Chain](#7-scope-and-scope-chain)
8. [Closure](#8-closure)
9. [Functions](#9-functions)Q
10. [Stack and Heap](#10-stack-and-heap)
11. [Spread and Rest](#11-spread-and-rest)
12. [JavaScript Modules](#12-javascript-modules)
13. [Reading Stack Traces](#13-reading-stack-traces)
14. [Asynchronous JavaScript and Callbacks](#14-asynchronous-javascript-and-callbacks)
15. [Callback Hell](#15-callback-hell)
16. [Promises](#16-promises)
17. [Promises in API Calls](#17-promises-in-api-calls)
18. [Event Loop, Microtasks, and Tasks](#18-event-loop-microtasks-and-tasks)
19. [Async/Await](#19-asyncawait)

---

## 1. How JavaScript Executes Code

The **JavaScript Engine** is responsible for processing and executing JavaScript code.

Example:

```js
const name = "Barcelona";
console.log(name);
```

Basic flow:

```text
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

Examples of JavaScript engines:

- **V8** - used by Chrome and Node.js.
- **SpiderMonkey** - used by Firefox.

### How V8 Works

A simplified view of V8's execution process:

1. **Source Code:** We write JavaScript code.
2. **Parser:** Reads the code and creates an AST.
3. **Ignition:** Converts the AST into bytecode and executes it.
4. **TurboFan:** Optimizes frequently executed code and can compile it into machine code.

### What is JIT?

**JIT** stands for **Just-In-Time Compilation**.

It means the JavaScript Engine can compile and optimize code while the program is running.

## 2. AST and Parser

### AST (Abstract Syntax Tree)

An **AST** is a tree-shaped structure that represents the structure and meaning of JavaScript code.

For example:

```js
const name = "Barcelona";
console.log(name);
```

A simplified AST looks like this:

```text
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

### Parser

The **Parser** reads the code, checks its syntax, and creates the AST.

## 3. Execution Context

An **Execution Context** is the environment where JavaScript code is evaluated and executed.

There are two main types:

1. **Global Execution Context (GEC):** Created when the JavaScript program starts.
2. **Function Execution Context (FEC):** Created whenever a function is called.

Example:

```js
function first() {
  console.log("First");
}

function second() {
  first();
  console.log("Second");
}

second();
```

When `second()` is called, a Function Execution Context is created. When `first()` is called inside it, another Function Execution Context is created.

## 4. Call Stack

The **Call Stack** keeps track of function execution contexts.

It follows **LIFO (Last In, First Out)**: the last function added to the stack is the first one removed.

For the previous example, the stack changes like this:

```text
1. second() is called

   | second() |
   |----------|
   | Global   |

2. first() is called

   | first()  |
   |----------|
   | second() |
   |----------|
   | Global   |

3. first() finishes and is removed

   | second() |
   |----------|
   | Global   |

4. second() finishes and is removed

   | Global   |
```

JavaScript executes synchronous code on its main thread using the Call Stack.

## 5. Execution Context Phases

Every Execution Context has two main phases:

1. **Memory Creation Phase**
2. **Code Execution Phase**

### 5.1 Memory Creation Phase

Before executing the code, JavaScript prepares memory for declarations.

Example:

```js
var name = "James";
var age = 25;

function greet() {
  console.log("Hello");
}
```

During the Memory Creation Phase:

| Declaration | Initial state |
|---|---|
| `name` (`var`) | `undefined` |
| `age` (`var`) | `undefined` |
| `greet` | The function definition is available |
| `let` / `const` | Reserved but uninitialized |

Assignments and `console.log()` statements do not run during this phase.

### 5.2 Code Execution Phase

JavaScript executes the code line by line.

- `var` variables receive their assigned values when their assignment statements run.
- Function calls create new Function Execution Contexts.
- Each function context has its own Memory Creation Phase and Code Execution Phase.

### Overall Flow

```text
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

## 6. Hoisting

**Hoisting** is JavaScript's behavior of processing declarations when an Execution Context is created, before the code is executed.

It does not mean JavaScript physically moves code to the top.

| Declaration | During Memory Creation Phase |
|---|---|
| `var` | Initialized with `undefined` |
| `let` | Reserved but uninitialized |
| `const` | Reserved but uninitialized |
| Function Declaration | The whole function is available |

Example - `var`:

```js
console.log(name);
var name = "Karim";
```

Output:

```text
undefined
```

Example - Function Declaration:

```js
greet();

function greet() {
  console.log("Hello");
}
```

Output:

```text
Hello
```

The function definition is available during the Memory Creation Phase, so it can be called before its declaration in the code.

## 7. Scope and Scope Chain

**Scope** determines where a variable can be accessed.

Main types of scope:

- **Global Scope:** Accessible throughout the relevant global code.
- **Function Scope:** Accessible inside the function where it is declared.
- **Block Scope:** Accessible only inside the block `{}` where it is declared.

### `var` is Function-Scoped

`var` belongs to the whole function, not just the block `{}` where it is declared.

```js
function test() {
  if (true) {
    var name = "Messi";
  }

  console.log(name); // Messi
}

test();
```

`name` can be accessed outside the `if` block because `var` does not follow block scope.

By contrast, `let` and `const` are block-scoped:

```js
if (true) {
  let age = 25;
  const name = "Rahim";
}

console.log(age);  // ReferenceError
console.log(name); // ReferenceError
```

### Scope Chain

The **Scope Chain** is the process JavaScript uses to look for a variable.

It searches in this order:

```text
Current Scope
     |
     v
Parent Scope
     |
     v
Global Scope
```

An inner scope can access variables from its outer scopes. An outer scope cannot access variables declared only inside an inner scope.

## 8. Closure

A **Closure** allows an inner function to retain access to variables from its outer scope, even after the outer function has finished executing.

Example:

```js
function multiplier(factor) {
  return function number(num) {
    return num * factor;
  };
}

const twice = multiplier(2);
console.log(twice(2)); // 4
```

How it works:

1. `multiplier(2)` is called, so `factor` becomes `2`.
2. The inner function is returned.
3. `multiplier()` finishes executing.
4. The returned function still has access to `factor`.
5. `twice(2)` returns `2 * 2`, which is `4`.

**Remember:** Closure is about an inner function retaining access to its outer scope.

## 9. Functions

### 9.1 Function Expression

A **Function Expression** assigns a function to a variable.

```js
const greet = function() {
  console.log("Hello");
};

greet();
```

The function is treated as a value and stored in the `greet` variable.

### 9.2 Arrow Function

An **Arrow Function** is a shorter syntax for writing a function expression.

```js
const greet = () => {
  console.log("Hello");
};

greet();
```

Arrow functions are not hoisted like Function Declarations. Their behavior also differs from normal functions because they do not have their own `this`.

### 9.3 Callback Function

A **Callback Function** is a function passed as an argument to another function. The receiving function calls it.

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

Output:

```text
Hello
Goodbye
```

A callback can be executed immediately or later, depending on how the receiving function uses it.

## 10. Stack and Heap

JavaScript uses memory to store data while a program runs.

For a simple mental model, think of memory as two areas:

### Stack

- Tracks function execution data.
- Holds local execution information and, in a simplified model, primitive values and references to objects.
- When a function finishes, its stack frame is removed.

### Heap

- Stores dynamically allocated data, such as objects, arrays, functions, and data used by closures.

Example:

```js
const user = {
  name: "Karim",
  age: 25
};
```

Simplified view:

```text
Stack                  Heap
+---------+            +----------------+
|  user   | ----------> | name: "Karim"  |
+---------+            | age: 25        |
                       +----------------+
```

`user` holds a reference to the object.

## 11. Spread and Rest

Both use the same syntax (`...`), but their purposes are different.

### 11.1 Spread Operator

**Spread expands values** from an array or object.

```js
const numbers = [10, 20, 30];
const newNumbers = [...numbers, 40];

console.log(newNumbers); // [10, 20, 30, 40]
```

In a function call, Spread expands array values into separate arguments:

```js
const numbers = [10, 20, 30];
sum(...numbers);
```

This is equivalent to:

```js
sum(10, 20, 30);
```

### 11.2 Rest Parameter

**Rest collects multiple values** into a single array.

```js
function sum(...numbers) {
  console.log(numbers);
}

sum(10, 20, 30);
```

Output:

```js
[10, 20, 30]
```

### Spread vs Rest

| Spread | Rest |
|---|---|
| Expands values | Collects values |
| Unpacks | Packs |
| Used in function calls and array/object expressions | Used in function parameters and destructuring |

**Quick trick:** Spread = unpack. Rest = collect.

## 12. JavaScript Modules

Modules allow us to split a large application into smaller, reusable files.

Each module has its own scope.

JavaScript has two main types of exports.

### 12.1 Named Export

Named exports allow a file to export multiple items.

`math.js`

```js
export const add = (a, b) => a + b;
export const multiply = (a, b) => a * b;
```

`app.js`

```js
import { add, multiply } from "./math.js";

console.log(add(5, 3)); // 8
```

- Uses `{}` when importing.
- Imported names must match exported names.
- Aliases are allowed with `as`.

```js
import { multiply as mul } from "./math.js";
```

### 12.2 Default Export

A module can have one default export.

`math.js`

```js
export default function sum(a, b) {
  return a + b;
}
```

`app.js`

```js
import sum from "./math.js";
```

- Does not use `{}` when importing.
- The imported name can be chosen by the importer.

### Named vs Default Export

| Named Export | Default Export |
|---|---|
| Multiple named exports are allowed | One default export per module |
| Uses `{}` when importing | Does not use `{}` when importing |
| Name must match; alias is allowed | Importer can choose the name |

## 13. Reading Stack Traces

A **Stack Trace** shows the sequence of function calls leading to an error.

It helps identify:

- Where the error occurred.
- Which functions were involved.
- Which file and line contain the error.

Example:

```text
TypeError: Cannot read properties of undefined (reading 'name')

at renderUser (ui.js:42:18)
at loadDashboard (app.js:17:5)
at main (app.js:30:3)
```

How to read it:

- `TypeError` - error type.
- `renderUser` - function where the error occurred.
- `ui.js` - file name.
- `42` - line number.
- `18` - column number.

The call sequence was:

```text
main()
   |
   v
loadDashboard()
   |
   v
renderUser()
   |
   v
ERROR
```

**Remember:**

- **Call Stack:** Tracks functions that are currently executing.
- **Stack Trace:** Shows the function call sequence leading to an error.

## 14. Asynchronous JavaScript and Callbacks

### 14.1 Asynchronous JavaScript

**Asynchronous** means JavaScript does not block the main thread while waiting for an operation to complete. It can continue executing other code.

Example:

```js
console.log("Start");

setTimeout(() => {
  console.log("Hello");
}, 1000);

console.log("End");
```

Output:

```text
Start
End
Hello
```

`setTimeout()` schedules the callback. JavaScript continues to the next line instead of waiting for the timer.

### 14.2 Callback Functions

A **Callback** is a function passed as an argument to another function. The receiving function calls it.

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

Output:

```text
Hello
Goodbye
```

An **asynchronous callback** is a callback that is executed after an asynchronous operation completes.

### How `setTimeout()` Works

```js
console.log("Start");

setTimeout(() => {
  console.log("Timer finished");
}, 1000);

console.log("End");
```

1. `Start` is printed.
2. `setTimeout()` asks the host environment to handle the timer.
3. JavaScript continues without waiting for the timer.
4. `End` is printed.
5. When the timer finishes, the callback becomes ready in the task queue.
6. When the Call Stack is available, the callback can execute.

The delay is a minimum waiting time, not a guarantee that the callback runs at that exact moment.

## 15. Callback Hell

**Callback Hell** occurs when multiple nested callbacks are used to handle dependent asynchronous operations.

Example:

```js
getUser(id, (err, user) => {
  if (err) return fail(err);

  getOrders(user, (err, orders) => {
    if (err) return fail(err);

    getInvoice(orders[0], (err, invoice) => {
      if (err) return fail(err);

      send(invoice);
    });
  });
});
```

The steps are:

1. Get the user.
2. Get the user's orders.
3. Get an invoice.
4. Send the invoice.

Problems:

- Code becomes deeply nested.
- Readability decreases.
- Error handling becomes complicated.
- Maintenance becomes difficult.

Promises provide another way to handle asynchronous results and avoid deeply nested callback chains.

## 16. Promises

A **Promise** is a JavaScript object that represents the eventual success or failure of an asynchronous operation.

### Promise States

1. **Pending:** The operation is still in progress.
2. **Fulfilled:** The operation completed successfully.
3. **Rejected:** The operation failed.

Once a Promise is fulfilled or rejected, it is **settled** and its state cannot change again.

### 16.1 Creating a Promise

```js
const promise = new Promise((resolve, reject) => {
  const success = true;

  if (success) {
    resolve("Success");
  } else {
    reject("Failed");
  }
});
```

- `resolve()` fulfills the Promise.
- `reject()` rejects the Promise.

### 16.2 Consuming a Promise

```js
promise
  .then(result => console.log(result))
  .catch(error => console.log(error))
  .finally(() => console.log("Completed"));
```

- `.then()` handles fulfillment.
- `.catch()` handles rejection.
- `.finally()` runs when the Promise settles, whether fulfilled or rejected.

## 17. Promises in API Calls

When we call an API using `fetch()`, it immediately returns a Promise.

### Flow

1. `fetch()` sends an API request.
2. It returns a Promise, initially in the Pending state.
3. JavaScript can continue executing other code without waiting.
4. When a response is received, the Promise is fulfilled.
5. `.then()` handles the response.
6. If a network error occurs, the Promise is rejected and `.catch()` handles the error.

Example:

```js
fetch("https://api.example.com/users")
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.log(error));
```

**Remember:**

- A Promise represents the future result of an asynchronous operation.
- We do not need to wait manually.
- `.then()` handles success.
- `.catch()` handles failure.

## 18. Event Loop, Microtasks, and Tasks

### 18.1 Event Loop

The **Event Loop** is a mechanism that coordinates the Call Stack and task queues so asynchronous callbacks can run when they are ready.

Main components:

1. **Call Stack:** Executes synchronous JavaScript code.
2. **Host Environment:** Handles operations such as timers and network requests.
3. **Task Queues:** Hold callbacks waiting for execution.
4. **Event Loop:** Coordinates when queued callbacks can run.

### How It Works

1. Synchronous code executes in the Call Stack.
2. The host environment handles asynchronous operations.
3. When an operation completes, its callback becomes ready in a queue.
4. After the current task finishes, the Event Loop processes pending microtasks before the next task.
5. The browser then gets an opportunity to render.

### 18.2 Microtask Queue

The **Microtask Queue** holds callbacks that run after the current JavaScript task finishes and before the next task begins.

Examples:

- `Promise.then()`
- `Promise.catch()`
- `Promise.finally()`
- `queueMicrotask()`

### 18.3 Task Queue (Macrotasks)

The **Task Queue** holds callbacks from tasks such as:

- `setTimeout()`
- `setInterval()`
- DOM events, such as click events

### Microtask vs Task

| Microtask | Task (often called Macrotask) |
|---|---|
| Promise callbacks | `setTimeout()` callbacks |
| `queueMicrotask()` | `setInterval()` callbacks |
| Runs before the next task | Runs after pending microtasks are processed |

### Example

```js
console.log("Start");

setTimeout(() => {
  console.log("Timeout");
}, 0);

Promise.resolve().then(() => {
  console.log("Promise");
});

console.log("End");
```

Output:

```text
Start
End
Promise
Timeout
```

Why?

1. `Start` executes.
2. The `setTimeout()` callback is scheduled as a task.
3. The Promise callback is scheduled as a microtask.
4. `End` executes.
5. The current JavaScript task finishes.
6. The microtask runs: `Promise`.
7. The next task runs: `Timeout`.

**Main rule:** Pending microtasks are processed before the next task.

## 19. Async/Await

**Async/Await** is a cleaner way to work with Promises. It makes asynchronous code easier to read and write.

### 19.1 `async`

- `async` makes a function return a Promise.

```js
async function getData() {
  return "Hello";
}
```

### 19.2 `await`

- `await` waits for a Promise to settle before continuing the async function.
- It pauses that async function, not the main JavaScript thread.
- It is normally used inside an `async` function.

```js
async function getData() {
  const response = await fetch("/api/users");
  const data = await response.json();

  console.log(data);
}
```

### 19.3 Error Handling

Use `try`, `catch`, and `finally` to handle success, errors, and completion.

```js
async function getData() {
  try {
    const response = await fetch("/api/users");
    const data = await response.json();

    console.log(data);
  } catch (error) {
    console.log(error);
  } finally {
    console.log("Done");
  }
}
```

### 19.4 Multiple Sequential API Calls

Each `await` waits for the previous Promise to settle before the function continues.

```js
async function getData() {
  const users = await fetch("/api/users");
  const posts = await fetch("/api/posts");
  const comments = await fetch("/api/comments");
}
```

### Remember

- `async` makes a function return a Promise.
- `await` pauses the async function until the Promise settles.
- `try/catch` handles errors.
- Async/Await is built on Promises; it does not replace them.
- It makes asynchronous code easier to read and maintain.
