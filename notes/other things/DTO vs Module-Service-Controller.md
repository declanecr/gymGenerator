#API

---
## 📦 Modules

- **What**: The “glue” that groups related pieces (controllers, providers/services, imports) into a single cohesive unit.

- **Responsibility**:
    - Organize features into logical domains
    - Declare which controllers and providers belong here
    - Import other modules when you need shared functionality (e.g. `PrismaModule`, `AuthModule`)

- **Example**:
``` ts
@Module({
  imports: [PrismaModule],
  controllers: [TemplateWorkoutsController],
  providers: [TemplateWorkoutsService],
})
export class TemplateWorkoutsModule {}
```
---
## 🛂 Controllers

- **What**: HTTP “entry-points” that map routes → methods.

- **Responsibility**:
    1. Define route decorators (`@Get()`, `@Post()`, etc.)
    2. Parse inputs (`@Param()`, `@Body()`, `@Query()`) into DTOs
    3. Delegate to a service, then return the result (or throw HTTP errors)

- **Why**: Keeps all HTTP and protocol concerns in one layer—no business logic here!

- **Example:**
``` ts
@Controller('template-workouts')
export class TemplateWorkoutsController {
  constructor(private readonly svc: TemplateWorkoutsService) {}

  @Post()
  create(@Body() dto: CreateTemplateWorkoutDto) {
    return this.svc.create(dto);
  }
}
```
---
## ⚙️ Services (Providers)

- **What**: The “brains” that contain your business logic and data access.

- **Responsibility**:
    1. Receive plain JS/TS objects (DTOs) from controllers
    2. Validate additional invariants or orchestrate complex flows
    3. Talk to your ORM/DB (Prisma) via an injected `PrismaService`
    4. Return domain/data objects back to controllers

- **Why**: Isolates all logic so you can write unit tests against methods without HTTP.

- **Example:**
``` ts
@Injectable()
export class TemplateWorkoutsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTemplateWorkoutDto) {
    return this.prisma.templateWorkout.create({ data: dto });
  }
}
```
---
## 📑DTOs (Data Transfer Objects)

- **What**: Type‐safe classes or interfaces that describe the shape of incoming (and sometimes outgoing) data.

- **Responsibility**:
    1. Define required vs. optional fields
    2. Attach validation rules (e.g. class-validator decorators or Zod schemas)
    3. Serve as a contract between client ↔ server

- **Why**:
    - Ensures you never trust raw `any` data
    - Automatically enforce constraints before hitting your service/DB

- **Example:**
``` ts
export class CreateTemplateWorkoutDto {
  @IsString()             // class-validator rule
  @Length(1, 50)          // enforce name length
  name: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
```
---
## 🔄 How They Work Together

1. **Module** wires up Controllers + Services + Imports
    
2. **Controller** receives `POST /…` → Nest’s `ValidationPipe` transforms & validates into a **DTO**
    
3. Controller calls a **Service** method, passing the DTO
    
4. **Service** runs business logic, uses **PrismaService** to talk to the DB
    
5. Result flows back through the Controller → HTTP response
``` arduino
Client → [Controller ↔ DTO validation] → Service → Prisma → Service → Controller → Client
```
---
### 👉 Next Steps

- **Practice**: Scaffold one feature (e.g. TemplateWorkout) end-to-end:
    
    1. Create DTOs
    
    2. Wire up Controller & Service
        
    3. Write a simple test that posts invalid & valid payloads
        
- **Observe**: Notice that whenever you need a new data shape, you add or update a DTO—your controllers and services remain untouched in terms of type‐safety.