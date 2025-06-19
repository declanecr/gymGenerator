#backend 

## 🧠 **What Is Node.js?**

**Node.js** is a **JavaScript runtime** built on **Chrome’s V8 engine** that lets you run JavaScript **outside the browser** — like on servers, command-line tools, or IoT devices.
	**JavaScript Runtime** is the __environment__ that can understand and execute JavaScript code

- It uses [**non-blocking I/O**](Non-Blocking I/O) and an **event-driven architecture** 
- It's commonly used to build **APIs**, **web servers**, **CLI tools**, and more

---

## ⚙️ **Core Concepts**

### 1. **Event Loop**
- Node handles tasks **asynchronously** using an **event loop**
- This allows it to process many requests without blocking
### 2. **Single-threaded**
- Node.js runs on a [[Single Thread]] but handles I/O (e.g. reading files, DB queries) **in the background**
- You write async code using `callbacks`, `Promises`, or `async/await`
``` js
// Async example
fs.readFile('file.txt', (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

---
### 3. [**Modules**](Modules.md)
Node uses a modular system via `require()` or `import`.
``` js
// CommonJS
const fs = require('fs');

// ES Module (if using .mjs or in newer setups)
import fs from 'fs';
```
You organize code using:
- **Core modules:** `fs`, `http`, `path`, etc.
- **Third-party modules:** Installed via `npm` (like `express`, `bcrypt`, etc.)
- **Your own files:** You can `require` your own scripts and export functions/classes
---
## 🧰 **npm & package.json**
`npm` (Node Package Manager) is how you install libraries.
- `package.json` keeps track of dependencies, scripts, and metadata
- Example:
``` json 
{
  "name": "backend",
  "version": "1.0.0",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}

```
You run scripts like:
``` bash
npm run dev
```
---
## 📁 Typical Node.js Project Structure

For a basic API:
``` pgsql
project/
├── index.js
├── routes/
│   └── users.js
├── controllers/
│   └── usersController.js
├── models/
├── package.json
└── .env
```

>[[NestJS]] is built on top of Node.js — it just gives you a **framework with structure**, dependency injection, and decorators.
---
## 💡 Why Use Node.js for APIs?

- Uses JavaScript (shared language across frontend/backend)
- Fast for I/O-heavy tasks (like APIs, DB interactions)
- Huge ecosystem (npm)
- Active community + tooling