#Database 
## 🛠️ When to Run `prisma generate` vs `prisma migrate dev`
| Command                      | Purpose                                                              | When to Run                                                            |
| ---------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `npx prisma **migrate dev**` | Applies schema changes to the database **and** generates client code | ✅ Whenever you **change your schema** and want to **update the DB**    |
| `npx prisma **generate**`    | Just regenerates the Prisma Client (no DB changes)                   | ✅ When you change the **output path** or use a different **generator** |
| `npx prisma **db push**`     | Applies schema to DB without migrations (useful in prototyping)      | ⚠️ Use **only in dev**, and **not for production**                     |
| `npx prisma **format**`      | Formats `schema.prisma` file (like Prettier)                         | Optional — just cleans up code style                                   |

---
## ✅ Typical Workflow (with Migrations)
1. **Edit your schema**
```prisma	
model Workout {
	id        Int    @id @default(autoincrement())
	title     String
	userId    Int
}
```
2. **Run migration**
``` bash
npx prisma migrate dev --name add_workout
```

3. This will
	- Apply schema changes to your local SQLite DB
	- Generate updated Prisma Client (you don’t need to run `generate` separately)

---
## 💡 When You’d Use `generate` Alone

You **only** need to run:
``` bash
npx prisma generate
```
…if you:

- Deleted `node_modules/` and want to regenerate the Prisma Client
    
- Changed something in `schema.prisma` that doesn’t affect DB schema (like generator options)
    
- Added a custom generator (e.g. `nexus-prisma`, `graphql`, etc.)