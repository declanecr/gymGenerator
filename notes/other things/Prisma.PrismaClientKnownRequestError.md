#backend 
> [!abstract] TL;DR – `Prisma.PrismaClientKnownRequestError` is Prisma’s way of telling you exactly what kind of DB error happened, so you can handle it cleanly and type-safely!
> - Want to see all the error codes you can handle? [Prisma error code docs here](https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes).
> 
---

### `Prisma.PrismaClientKnownRequestError` — **What Is It?**

- **It’s a class provided by Prisma** to represent _known_ (i.e., predictable, documented) database errors that occur when you interact with your database through Prisma’s client.
    
- When Prisma throws this error, it means the problem is something it specifically recognizes—**not a random crash or unknown bug**.
---
### **When Does It Occur?**

- Examples:
    
    - **Unique constraint violations** (like duplicate emails)
        
    - **Foreign key constraint violations**
        
    - **Missing required fields**
        
- Basically, when your DB operation fails in a way Prisma knows how to describe, it throws an instance of this class.
---
### **What Does It Contain?**

- **`code`**: A short string (e.g., `'P2002'` for unique constraint failed) identifying the error type.
    
- **`meta`**: Extra details, e.g. which field caused the problem.
    
- **`message`**: Human-readable error description.
    
- **All standard Error properties** (`name`, `stack`, etc.).
---
### **Why Use `instanceof Prisma.PrismaClientKnownRequestError`?**

- **Type safety**: Confirms you’re handling an error you _expect_ and can introspect.
    
- **Access fields**: Lets you safely read `code`/`meta` without linter/TypeScript complaints.
    
- **Best practice**: Avoids false positives from other error types.
---
#### **Quick Example:**
```ts
import { Prisma } from '@prisma/client';

try {
  // prisma DB operation
} catch (e: unknown) {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    // e.code is safe to access
    // e.meta is safe to access
  }
}
```
---
