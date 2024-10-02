# 4 - Union & Intersection Types

## 4.1 - Conceptualizing

When discussing types in TypeScript, it's helpful to think of them as `sets of allowed values`.

### 4.1.1 - Union Types (`|`)

- Union types allow a value to `belong to one or more sets`.
- `Represented by the pipe symbol` (|), similar to the OR operator in JavaScript.
- Example: Consider two sets:
  - evens = {2, 4, 6, 8}
  - numbers 1-5 = {1, 2, 3, 4, 5}  
    The union of these sets would be {1, 2, 3, 4, 5, 6, 8}. Any value in either set is allowed.
- Allowed Values: `Any value from either set`.
  > Values that are in either this set | the other set.

### 4.1.2 - Intersection Types (`&`)

- Intersection types `require a value to belong to both sets`.
- `Represented by the ampersand (&)`, similar to the AND operator in JavaScript.
- Example: Using the same sets (evens and numbers 1-5), the intersection would be {2, 4}, as these are the `values present in both sets`.
- Allowed Values: Must meet the criteria of both sets.
  > Values that are in both this set & the other set.

### 4.1.3 - Mental Model: Values vs. Guarantees

![](https://www.typescript-training.com/static/e0631284ba90dde4a2757980407264fd/2c95d/union-intersection-preview.png)

- Union: Focus on `what values are allowed` in the set.
- Intersection: `Focus on the guarantees` about each value in the set.
- With union, a function might not accept all values since they could belong to only one set. `With intersection, you have stricter control, knowing that the value satisfies both` criteria.

## 4.2 - Union Types

Let’s think back to the concept of literal types from an earlier example

```ts
const humidity = 79; // type is the literal number 79 (literal type)
```

The type of humidity is `literally 79 rather than a more general type like number`.

Now, `when needed to create an union type that allows only specific literal values`, we can use the | (union) operator. It's possible to give this type a name using the type keyword.

```ts
// Example 1:
type OneThroughFive = 1 | 2 | 3 | 4 | 5;

let lowNumber: OneThroughFive = 3; // it passes

lowNumber = 8; // Type '8' is not assignable to type 'OneThroughFive'.
```

```ts
// Example 2:
type Evens = 2 | 4 | 6 | 8;

let evenNumber: Evens = 2; // it passes

evenNumber = 5; // Type '5' is not assignable to type 'Evens'.
```

Now the union type with both sets:

```ts
let evenOrLowNumber = 5 as Evens | OneThroughFive; // it passes
// let evenOrLowNumber: 2 | 4 | 6 | 8 | 1 | 3 | 5
```

## 4.3 - Union Type Control Flow

Union types `allow a function or variable to accept multiple types`. For example, a function that can return either of two possible values:

```ts
function flipCoin(): "heads" | "tails" {
  if (Math.random() > 0.5) return "heads";
  return "tails";
}
```

You can also define union types in function parameters:

```ts
// Examples:

function printEven(even: Evens): void {}
function printLowNumber(lowNum: OneThroughFive): void {}
function printEvenNumberUnder5(num: 2 | 4): void {}
function printNumber(num: number): void {}

let evenOrLowNumber: Evens | OneThroughFive;
evenOrLowNumber = 6; // ✔️ An even number
evenOrLowNumber = 3; // ✔️ A low number
evenOrLowNumber = 4; // ✔️ A low even number

// Function calls
printEven(evenOrLowNumber); //❌ Not guaranteed to be even
printLowNumber(evenOrLowNumber); //❌ Not guaranteed to be in {1, 2, 3, 4, 5}
printEvenNumberUnder5(evenOrLowNumber); //❌ Not guaranteed to be in {2, 4}
printNumber(evenOrLowNumber); //✔️ Guaranteed to be a number
```

### 4.3.1 - Type Guards and Narrowing Examples

- Type guards are expressions or functions that perform runtime `checks to ensure a variable is of a specific type`. These checks allow TypeScript to "narrow" the type of a variable `from a broad or union type to a more specific type`. In other words, type guards help `refine or narrow down the possible types of a value` within a particular block of code, making it safer and easier to work with specific types.

After applying a type guard, TypeScript knows the variable's exact type in that code block.


1. typeof - `primitive types`

```ts
function printValue(value: string | number) {
  if (typeof value === "string") {
    // Narrowed to string
    console.log(value.toUpperCase());
  } else {
    // Narrowed to number
    console.log(value.toFixed(2));
  }
}
```

2. instanceof - `objects and classes`

```ts
class Animal {}
class Dog extends Animal {
  bark() {
    console.log("Woof!");
  }
}

function isDog(animal: Animal) {
  if (animal instanceof Dog) {
    // Narrowed to Dog
    animal.bark();
  }
}
```

3. Custom Type Guards

It's possible to create custom type guard functions using a return type with a specific syntax: `paramName is Type`.

```ts
function isString(value: unknown): value is string {
  return typeof value === "string";
}

function printValue(value: unknown) {
  if (isString(value)) {
    // Narrowed to string
    console.log(value.toUpperCase());
  }
}
```

4. Discriminated Unions

This is a pattern where a `specific property discriminator is used to narrow` down union types.

```ts
// Example 1:
type Success = { status: "success"; data: string };
type Failure = { status: "error"; error: string };

function handleResponse(response: Success | Failure) {
  if (response.status === "success") {
    // Narrowed to Success
    console.log(response.data);
  } else {
    // Narrowed to Failure
    console.log(response.error);
  }
}
```

```ts
// Example 2:
const outcome = maybeGetUserInfo();
const [first, second] = outcome;

if (first === "error") {
  // In this branch of your code, second is an Error
  second;

  const second: Error;
} else {
  // In this branch of your code, second is the user info
  second;

  const second: {
    readonly name: "Eduardo";
    readonly email: "eduardo@mail.com";
  };
}
```

## 4.4 - Intersection Types

Intersection types in TypeScript can be described using the `& `(ampersand) operator.

Essentially, `& means “anything that is in both sets”` in terms of the allowed values or proeperties. An intersection type allows a variable to `have all the properties and behaviors of the intersected types, combining them into a new type`.


```ts
//? What does Evens & OneThroughFive accept as values?
let evenAndLowNumber: Evens & OneThroughFive;
evenAndLowNumber = 6 //! Not in OneThroughFive
evenAndLowNumber = 3 //! Not in Evens
evenAndLowNumber = 4 //✔️ In both sets

// ? What requirements can `Evens & OneThroughFive` meet?
let y = 4 as Evens & OneThroughFive;

printEven(y) //✔️ Guaranteed to be even
printLowNumber(y) //✔️ Guaranteed to be in {1, 2, 3, 4, 5}
printEvenNumberUnder5(y) //✔️ Guaranteed to be in {2, 4}
printNumber(y) //✔️ Guaranteed to be a number
```

Example Explanation: 

- The intersection type Evens & OneThroughFive can `only accept values that exist in both types, which narrows the range` of allowed values.
- In this case, only 4 is allowed because it's both an even number and within the range of OneThroughFive (1-5).
- This `narrow range of values makes it possible to meet the type-checking requirements` for all four print* functions.

> It is far less common to use intersection types compared to union types. A real-world case where you’ll find an intersection type is Object.assign(a, b)