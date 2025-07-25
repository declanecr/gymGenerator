### Backend unit tests

- **AppController** – `backend/src/app.controller.spec.ts`
    
    - `should return "Hello World!"`

- **PrismaService** – `backend/src/prisma/prisma.service.spec.ts`
    
    - `should be defined`

- **Hello spec** – `backend/src/hello.spec.ts`
    
    - `should run TypeScript`

### Backend end‑to‑end tests

- **AppController (e2e)** – `backend/test/app.e2e-spec.ts`
    
    - `GET /hello`

- **ExercisesCatalog (e2e)** – `backend/test/exercises-catalog.e2e-spec.ts`
    
    - `GET /exercises-catalog?custom=false should return only the default exercise`
        
    - `GET /exercises-catalog?custom=true should return only the default exercise and the seeded custom exercise`
        
    - `POST /exercises-catalog/custom should create a new custom exercise`
        
    - `POST /exercises-catalog/custom with a duplicate default name should return 409`
        
    - `PATCH /exercises-catalog/custom/id should update custom fields`
        
    - `PATCH /…/:id renaming to a default name should return 409`
        
    - `DELETE /exercises-catalog/custom/:id should remove that exercise`

- **Catalog search and admin features (e2e)** – `backend/test/exercises-catalog-admin-search.e2e-spec.ts`
    
    - `GET /api/v1/exercises-catalog/search?term=bench USER searching "bench" returns default and user custom exercises`
        
    - `GET /api/v1/exercises-catalog/search?term= ADMIN search includes exercises from all users`
        
    - `GET /api/v1/exercises-catalog/search regular user search excludes others custom exercises`
        
    - `POST /api/v1/exercises-catalog/default non-admin cannot create default exercise`
        
    - `POST /api/v1/exercises-catalog/default admin can create default exercise`

- **TemplateWorkouts (e2e)** – `backend/test/template-workouts.e2e-spec.ts`
    
    - `POST /template-workouts should create a new template`
        
    - `GET /template-workouts should list templates`
        
    - `POST /template-workouts/:id/exercises adds an exercise`
        
    - `POST /template-workouts/:id/exercises/:eid/sets adds a set`
        
    - `PATCH /template-workouts/:id/exercises/:eid/sets/:sid updates the set`
        
    - `DELETE /template-workouts/:id/exercises/:eid/sets/:sid removes the set`
        
    - `DELETE /template-workouts/:id/exercises/:eid removes the exercise`
        
    - `DELETE /template-workouts/:id removes the template`

- **Workouts (e2e)** – `backend/test/workouts.e2e-spec.ts`
    
    - `POST /workouts creates a workout`
        
    - `GET /workouts lists user workouts`
        
    - `POST /workouts/:id/exercises adds exercise`
        
    - `POST /workouts/from-template/:id copies template`
        
    - `PATCH /workouts/:id/exercises/:eid updates exercise`
        
    - `GET /workouts/:id/exercises fetches exercises`
        
    - `POST /workouts/:id/exercises/:eid/sets adds set`
        
    - `PATCH /workouts/:id/exercises/:eid/sets/:sid updates set`
        
    - `GET /workouts/:id returns the created workout`
        
    - `PATCH /workouts/:id updates the workout (no changes)`
        
    - `PATCH /workouts/:id/exercises/:eid updates exercise position`
        
    - `DELETE /workouts/:id/exercises/:eid/sets/:sid removes set`
        
    - `DELETE /workouts/:id/exercises/:eid removes exercise`
        
    - `DELETE /workouts/:id removes workout`
        
    - `DELETE copied workout`
        
    - `GET /workouts returns empty array after deletion`