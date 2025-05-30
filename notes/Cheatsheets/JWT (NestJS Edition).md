## 1. What is JWT?

- **JWT** = JSON Web Token: a secure, compact way to transmit information (claims) between parties as a JSON object, digitally signed.
    
- Used for **stateless authentication**—client stores the token, server verifies it on each request.

---

## 2. Installing JWT Packages

```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt
```
---
## 3. Register JwtModule in Your AuthModule
```ts
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'yourDefaultSecret', // Store in .env!
      signOptions: { expiresIn: '1h' },
    }),
    // ...other imports
  ],
  // ...providers, controllers
})
export class AuthModule {}
```
---
## 4. Creating and Signing Tokens

**In your AuthService:**
```ts
import { JwtService } from '@nestjs/jwt';

const payload = { sub: user.id, email: user.email };
const accessToken = this.jwtService.sign(payload);
return { accessToken };
```
- **Payload**: Can contain any public info, but avoid sensitive data.
    
- **sub**: "subject"—usually user ID.
---
## 5. Validating Tokens

- **Passport-JWT Strategy** parses JWT from the `Authorization` header:

```makefile
Authorization: Bearer <token>
```

- Server checks signature and expiration.

---
## 6. Typical Auth Flow

1. **User logs in** (`/auth/login`)
    
2. **Server validates credentials**, returns JWT
    
3. **Client stores JWT** (e.g., in `localStorage`)
    
4. **Client includes JWT in Authorization header** for protected routes
---
## 7. Protecting Routes (Example)

```ts
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Get('me')
getMe(@Req() req) {
  return req.user;
}
```
- **JwtAuthGuard** validates and injects the decoded user.
---
## 8. Environment Variables
``` env
# .env
JWT_SECRET=supersecretkey
JWT_EXPIRES_IN=1h
```
---
## 9. Security Tips

- **Never expose sensitive data** (password, etc.) in token payload.
    
- **Rotate your secret** if compromised.
    
- **Set reasonable expiration** (short-lived tokens, use refresh tokens if needed).
    
- **Use HTTPS** in production.
---
## 10. Common Pitfalls

- Using a weak or hard-coded secret.
    
- Storing JWT in an insecure place (e.g., localStorage in a vulnerable SPA).
    
- Not handling expired tokens gracefully.
---
## 11. Handy JWT Debug Tools

- [jwt.io](https://jwt.io/) — Paste your JWT, inspect header/payload/signature.
---
## 12. Example JWT Payload
```json
{
  "sub": 1,
  "email": "user@example.com",
  "iat": 1614986762,
  "exp": 1614987662
}
```
