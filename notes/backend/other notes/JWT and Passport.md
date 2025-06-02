#auth #backend #NestJS 

> [!note] **JWT = JSON Web Token **
---
## 1. JWT in a Nutshell

1. **What’s a JWT?**
    
    - A JSON Web Token is just a string containing three parts:
        
		```css   
		`header.payload.signature`
		```
        
    - **Header** says which algorithm was used (e.g. HS256).
        
    - **Payload** is your data (e.g. `{ sub: 3, email: "you@ex.com" }`).
        
    - **Signature** is a cryptographic hash of header+payload plus your secret—this makes it tamper-proof.
        
2. **Why use JWTs?**
    
    - They’re **stateless**: you don’t need to store session data on the server.
        
    - Each request carries its own “proof” of who the user is (in the token).
        
3. **Flow at login:**
    
    1. User logs in with email/password.
        
    2. Server checks credentials, then calls `JwtService.sign(payload)`.
        
    3. Client gets back the token string and stores it (e.g. localStorage).
        
## [[JWT Module & Service]] for more info on JWT under the hood work

---

## 2. Passport: The Authentication Framework

1. **Passport’s job** is to standardize authentication “strategies” (local, OAuth, JWT, etc.).
    
2. A **strategy** defines:
    
    - How to **extract** credentials (for JWT, that’s from the Authorization header).
        
    - How to **validate** them (for JWT, that’s verifying the signature and expiry).
        
    - What to **attach** to the request (e.g. a user object).
        
3. **Why Nest uses Passport**
    
    - It gives you the familiar `@UseGuards(AuthGuard('jwt'))` decorator.
        
    - You don’t write the HTTP-level plumbing yourself—Passport handles parsing headers, verifying tokens, and erroring out if something’s wrong.

---
## 3. How Nest Ties JWT + Passport Together

1. **`JwtModule.register(...)`**
    
    - You tell Nest your secret and default expiry time.
        
    - This gives you a `JwtService` you can inject wherever you need to sign or verify tokens.
        
2. **`JwtStrategy`** (extends `PassportStrategy`)
    
    - You configure:
		```ts
		super({
		  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
		  secretOrKey: process.env.JWT_SECRET,
		});
		```
	- **`validate(payload)`**
        
        - Runs _after_ the signature & expiry are verified.
            
        - You return whatever object you want on `req.user` (e.g. `{ id: payload.sub, email: payload.email }`).
            
3. **`@UseGuards(AuthGuard('jwt'))`**
    
    - When a request hits that route, Nest calls [Passport’s JWT](JWT%20Module%20&%20Service.md) strategy under the hood.
        
    - If the token is valid, Passport calls your `validate()` and sets `req.user`.
        
    - If invalid or missing, it short-circuits with a 401 error before your handler ever runs.
        
4.  **`@GetUser()` decorator**
    
    - Just a thin wrapper around `ctx.switchToHttp().getRequest().user`.
        
    - It’s how you pull the decoded user object out of the [[HTTP Request]] in your controller methods.

---

## 4. Putting It All Together: A Request Lifecycle

1. **Client** sends `Authorization: Bearer <token>`.
    
2. **Nest** sees `@UseGuards(AuthGuard('jwt'))` and hands the request to **Passport**.
    
3. **Passport/JwtStrategy**
    
    - Extracts the token.
        
    - Verifies signature & expiry.
        
    - Calls your `validate(payload)` → returns a `{ id, email }` object.
        
4. Passport attaches that object to `req.user`.
    
5. **Nest’s guard** passes control back to your controller.
    
6. Your controller method (with `@GetUser() user`) now has the authenticated user data.