# GymGenerator Project Context — Backend MVP (May 30 2025)

**Tech stack (implemented so far)**

- **Backend:** NestJS (Node .js 20 .x)
    
- **Database:** SQLite for dev via **Prisma** ORM (PostgreSQL planned for prod)
    
- **Auth:** JWT with `@nestjs/jwt`, `passport-jwt`, passwords hashed with **bcrypt** (12 salt rounds)
    
- **Testing tool:** VS Code REST Client (`test-user-auth.http`)
    

---

### Current backend modules & shared utilities

```
backend/src/
  modules/v1/
    auth/
      auth.module.ts
      auth.controller.ts  // POST /auth/register, POST /auth/login
      auth.service.ts
    users/
      dto/
        create-user.dto.ts
        login-user.dto.ts
        update-user.dto.ts
        users-response.dto.ts
      users.module.ts
      users.controller.ts   // GET|PATCH|DELETE /users/me
      users.service.ts
  shared/
    decorators/get-user.decorator.ts   // extracts user object from JWT
    guards/jwt.strategy.ts             // Passport JWT strategy (payload { id, email })
```

---

### Implemented REST endpoints

|Method|Path|Auth?|Purpose|
|---|---|---|---|
|POST|`/auth/register`|public|Create new user ➜ **CreateUserDto**|
|POST|`/auth/login`|public|Validate credentials, returns `{ accessToken }`|
|GET|`/users/me`|Bearer JWT|Fetch current user ➜ **UserResponseDto**|
|PATCH|`/users/me`|Bearer JWT|Update current user (currently only `name`) ➜ **UpdateUserDto**|
|DELETE|`/users/me`|Bearer JWT|Hard‑delete current user|

> **JWT payload** generated on login: `{ sub: user.id, email }` → `jwt.strategy.validate()` maps to `{ id, email }`, so `@GetUser()` returns `{ id, email }`.

---

### DTO summaries

```ts
// CreateUserDto
{ email: string; password: string; name?: string }

// LoginUserDto
{ email: string; password: string }

// UpdateUserDto
{ name?: string }

// UserResponseDto (outgoing)
{ id: number; email: string; name?: string | null; createdAt: Date }
```

---

### Prisma — key model implemented

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  // relations omitted for brevity
}
```

_Additional models defined but **not yet exposed** via API:_ `TemplateWorkout`, `TemplateExercise`, `TemplateSet`, `Exercise`, `Workout`, `WorkoutExercise`, `WorkoutSet`.

---

### Manual test script (VS Code REST Client)

File: **test-user-auth.http**

```
### Register
POST http://localhost:3000/auth/register
Content-Type: application/json

{ "email": "test@example.com", "password": "SuperSecure123", "name": "Tester" }

### Login
POST http://localhost:3000/auth/login
Content-Type: application/json

{ "email": "test@example.com", "password": "SuperSecure123" }

@token = <insert‑accessToken‑here>

### Get profile
GET http://localhost:3000/users/me
Authorization: Bearer {{token}}

### Update profile
PATCH http://localhost:3000/users/me
Authorization: Bearer {{token}}
Content-Type: application/json

{ "name": "Updated Name" }

### Delete profile
DELETE http://localhost:3000/users/me
Authorization: Bearer {{token}}
```

---

## Next planned step (frontend)

1. **Bootstrap React app** (Vite + TypeScript).
    
2. **Material UI v5** for component library.
    
3. Pages/components:
    
    - **Login** (form ➜ POST `/auth/login`)
        
    - **Register** (form ➜ POST `/auth/register`)
        
4. **Axios** for HTTP; store JWT in `localStorage` and expose via React Context (or Zustand later).
    
5. **React Router v6** for navigation.


