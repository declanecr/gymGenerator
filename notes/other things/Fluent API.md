### What It Means:

A **fluent API** is one that uses **method chaining** and **natural language-like syntax** to make code expressive and readable.

### In Prisma:

Rather than writing raw SQL, you write:
``` ts
const workouts = await prisma.workout.findMany({
  where: { userId: 1 },
  include: { exercises: true },
});
```
That reads like:

> "Find all workouts where `userId` is 1, and include their exercises."

### Why It’s Useful:

- Cleaner than raw SQL
    
- Easier to compose queries programmatically
    
- Can be validated and typed (as above)