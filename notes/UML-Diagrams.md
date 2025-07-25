# Architecture Component Diagram
``` plantuml
@startuml
component "React Frontend" as FE
component "NestJS Backend" as BE
component "Prisma ORM" as Prisma
database "SQL Database" as DB

FE --> BE : HTTP/REST requests
BE --> Prisma : Prisma Client calls
Prisma --> DB : SQL queries
@enduml

```

---

# Backend Package/Module Diagram


```plantuml
@startuml
' === NestJS Module Dependencies (simplified) ===
!define NestModule(x) package x <<Module>>
skinparam packageStyle rect

' Core modules
NestModule(AuthModule)
NestModule(UsersModule)
NestModule(ExercisesCatalogModule)
NestModule(TemplateWorkoutsModule)
NestModule(WorkoutsModule)

' Shared providers
together {
	NestModule(PrismaModule)
	component JwtStrategy
	component RolesGuard
}

' Relationships
AuthModule --> UsersModule
AuthModule --> JwtStrategy

UsersModule --> PrismaModule
ExercisesCatalogModule --> PrismaModule
TemplateWorkoutsModule --> PrismaModule
WorkoutsModule --> PrismaModule
JwtStrategy --> PrismaModule

ExercisesCatalogModule ..> RolesGuard
TemplateWorkoutsModule ..> RolesGuard
WorkoutsModule ..> RolesGuard

' AppModule orchestrates everything
package AppModule {
    AppModule --> AuthModule
    AppModule --> UsersModule
    AppModule --> ExercisesCatalogModule
    AppModule --> TemplateWorkoutsModule
    AppModule --> WorkoutsModule
    AppModule --> PrismaModule
}
note left of AppModule :  AppModule orchestrates everything

@enduml

```


---

# Persistance Layer Class Diagram




``` mermaid
classDiagram
    class User {
        +Int id
        +String email
        +Role role
        ---
        workouts: Workout[]
        templateWorkouts: TemplateWorkout[]
        Exercise: Exercise[]
    }

    class TemplateWorkout {
        +String id
        +String name
        ---
        workouts: Workout[]
        templateExercises: TemplateExercise[]
        userId: Int?
    }

    class TemplateExercise {
        +String id
        +Int position
        ---
        workoutTemplateId: String
        exerciseId: Int
        workoutExercises: WorkoutExercise[]
        sets: TemplateSet[]
    }

    class TemplateSet {
        +String id
        +Int position
        reps
        weight
        ---
        templateExerciseId: String
    }

    class Exercise {
        +Int id
        +String name
        +Int? userId
        ---
        templateExercises: TemplateExercise[]
        workoutExercises: WorkoutExercise[]
    }

    class Workout {
        +String id
        +String name
        +Int userId
        ---
        workoutTemplateId: String?
        workoutExercises: WorkoutExercise[]
    }

    class WorkoutExercise {
        +String id
        +Int position
        ---
        workoutId: String
        exerciseId: Int
        templateExerciseId: String?
        workoutSets: WorkoutSet[]
    }

    class WorkoutSet {
        +String id
        +Int position
        reps
        weight
        ---
        workoutExerciseId: String
    }

    %% Relations
    User "1" --> "many" Workout : performs
    User "1" --> "many" TemplateWorkout : owns
    User "1" --> "many" Exercise : owns
    TemplateWorkout "1" --> "many" Workout : followed by
    TemplateWorkout "1" --> "many" TemplateExercise : contains
    TemplateExercise "1" --> "many" TemplateSet : has
    TemplateExercise "1" --> "many" WorkoutExercise : compared by
    Exercise "1" --> "many" TemplateExercise : basis for
    Exercise "1" --> "many" WorkoutExercise : used in
    Workout "1" --> "many" WorkoutExercise : includes
    WorkoutExercise "1" --> "many" WorkoutSet : sets

```
---





# Core Backend Services Class Diagram
```plantuml
@startuml
class AuthService {
  +login(dto: LoginUserDto)
  +create(dto: CreateUserDto)
}

class UsersService {
  +update(userId, dto)
  +delete(userId)
  +findByEmail(email)
  +findById(id)
}

class ExercisesCatalogService {
  +getVisibleExercises(user, showCustom)
  +createCustomExercise(userId, dto)
  +getById(id, user)
  +updateCustomExercise(id, dto, userId)
  +deleteCustomExercise(id, userId)
  +searchExercises(term, user)
  +createDefaultExercise(dto)
}

class WorkoutsService {
  +create(userId, dto)
  +copyFromTemplate(templateId, userId)
  +findAll(userId)
  +findAllAdmin()
  +findOne(id, userId)
  +update(id, dto, userId)
  +remove(id, userId)
  +addExercise(workoutId, userId, dto)
  +getExercises(workoutId, userId)
  +updateExercise(workoutId, exerciseId, userId, dto)
  +removeExercise(workoutId, exerciseId, userId)
  +addSet(exerciseId, userId, dto)
  +getSets(workoutExerciseId, workoutId, userId)
  +updateSet(setId, userId, dto)
  +removeSet(setId, userId)
}

class TemplateWorkoutsService {
  +create(userId, dto)
  +createGlobal(dto)
  +findAll(userId)
  +findOne(id, userId, role?)
  +update(id, userId, dto, role?)
  +remove(id, userId, role?)
  +getExercises(templateId, userId, role?)
  +addExercise(templateId, userId, dto, role?)
  +updateExercise(id, exerciseId, userId, dto, role?)
  +removeExercise(id, exerciseId, userId, role?)
  +getSets(exerciseId, templateId, userId, role?)
  +addSet(exerciseId, userId, dto, role?)
  +updateSet(setId, userId, dto, role?)
  +removeSet(setId, userId, role?)
}

class AccessToken <<DTO>> {
  + token: String
  + expiresIn: Int
}

class JWTService {
  + sign(id, email): AccessToken
}

JWTService --> AccessToken : returns
JWTService <-- AuthService
PrismaService <|-- UsersService
PrismaService <|-- AuthService
PrismaService <|-- ExercisesCatalogService
PrismaService <|-- WorkoutsService
PrismaService <|-- TemplateWorkoutsService
UsersService <-- AuthService
@enduml

```

---


---
# Registration/Login Sequence Diagram
``` plantuml
@startuml
actor User

box "Frontend" #LightGrey
	participant "RegisterForm\n/LoginForm" as ReactForm
	participant "auth.ts\nAxios" as API
end box

participant AuthController
participant AuthService
participant UsersService
database PrismaDB
participant JwtService

User -> ReactForm: submit form
ReactForm -> API: POST /auth/register\nor /auth/login
API -> AuthController: call endpoint

alt Registration
    AuthController -> AuthService: create(dto)
    AuthService -> UsersService: create(dto with hashed password)
    UsersService -> PrismaDB: insert user
    PrismaDB --> UsersService: user
    UsersService --> AuthService: user
end

AuthController -> AuthService: login(dto)
AuthService -> UsersService: findByEmail(email)
UsersService -> PrismaDB: lookup user
PrismaDB --> UsersService: user
UsersService --> AuthService: user
AuthService -> AuthService: bcrypt.compare()
AuthService -> JwtService: sign({id, email})
JwtService --> AuthService: accessToken
AuthService --> AuthController: { accessToken }
AuthController --> API: 200 { accessToken }
API --> ReactForm: return { accessToken }
@enduml

```

---


# Workout Creation From Template Sequence Diagram
---
``` plantuml
@startuml
actor User
participant "TemplateWorkoutPage" as Page
participant "useCreateWorkoutFromTemplate" as Hook
participant "WorkoutsController" as Controller
participant "WorkoutsService" as Service
database "Prisma DB" as DB

User -> Page : click **Start this workout**
Page -> Hook : mutate({ tid })
Hook -> Controller : POST /workouts/from-template/{tid}
Controller -> Service : copyFromTemplate(tid, userId)
Service -> DB : templateWorkout.findFirst(...)
DB --> Service : Template data (exercises/sets)
Service -> DB : workout.create(...) with copied exercises/sets
DB --> Service : Created Workout
Service --> Controller : Workout
Controller --> Hook : WorkoutResponseDto
Hook -> Page : resolve promise
Page -> User : navigate to /workouts/{id}
@enduml

```

---
# Template Workout Sequence Diagram
``` plantuml
@startuml
start
:User selects template to edit;

:TemplateWorkoutsService.getTemplate(templateId);
:Display current list of exercises;

repeat :For each exercise in template
    :Update its position if order changed;
    :Add or modify sets as needed;
    note left
	  Each set uses ensureEditableOwnership
	  before saving.
	end note
repeat while (all exercises processed?)

:TemplateWorkoutsService.saveTemplate(updatedTemplate);
stop
@enduml

```
# Roles and Permissions Use-Case Diagram
``` plantuml
@startuml
left to right direction
actor "Regular User" as User
actor Admin

Admin -|> User



package "Exercise Catalog" {
  usecase "Search All Exercises\n(Global+User)" as SAE
  User  --> (Manage User Exercises)
  Admin --> (Create Global Exercise)
  User --> (SAE)
}

package "Template Workouts" {
usecase "Search All Templates\n(Global+User)" as SAT
  User  --> (Create/Edit User Templates)
  Admin --> (Create Global Templates)
  User --> (SAT)
}

package "Workouts" {
  User  --> (Log Workouts)
  User  --> (View Own Workouts)
  Admin --> (View All Workouts)
}

@enduml

```



---
# Workout Lifecycle State Diagram
``` plantuml
@startuml
[*] --> Created

Created : workout is inserted (createdAt set)

Created --> InProgress : first exercise or set added
InProgress --> Completed : workout marked complete (e.g., completedAt or status flag)

Completed --> [*]
@enduml

```
---

