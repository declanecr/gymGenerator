#auth #API #backend #NestJS 

> [!question]
> # **What's the difference?**
---
## **JwtService**

- **What it is:** A Nest-provided utility class (from `@nestjs/jwt`) that knows your secret key and signing options.
- **Primary responsibilities:**
    - **Signing tokens:** `jwtService.sign(payload)` → returns a compact JWT string
    - **Verifying tokens (manually):** `jwtService.verify(token)` → throws if invalid or expired

- **When you use it:**
    - In your **AuthService** when you log a user in and need to issue them a token.
    - Anywhere else you need to create or inspect JWTs programmatically.

---

## **JwtStrategy**

- **What it is:** A Passport “strategy” class (extending `PassportStrategy(Strategy)`) that plugs into Nest’s guard system.
- **Primary responsibilities:**
    - **Extracting** the token from each incoming request (e.g. via `ExtractJwt.fromAuthHeaderAsBearerToken()`)
    - **Verifying** its signature and expiry (under the hood it uses the same secret you gave `JwtModule`)
    - **Calling** your `validate(payload)` method if the token is good, and attaching the returned object to `req.user`

- **When it runs:**
    - **Automatically** on any route guarded by `@UseGuards(AuthGuard('jwt'))`—no manual calls to `jwtService` needed in your controllers.

---
## **In a Nutshell**

|Aspect|JwtService|JwtStrategy|
|---|---|---|
|Provided by|`@nestjs/jwt`|`@nestjs/passport` + `passport-jwt`|
|Lives in|Your **AuthModule** (as a provider)|Your **AuthModule** (as a provider & guard)|
|Used for|Manually **signing** or **verifying** tokens|Automatically **extracting**, **verifying**, and **validating** tokens on requests|
|You call…|`jwtService.sign()` or `jwtService.verify()`|You don’t call it directly—Nest’s `AuthGuard` does|
|You implement…|N/A (just inject and use)|The `validate(payload)` method to shape `req.user`|

---
# Flow Recap:
**Flow Recap:**

1. **Login:** Your code calls `JwtService.sign()`.
    
2. **Client request:** Includes `Authorization: Bearer <token>`.
    
3. **Guard:** `AuthGuard('jwt')` triggers your `JwtStrategy`.
    
4. **Strategy:** Verifies via the same secret, then hands you the payload in `validate()`.
    
5. **Controller:** You grab `req.user` (via `@GetUser()`) and run your business logic.

That separation of concerns—**service for creation/inspection**, **strategy for request-time enforcement**—is what makes Nest’s auth system both powerful and clean.

---
> [!question]
> # **So shouldn't I just use one?**
---

> [!abstract] TL;DR 
> ## Use **JwtService** for generating tokens, and use **JwtStrategy** + **AuthGuard** for validating them on incoming requests.



You actually need **both**—they serve two distinct roles:
- **JwtService** is what _you_ call in your **AuthService** when you want to **create** (or manually verify) a token. It’s all about signing payloads (and, if you choose, ad-hoc verification).
    
- **JwtStrategy** (used via `AuthGuard('jwt')`) is what Nest/Passport uses _for every incoming request_ to **enforce** that the token is valid and to populate `req.user`. ==You don’t call it yourself—it’s wired up by the guard.==
    
---
In practice:
1. **Login flow** (<u>you</u> call):
```ts
 // in AuthService
const token = this.jwtService.sign({ sub: user.id, email: user.email });
```
2. **Protected routes** (<u>Nest</u> calls):
```ts
@UseGuards(AuthGuard('jwt'))
@Get('me')
getMe(@GetUser() user) { … }
// under the hood: JwtStrategy.extracts & verifies the token,
// then calls your validate() and sets req.user
```
So:
- If you only used **JwtService** and never set up a strategy/guard, you could sign tokens but you’d have no automatic way to protect routes or decode them on each request.
    
- If you only used **JwtStrategy** (and never called `jwtService.sign()`), you’d have no tokens to validate—login wouldn’t work.