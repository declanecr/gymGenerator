#API #auth #backend #NestJS #Database 
# How Authentication Works in Your Gym App

## **1. Prisma Schema/Database**

- Your **Prisma schema** defines the `User` model (and others), mapping directly to your database tables.
    
- When you register, log in, or update/delete a user, the **Prisma client** (via `PrismaService`) reads/writes user records in the DB.
    
- **Password hashes** are stored in the user table; never the raw password.
    

---

## **2. Auth Files**

- The **auth module** (`auth.controller.ts`, `auth.service.ts`, `auth.module.ts`) provides all endpoints and logic for authentication, including registration and login.
    
- **Register:** Accepts new user data, hashes the password, saves user via Prisma.
    
- **Login:** Verifies credentials; on success, creates a **JWT** token and sends it to the client.
    

---

## **3. User Files**

- The **users module** (`users.controller.ts`, `users.service.ts`, DTOs) handles actions on the user resource, such as viewing (`GET /users/me`), updating (`PATCH /users/me`), or deleting (`DELETE /users/me`) the current user.
    
- All “me” endpoints are **protected**—they require the requester to be authenticated.
    

---

## **4. JWT (JSON Web Tokens)**

- When a user logs in, the server issues a JWT, signing it with your secret key.
    
- The JWT encodes the user’s ID and (optionally) other info in its payload.
    
- The client (e.g., your React app) stores the JWT and sends it in the `Authorization: Bearer <token>` header with requests to protected endpoints.
    

---

## **5. JWT Strategy and Guards**

- The **JWT strategy** (in `shared/guards/jwt.strategy.ts`) tells Passport/Nest how to extract and validate JWTs from requests.
    
- If valid, it attaches the user info (from the JWT payload) to `req.user`.
    
- The **`AuthGuard('jwt')`** can be applied to any controller or route to require authentication:  
    If the JWT is invalid/missing, Nest returns a `401 Unauthorized` response.
    

---

## **6. Decorators**

- The custom **`GetUser` decorator** (`get-user.decorator.ts`) provides a clean way for controller methods to access the current user extracted from the JWT.
    
- This means your controllers don’t need to manually access `req.user`—they just declare a parameter with `@GetUser()`.
    

---

## **Putting It All Together – Request Flow Example**

1. **Registration:**
    
    - User sends POST `/auth/register` → data validated → password hashed → new user saved with Prisma.
        
2. **Login:**
    
    - User sends POST `/auth/login` → server checks credentials → on success, signs and returns a JWT.
        
3. **Accessing Protected Route (`GET /users/me`):**
    
    - Client sends JWT in header.
        
    - `AuthGuard('jwt')` verifies token.
        
    - `jwt.strategy.ts` decodes payload, attaches `{ id, email }` to `req.user`.
        
    - `GetUser` decorator injects user into controller.
        
    - Controller/service fetches user info from the DB using that ID, returns safe user data.
---
## **Summary Table**

|Component|Responsibility|
|---|---|
|Prisma schema/DB|Define/store users and hashed passwords|
|Auth files|Register/login, issue JWTs|
|User files|Handle authenticated user actions|
|JWT & Strategy|Secure endpoints, provide user info to server|
|Decorators|Cleanly inject current user into controllers|

---
