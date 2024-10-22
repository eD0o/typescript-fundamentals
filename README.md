# 7 - Class Fields & Type Guards

## 7.1 - Class Fields & Methods

### 7.1.1 - Fields & methods

Let’s go back to our car example. In the JS world, we could have something like:

```js
////////////////////////////////
// JavaScript, not TypeScript //
////////////////////////////////
class Car {
  constructor(make, model, year) {
    this.make = make; // any
    this.model = model; // any
    this.year = year; // any
  }
}

let sedan = new Car("Honda", "Accord", 2017);
sedan.activateTurnSignal("left"); // not safe!
// js wouldn't warn that is wrong, but would result in undefined being called, which would cause a runtime error like this:
// sedan.activateTurnSignal is not a function
new Car(2017, "Honda", "Accord"); // not safe!
```

This is `allowed in the JS world because every value`, including the class fields and instances of the class itself, `is effectively of type any`.

In the TypeScript world, we want some assurance that we will be stopped at compile time from invoking the non-existent activateTurnSignal method on our car. In order to get this we have to provide a little more information up front:

```ts
class Car {
  make: string;
  model: string;
  year: number;
  constructor(make: string, model: string, year: number) {
    this.make = make; // string
    this.model = model; // string
    this.year = year; // number
  }
}

let sedan = new Car("Honda", "Accord", 2017);
sedan.activateTurnSignal("left"); // not safe!
// error: Property 'activateTurnSignal' does not exist on type 'Car'.
new Car(2017, "Honda", "Accord"); // not safe!
// error: Argument of type 'number' is not assignable to parameter of type 'string'.
```

Two things to notice in the code snippet above:

- We are stating the types of each class field
- We are stating the types of each constructor argument

Expressing types for class methods works using largely `the same pattern used for function arguments` and return types:

```ts
class Car {
  make: string;
  model: string;
  year: number;
  constructor(make: string, model: string, year: number) {
    this.make = make;
    this.model = model;
    this.year = year;
  }
  honk(duration: number): string {
    return `h${"o".repeat(duration)}nk`;
  }
}

const c = new Car("Honda", "Accord", 2017);
c.honk(5); // "hooooonk"
```

### 7.1.2 - static fields, methods & blocks

In TypeScript, we `can define static fields and methods that belong to the class itself, rather than instances of the class`. These are `useful when we want shared behavior or state across all instances of a class`.

Static fields and methods `are declared using the static keyword`. They can be accessed directly on the class, `without needing to create an instance`.

Here’s an example of a case where we want to have a counter that increments each time there’s a new instance:

```ts
class Car {
  static nextSerialNumber = 100; // Static field
  static generateSerialNumber(): number {
    // Static method
    return this.nextSerialNumber++;
  }

  // Instance fields
  make: string;
  model: string;
  year: number;
  serialNumber = Car.generateSerialNumber();
  constructor(make: string, model: string, year: number) {
    this.make = make;
    this.model = model;
    this.year = year;
  }
  getLabel() {
    return `${this.make} ${this.model} ${this.year} - #${this.serialNumber}`;
  }
}
console.log(new Car("Honda", "Accord", 2017));
// > "Honda Accord 2017 - #100
console.log(new Car("Toyota", "Camry", 2022));
// > "Toyota Camry 2022 - #101
```

- Static fields (nextSerialNumber) store shared state.
- Static methods (generateSerialNumber) perform operations on the static fields.

> Unless you state otherwise, static fields are accessible from anywhere the Car class is accessible.

`There’s one more place where the static world appears: next to a code block`. The static block `allows you to perform complex or asynchronous operations` when the class is initialized. It runs once when the class is defined.

Let’s imagine that we don’t want to start with that invoice counter at 1, but instead we want to load it from an API somewhere.

```ts
class Car {
  // Static stuff
  static nextSerialNumber: number;
  static generateSerialNumber() {
    return this.nextSerialNumber++;
  }
  static {
    // `this` is the static scope
    fetch("https://api.example.com/vin_number_data")
      .then((response) => response.json())
      .then((data) => {
        this.nextSerialNumber = data.mostRecentInvoiceId + 1;
      });
  }
  // Instance fields
  make: string;
  model: string;
  year: number;
  serialNumber = Car.generateSerialNumber();
  constructor(make: string, model: string, year: number) {
    this.make = make;
    this.model = model;
    this.year = year;
  }
}
```

The static block fetches data from an API and sets nextSerialNumber before any instances are created.

> The this keyword in a static block refers to the class itself (Car in this case).

Advantages of Static Members:

- They allow centralization of logic or data that applies to the entire class, rather than individual instances.
- They help `reduce redundancy and save memory when many instances of a class share common data` or behavior.

## 7.2 - Access modifier keywords

### 7.2.1 - public, private and protected

TypeScript provides three access modifier keywords, which can be used with class fields and methods, to `describe who should be able to see and use them`.

| keyword   | who can access                                                  |
| --------- | --------------------------------------------------------------- |
| public    | Anyone who has access to the scope in which the instance exists |
| protected | the instance itself, and subclasses                             |
| private   | only the instance itself                                        |
|           |
