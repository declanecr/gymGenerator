
## Overview

GymGenerator is a full-stack TypeScript monorepo for a workout tracking and generator application. The project combines a NestJS API with a React client. This file summarizes important conventions, architecture, and workflow tips so ChatGPT can provide tailored answers when assisting with this codebase.

## Repository Layout

```
.
├─ backend/      # NestJS  Prisma API
└─ frontend/     # Vite  React  MUI client
```

- Root `package.json` runs Jest across both packages (`npm test`).
- Each package manages its own dependencies and scripts.
- Extensive notes live under the `notes/` directory.

## Backend Highlights

- **Framework**: NestJS with TypeScript.
- **ORM**: Prisma (SQLite for dev, PostgreSQL planned for prod).
- **Authentication**: JWT  bcrypt, implemented in `modules/v1/auth`.
- **REST Modules** (`backend/src/modules/v1/`):
  - `auth` – login and registration endpoints.
  - `users` – user profile CRUD via `/users/me` routes.
  - `exercises-catalog` – templates for exercises.
  - `workouts` and `template-workouts` – workout logging and templates.
- **Shared Utilities**: decorators and guards live under `src/shared`.
- **Validation**: DTO classes decorated with `class-validator`. Global `ValidationPipe` configured in `main.ts`.
- **Testing**: Jest for unit tests (`*.spec.ts`); Supertest for integration tests.

## Frontend Highlights

- **Framework**: React (Vite  TypeScript) with Material UI.
- **Routing**: React Router v6. Routes defined in `src/routes/AppRoutes.tsx` using a `PrivateRoute` wrapper to protect authenticated pages.
- **State**: Context API handles auth state. React Query manages server state for workouts and exercises.
- **Forms**: React Hook Form with Zod schemas under `src/schemas/`.
- **API Calls**: Axios instance created in `src/api/axios.ts`. Hooks for queries/mutations live in `src/api`.
- **Testing**: React Testing Library  Jest; mocks configured in `src/mocks`.

## Coding Conventions

### Naming

- **Files & Folders**: `kebab-case` (`create-exercise.dto.ts`).
- **Classes/Components**: `PascalCase`.
- **Variables & Functions**: `camelCase`.
- React component file name should match the component (`Dashboard.tsx`).

### Commits

- Use Conventional Commits format: `<type>(<scope>): <description>`.
- Example scopes: `frontend`, `auth`, `workout`, `api`.
- Messages are short, imperative, and present tense: `feat(auth): add login endpoint`.

### Linting & Tests

- ESLint with `@typescript-eslint` ensures style and type safety. Prettier formats code.
- Always run `npm test` before pushing. Backend and frontend share the Jest config.
- Avoid committing failing tests or unused code.

## Environment & Secrets

- Development uses SQLite (`backend/prisma/dev.db`). Production will use PostgreSQL.
- Store sensitive values like `JWT_SECRET` in environment variables (`backend/.env`).
- Do not commit `.env` files or other secrets to version control.

## Typical Workflow

1. **Install dependencies**
   ```bash
   npm install            # root
   cd backend && npm install
   cd ../frontend && npm install
   ```
2. **Run database migrations**
   ```bash
   cd backend
   npx prisma migrate dev --name init
   npx prisma generate
   ```
3. **Start development servers**
   ```bash
   # Terminal 1
   cd backend && npm run start:dev
   # Terminal 2
   cd frontend && npm run dev
   ```
4. **Run tests**
   ```bash
   npm test
   ```

## Architectural Notes

- The application follows a modular design. Each feature lives in its own folder under `backend/src/modules/v1/`. Controllers handle HTTP concerns, services encapsulate business logic, and Prisma client calls are centralized in services.
- Frontend logic is organized by domain as well: React components under `src/components/`, pages under `src/pages/`, and hooks under `src/hooks/`.
- Global styles and theming are centralized (`frontend/src/theme.ts`).
- The project aims for SOLID principles and minimal coupling between modules.

## Additional Resources

- `notes/architecture.md` provides a high-level diagram of how React, NestJS, Prisma, and the database interact.
- `notes/TECH_STACK.md` explains why each technology was chosen and highlights authentication, testing, and state management tools.
- `backend/test-user-auth.http` can be used with VS Code’s REST Client extension to manually exercise auth endpoints.

## Reminders for ChatGPT Assistance

- Offer guidance in small, focused steps. Avoid providing entire implementations when a high-level overview or pseudocode suffices.
- Reinforce best practices around validation, error handling, and dependency injection when discussing backend code.
- Encourage testing strategies (Jest, React Testing Library, Supertest) when the user adds new features.
- Always highlight security considerations, such as protecting secrets and validating inputs.