### What It Means:

Type safety means **your code knows the structure of your data at compile time**, not just at runtime. If you try to query or mutate data incorrectly (e.g. wrong field name or wrong type), **TypeScript will catch it before you run your code.**

### In Prisma:

When you define this model:
``` prisma
model User {
  id       Int    @id @default(autoincrement())
  email    String @unique
  password String
}
```
Prisma generates a TS-safe client:
``` ts
const user = await prisma.user.findUnique({
  where: { email: "declan@example.com" }, // ✅ knows "email" exists
});

user.password; // ✅ TypeScript knows this is a string
user.notAField; // ❌ Compile-time error
```
### Why It’s Useful:

- Autocompletion in VS Code
    
- Refactor-safe (rename a field and TypeScript will show every break)
    
- Prevents common runtime bugs (e.g. misspelling `email`)