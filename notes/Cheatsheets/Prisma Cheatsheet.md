#database
#Cheatsheet
#backend 
### 📦 Basic Scalar Types
``` Prisma
String     // text or UUID
Int        // integer
Float      // decimal
Boolean
DateTime
Json
```
Add `?` for optional:
``` prisma
bio String?  // can be null
```
---
### 🔑 Primary Key and Defaults
``` prisma
id    String  @id @default(cuid())   // or uuid()
count Int     @default(0)
createdAt DateTime @default(now())
```
---
### 🔁 One-to-Many Relation
``` prisma
model User {
  id       String    @id @default(cuid())
  workouts Workout[]
}

model Workout {
  id     String  @id @default(cuid())
  user   User    @relation(fields: [userId], references: [id])
  userId String
}
```
> [!tip] 🎯 Rule of thumb:
> - `fields: [foreignKey]` is on the child side
> 
> - `references: [parentId]` refers to parent key

---
### 🔁 Many-to-Many Relation (via implicit join)
``` prisma
model Post {
  id       String   @id @default(cuid())
  tags     Tag[]    // Prisma creates join table automatically
}

model Tag {
  id     String  @id @default(cuid())
  posts  Post[]
}
```
Or create an **explicit join model** if you need metadata (e.g. `createdAt`, `order`)

---
### 📐 Other Tips

- `@@map("table_name")` → rename DB table
    
- `@unique` → enforce uniqueness
    
- `@default("...")` → default values for fields
    
- `@relation(name: "...")` → use when multiple relations between same models
    

---

## 🧠 Bonus Tips

- Prefer `cuid()` over `uuid()` unless you _need_ UUID v4
    
- Prisma auto-pluralizes relation fields (but you can rename them)
    
- Always test your relationships with `prisma migrate dev` early and often