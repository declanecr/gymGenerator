# Tech Stack

This project is a Gym Workout Tracker & Generator built with a modern full-stack TypeScript environment, chosen for developer experience, scalability, and strong ecosystem support.

## 📦 Backend

### Node.js

**Why:** Node.js is a fast, non-blocking JavaScript runtime. It enables full-stack development using a single language (TypeScript), allowing for better developer efficiency.

### NestJS

**Why:** NestJS provides a scalable and maintainable architecture using decorators, dependency injection, and modular structure. It's built on top of Express and is ideal for complex applications.

### Prisma (ORM)

**Why:** Prisma offers a type-safe, declarative ORM with auto-generated queries and migrations. It integrates seamlessly with PostgreSQL and SQLite, and supports TypeScript out of the box.

### SQLite (Dev) / PostgreSQL (Prod)

**Why:**

- **SQLite** is simple and file-based — perfect for local development and prototyping.
- **PostgreSQL** is robust and production-ready with strong support for relational integrity, performance, and scalability.

---

## 🧠 Authentication

### JWT + bcrypt

**Why:** JWT provides stateless, scalable authentication. `bcrypt` is a widely trusted hashing algorithm for storing passwords securely.

---

## 🎨 Frontend

### ReactJS

**Why:** React provides a performant, component-based architecture, strong ecosystem, and good developer tooling for building responsive, interactive UIs.

### Material UI (MUI)

**Why:** MUI offers a comprehensive set of accessible and customizable UI components that speed up development and maintain design consistency.

### React Hook Form + Zod

**Why:**

- **React Hook Form**: Efficient and minimal boilerplate for form management.
- **Zod**: Type-safe schema validation, easily integrated with React Hook Form and TypeScript.

### Axios + React Query

**Why:**

- **Axios** is a widely-used, promise-based HTTP client for communicating with the backend.
- **React Query** handles caching, background updates, and syncing with the server for a smooth user experience.

---

## ⚙️ State Management

### Context API (fallback: Zustand)

**Why:**

- **Context API** is built-in and sufficient for basic global state like user auth or workout context.
- **Zustand** is a simple, scalable alternative when state grows more complex.

---

## 🧪 Testing

### Backend: Jest + Supertest

**Why:** Jest provides a robust testing framework for unit and integration testing. Supertest is ideal for HTTP endpoint testing in Node/NestJS apps.

### Frontend: React Testing Library + Jest

**Why:** RTL focuses on user-centric testing of UI behavior, and Jest handles the test runner/assertions.

---
