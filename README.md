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