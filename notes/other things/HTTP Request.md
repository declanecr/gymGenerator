#auth #backend 
> [!abstract]- TL;DR 
> - **You** never parse the raw JWT in controllers.
> -  Passport (via `JwtStrategy`) pulls it out of `req.headers.authorization`, verifies it, and hands you the **payload** (or a shaped version of it) on `req.user`.
> - Your handlers call `@GetUser()` to grab that object—no manual JWT parsing needed in your business logic.

- `req.headers` — all the HTTP headers (including `authorization`)
    
- `req.body` — the parsed JSON payload for POST/PATCH/etc
    
- `req.query` and `req.params` — your URL query‐string and route params
    
- **plus** Passport will add a `req.user` property once a JWT has been successfully validated.
---
### 1. Where the JWT lives

When your client calls a protected route, it sends:
```makefile
Authorization: Bearer <your.jwt.token.here>
```
That lives in `req.headers.authorization`.

---
### 2. How the strategy extracts & validates

1. **Extraction**  
    `JwtStrategy` uses `ExtractJwt.fromAuthHeaderAsBearerToken()` to pull that token string out of `req.headers`.
    
2. **Validation**  
    Passport calls `jwtService.verify(token)` behind the scenes (using the secret you configured) to:
    
    - Check the signature
        
    - Check the `exp` (“expires at”) claim
        
3. **Payload → `req.user`**  
    If valid, Passport takes the decoded payload (e.g. `{ sub: 42, email: 'you@ex.com', iat: …, exp: … }`) and passes it into your `validate(payload)` method.  
    Whatever object **you return** from `validate()` is then attached as `req.user`.
    ```ts
	// jwt.strategy.ts
	async validate(payload: any) {
	  // you could fetch more details from the DB here,
	  // but at minimum you return an object that becomes req.user
	  return { id: payload.sub, email: payload.email };
	}
	```
---
### 3. Pulling `req.user` into your handlers

Rather than looking at `req.headers.authorization` or re-verifying the token yourself, you simply grab the already-decoded user object:
```ts
@Get('me')
@UseGuards(AuthGuard('jwt'))
getMe(@GetUser() user) {
  // user here = { id: 42, email: 'you@ex.com' }
  return user;
}
```
Your `@GetUser()` decorator is just a thin helper that does:
```ts
const req = ctx.switchToHttp().getRequest();
return req.user;
```
