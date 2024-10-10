# 5 - Interfaces and Type Aliases

TypeScript allows us to use to `name types and pass them across module boundaries using imports/exports`, similar to how values are treated in JS modules.

## 5.1 - Type Aliases

Think back to the : {name: string, email: string} syntax we’ve used for type annotations. `This syntax becomes increasingly complicated as more properties are added` to the type.

Additionally, if we pass objects of this type through various functions and variables, we’ll `end up with a lot of verbose types that need to be manually updated` whenever changes are required:

![](https://i.imgur.com/pjoonTR.png)

```ts
function maybeGetUserInfo():
  | readonly [
      "success",
      {
        readonly name: "Mike North";
        readonly email: "mike@example.com";
      }
    ]
  | readonly ["error", Error] {
  if (flipCoin() === "heads") {
    return success;
  } else {
    return fail;
  }
}
```

With a Type Alias:

```ts
// Define a type alias for the possible return values
type UserInfoOutcomeError = readonly ["error", Error];
type UserInfoOutcomeSuccess = readonly [
  "success",
  { readonly name: string; readonly email: string }
];
type UserInfoOutcome = UserInfoOutcomeError | UserInfoOutcomeSuccess;

export function maybeGetUserInfo(): UserInfoOutcome {
  if (flipCoin() === "heads") {
    return success;
  } else {
    return fail;
  }
}
```

<details>
<summary>Another example:</summary>

A few things to point out here:

- This is one of the rare cases where we see type information on the right-hand side of the assignment operator (=).
- We're using `TitleCase` for the alias name, which is a common convention.
- You `can only declare an alias with a given name once within a scope`, similar to how let or const declarations work.

```tsx
// types.ts
export type Amount = {
  currency: string;
  value: number;
};
```

```ts
// utils.ts
import { Amount } from "./types";

function printAmount(amt: Amount) {
  console.log(amt);
  const { currency, value } = amt;
  console.log(`${currency} ${value}`);
}

const donation = {
  currency: "USD",
  value: 30.0,
  description: "Donation to food bank",
};

printAmount(donation); // 👍
```

</details>

Type aliases help to address this, by allowing us to:

- Define a `more meaningful name` for this type.
- Declare the `shape of the type` in a single location.
- `Import and export the type`, between modules, just as with values.

It’s `better to centralize the definition of such types in a single place`.

### 5.1.1 - Inheritance

You can `create type aliases that combine existing types with new behavior` by using Intersection (&) types.

While `there’s no true extends keyword` that can be used when defining type aliases, an `intersection type has a very similar effect`:

![](https://i.imgur.com/1u2W7FQ.png)

Thus, you `can use both methods` from Date as well from Object.assign.

## 5.2 - Interfaces, extends & implements

An interface is `a way of defining an object type`.

> Not to be confused with a type called object, which will be explained later.

An object type is anything that looks like this:

```ts
{
  field: "value";
}
```

As seen in the previous chapter, it may be a type alias:

```ts
type Amount = {
  currency: string;
  value: number;
};
```

> string | number is an example of something that cannot be described using an object type, because it makes use of the union type operator.

```ts
// you can't create a union type in na interface
interface Amount = {
  currency: string;
  value: number;
}; | string
```

### 5.2.1 - extends

Just as in in JavaScript, a subclass `extends from a base class`.

> It's not possible to have a multiple inheritance in classes using extends.

```ts
function consumeFood(arg: string) {}
class AnimalThatEats {
  eat(food: string) {
    consumeFood(food);
  }
}
class Cat extends AnimalThatEats {
  meow() {
    return "meow";
  }
}

const c = new Cat();
c.eat();
c.meow();
```

Additionally a `“sub-interface” extends from a base interface`.

```ts
interface Animal {
  isAlive(): boolean;
}
interface Mammal extends Animal {
  getFurOrHairColor(): string;
}
interface Hamster extends Mammal {
  squeak(): string;
}
function careForHamster(h: Hamster) {
  h.getFurOrHairColor();
  h.squeak();
}
```

### 5.2.2 - implements

TypeScript adds `another clause called that can be used to state that a given class should produce instances` that confirm to a given interface.

```ts
interface AnimalLike {
  eat(food): void;
}

class Dog implements AnimalLike {
  //   ^
  //Class 'Dog' incorrectly implements interface 'AnimalLike'.
  //Property 'eat' is missing in type 'Dog' but required in type 'AnimalLike'.
  bark() {
    return "woof";
  }
}
```

In the example above, we can see that TypeScript `is objecting to us failing to add an eat()` method to our Dog class. Without this method, instances of Dog do not conform to the AnimalLike interface.

Let’s update it:

```ts
interface AnimalLike {
  eat(food): void;
}

class Dog implements AnimalLike {
  bark() {
    return "woof";
  }
  eat(food) {
    consumeFood(food);
  }
}
```

It's `possible to extends many interfaces in one`:

```ts
interface CanBark {
  bark(): string;
}

interface DogLike extends Animal, AnimalLike, CanBark {}

class Dog2 extends LivingOrganism implements DogLike {}
```

## 5.3 - Open Interfaces

