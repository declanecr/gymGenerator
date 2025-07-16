import { PrismaClient, Role, TemplateSet } from '@prisma/client';
import bcrypt from 'bcrypt';
import {
  TemplateExerciseWithSets,
  TemplateWorkoutWithExtras,
} from 'src/modules/v1/template-workouts/dto/template-workout-reponse.dto';

const prisma = new PrismaClient();

// --- Fake users ---
const fakeUsers = [
  {
    email: 'user1@example.com',
    password: 'password123',
    name: 'User One',
    role: Role.USER,
  },
  {
    email: 'user2@example.com',
    password: 'password123',
    name: 'User Two',
    role: Role.USER,
  },
  {
    email: 'user3@example.com',
    password: 'password123',
    name: 'User Three',
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
  ...Array.from({ length: 46 }, (_, i) => ({
    name: `Exercise ${i + 1}`,
    description: `Generic exercise ${i + 1}`,
    primaryMuscle: 'Various',
    equipment: 'Bodyweight',
    default: true,
  })),
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
    name: 'Leg Day',
    isGlobal: true,
    exercises: [
      {
        name: 'Squat',
        sets: [
          { reps: 5, weight: 185 },
          { reps: 5, weight: 195 },
        ],
      },
      {
        name: 'Deadlift',
        sets: [{ reps: 5, weight: 225 }],
      },
    ],
  },
  {
    name: 'Pull Day',
    isGlobal: true,
    exercises: [
      {
        name: 'Deadlift',
        sets: [{ reps: 5, weight: 225 }],
      },
      {
        name: 'Bench Press',
        sets: [{ reps: 8, weight: 135 }],
      },
    ],
  },
  {
    name: 'Cardio Burst',
    isGlobal: true,
    exercises: [
      {
        name: 'Exercise 1',
        sets: [{ reps: 20, weight: 0 }],
      },
    ],
  },
  {
    name: 'Full Body Blast',
    isGlobal: true,
    exercises: [
      {
        name: 'Squat',
        sets: [{ reps: 5, weight: 185 }],
      },
      {
        name: 'Bench Press',
        sets: [{ reps: 8, weight: 135 }],
      },
      {
        name: 'Deadlift',
        sets: [{ reps: 5, weight: 225 }],
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
  const createdGlobalTemplates = [] as TemplateWorkoutWithExtras[];
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
    const tpl = await prisma.templateWorkout.create({
      data: {
        name: templateWorkout.name,
        userId: undefined,
        templateExercises: {
          create: templateExercises,
        },
      },
      include: { templateExercises: { include: { sets: true } } },
    });
    createdGlobalTemplates.push(tpl);
  }

  const users = await prisma.user.findMany({ where: { role: Role.USER } });

  for (const user of users) {
    const userTemplate = await prisma.templateWorkout.create({
      data: {
        name: `${user.name}'s Template`,
        userId: user.id,
        templateExercises: {
          create: [
            {
              position: 0,
              exercise: { connect: { id: exerciseMap['Bench Press'].id } },
              sets: {
                create: [
                  { position: 0, reps: 8, weight: 135 },
                  { position: 1, reps: 8, weight: 135 },
                ],
              },
            },
          ],
        },
      },
      include: { templateExercises: { include: { sets: true } } },
    });
    // 3 manual workouts
    for (let i = 0; i < 3; i++) {
      await prisma.workout.create({
        data: {
          userId: user.id,
          name: `Manual Workout ${i + 1} - ${user.name}`,
        },
      });
    }

    const copyTemplate = async (template: TemplateWorkoutWithExtras) => {
      if (!template.templateExercises) {
        throw new Error('No exercises on template ' + template.id);
      }
      await prisma.workout.create({
        data: {
          userId: user.id,
          workoutTemplateId: template.id,
          name: template.name,
          notes: template.notes,
          workoutExercises: {
            create: template.templateExercises.map(
              (ex: TemplateExerciseWithSets) => ({
                exerciseId: ex.exerciseId,
                templateExerciseId: ex.id,
                position: ex.position,
                workoutSets: {
                  create: ex.sets.map((set: TemplateSet) => ({
                    reps: set.reps,
                    weight: set.weight,
                    position: set.position,
                  })),
                },
              }),
            ),
          },
        },
      });
    };

    await copyTemplate(createdGlobalTemplates[0]);
    await copyTemplate(userTemplate);
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
