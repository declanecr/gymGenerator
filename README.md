# GymGenerator

Simple setup instructions for the root of the GymGenerator monorepo. Follow these steps to get the backend up and running locally.

---

## 1. Prerequisites

- **Node.js** 20.x (LTS) and npm (or yarn) installed.
- **Git** for cloning the repository.
- (Optional) VS Code or your preferred editor.

> We’re using SQLite for development via Prisma. No external database setup is required for now; a `dev.db` file will be created automatically.

---

## 2. Clone the Repo

```bash
git clone https://github.com/declanecr/gymGenerator.git
cd gymGenerator
```

---

## 3. Backend Setup

1. `cd` into the backend folder:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a simple `.env` file at `backend/.env` with at least:

   ```
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="yourStrongSecretHere"
   ```

   > You can choose any string for `JWT_SECRET`. Make sure it’s at least 32 characters in production.

4. Generate and apply the initial Prisma migration (creates `dev.db` in backend/prisma):

   ```bash
   npx prisma migrate dev --name init
   ```

5. Generate Prisma Client:

   ```bash
   npx prisma generate
   ```

6. Start the NestJS backend in watch mode:

   ```bash
   npm run start:dev
   # or
   yarn start:dev
   ```

   - The server will run on `http://localhost:3000` by default.
   - You should see console output like `Nest application successfully started` if everything is configured correctly.

---

## 4. Verify the REST API

A sample VS Code REST Client script is provided at `backend/test-user-auth.http`. To test basic auth endpoints:

1. Open `test-user-auth.http` in VS Code.
2. Follow the comments to:

   - Register a new user (`POST /auth/register`)
   - Log in (`POST /auth/login`)
   - Copy the returned token into the `@token` variable
   - Fetch/update/delete your profile (`GET|PATCH|DELETE /users/me`)

This confirms that the SQLite database, Prisma schema, and JWT auth flow are working .

---

## 5. (Optional) Prisma Studio

If you want to peek at your local data:

```bash
npx prisma studio
```

Then open the URL shown in your browser to view and edit records.

---

---

## 6. Frontend Setup

> The React app lives in **`frontend/`** and talks to the backend at `http://localhost:3000/api/v1`.

### 6.1 Prerequisites

- Same **Node 20.x** install you used for the backend.
- Yarn or npm (examples use npm here).

### 6.2 Bootstrap the Vite + TypeScript project

```bash
# From the repo root
cd frontend
npm install
```

### 6.3 Install dependencies

```bash
npm install \
  @mui/material @emotion/react @emotion/styled \
  react-hook-form @hookform/resolvers zod \
  react-router-dom axios
```

_Optional extras you’ll likely add soon:_ React Query, React Testing Library, Jest, etc.

### 6.4 Create an Axios instance

Create `src/api/axios.ts`:

```ts
import axios from "axios";

export default axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000/api/v1",
  headers: { "Content-Type": "application/json" },
});
```

### 6.5 Environment file (front-end)

Add `.env` in `frontend/`:

```
VITE_API_URL=http://localhost:3000/api/v1
```

> Change this for staging/production builds.

### 6.6 Start the dev server

```bash
npm run dev
```

Open the printed URL (usually `http://localhost:5173`) — hot-reload is active.

### 6.7 Verify auth flow

1. Navigate to `/register`, create a user.
2. On success you should land on `/dashboard` and see the token box.
3. Refresh the page — the token persists thanks to `localStorage` hydration.
4. Click **Logout** — you’re redirected to `/login` and the token disappears from dev-tools → Application → Local Storage.

You now have a working full-stack auth MVP.

---

### Directory recap (root-level)

```
.
├─ backend/      ← NestJS + Prisma API
└─ frontend/     ← Vite + React + MUI client
```

### Run tests (monorepo)

```bash
npm test
```

This command runs Jest across both packages using the root configuration.

> **Tip:** keep backend and frontend dev servers running in two terminal tabs for a smooth workflow.

---

### Directory Recap (backend-only)

```

backend/
├─ prisma/
│ ├─ dev.db ← SQLite file (auto-generated)
│ ├─ migrations/ ← Prisma migration SQL files
│ └─ schema.prisma ← Prisma schema (User, Exercise, etc.)
├─ src/
│ ├─ modules/v1/
│ │ ├─ auth/ ← JWT + bcrypt auth flow
│ │ └─ users/ ← /users/me endpoints
│ ├─ shared/
│ │ ├─ decorators/ ← @GetUser() decorator
│ │ └─ guards/ ← JWT strategy (`jwt.strategy.ts`)
│ └─ main.ts ← NestJS bootstrap
├─ test-user-auth.http ← VS Code REST Client for manual testing
├─ package.json
└─ .env ← JWT_SECRET, etc.

```

That’s it! After these steps, your backend should be running locally, ready for manual testing or integration with a future React frontend.
