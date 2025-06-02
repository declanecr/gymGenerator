#auth #backend 
%% auth.module.ts %%
```ts
import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from '../../../shared/guards/jwt.strategy';

// This tells Nest how to issue JSON Web Tokens (JWTs) for the login route
@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'myDefaultSecret', // use env var in prod!
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtStrategy], //these are just services, just different name for them
  controllers: [AuthController],
  exports: [AuthService], // So other modules (like guards) can use AuthService/JwtModule if needed
})
export class AuthModule {}
```

### When you call `JwtModule.register({ secret, signOptions })` in your `AuthModule` 
Nest under the hood does two key things:

1. **Registers a `JwtService` provider**
    
    - It captures your `secret` and `signOptions` (like `expiresIn: '1h'`) in a configuration object.
        
    - Anywhere you inject `JwtService`, those options are available for both **signing** and **verifying** tokens.
        
2. **Makes those options available to Passport’s JWT strategy**
    
    - When you register your `JwtStrategy` in the same module, Passport pulls the **same** `secret` to check incoming tokens.
        
    - You don’t have to manually pass the secret into your strategy—Nest wires it up for you.

> [!info]
> # For the difference between [[JwtService vs JwtStrategy]]


---
### How it Flows
```ts
// auth.module.ts
JwtModule.register({
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: '1h' },
}),
```
- **On login**
    
    - You call `this.jwtService.sign(payload)`.
        
    - `JwtService` uses the registered `secret` + `expiresIn` to build a token.
        
- **On protected requests**
    
    - Passport’s JWT strategy calls `ExtractJwt.fromAuthHeaderAsBearerToken()` to pull the token out.
        
    - It then calls `this.jwtService.verify(token)` (behind the scenes) using that **same** `secret`.
        
    - If the signature and expiry check out, it passes the decoded payload into your `validate()`.
        

---

### Why This Matters

- **Centralized config:** ==You only set the secret and expiry in one place==.
    
- **Consistency:** Tokens you sign in `AuthService` and tokens you verify in `JwtStrategy` always use the same key and rules.
    
- **Security:** By using environment variables for the secret, you avoid leaking keys in code.