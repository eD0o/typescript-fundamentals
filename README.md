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

