# 3 - Objects, Arrays & Tuples

## 3.1 - Objects & Property Types

### 3.1.1 - Object properties declaration

To define a mutable object, you can do it like this:

```ts
//declaring the types
let car: {
  make: string;
  model: string;
  year: number;
} = {
  make: "Toyota",
  model: "Corolla",
  year: 2004,
};

// allowed
car.make = "Ford";

//not allowed
car = { make: "Ford", model: "Focus", year: 2020 };
```

Using `const` allows you to change properties, but not the entire object at once:

The `?` signal means it's optional and not required prop.

```ts
//without declaring the types, but ts will infer
const car = {
  make: "Toyota",
  model: "Corolla",
  year: 2004,
  color: "Black", // optional value
};

// allowed
car.make = "Ford";
car.model = "Focus";
car.make = 2020;

//not allowed
car = { make: "Ford", model: "Focus", year: 2020 };
```

Using `readonly` makes properties immutable:

```ts
const car: {
  readonly make: string;
  readonly model: string;
  readonly year: number;
} = {
  make: "Toyota",
  model: "Corolla",
  year: 2004,
};

// Any attempt to change will result in an error
car.make = "Honda"; // ~ error
```

### 3.1.2 - Object Functions

It's possible to define functions that take objects as parameters:

```ts
const myCar = {
  make: "Toyota",
  model: "Corolla",
  year: 2004,
};

function printCar(car: { make: string; model: string; year: number }) {
  console.log(`${car.make} ${car.model} (${car.year})`);
}

printCar(myCar);
```

## 3.2 - Index Signature

Sometimes it's necessary to represent a type for dictionaries, where `values of a consistent type can be retrieved by keys`.

Let’s consider the following collection of phone numbers:

```ts
const phones = {
  home: { country: "+1", area: "211", number: "652-4515" },
  work: { country: "+1", area: "670", number: "752-5856" },
  fax: { country: "+1", area: "322", number: "525-4357" },
};
```

To type it, it'd be like:

```ts
const phones: {
  [k: string]: {
    country: string;
    area: string;
    number: string;
  };
} = {
  home: { country: "+1", area: "211", number: "652-4515" },
  work: { country: "+1", area: "670", number: "752-5856" },
  fax: { country: "+1", area: "322", number: "525-4357" },
};
```

Or in a shorter way:

```ts
const phones: { [k: string]: string } = {};
```

> However, you can't add values that are of a different type or more complex structures, such as nested objects as in the first scenario.

## 3.3 - Array Types, Tuples & readonly

### 3.3.1 - Array Types:

Describing types for arrays is often as easy as `adding [] to the end of the array member’s type`. For example the type for an array of strings would look like `string[]`:

```ts
const fileExtensions: string[] = ["js", "ts"];
const numberArr: number[] = [1, 2, 3];
```

> Avoid using `Array<string>` because can cause weird bugs in JSX due to syntax conflicts. Prefer using `string[]`.

### 3.3.2 - Tuples & readonly:

The best way to create `immutable tuples` in TypeScript is by using `readonly`:

```ts
const tupleExample: readonly [number, number] = [4, 5];
tupleExample.push(6); // Error: Property 'push' does not exist on type 'readonly [number, number]'.
```

> It's possible to create mutable tuples as well, but conceptually, this is the best scenario in TypeScript.

## 3.4 - Structural vs Nominal Typing

- **Nominal**: Types are based on explicit names. Example from Java:

```java
public class Car {
  String make;
  String model;
}

Car myCar = new Car();
CarChecker.checkCar(myCar); // Checks if myCar is a Car instance
```

- **Structural**: Types are based on structure or shape. Example from TypeScript:

```ts
class Car {
  make: string;
  model: string;
  year: number;
}

class Truck {
  make: string;
  model: string;
  year: number;
  towingCapacity: number;
}

function printCar(car: { make: string; model: string; year: number }) {
  console.log(`${car.make} ${car.model} (${car.year})`);
}

const vehicle = { make: "Honda", model: "Accord", year: 2017 };
printCar(vehicle); // Works fine, no need for an explicit class
```

In TypeScript, `compatibility is determined by whether an object has the required properties`, not by its class. For example, `both Car and Truck are compatible with the printCar` function as long as they have the necessary properties.