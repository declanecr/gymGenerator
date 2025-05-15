# `main.ts` – Entry Point

This is where the NestJS application starts. It bootstraps the app by loading the root module (`AppModule`) and starting the HTTP server.

## Responsibilities

- Start the NestJS application
- Enable global features (e.g., CORS, validation)
- Configure middleware or pipes

## Example

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Allow frontend connections
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(3000); // Start the HTTP server
}
bootstrap();
```

---

# 📦 Modules – Organizing Your App

Modules are used to organize related components in your application, such as controllers and services.

## Responsibilities

- Group related logic into cohesive units (e.g., AuthModule, UserModule)
- Define dependencies with `imports`, `providers`, and `controllers`

## Example

```ts
@Module({
  imports: [AuthModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

---

# 🎮 Controllers – Handling HTTP Requests

Controllers handle incoming HTTP requests and delegate business logic to services.

## Responsibilities

- Define route handlers (GET, POST, PUT, DELETE)
- Receive and validate request data
- Return responses

## Example

```ts
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
```

---

# 🧠 Services – Business Logic Layer

Services are where the core logic of your application lives. They handle things like database access, calculations, and external API calls.

## Responsibilities

- Implement reusable business logic
- Communicate with repositories (e.g., Prisma)
- Serve data to controllers

## Example

```ts
@Injectable()
export class UsersService {
  findAll() {
    return [{ id: 1, name: 'Declan' }];
  }
}
```

---

# 🧠 NestJS Architecture Overview (Summary)

NestJS is designed around the idea of modularity and dependency injection.

## Component Responsibilities

| Part       | Description                     | Analogy      |
| ---------- | ------------------------------- | ------------ |
| `main.ts`  | Bootstraps the app              | Front door   |
| Module     | Groups services and controllers | Department   |
| Controller | Handles HTTP input/output       | Receptionist |
| Service    | Contains business logic         | Engine room  |
