### What It Means:

A **migration** is a version-controlled file that describes how to change your database schema — adding tables, removing columns, modifying constraints, etc.

### In Prisma:

You define your schema in `schema.prisma`, and Prisma generates SQL migration scripts for you:
``` bash
npx prisma migrate dev --name init
```
This creates a folder like:
``` bash
prisma/migrations/
  └── 20240514180312_init/
      └── migration.sql
```
### Why It’s Useful:

- Keeps DB schema **in sync** with your application code
    
- Makes it easy to roll back or reapply changes
    
- Works across environments (dev, staging, prod)

Think of it like Git for your database schema.