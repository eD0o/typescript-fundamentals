# 8 - Generics

Generics `allow us to parameterize types`, making it possible to reuse types across a TypeScript project.

They `act as "function arguments, but for types" and adapt based on the type of data provided`, ensuring that the types remain dynamic and can adjust depending on context.

Functions `may return different values`, depending on the arguments you pass them.

> Generics can adapt their type based on the parameters you use with them, maintaining type safety across different inputs.

## 8.1 - When to use

Generics are especially useful when you want a function, class, or data structure `to work across multiple types without sacrificing type safety`.

For instance, consider a wrapInArray function. This function takes a single item and wraps it in an array. `Using generics allows this function to work with any type` and ensures that the return type matches the type of the input.

```ts
function wrapInArray<T>(item: T): T[] {
  return [item];
}

// Usage
const numberArray = wrapInArray(5); // Type: number[]
const stringArray = wrapInArray("hello"); // Type: string[]
const booleanArray = wrapInArray(true); // Type: boolean[]

// Output
console.log(numberArray); // [5]
console.log(stringArray); // ["hello"]
console.log(booleanArray); // [true]
```

- Generic Parameter <T>: `T represents the type of item`, allowing TypeScript to infer the type of item and the resulting array.

- Function:
  - Takes item of type T.
  - Returns an array of T (T[]).

Another Example:

Suppose we have an array of items, and we want to find the item with the highest value for a particular property.
Using generics ensures that our function works with any type of object and checks that the specified property is valid.

```ts
function findMaxByProperty<T, K extends keyof T>(items: T[], key: K): T | null {
  if (items.length === 0) return null;

  return items.reduce((max, item) => (item[key] > max[key] ? item : max));
}

// Usage
type Employee = { id: number; name: string; salary: number };

const employees: Employee[] = [
  { id: 1, name: "Alice", salary: 50000 },
  { id: 2, name: "Bob", salary: 75000 },
  { id: 3, name: "Charlie", salary: 60000 },
];

const highestSalaryEmployee = findMaxByProperty(employees, "salary");

console.log(highestSalaryEmployee);
// Output: { id: 2, name: "Bob", salary: 75000 }
```

- Generic Parameters <T, K extends keyof T>:

  - T is the type of items in the array, allowing this function to work with any object type.
  - `K extends keyof T ensures that key is a valid property of T`, so TypeScript can enforce that key is a property of each item.

- Function:
  - `Takes an array of objects (items: T[]) and a key (key: K)` that represents a property on T.
  - Uses .reduce to iterate over items and find the item with the maximum value for the specified property.
  - `Returns null if items is empty, otherwise returns the item` with the maximum value for key.

This example demonstrates how generics help make findMaxByProperty type-safe, `ensuring that only valid properties can be used for comparison and allowing it to work across different object types`, such as employee records, product listings, or any other structured data.

## 8.2 - Best Practices

Use each type parameter at least twice. Any less and you might be casting with the as keyword. Let’s take a look at this example:

```ts
function identity<T>(input: any): T {
  return input; // 🚨 Returns `input` as `T`, but there's no type enforcement
}

// 🚨 Problem: `identity<string>(123)` will treat `123` as if it were a `string`
const text = identity<string>(123); // TypeScript thinks `text` is a `string`
console.log(text.toUpperCase()); // Runtime error: `toUpperCase` is not a function
```

- Here, identity<string>(123) passes in a number, but the return type is assumed to be a string because of the <string> generic type. This results in a runtime error since 123 doesn’t have string methods like toUpperCase.
- Correct usage would involve a function where T relates directly to the type of input, like this:

```ts
function safeIdentity<T>(input: T): T {
  return input;
}

const text = safeIdentity("Hello"); // Correctly typed as `string`
console.log(text.toUpperCase()); // Safe to use
```

This enforces type consistency by ensuring the input and output types match, preventing the need for casting.

`Using each type parameter at least twice ensures the generic type is actually used and enforced`.

> Without it, TypeScript can’t verify the compatibility between T and the input type, leading to possible runtime errors.
