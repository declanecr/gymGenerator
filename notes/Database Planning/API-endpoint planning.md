#Database #backend 
[[HTTP Actions]]
[[Endpoint Syntax]]
[[Determining API Actions]]
[[DTO vs Module-Service-Controller]]
# / V1 planning (`/api/v1`)
---
## USER

| Resource | HTTP Verb | Endpoint         | Description       |
| -------- | --------- | ---------------- | ----------------- |
| User     | POST      | `/auth/register` | Register (signup) |
|          | POST      | `/auth/login`    | Login (issue JWT) |
|          | GET       | `/users/me`      | Get profile       |
|          | PATCH     | `/users/me`      | Update profile    |
|          | DELETE    | `/users/me`      | Delete profile    |

---
## EXERCISE CATALOG MODEL
### Exercise

| Resource | HTTP Verb | Endpoint                      | Description        |
| -------- | --------- | ----------------------------- | ------------------ |
| Exercise | GET       | `/exercises-catalog`          | List all (catalog) |
|          | GET       | `/exercises-catalog/:eid`     | Get one exercise   |
|          |           | `/exercises-catalog/search?=` |                    |

---

## TEMPLATES
| Resource         | HTTP Verb | Endpoint                                          | Description                                      |
| ---------------- | --------- | ------------------------------------------------- | ------------------------------------------------ |
| TemplateWorkout  | POST      | `/template-workouts`                              | Create a new workout template                    |
|                  | GET       | `/template-workouts`                              | List all templates for the current user          |
|                  | GET       | `/template-workouts/:id`                          | Fetch one template (with its exercises and sets) |
|                  | PATCH     | `/template-workouts/:id`                          | Update name/metadata                             |
|                  | DELETE    | `/template-workouts/:id`                          | Delete a template and its exercises              |
| TemplateExercise | POST      | `/template-workouts/:id/exercises`                | Add an exercise to a template                    |
|                  | PATCH     | `/template-workouts/:id/exercises/:eid`           | Update position                                  |
|                  | DELETE    | `/template-workouts/:id/exercises/:eid`           | Remove an exercise from a template               |
| Template Set     | POST      | `/template-workouts/:id/exercises/:eid/sets`      | Add a set to a exercise template                 |
|                  | PATCH     | `/template-workouts/:id/exercises/:eid/sets/:sid` | Update a sets info                               |
|                  | DELETE    | `/template-workouts/:id/exercises/:eid/sets/:sid` | delete a set                                     |



---
## LOG MODELS

| Resource        | HTTP Verb | Endpoint                                 | Description                         |
| --------------- | --------- | ---------------------------------------- | ----------------------------------- |
| Workout         | POST      | `/workouts`                              | Start/Create a new workout          |
|                 | GET       | `/workouts`                              | List past workouts                  |
|                 | GET       | `/workouts/:id`                          | Get one workout (details)           |
|                 | PATCH     | `/workouts/:id`                          | update data                         |
|                 | DELETE    | `/workouts/:id`                          | delete workout                      |
| WorkoutExercise | POST      | `/workouts/:id/exercises`                | Add exercise to in-progress workout |
|                 | PATCH     | `/workouts/:id/exercises`                | update exercise order               |
|                 | PATCH     | `/workouts/:id/exercises/:eid`           | add notes or other info             |
|                 | DELETE    | `/workouts/:id/exercises/:eid`           | remove exercise from workout        |
| WorkoutSet      | POST      | `/workouts/:id/exercises/:eid/sets`      | add a set to a workout-exercise     |
|                 | PATCH     | `/workouts/:id/exercises/:eid/sets/:sid` | update set info                     |
|                 | DELETE    | `/workouts/:id/exercises/:eid/sets/:sid` | remove a set                        |



---


