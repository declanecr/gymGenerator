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
  // Add as many as you want...
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

  // --- (Optional) Seed User-specific exercises ---
  const user = await prisma.user.findUnique({
    where: { email: 'testuser1@example.com' },
  });
  if (user) {
    await prisma.exercise.upsert({
      where: {
        name_userId: {
          name: 'Single-arm Row',
          userId: user.id,
        },
      },
      update: {},
      create: {
        name: 'Single-arm Row',
        description: 'Back exercise for lats, user-specific.',
        primaryMuscle: 'Back',
        equipment: 'Dumbbell',
        default: false,
        userId: user.id,
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
