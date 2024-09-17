# 2 - Variables and Values

## 2.1 - Compiling TypeScript with TSC

### 2.1.1 - Setup info

Inside the repo, navigate to `packages/welcome-to-ts`. The key files here include:

- package.json: Defines `project dependencies` (TypeScript 5.3 in beta).
- tsconfig.json: `Configuration for the TypeScript compiler`, which controls things like `output language` level (ES2015, ES2017, ES2022).
- index.ts: The actual TypeScript `file with code`.

### 2.1.2 - Compilation

![](https://i.imgur.com/DB7XEjg.png)

- Compiling the TypeScript code generates JavaScript in the `src/dist` folder. The `output varies based on the language level set in the tsconfig.json` file.
- The code in `index.ts` can and in this case includes modern JavaScript features such as `async/await` (ES2017) and private static fields (ES2022).

  > For example, when targeting ES2017, the output uses polyfills (like `_Foo_bar`) to mimic features unsupported in older environments, while ES2022 natively supports private static fields.

- Enabling `"declaration": true` in tsconfig.json `generates .d.ts files` alongside the JavaScript output. These files contain type information, `allowing other developers to use TypeScript types even when the main output is JavaScript`.

- Module resolution is the mechanism by which TypeScript finds the files referenced in imports. The `Node option is the most common setting, searching for modules in node_modules` and using relative paths.

- TypeScript provides `flexibility by compiling modern JavaScript features down to versions that can run in older environments`, similar to Babel. It also separates type information from the JavaScript code, allowing the code to be runnable in JS environments while still benefiting TypeScript users.

## 2.2 - Variable Declarations and Inference

### 2.2.1 - Inference

TypeScript can automatically `infer types based on the assigned value` during variable declaration.

```ts
let temperature = 6; // inferred as type number
```

### 2.2.2 - Type Checking

TypeScript enforces type-checking to `ensure values assigned to variables to match` the expected type.

```ts
temperature = "warm"; // error: Type '"warm"' is not assignable to type 'number'
```

### 2.2.3 - Literal Types

You can define a variable with a literal type, `restricting it to a specific value`.

```ts
// most common and useful option when you know the value will not change.
const humidity = 79; // humidity's type is literally 79
humidity = 78; // error: Type '78' is not assignable to type '79'
```

### 2.2.4 - Type Compatibility

When assigning one variable to another, TypeScript checks if the values are compatible.

```ts
let temp2 = 19; // type: number
let humid2 = 79 as const; // type: 79 (literal)
temp2 = humid2; // allowed, since 79 is a number
humid2 = temp2; // error: cannot assign a general number to a literal type
```

> Using `as const ensures a variable's type is treated as a literal`, preventing it from being changed to another value.

### 2.2.5 - "Trivia"

In TypeScript, `let temperature = 79 as 79`; creates a let variable with a literal type (79), meaning it can only hold the value 79. `Although it is reassignable, it can only be reassigned to 79, making it function similarly to a const but still technically a let.`

Now considering the examples:

```ts
let temperature = 79 as const;
let temperature = 79 as 79;
const temperature = 79;
```

_let temperature = 79 as const_ or _let temperature = 79 as 79_ `would only be useful if you need reassignability (though limited to the same value)`, but that’s a very niche scenario.

_const temperature = 79_ is the most useful in most cases because:

- It's `simpler` and more concise.
- It `communicates clearly that the value will not change`, which aligns with best practices of immutability.
