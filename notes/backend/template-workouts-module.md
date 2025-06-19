# Template Workouts Module Overview

This note explains how the newly introduced template workout features fit together across the backend codebase.

## Prisma schema

- `TemplateWorkout` includes an optional `notes` column added via the `20250606003405_add_template_notes` migration.
- `TemplateExercise` belongs to a `TemplateWorkout` and has many `TemplateSet` entries.
- `TemplateSet` references its parent `TemplateExercise` so sets can be organized per exercise.

## NestJS module

- `TemplateWorkoutsModule` registers a controller and service using `PrismaModule` for database access.
- `TemplateWorkoutsController` exposes CRUD endpoints for templates, exercises, and sets under `/api/v1/template-workouts`.
- `TemplateWorkoutsService` handles authorization checks and Prisma calls for each operation.
- DTO classes (`create-template-workout.dto.ts`, `update-template-exercise.dto.ts`, etc.) ensure request payloads are validated.

## Response DTO

- `TemplateWorkoutResponseDto` constructs a structured object containing a workout template along with its exercises and sets.
- Interfaces `TemplateExerciseWithSets` and `TemplateWorkoutWithExtras` avoid `any` types when mapping Prisma results.

## End-to-end tests

- `test/template-workouts.e2e-spec.ts` spins up the Nest app and registers a test user.
- The suite covers creating a template, adding exercises and sets, updating them, and finally deleting everything.
- Jest runs with a single worker so database state is predictable.

## Using the feature

1. Run Prisma migrations to add the new column: `npx prisma migrate dev`.
2. Start the backend with `npm run start:dev`.
3. Call the `/api/v1/template-workouts` routes to manage workout templates.
4. Execute `npm run test:e2e` to verify the workflow end-to-end.
