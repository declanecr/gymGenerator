**Definition**:  
A **module** is any file that exports code (functions, variables, classes) for reuse in other files.

This is how you **split up your project into smaller pieces**.

#### Example:
``` js
// math.js
export function add(a, b) {
  return a + b;
}

// main.js
import { add } from './math.js';
console.log(add(2, 3));
```
#### In Node:
- You use `require()` (CommonJS) or `import` (ESM)
- Built-in modules: `fs`, `http`
- Your own: any `.js` file you write
- 3rd party: Installed via `npm`

#### 🧠 Analogy:

Think of modules like tools in a toolbox. Instead of one giant file with every tool, you have one file per tool, and import what you need.