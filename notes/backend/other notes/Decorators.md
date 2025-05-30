#backend #NestJS
**Decorators in NestJS are special functions that attach metadata to classes, methods, or parameters. This metadata tells Nest how to treat that code—for example, which routes to create, how to inject dependencies, how to validate inputs, or how to enforce authentication.**

> [!abstract] In other words:
>**Decorators give instructions to the NestJS framework about what your code is and how it should behave at runtime.**

---
# NestJS Decorators Cheatsheet

### **1. Controller & Routing**

- `@Controller('route')`  
    Marks a class as a controller, optionally setting a base route.
    
- `@Get()`, `@Post()`, `@Put()`, `@Patch()`, `@Delete()`  
    Maps a method to an HTTP request method.

```ts
@Controller('users')
export class UsersController {
  @Get() // GET /users
  findAll() {}

  @Get(':id') // GET /users/123
  findOne(@Param('id') id: string) {}

  @Post() // POST /users
  create(@Body() dto: CreateUserDto) {}
}
```

---
### **2. Parameter Decorators**

- `@Body()`  
    Injects the request body.
    
- `@Param('name')`  
    Injects a route parameter.
    
- `@Query('name')`  
    Injects a query parameter.
    
- `@Headers('name')`  
    Injects a specific header.
    
- `@Req()` / `@Res()`  
    Injects the request/response objects (discouraged for RESTful code).

```ts
@Get(':id')
findOne(@Param('id') id: string) {}

@Post()
create(@Body() dto: CreateDto) {}
```
---
### **3. Custom Decorators**

- **Create your own for things like getting the user from JWT:**
```ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext) => ctx.switchToHttp().getRequest().user
);
```
### **createParamDecorator**
- **What is it?**  
    A NestJS function for making your own custom `@Decorator()` that extracts a value from the request (or context).
    
- **Why use it?**  
    So you can write clean controller code like `@GetUser() user` instead of digging through `@Req()` everywhere.

---

### **ExecutionContext**

- **What is it?**  
    An object NestJS provides that gives you access to the current request, response, and other context details for the current handler (HTTP, WebSocket, etc).
    
- **Why use it?**  
    To reliably grab the request object (and thus properties like `req.user` added by Passport after auth).

---

#### **How They Work Together**
Using above as Example:
```ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest(); // gets the HTTP request object
    return req.user; // req.user set by your JWT strategy
  }
);
```
- **`ctx.switchToHttp().getRequest()`**  
    Gets the Express (or Fastify) `Request` object, no matter what else Nest is doing internally.
    
- **`return req.user`**  
    Returns the user (decoded JWT payload) so you can use it as an argument in your controller.
---
#### In Use
```ts
@Get('me')
@UseGuards(AuthGuard('jwt'))
getMe(@GetUser() user) {
  return user;
}
```
- Instead of digging through `@Req()`, you get just what you need, exactly where you want it.
---
### **4. Guards, Pipes, Interceptors, and Filters**

- `@UseGuards(AuthGuard('jwt'))`  
    Applies a guard (e.g., for authentication).
    
- `@UsePipes(ValidationPipe)`  
    Applies a pipe (e.g., for validation).
    
- `@UseInterceptors(ClassSerializerInterceptor)`  
    Applies an interceptor.
    
- `@UseFilters(MyExceptionFilter)`  
    Applies an exception filter.
---
### **5. [[Dependency Injection]]**

- `@Injectable()`  
    Marks a class as a provider/service (DI).
    
- `@Inject()`  
    Injects a specific provider.
    
- **Constructor injection** is the norm:
```ts
@Injectable()
export class MyService {
  constructor(private readonly dep: Dependency) {}
}
```
---
### **6. Module Decorators**

- `@Module({ ... })`  
    Marks a class as a module, organizing controllers/providers.
```ts
@Module({
  imports: [OtherModule],
  controllers: [MyController],
  providers: [MyService],
  exports: [MyService],
})
export class MyModule {}
```
---
### **7. DTO Validation Decorators (class-validator)**

- `@IsString()`, `@IsEmail()`, `@MinLength()`, `@IsOptional()`, etc.  
    Used in DTOs for request validation.
```ts
export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;
}
```
---
### **8. Useful Patterns**

- **Apply a guard to a whole controller:**
```ts
@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController { ... }
```
- Apply a pipe to a single route:
```ts
@Post()
@UsePipes(new ValidationPipe())
create(@Body() dto: CreateDto) { ... }
```
---
## Summary Table

|Decorator|Purpose|Example|
|---|---|---|
|`@Controller()`|Define a controller class|`@Controller('users')`|
|`@Get()`, etc|Map to HTTP methods|`@Get('me')`|
|`@Body()`, etc|Inject request data|`@Body()`, `@Param('id')`|
|`@UseGuards()`|Apply a guard (auth, roles, etc)|`@UseGuards(AuthGuard())`|
|`@Injectable()`|Register as a DI provider/service|`@Injectable()`|
|`@Module()`|Define a NestJS module|`@Module({ ... })`|
|`@IsString()`|Validate input DTO fields|`@IsString()`|
