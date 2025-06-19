# GymGenerator Overview

This document summarizes how the current pieces of the monorepo fit together and what functionality already exists. Use it to quickly orient new contributors or AI assistants.

## Repo Structure

- **backend/** – NestJS API powered by Prisma and SQLite (Postgres planned for prod).
- **frontend/** – Vite + React client with Material UI.
- **notes/** – Reference docs and daily logs (this file lives here).

## Prisma Schema Highlights

The database models are defined in `backend/prisma/schema.prisma`. Key relations:

- `User` – owns `Workout` logs and `TemplateWorkout` plans. Can also create custom `Exercise` entries.
- `Exercise` – represents a movement. Can be global (`default = true`) or user-created. Referenced by both templates and actual workouts.
- `TemplateWorkout` → contains `TemplateExercise` → contains `TemplateSet`.
- `Workout` → contains `WorkoutExercise` → contains `WorkoutSet`.

This mirrors the idea of planning a workout template and then logging the performed workout with sets and reps.

## Backend Modules

Located under `backend/src/modules/v1/`:

- **auth** – `/auth/register` and `/auth/login` endpoints. JWT strategy implemented with Passport. Passwords hashed via bcrypt.
- **users** – `/users/me` for fetch/update/delete of the current user (requires JWT).
- **exercises-catalog** – CRUD for exercises; supports default (admin) and custom exercises. Guards enforce ownership.
- **template-workouts** – CRUD for workout templates, including nested exercises and sets.
- **workouts** – CRUD for actual workouts, including nested exercises and sets.

Shared decorators and guards live in `src/shared/` (e.g., `@GetUser`, `RolesGuard`). A global `PrismaService` provides database access.

## Frontend Features

The React app currently handles authentication:

- Pages: `Login`, `Register`, `Dashboard`.
- Forms built with React Hook Form + Zod for validation.
- `AuthContext` + `AuthProvider` store the JWT in `localStorage` and React state.
- `PrivateRoute` protects the dashboard route.
- Axios instance at `src/api/axios.ts` communicates with the backend.

At this stage the UI mainly demonstrates login/registration and token persistence. Future milestones include fetching user data and exposing workout features.

## Current Progress

- Backend auth flow fully working with manual tests (`backend/test-user-auth.http`).
- Exercise catalog, template workouts, and workout endpoints drafted with ownership checks.
- Frontend login and registration pages operational, storing the JWT and protecting routes.
- Daily notes under `notes/daily/` capture incremental goals and next steps.

Use this summary along with the existing notes for more context on where development stands today.