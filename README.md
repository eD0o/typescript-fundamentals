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

type WhatIWant = "name" | "email"
// keyof extracts the keys from the contact object.
type Try1 = keyof typeof contact
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
