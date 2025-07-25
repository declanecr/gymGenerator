**Prisma schema**

The backend uses a Prisma schema defined in `backend/prisma/schema.prisma`.  
A `Role` enum defines user roles (`USER` and `ADMIN`) and is referenced within the `User` model

.  
Key models include:

- `User` with one-to-many relations to `Workout`, `TemplateWorkout`, and `Exercise`
    

- Template-related models: `TemplateWorkout`, `TemplateExercise`, and `TemplateSet`. These handle planned workouts and planned exercise sets
    
- Exercise catalog model `Exercise` storing default or user-created exercises with a uniqueness constraint on `(name, userId)`
    
- Workout log models: `Workout`, `WorkoutExercise`, and `WorkoutSet` representing performed workouts and actual sets
    

Each relation uses Prisma’s referential actions (e.g., `onDelete: Cascade`) to maintain integrity.

**Prisma service**

`PrismaService` is a Nest provider extending `PrismaClient`. It connects in `onModuleInit` so the client is available across the app

.  
`PrismaModule` marks this provider as a global module so other modules inject it without needing to import it repeatedly

.

**Services using Prisma**

Several services interact with Prisma directly through `PrismaService`:

_Authentication_

- `AuthService.login` loads users via `UsersService.findByEmail` (indirect Prisma call) to validate credentials
    

- `AuthService.create` persists a new user with `this.prisma.user.create` and handles unique email errors
    

_Users_

- `UsersService` performs CRUD operations on `user` records using `update`, `delete`, `findUnique` methods
    

_Exercises catalog_

- Methods such as `isNameTakenByDefault`, `getVisibleExercises`, `createCustomExercise`, `getById`, `updateCustomExercise`, `deleteCustomExercise`, `searchExercises`, and `createDefaultExercise` query or modify the `exercise` table using Prisma calls like `findFirst`, `findMany`, `create`, `findUnique`, `update`, and `delete`
    

_Template workouts_

- Creating/updating/deleting template workouts and their nested exercises/sets relies on Prisma methods (`templateWorkout.create`, `findMany`, `findUnique`, `update`, `delete`, etc.) as shown throughout `TemplateWorkoutsService`
    

_Workouts_

- `WorkoutsService` manages actual workout records using Prisma methods such as `workout.create`, `findMany`, `findUnique`, `update`, `delete`, plus nested operations on `workoutExercise` and `workoutSet` models
    

_JWT strategy_

- `JwtStrategy.validate` fetches a user via `this.prisma.user.findUnique` when validating tokens
    

**Seeding scripts**

Development seeding uses direct Prisma calls (`prisma.user.upsert`, `prisma.exercise.create`, etc.) to populate sample data

. A test seed script instantiates `PrismaClient` but performs no inserts by default

.

**Tests**

E2E tests also access Prisma via `PrismaService` to prepare or clean up database state. For example, `workouts-admin.e2e-spec.ts` obtains `PrismaService` from the testing module and uses it to seed users and workouts before assertions

**Summary**

The schema defines users, workouts, template workouts, exercises, and related set/exercise entities with cascaded relationships. All data access flows through a shared `PrismaService`, injected into services such as `AuthService`, `UsersService`, `ExercisesCatalogService`, `TemplateWorkoutsService`, `WorkoutsService`, and `JwtStrategy`. Development and test utilities also rely on Prisma for seeding and setup. Methods across these services handle CRUD operations, validation, and complex inserts (e.g., copying workouts from templates) by invoking Prisma client methods as shown in the cited lines.

---
