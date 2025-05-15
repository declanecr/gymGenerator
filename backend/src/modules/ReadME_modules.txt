what each folder does

src/
├── modules/        <- Each feature is its own module (auth, users, workouts)
│ ├── auth/         <- Auth routes, services, DTOs, and guards
│ ├── users/        <- User-related logic: registration, profile, etc.
│ └── workouts/     <- Workout tracking, plans, history, etc.
├── shared/         <- Reusable logic, helpers, and global providers
│ ├── database/     <- Prisma service, DB config, migrations
│ ├── guards/       <- Custom route guards like JWT auth
│ └── interceptors/ <- (Optional) Modify responses globally
├── app.module.ts   <- Root module that imports feature modules
└── main.ts         <- Entry point of the application
