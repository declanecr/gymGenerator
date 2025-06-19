# Architecture Overview

This document outlines the structure and interactions of the Gym Workout Tracker & Generator application.

---

## 🌐 High-Level Architecture

[ React Frontend ] <---> [ NestJS API ] <---> [ Prisma ORM ] <---> [ SQL Database ]

---

## 🧱 Layer Breakdown

### 1. Frontend (ReactJS)

- Component-based UI built with Material UI
- Forms handled via React Hook Form + Zod for validation
- API requests made with Axios
- Server state (workouts, recommendations) managed by React Query
- Global auth state managed with Context API (or Zustand as fallback)

### 2. Backend (NestJS)

- Modular controller/service structure
- RESTful API endpoints exposed to frontend
- Authentication system using JWT and bcrypt
- Middleware handles auth, logging, error handling
- Prisma client acts as the data access layer

### 3. Database

- SQLite used for development (local, fast, file-based)
- PostgreSQL targeted for production (scalable, ACID-compliant)
- Data models managed with Prisma schema and migrations

---

## 🧠 Data Flow (Simplified)

1. User logs in → receives JWT
2. JWT is stored in localStorage or HttpOnly cookie
3. React app uses Axios with token in Authorization header
4. Backend verifies token, performs requested DB operation via Prisma
5. Response returned to frontend
6. React Query caches and syncs results

---

## 📈 Domain Model Overview

- **User**
  - id, name, email, hashedPassword
- **Workout**
  - id, userId, date, type (e.g. push/pull/legs), notes
- **Exercise**
  - id, name, muscleGroup
- **Set**
  - id, workoutId, exerciseId, reps, weight, RPE, rest
- **Recommendation**
  - id, userId, exerciseId, suggestedReps, weight, date

---

## 🧪 Testing Strategy

- **Unit tests** for backend services and frontend utility functions
- **Integration tests** for API endpoints (Supertest)
- **Component tests** for form components and workout log views
- **E2E tests** planned post-MVP

---

## 🚀 Deployment Plan (Post-MVP)

- Dockerize backend and database
- Deploy backend on Render or Railway
- Host frontend with Vite + Netlify or Vercel
- Use PostgreSQL managed instance in production
