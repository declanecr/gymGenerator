import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// --- Fake users ---
const fakeUsers = [
  {
    email: 'testuser1@example.com',
    password: 'password123',
    name: 'Alice Example',
    role: Role.USER,
  },
  {
    email: 'admin@example.com',
    password: 'adminpass',
    name: 'Admin User',
    role: Role.ADMIN,
  },
];

// --- Fake exercises (global and user-specific) ---
const fakeExercises = [
  {
    name: 'Squat',
    description: 'A compound lower body exercise.',
    primaryMuscle: 'Quadriceps',
    equipment: 'Barbell',
    default: true,
    // userId: null // global exercise
  },
  {
    name: 'Bench Press',
    description: 'A chest exercise.',
    primaryMuscle: 'Chest',
    equipment: 'Barbell',
    default: true,
    // userId: null // global exercise
  },
  {
    name: 'Deadlift',
    description: 'A full body posterior chain exercise.',
    primaryMuscle: 'Back',
    equipment: 'Barbell',
    default: true,
  },
  {
    name: 'Overhead Press',
    description: 'A overhead press shoulder exercise',
    primaryMuscle: 'Shoulder',
    equipment: 'Barbell',
    default: true,
  },
  // Add as many as you want...
];

// --- Fake template workouts---
const fakeTemplateWorkouts = [
  {
    name: 'Push Day',
    isGlobal: true,
    exercises: [
      {
        name: 'Bench Press',
        sets: [
          { reps: 8, weight: 135 },
          { reps: 6, weight: 145 },
        ],
      },
      {
        name: 'Overhead Press',
        sets: [{ reps: 10, weight: 65 }],
      },
    ],
  },
  {
    name: 'User Leg Day',
    isGlobal: false,
    exercises: [
      {
        name: 'Squat',
        sets: [
          { reps: 5, weight: 185 },
          { reps: 5, weight: 195 },
        ],
      },
    ],
  },
];

async function main() {
  console.log('seeding');
  // --- Seed Users ---
  for (const user of fakeUsers) {
    const hashed = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: { ...user, password: hashed },
    });
  }

  // --- Seed Global Exercises (userId: null) ---
  for (const exercise of fakeExercises) {
    const found = await prisma.exercise.findFirst({
      where: {
        name: exercise.name,
        userId: null,
      },
    });
    if (!found) {
      await prisma.exercise.create({
        data: { ...exercise, userId: null },
      });
    }
  }

  // --- Seed User-specific exercises ---
  const testUser = await prisma.user.findUnique({
    where: { email: 'testuser1@example.com' },
  });
  if (testUser) {
    await prisma.exercise.upsert({
      where: {
        name_userId: {
          name: 'Single-arm Row',
          userId: testUser.id,
        },
      },
      update: {},
      create: {
        name: 'Single-arm Row',
        description: 'Back exercise for lats, user-specific.',
        primaryMuscle: 'Back',
        equipment: 'Dumbbell',
        default: false,
        userId: testUser.id,
      },
    });
  }

  const allExercises = await prisma.exercise.findMany({
    where: { userId: null },
  });

  const exerciseMap = Object.fromEntries(
    allExercises.map((ex) => [ex.name, ex]),
  );

  function isNotNull<T>(value: T | null): value is T {
    return value !== null;
  }
  // --- Seed Global Template ---
  for (const templateWorkout of fakeTemplateWorkouts) {
    const templateExercises = templateWorkout.exercises
      .map((ex, index) => {
        const found = exerciseMap[ex.name];
        if (!found) {
          console.warn(`⚠️ Exercise "${ex.name}" not found — skipping.`);
          return null;
        }

        return {
          position: index,
          exercise: { connect: { id: found.id } },
          sets: {
            create: ex.sets.map((set, i) => ({
              position: i,
              reps: set.reps,
              weight: set.weight,
            })),
          },
        };
      })
      .filter(isNotNull); // remove nulls
    await prisma.templateWorkout.create({
      data: {
        name: templateWorkout.name,
        userId: templateWorkout.isGlobal ? undefined : testUser?.id,
        templateExercises: {
          create: templateExercises,
        },
      },
    });
  }
}

main()
  .then(async () => {
    console.log('DEV seed complete');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
