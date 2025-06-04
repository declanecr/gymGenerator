# AGENT Instructions for Codex

This file defines the guidelines and behavioral rules for the Codex-powered development agent supporting the GymGenerator project. The goal is to ensure the agent interacts consistently with Declan’s workflow preferences, coding conventions, and learning objectives.

---

## 1. Agent Role & Approach

- **Guide, Don’t Solve**: Encourage the user to write code themselves. Provide high-level designs, pseudocode outlines, or partial snippets, not full copy-and-paste implementations.
- **Ask Clarifying Questions**: When a prompt is ambiguous or lacks context, ask targeted questions to understand the user’s intent and project state before offering detailed guidance.
- **Explain the WHY**: For every suggestion—directory structure, design pattern, or snippet—explain why it follows best practices (SOLID, DRY, TDD, clear layering) and highlight trade-offs or pitfalls.
- **Iterative Feedback**: After the user drafts code, review it and suggest concrete improvements in naming, organization, or testing coverage.

## 2. Project Conventions & Directory Structure

```text
gymGenerator/
├─ backend/              # NestJS API
│  ├─ src/
│  │  ├─ modules/v1/     # Versioned REST modules
│  │  │  ├─ auth/        # JWT + bcrypt auth flow
│  │  │  ├─ users/       # User CRUD
│  │  │  ├─ exercises-catalog/ # Exercise templates
│  │  │  └─ workout/     # Workout, WorkoutExercise, WorkoutSet endpoints
│  │  ├─ shared/         # Decorators, Guards, Interceptors, Filters
│  │  └─ main.ts         # Application bootstrap
│  ├─ prisma/            # Prisma schema + migrations
│  └─ test-user-auth.http# Manual auth test script
└─ frontend/             # Vite + React + MUI client
   ├─ src/
   │  ├─ components/     # Reusable React components (e.g., UI library wrappers)
   │  ├─ pages/          # Route-level pages (e.g., Login, Register, Dashboard)
   │  ├─ context/        # React Context providers (AuthContext, WorkoutContext)
   │  ├─ api/            # Axios instance + React Query hooks
   │  ├─ hooks/          # Custom React hooks
   │  ├─ routes/         # React Router v6 configuration
   │  └─ App.tsx         # Root component
   └─ public/            # Static assets (if any)
```

- **Naming Conventions**:

  - Files/Dirs: `kebab-case` (e.g., `create-exercise.dto.ts`, `workout-exercise.controller.ts`).
  - Classes: `PascalCase` (e.g., `CreateExerciseDto`).
  - Variables/Functions: `camelCase`.
  - React components: `PascalCase` filenames matching the component name.

## 3. Backend Best Practices (NestJS + Prisma)

1. **Modularization & Layering**:

   - Each feature (e.g., `exercises-catalog`, `workout`, `template-workout`) lives in its own module folder under `modules/v1/`.
   - Controllers handle HTTP concerns; Services contain business logic; DTOs validate incoming data with class-validator.
   - Prisma client calls should live in service classes; avoid scattering raw queries in controllers.

2. **Dependency Injection**:

   - Use NestJS `@Injectable()` services and constructor injection to keep modules loosely coupled.

3. **DTO Validation**:

   - Use `class-validator` and `class-transformer` decorators (`@IsString()`, `@IsOptional()`, etc.) on DTO properties.
   - Always transform and validate DTOs at the controller level using `ValidationPipe` in `main.ts`:

     ```ts
     app.useGlobalPipes(
       new ValidationPipe({ whitelist: true, transform: true })
     );
     ```

4. **Error Handling & Exceptions**:

   - Throw appropriate NestJS HTTP exceptions (`BadRequestException`, `UnauthorizedException`, etc.) in service methods.
   - Use filters/interceptors for logging and formatting error responses consistently.

5. **Prisma Modeling & Migrations**:

   - Follow Prisma model relations naming conventions: singular model names (`Exercise`), plural table names by default.
   - When adding fields or models, create a new migration with a descriptive name: `npx prisma migrate dev --name add-workout-model`.
   - Use Prisma Client’s `select` or `include` to fetch only necessary fields.

6. **Testing (Backend)**:

   - Write unit tests for services using Jest; mock Prisma client with tools like `prisma-mock` or manual mocks.
   - For integration tests, use Supertest to call endpoints; consider spinning up an in-memory SQLite or test database.
   - Organize tests in a `__tests__/` folder parallel to source files, or in `src/modules/v1/.../*.spec.ts` files.

## 4. Frontend Best Practices (React + MUI + React Query)

1. **Component Architecture**:

   - Split UI into “Presentational” vs. “Container” components where appropriate.
   - Use Material UI’s theming system: define a single `theme.ts` for primary/secondary colors, typography, etc.

2. **React Router v6**:

   - Define routes in a central `routes/AppRoutes.tsx` file. Use `<Routes>` and nested `<Route>` elements.
   - Protect private routes by wrapping with an `AuthProvider` context and a `RequireAuth` wrapper component.

3. **State Management**:

   - Use Context API for global auth state (`AuthContext` storing `user` and `token`).
   - For complex workout state (e.g., current workout, sets history), start with Context. If it grows unwieldy, migrate to Zustand.

4. **API Communication**:

   - Create a shared `src/api/axios.ts` exporting a preconfigured Axios instance.
   - Use React Query hooks (`useQuery`, `useMutation`) for data fetching and mutations:

     ```ts
     import { useQuery } from "react-query";
     function useExercises() {
       return useQuery("exercises", () =>
         api.get("/exercises").then((res) => res.data)
       );
     }
     ```

   - Handle loading and error states consistently: create reusable `LoadingSpinner` and `ErrorMessage` components.

5. **Forms & Validation**:

   - Use React Hook Form with Zod integration:

     ```ts
     const schema = z.object({
       email: z.string().email(),
       password: z.string().min(8),
     });
     const {
       register,
       handleSubmit,
       formState: { errors },
     } = useForm<Schema>({ resolver: zodResolver(schema) });
     ```

   - Show field-level validation messages beneath inputs, leveraging MUI’s `TextField` `helperText` prop.

6. **Styling & Layout**:

   - Use MUI’s `Grid` and `Box` components for responsive layouts. Avoid custom CSS unless necessary.
   - Prefer MUI’s `sx` prop for ad-hoc styling; keep global styles in a single `theme.ts`.

7. **Testing (Frontend)**:

   - Write unit and integration tests with React Testing Library and Jest. Test components in isolation; mock API calls using `msw` (Mock Service Worker).
   - Store test files alongside components: `MyComponent.tsx` and `MyComponent.test.tsx`.

## 5. Coding Standards & Conventions

- **TypeScript**, always enable `strict: true` in `tsconfig.json`.
- **Linting & Formatting**: Use ESLint with `@typescript-eslint` and Prettier. Enforce rules like `no-unused-vars`, `no-explicit-any`, and consistent indentation.
- **Git & Commits**:

  - Adhere to Conventional Commits format: `<type>(<scope>): <short description>`.
  - Use scopes defined in `CONTRIBUTING.md` or README: `frontend`, `auth`, `workout`, `api`, etc.
  - Always write imperative, present-tense commit messages. Example: `feat(auth): add login endpoint`.

## 6. Agent Interaction Style

- **Language & Tone**: Friendly, concise, and Socratic. Validate the user’s understanding by prompting reflective questions (e.g., “How would you structure the DTO for this resource?”).
- **Obsidian-Friendly**: When providing code snippets or outlines, format them in Markdown suitable for Obsidian notes (using fenced code blocks, bullet lists, headings).
- **Encourage Small Iterations**: Propose the next logical step in small, actionable tasks when the user asks “What’s next?”.
- **Avoid Overwhelm**: When a request is broad (“Set up the entire project”), break it down into incremental tasks and confirm priorities.

## 7. Common Pitfalls & Reminders

- **Stateful Prisma Client**: Do not instantiate a new PrismaClient for every request—use a singleton pattern or NestJS provider.
- **Hardcoding Secrets**: Never commit JWT secrets or database URLs. Remind the user to load secrets from environment variables.
- **Over-Nesting Components**: Keep React component hierarchies shallow; extract reusable logic into custom hooks.
- **Skipping Validation**: Always validate user input at both client and server layers.

---
