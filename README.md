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

| keyword   | who can access (`instance` field/method)                        |
| --------- | --------------------------------------------------------------- |
| public    | anyone who has access to the scope in which the instance exists |
| protected | the instance itself, and subclasses                             |
| private   | only the instance itself                                        |

| keyword   | who can access (`static` field/method)                       |
| --------- | ------------------------------------------------------------ |
| public    | anyone who has access to the scope in which the class exists |
| protected | static and instance scopes of the class and its subclasses   |
| private   | static scope instance scopes of the class only               |

<details>
<summary>Instance example</summary>

```tsx
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
  // Instance stuff
  make: string;
  model: string;
  year: number;
  private _serialNumber = Car.generateSerialNumber();
  protected get serialNumber() {
    return this._serialNumber;
  }
  constructor(make: string, model: string, year: number) {
    this.make = make;
    this.model = model;
    this.year = year;
  }
}

class Sedan extends Car {
  getSedanInformation() {
    this._serialNumber; // Error: Property '_serialNumber' is private and only accessible within class 'Car'.
    const { make, model, year, serialNumber } = this;
    return { make, model, year, serialNumber };
  }
}

const s = new Sedan("Nissan", "Altima", 2020);
s.serialNumber; // Error: Property 'serialNumber' is protected and only accessible within class 'Car' and its subclasses.
```

A couple of things to note in the example above:

- The top-level scope doesn’t have the ability to read serialNumber anymore.
- Sedan doesn’t have direct access to write \_serialNumber, but it read it through the protected getter serialNumber.
- Car can expose private functionality by defining its own protected functionality (the serialNumber getter).
- Sedan can expose protected functionality by defining its own public functionality (the getSedanInformation() return value).

</details>

<details>
<summary>Static example</summary>

```tsx
class Car {
  // Static stuff
  private static nextSerialNumber: number;
  private static generateSerialNumber() {
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
  // Instance stuff
  make: string;
  model: string;
  year: number;
  private _serialNumber = Car.generateSerialNumber();
  protected get serialNumber() {
    return this._serialNumber;
  }
  constructor(make: string, model: string, year: number) {
    this.make = make;
    this.model = model;
    this.year = year;
  }
}

class Sedan extends Car {
  getSedanInformation() {
    Car.generateSerialNumber(); // Error: Property 'generateSerialNumber' is private and only accessible within class 'Car'.
    const { make, model, year, serialNumber } = this;
    return { make, model, year, serialNumber };
  }
}
```

> static scopes and instance scopes have some degree of visibility. protected static fields are accessible in the class’ static and instance scopes — as well as static and instance scopes of any subclasses.

</details>

> `Not for secret-keeping or security`: It is important to understand that, just like any other aspect of type information, access modifier keywords are only validated at compile time, with `no real privacy or security benefits at runtime`. This means that even if we mark something as private, `if a user decides to set a breakpoint and inspect the code that’s executing at runtime, they’ll still be able to see everything`.

### 7.2.2 - JS private #fields

As of TypeScript 3.8, TypeScript supports use of ECMAScript private class fields. If you have trouble getting this to work in your codebase, make sure to double-check your Babel settings.

```ts
class Car {
  private static nextSerialNumber: number;
  private static generateSerialNumber() {
    return this.nextSerialNumber++;
  }

  make: string;
  model: string;
  year: number;
  #serialNumber = Car.generateSerialNumber();

  constructor(make: string, model: string, year: number) {
    this.make = make;
    this.model = model;
    this.year = year;
  }
}
const c = new Car("Honda", "Accord", 2017);
c.#serialNumber; // Error: Property '#serialNumber' is not accessible outside class 'Car' because it has a private identifier.
```

Unlike TypeScript’s private keyword, `these are truly private fields, which cannot be easily accessed at runtime`. It’s important to remember, particularly if you’re writing client side code, that `there are still ways of accessing private field data through things like the Chrome Dev Tools protocol`.

Use this as an `encapsulation tool, not as a security construct`. The implementation of JS private fields is also mutually exclusive with properly-behaving ES proxies, which you may not care about directly, but it’s possible that libraries you rely on use them.

TypeScript 5 supports static private #fields:

```ts
class Car {
  static #nextSerialNumber: number;
  static #generateSerialNumber() {
    return this.#nextSerialNumber++;
  }

  make: string;
  model: string;
  year: number;
  #serialNumber = Car.#generateSerialNumber();

  constructor(make: string, model: string, year: number) {
    this.make = make;
    this.model = model;
    this.year = year;
  }
}
```

The class-level counter is now not observable in any way from outside the class, either at build time or runtime.

### 7.2.3 - Private field presence checks

In TypeScript, `private fields are not directly accessible`, but we can detect their presence using the in keyword. This `checks if a private field exists on an instance` without attempting to access its value.

```ts
class Car {
  static #nextSerialNumber: number;
  static #generateSerialNumber() {
    return this.#nextSerialNumber++;
  }

  make: string;
  model: string;
  year: number;
  #serialNumber = Car.#generateSerialNumber();

  constructor(make: string, model: string, year: number) {
    this.make = make;
    this.model = model;
    this.year = year;
  }
  // The equals method checks if another object has the private field #serialNumber
  equals(other: unknown) {
    // If `other` is an object and has the #serialNumber field
    if (other && typeof other === "object" && #serialNumber in other) {
      other; // (parameter) other: Car - TypeScript infers `other` is of type `Car` here
      return other.#serialNumber === this.#serialNumber;
    }
    return false;
  }
}
const c1 = new Car("Toyota", "Hilux", 1987);
const c2 = c1;
c2.equals(c1); // true or false depending on #serialNumber comparison
```

> This is useful for comparing instances of a class based on private properties without exposing those properties publicly.

When we check for a private field using the in keyword, TypeScript can narrow the type of the object being checked. For example, if #serialNumber in other evaluates to true, it means other must be an instance of the same class that declared the private field (Car in this case). This is because `private fields are only accessible within the class where they are defined`, and other classes, even if they have private fields with the same name, cannot access them.

### 7.2.4 - readonly

The readonly modifier in TypeScript `can be applied to properties or class fields, making them immutable after their initial assignment`. This ensures that once a value is set for a field (either in the constructor or during declaration), it `cannot be changed later in the class`.

```ts
// @errors: 2540
class Car {
  static #nextSerialNumber: number;
  static #generateSerialNumber() {
    return this.#nextSerialNumber++;
  }

  public make: string;
  public model: string;
  public year: number;
  readonly #serialNumber = Car.#generateSerialNumber();

  constructor(make: string, model: string, year: number) {
    this.make = make;
    this.model = model;
    this.year = year;
  }

  changeSerialNumber(num: number) {
    this.#serialNumber = num; // Error: Cannot assign to '#serialNumber' because it is a read-only property.
  }
}
```

## 7.3 - Param Properties & Overrides

### 7.3.1 - Param Properties

TypeScript provides `a more concise syntax to write classes`, through the use of param properties:

```ts
// Previous example:
class Car {
  make: string;
  model: string;
  year: number;
  constructor(make: string, model: string, year: number) {
    this.make = make;
    this.model = model;
    this.year = year;
  }
}
```

```ts
// New example:
class Car {
  constructor(public make: string, public model: string, public year: number) {}
}
```

- The arguments passed to the constructor should be string and available within the scope of the constructor as make, model and year.

- This also creates public class fields on Car called and pass its values that was given to the constructor.

To remember the constructor order in JS:

1 - super()
2 - param property initialization
3 - other class field initialization
4 - anything else that was in your constructor after super()

So, in TypeScript the below code:

```ts
class Base {}

class Car extends Base {
  foo = console.log("class field initializer");
  constructor(public make: string) {
    super();
    console.log("custom constructor stuff");
  }
}

const c = new Car("honda");
```

Will be compiled as:

```js
// Output in JS
"use strict";
class Base {}
class Car extends Base {
  constructor(make) {
    super();
    this.make = make;
    this.foo = console.log("class field initializer");
    console.log("custom constructor stuff");
  }
}
```

### 7.3.2 - Overrides

A common mistake, that has historically been difficult for TypeScript to assist with is typos when overriding a class method:

```ts
class Car {
  honk() {
    console.log("beep");
  }
}

class Truck extends Car {
  hoonk() {
    // OOPS!
    console.log("BEEP");
  }
}

const t = new Truck();
t.honk(); // "beep"
```

In this case, it looks like the intent was to override the base class method, but because of the typo, we defined an entirely new method with a new name. 

TypeScript 5 includes an `override keyword that makes this easier to spot`:

```ts
class Car {
  honk() {
    console.log("beep");
  }
}

class Truck extends Car {
  override hoonk() {
    // Error: This member cannot have an 'override' modifier because it is not declared in the base class 'Car'.
    // Did you mean 'honk'?
    console.log("BEEP");
  }
}

const t = new Truck();
t.honk(); // "beep"
```

The error message even correctly guessed what we meant to do! There’s a compiler option called `noImplicitOverride in tsconfig.json that you can enable to make sure that a correctly established override method remains an override`:

```ts
class Car {
  honk() {
    console.log("beep")
  }
}

class Truck extends Car {
  honk() {
    // Error: This member must have an 'override' modifier because it overrides a member in the base class 'Car'.
    console.log("BEEP")
  }
}

const t = new Truck();
t.honk(); // "BEEP"
```
