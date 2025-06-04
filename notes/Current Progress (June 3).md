# GymGenerator Project Context — Full‑Stack Auth MVP _(June 3 2025)_

> **Goal of this file:** Give any new collaborator (or future‑you) a **one‑screen deep dive** into exactly what works, why it works, and which directions are top priorities. This version expands previous notes ~50 % for richer context.

---

## ✅ Backend snapshot

|Layer / Concern|Current Status|Notes|
|---|---|---|
|**Framework & Runtime**|**NestJS** on Node 20.x|Modular architecture under `src/modules/v1` keeps versioning clean.|
|**Database**|**SQLite** (dev) via **Prisma** → PostgreSQL (prod roadmap)|Prisma migrations already set up; just swap the datasource + run `npx prisma migrate deploy` in prod.|
|**Authentication**|JWT (`@nestjs/jwt`) + **Passport** strategy|Payload: `{ sub:id, email }` → validated to `{ id, email }`. Passwords hashed with **bcrypt** (12 rounds).|
|**Key modules**|`auth/`, `users/`|Built with providers, controllers, DTOs. Follows NestJS CQRS‑lite pattern.|
|**Implemented REST endpoints**|**POST** `/auth/register` → returns `{ accessToken }`||
|**POST** `/auth/login` → returns `{ accessToken }`|||
|**GET** `/users/me` (guarded)|||
|**PATCH** `/users/me` (guarded)|||
|**DELETE** `/users/me` (guarded)|Routes versioned under `/api/v1`. All protected routes use `JwtAuthGuard`.||
|**Prisma models**|`User` finished; **template/workout** models drafted|Relationships are sketched but not yet exposed via API.|
|**Manual tests**|`test-user-auth.http` (VS Code REST Client)|Lets you demo full auth cycle in <30 s.|

### Backend flow diagram (text)

```
Client → POST /auth/register ─▶ AuthService.create() ─▶ Prisma.user.create()
         └───────────────────────────────────────▶ AuthService.login() ─▶ JWT.sign()
```

---

## ✅ Frontend snapshot _(Vite + React TS)_

```
src/
  api/            axios.ts · auth.ts (loginUser, registerUser)
  components/
    auth/         LoginForm.tsx · RegisterForm.tsx
  pages/          Login.tsx · Register.tsx · Dashboard.tsx
  context/        AuthContext.ts · AuthProvider.tsx
  hooks/          useAuth.ts
  routes/         AppRoutes.tsx · PrivateRoute.tsx
```

|Tool / Lib|Purpose|Extra Insight|
|---|---|---|
|**React Hook Form + Zod**|Declarative form handling & schema validation|Minimal re‑renders; shared Zod types = type‑safety end‑to‑end.|
|**Material UI v5**|Component / theme layer|Using default theme; can switch to dark mode with `<CssBaseline/>` + theme provider.|
|**Axios custom instance**|Central HTTP wrapper|`baseURL = http://localhost:3000/api/v1`; interceptors can inject token automatically later.|
|**AuthContext**|Stores JWT in **localStorage** + React state|Hydrates on app load; exposes `login`, `logout`, `isAuthenticated`.|
|**PrivateRoute**|Guards pages|Redirects to `/login` when not authed; uses `Navigate` replace to block "Back" loophole.|

### End‑to‑end user flow

1. **Un‑authed user** hits `/login` or `/register`. If already authed, `<Navigate/>` pushes them to `/dashboard` to avoid redundancy.
    
2. **Forms** built with RHF + Zod validate input → `auth.ts` Axios layer submits to backend.
    
3. **Backend** returns `{ accessToken }` → `AuthProvider.login()` writes token to `localStorage` _and_ state.
    
4. React Router redirects via `navigate('/dashboard')`.
    
5. **Dashboard** is behind `<PrivateRoute>` so refreshing keeps them in; hydration re‑loads token and keeps state.
    
6. **Logout** clears storage/state and routes back to `/login` for a clean slate.
    

---

## ✔️ Behaviour verified (manual QA)

- **Register** endpoint: creates user then immediately logs in (token received).
    
- **Login**: works with pre‑seeded & freshly registered users.
    
- **Token persistence**: refresh browser → remains on dashboard.
    
- **Visual**: token box now dark‑mode safe (`bg #f5f5f5`, `color='text.primary'`).
    

---

## 📌 Next candidate milestones (prioritised)

1. **Profile fetch & greeting**  
    Call `GET /users/me` on dashboard mount → display name/email.
    
2. **PublicRoute helper**  
    Block authed users from accessing `/login` & `/register`.
    
3. **Global Axios interceptors**  
    Attach `Authorization: Bearer <token>` automatically; centralised error toast.
    
4. **Workout domain**  
    Flesh out Prisma models (TemplateWorkout, Workout, Exercise, Set) + CRUD endpoints.
    
5. **Testing pipeline**
    
    - Backend: Jest + Supertest HTTP e2e
        
    - Frontend: React Testing Library + Jest for component & hook coverage.
        
6. **CI/CD draft**  
    GitHub Actions workflow: lint → test → build → deploy preview.
    

---

### Conventional commit just applied

```text
feat(auth): implement full login/register UI with protected dashboard

- Built forms with RHF + Zod
- Added Axios instance (api/v1 base‑URL)
- Introduced AuthContext for hybrid storage
- Added PrivateRoute guard for /dashboard

Closes #15
```

---

> **Dev‑tip**: Backend runs on `, frontend on` . Update `.env` values before containerising.
> 