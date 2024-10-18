# 6 - Type Queries, Callables & Constructables

## 6.1 - Type Queries

Allow us to `obtain type information from values`. This is especially `important when working with libraries that may not expose type` information directly.

### 6.1.1 - keyof

The keyof operator allows us to `obtain a type representing all property keys of a given object type or interface`.

> Not all keys are strings, so we can separate out those keys that are symbols and those that are strings using the intersection operator (&).

```ts
type DatePropertyNames = keyof Date;

type DateStringPropertyNames = DatePropertyNames & string;

//type DateStringPropertyNames = "toString" | "toDateString" | "toTimeString" | ... 33 more ...
```

### 6.1.2 - typeof

Allows you to `extract a type from a value`. This is useful when you want to infer a type from a variable or expression.

```ts
async function main() {
  const apiResponse = await Promise.all([
    fetch("https://example.com"),
    Promise.resolve("Titanium White"),
  ]);

  type ApiResponseType = typeof apiResponse;
  // type ApiResponseType = [Response, string];
}
```

Also, a common use of typeof is to obtain a type representing the “static site” of a class: `constructor, static properties, and other things not present on an instance` of the class.

> Don't confuse this typeof with the runtime typeof() used in conditions, they have different purposes. The runtime typeof() only returns string values like "number", "string", etc. The TypeScript typeof returns a complex type.

### 6.1.3 - keyof vs typeof

keyof = is used to retrieve the keys of an object or type. It works `similarly to JavaScript's Object.keys()`, but at the type level, `returning the union of all the key names in a type or interface.`

typeof = is used to `get the type of a value or variable at compile time`. It allows TypeScript to infer the type of a variable or object, which can then be used elsewhere in your type annotations.

```ts
const contact = {
  name: "Ashley",
  email: "ashley@example.com",
};

type WhatIWant = "name" | "email";
// keyof extracts the keys from the contact object.
type Try1 = keyof typeof contact;
// type Try1 = "name" | "email"
```

### 6.1.4 - Indexed Access Types

Provide a mechanism for `retrieving part(s) of an array or object type via indices`. This is particularly `useful for working with nested structures`.

```ts
interface Car {
  make: string;
  model: string;
  year: number;
  color: {
    red: string;
    green: string;
    blue: string;
  };
}

// In this situation 'color' is the “index”
let carColor: Car["color"];
/*
 let carColor: {
    red: string;
    green: string;
    blue: string;
  }
*/
```

You `can also reach deeper into the object` through multiple indices:

```ts
let carColorRedComponent: Car["color"]["red"];
// let carColorRedComponent: string
```

And you `can pass or “project” a union type (|) through Car as an index`, as long as all parts of the union are valid indices:

```ts
let carProperty: Car["color" | "year"];
/*
  let carProperty: number | {
    red: string;
    green: string;
    blue: string;
  }
*/
```

## 6.2 - Type Registry Pattern

This is called a module declaration, and it allows us to effectively layer types on top of things already exported by a module ./lib/registry.ts. Remember, `there’s only one definition of the types exported by ./lib/registry.ts, so if we modify them using a module declaration, that modification will affect every place` where its types are used.

Now, let’s use keyof, module declarations and what we just learned about open interfaces to solve a problem.

Imagine we’re building a data library for a web applications. Part of this task involves building a function that fetches different types of records from a user’s API. We want to `be able to retrieve a record by the name of the kind of record and its ID`, but as the builders of the library, we don’t know the specific types that any given user will need.

```ts
// Assumption -- our user has set up resources like Book and Magazine
//
// returns a Book
fetchRecord("book", "bk_123");
// returns a Magazine
fetchRecord("magazine", "mz_456");
// maybe should refuse to compile
fetchRecord("blah", "");
```

Our project might have a file structure like:

```
data/
  book.ts       // A model for Book records
  magazine.ts   // A model for Magazine records
lib/
  registry.ts   // Our type registry, and a `fetchRecord` function
index.ts        // Entry point
```

Let’s focus on that first argument of the fetchRecord function. We can create a `“registry” interface that any consumer of this library can use to “install” their resource types`, and define the fetchRecord function using our new keyof type query.

```ts
// lib/registry.ts
export interface DataTypeRegistry {
  // empty by design
}
// the "& string" is just a trick to get
// a nicer tooltip to show you in the next step
export function fetchRecord(arg: keyof DataTypeRegistry & string, id: string) {}
```

Now let’s focus our attention toward “app code”. We’ll define classes for Book and Magazine and “register” them with the DataTypeRegistry interface

```ts
export class Book {
  deweyDecimalNumber(): number {
    return 42;
  }
}
declare module "../lib/registry" {
  export interface DataTypeRegistry {
    book: Book;
  }
}

// @filename: data/magazine.ts
export class Magazine {
  issueNumber(): number {
    return 42;
  }
}

declare module "../lib/registry" {
  export interface DataTypeRegistry {
    magazine: Magazine;
  }
}
```

Now look what happens to the first argument of that fetchRecord function! it’s "book" | "magazine" despite the library having absolutely nothing in its code that refers to these concepts by name!

```ts
// @filename: index.ts
import { DataTypeRegistry, fetchRecord } from "./lib/registry";

fetchRecord("book", "bk_123");
```

Obviously there are other things we’d need to build other parts of what we’d need for a fetchRecord function. Don’t worry! We’ll come back once we’ve learned a few more things that we need.

## 6.3 - Callables

Both type aliases and interfaces offer the `capability to describe call signatures`:

```ts
interface TwoNumberCalculation {
  (x: number, y: number): number;
}

type TwoNumberCalc = (x: number, y: number) => number;

const add: TwoNumberCalculation = (a, b) => a + b;

const subtract: TwoNumberCalc = (x, y) => x - y;
```

- The return type for both the interface and the type alias is number, though the `syntax differs (:number in the interface and => number in the type alias)`.
- Because the functions add and subtract are typed using an interface or type alias, `there's no need to provide type annotations for the arguments or the return` type directly in the function definition.

> This interface cannot be "implemented" in the usual sense like a class, as it only describes the function signature, not an object structure.

## 6.4 - void Type

void is a special type used to describe function return values when `no value is returned`. The `return value of a void-returning function is intended to be ignored` by the caller.

void `serves as a clear indicator that you should not expect anything from this function`, focusing on actions rather than returning a value. It's especially useful in functions that perform side effects or callbacks, `ensuring that the developer doesn't mistakenly expect a meaningful return value where none is provided`.

While we could type functions as returning undefined, there are key differences that explain the purpose of void:

```ts
function invokeInFourSeconds(callback: () => undefined) {
  setTimeout(callback, 4000);
}
function invokeInFiveSeconds(callback: () => void) {
  setTimeout(callback, 5000);
}

const values: number[] = [];
invokeInFourSeconds(() => values.push(4)); // Type 'number' is not assignable to type 'undefined'.
invokeInFiveSeconds(() => values.push(4)); // ok
```

In the first example, Array.prototype.push returns a number (the new length of the array). Because invokeInFourSeconds expects the callback to return undefined, it throws an error when push returns a number.

In contrast, `invokeInFiveSeconds expects a void return, meaning it doesn't care what the function returns, so the call succeeds`.

Other useful cases:

- Logging:

```ts
function logError(message: string): void {
  console.error(message);
}
```

- Event Handlers:

```ts
function handleButtonClick(event: MouseEvent): void {
  console.log("Button was clicked");
  // Perform other actions, but no meaningful value is returned
}

const button = document.querySelector("button");
if (button) {
  button.addEventListener("click", handleButtonClick);
}
```

- Callbacks in Asynchronous Functions:

```ts
function executeAfterDelay(callback: () => void, ms: number): void {
  setTimeout(callback, ms);
}

executeAfterDelay(() => {
  console.log("Delayed execution");
}, 2000);
```

- Side Effects:

```ts
function sendAnalytics(data: any): void {
  // Send data to analytics server, but nothing is returned
  fetch("/analytics", { method: "POST", body: JSON.stringify(data) });
}
```

- Void in Asynchronous Functions:

```ts
async function notifyUser(): Promise<void> {
  await sendNotification("Your order has been shipped");
  // Nothing is returned, just a side effect of sending a notification
}
```

## 6.5 - Constructables & Function Overloads

### 6.5.1 - Construct signatures

Construct signatures are `similar to call signatures, except they describe what should happen with the new keyword` is used in an instantiation scenario.

```ts
interface DateConstructor {
  // the main difference from call signature is the keyword new
  new (value: number): Date; // used to create an instance (classes)
}

let MyDateConstructor: DateConstructor = Date;
const d = new MyDateConstructor(1697923072611);
```

### 6.5.2 - Function overloads

`Allows you to define multiple signatures for the same function`. This is useful `when a function can be called in different ways, depending on the `types of arguments. Overloads provide better type safety and IntelliSense support.

However, `the actual function implementation is written once, and it handles the logic for all overloads`. The key is to ensure that the function body can accommodate the possible combinations of argument types.

```ts
// Function overload signatures
function add(a: number, b: number): number;
function add(a: string, b: string): string;

// Function implementation that handles both overloads
function add(a: number | string, b: number | string): number | string {
  if (typeof a === "number" && typeof b === "number") {
    return a + b;
  } else if (typeof a === "string" && typeof b === "string") {
    return a.concat(b);
  }
  throw new Error("Invalid arguments");
}

// Usage examples:
console.log(add(10, 20)); // Outputs: 30
console.log(add("Hello, ", "World!")); // Outputs: "Hello, World!"
```

## 6.6 - this Types

Sometimes, a function strongly depends on `what this will reference at the time it is invoked`. For example, consider the case of a DOM event listener for a button:

```html
<button onClick="myClickHandler">Click Me!</button>
```

You might define myClickHandler as follows:

```ts
function myClickHandler(event: Event) {
  this.disabled = true; // Problem: this is inferred as any
}
```

In this example, `TypeScript infers this as any, which can lead to type safety issues`. If we enable the compilerOptions.noImplicitThis flag in tsconfig.json, TypeScript will raise an error:

```ts
'this' implicitly has type 'any' because it does not have a type annotation.
```

The `noImplicitThis flag ensures that this must always have an explicit type, preventing unsafe assumptions` about what this is.

To solve this,` we need to specify the this type explicitly. For instance, we can define this as HTMLButtonElement`:

```ts
function myClickHandler(this: HTMLButtonElement, event: Event) {
  this.disabled = true;
}
```

Now, TypeScript knows that this refers to an HTMLButtonElement, allowing us to safely access properties like disabled.

However, If we try to directly invoke myClickHandler:

```ts
myClickHandler(new Event("click"));
// Error: The 'this' context of type 'void' is not assignable to method's 'this' of type 'HTMLButtonElement'.
```

`To resolve this issue, we can bind` myClickHandler to the button element, ensuring the correct this is passed:

```ts
const myButton = document.getElementsByTagName("button")[0];
const boundHandler = myClickHandler.bind(myButton);
boundHandler(new Event("click")); // Works fine

myClickHandler.call(myButton, new Event("click")); // Also works
```

Key points:

- `.bind creates a new function where this is permanently set` to the provided value (myButton in this case).
- `.call and .apply immediately invoke the function with a specific this` value passed in.

> TypeScript understands that .bind, .call, and .apply will pass the proper this to the function.

## 6.7 - Explict Function Return Types

TypeScript is capable of inferring function return types quite effectively. However, `relying on inferring can lead to unintentional unexpected type changes when modifications are made`, affecting type safety across the codebase.

```ts
export async function getData(url: string) {
  const resp = await fetch(url);
  const data = (await resp.json()) as { properties: string[] };
  return data;
}

function loadData() {
  getData("https://example.com").then((result) => {
    console.log(result.properties.join(", "));
  });
}
```

In this case, TypeScript correctly infers the return type. However, making a seemingly innocent change can introduce issues:

```diff
export async function getData(url: string) {
  const resp = await fetch(url);
+ if (resp.ok) {
    const data = await resp.json();
    return data;
+ }
}
```

Here, we introduced a conditional return (if (resp.ok)), which `may result in undefined being returned if resp.ok is false`. This creates a potential error:

```ts
'result' is possibly 'undefined'.
```

By `explicitly defining return types, we can catch these errors earlier, at the function declaration level`, rather than at the invocation site:

```ts
async function getData(
  url: string
): Promise<{ properties: string[] } | undefined> {
  const resp = await fetch(url);
  if (resp.ok) {
    const data = (await resp.json()) as { properties: string[] };
    return data;
  }
  return undefined; // Explicitly returning undefined if not ok
}
```

By making `the return type Promise<{ properties: string[] } | undefined>, we surface potential issues earlier`, making it easier to ensure that the function handles all return paths correctly.

An alternative:

At the invocation site (loadData), TypeScript will alert us that result could be undefined, requiring us to `handle this case with optional chaining`:

```ts
function loadData() {
  getData("https://example.com").then((result) => {
    console.log(result?.properties.join(", ")); // Safe use of optional chaining
  });
}
```

Optional chaining (?.) `safely handles cases where result could be undefined`, preventing runtime errors by only accessing properties if result is not undefined.