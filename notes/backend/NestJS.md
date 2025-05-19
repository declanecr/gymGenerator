#backend 
## the modular backend framework for [[NodeJS]]
## 🧱 What Is NestJS?

**NestJS** is a **framework** for building efficient, scalable server-side applications.  
It sits on top of **Node.js** (specifically, **Express** or optionally **Fastify**) and adds:
- A powerful **module system**
- **TypeScript-first** architecture
- [[Dependency Injection]] (DI)
- Clean separation of concerns (Controllers, Services, Module)
- Out-of-the-box support for tools like [[Prisma]], [JWT](Authentication_Flow), Swagger, and more
---
### 🔍 How It Abstracts Node.js
| Feature                       | Node.js / Express (raw)                           | NestJS (abstracted)                              |
| ----------------------------- | ------------------------------------------------- | ------------------------------------------------ |
| **Routing**                   | Manually set up in `app.get()`, `app.post()`      | Uses `@Controller()` + `@Get()`, `@Post()`       |
| **DI (Dependency Injection)** | Manual via constructors or global singletons      | Automatic, powered by a built-in DI container    |
| **Modules**                   | You organize files however you like               | Uses `@Module()` to group logic cleanly          |
| **Middleware**                | Manual setup                                      | Built-in support + guards/interceptors           |
| **Validation**                | Manual or use middleware like `express-validator` | Built-in via `@nestjs/common` + class-validator  |
| **Decorators**                | N/A (not built-in)                                | Fully supported (`@Injectable()`, `@Param()`...) |
| **Type Safety**               | Optional                                          | Enforced via TypeScript + decorators             |

---

## 💡 Example: Basic Route

### 📦 Express (Raw Node)
``` js
const express = require('express');
const app = express();

app.get('/hello', (req, res) => {
  res.send('Hello World');
});

app.listen(3000);
```
### 🧱 NestJS Equivalent
``` ts
@Controller()
export class AppController {
  @Get('hello')
  getHello(): string {
    return 'Hello World';
  }
}
```
---
## 🧩 NestJS Layered Architecture

You’ll almost always work with these pieces:

- **Controller**: Handles incoming requests and returns responses
- **Service**: Contains business logic, injected into controllers
- **Module**: Groups controllers and services into functional domains
- **Provider**: A class or value managed by Nest’s DI system
- **Guard**: Middleware-like, used for route protection (e.g. JWT check)

This clean layering promotes **SOLID principles**, especially _Single Responsibility_ and _Dependency Inversion_.

---

## 🧰 Under the Hood

- By default, Nest uses **Express.js** as its HTTP adapter
- You can swap it with **Fastify** by changing one line in `main.ts`
- Nest compiles to standard JS that runs on Node just like any Express app

---

## ✅ Why You Should Use Nest (Especially for This Project)

- Scales well as your app grows (you’ll have workouts, sets, users, auth, maybe history/logs)
- Built-in testing support (Jest + Supertest)
- Integrates easily with Prisma, JWT, bcrypt, etc.
- Type safety reduces runtime bugs