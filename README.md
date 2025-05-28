# 🏋️‍♂️ Gym Generator

A full-stack workout tracker and generator built with NestJS, React, Prisma, and SQLite/PostgreSQL. This base version of the app will allow users to create accounts, log workouts, and generate custom exercise routines based on their goals.

---

## 🚀 Tech Stack

### Backend

- **Node.js** with **NestJS** (modular backend framework)
- **Prisma** ORM
- **SQLite** for development DB
- **PostgreSQL** for production DB
- **JWT + bcrypt** for authentication

### Frontend (in progress)

- **React** with Context API (Zustand fallback)
- **Material UI** for styling
- **React Hook Form + Zod** for forms and validation
- **Axios + React Query** for data fetching

---

## ✅ Features (in progress)

- [x] NestJS backend scaffolding
- [x] Prisma setup with SQLite
- [ ] Initial User model defined and migrated
- [ ] Auth module with JWT + bcrypt
- [ ] User signup & login endpoints
- [ ] Workout and Exercise models
- [ ] Workout logging and generator logic
- [ ] Responsive frontend dashboard

---

## 🗂️ Project Structure

```bash
gymGenerator/
├── backend/              # NestJS backend
│   ├── prisma/           # Prisma schema & migrations
│   ├── src/
│   │   ├── modules/      # Feature modules (auth, users, workouts, etc.)
│   │   ├── prisma/       # PrismaService for DI
│   │   └── main.ts       # Application entry point
├── frontend/             # React frontend (planned)
├── .env                  # Environment variables
├── README.md
└── package.json
```
