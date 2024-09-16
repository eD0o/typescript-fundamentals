# 2 - Variables and Values

## 2.1 - Compiling TypeScript with TSC

### 2.1.1 - Setup info

Inside the repo, navigate to `packages/welcome-to-ts`. The key files here include:

- package.json: Defines `project dependencies` (TypeScript 5.3 in beta).
- tsconfig.json: `Configuration for the TypeScript compiler`, which controls things like `output language` level (ES2015, ES2017, ES2022).
- index.ts: The actual TypeScript `file with code`.

### 2.1.2 - Compilation

![](https://i.imgur.com/DB7XEjg.png)

- Compiling the TypeScript code generates JavaScript in the `src/dist` folder. The `output varies based on the language level set in the tsconfig.json` file.
- The code in `index.ts` can and in this case includes modern JavaScript features such as `async/await` (ES2017) and private static fields (ES2022).

  > For example, when targeting ES2017, the output uses polyfills (like `_Foo_bar`) to mimic features unsupported in older environments, while ES2022 natively supports private static fields.

- Enabling `"declaration": true` in tsconfig.json `generates .d.ts files` alongside the JavaScript output. These files contain type information, `allowing other developers to use TypeScript types even when the main output is JavaScript`.

- Module resolution is the mechanism by which TypeScript finds the files referenced in imports. The `Node option is the most common setting, searching for modules in node_modules` and using relative paths.

- TypeScript provides `flexibility by compiling modern JavaScript features down to versions that can run in older environments`, similar to Babel. It also separates type information from the JavaScript code, allowing the code to be runnable in JS environments while still benefiting TypeScript users.
