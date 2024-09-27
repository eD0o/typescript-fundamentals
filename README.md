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
const humidity = 79 // type is the literal number 79 (literal type)
```

The type of humidity is `literally 79 rather than a more general type like number`.

Now, `when needed to create an union type that allows only specific literal values`, we can use the | (union) operator. It's possible to give this type a name using the type keyword.

```ts
// Example 1:
type OneThroughFive = 1 | 2 | 3 | 4 | 5

let lowNumber: OneThroughFive = 3 // it passes

lowNumber = 8 // Type '8' is not assignable to type 'OneThroughFive'.
```

```ts
// Example 2:
type Evens = 2 | 4 | 6 | 8

let evenNumber: Evens = 2; // it passes

evenNumber = 5; // Type '5' is not assignable to type 'Evens'.
```

Now the union type with both sets:

```ts
let evenOrLowNumber = 5 as Evens | OneThroughFive; // it passes
// let evenOrLowNumber: 2 | 4 | 6 | 8 | 1 | 3 | 5
```