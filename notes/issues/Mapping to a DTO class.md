#API #auth #backend #issue

> [!note] SOFTWARE ENGINEERING BEST PRACTICE:
> NEVER return your DB models directly

---
## users.service.ts:
``` ts
@Injectable()

export class UsersService {

  constructor(private readonly prisma: PrismaService) {}

  // 1. Add a create() that hashes before saving:
  async create(dto: CreateUserDto): Promise<User> {
    const { email, password, name } = dto;

    // 2. Pick salt rounds -- chosing 12 for a little extra security
    const SALT_ROUNDS = 12;
    const hashed: string = await bcrypt.hash(password, SALT_ROUNDS);

    try {
      // 3. Use Prisma to persist the user with the hashed password
      // creates a new user in the DB with a hashed password
      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashed,
          name,
        },
      });
  
      // 4. strip the password before returning to the CLIENT
      // user already got saved to DB above, this is to ensure
      // the password isn't returned to the CLIENT
      delete user.password;
      return user;
    } catch (e: any) {
      // 5. Handle unique-constraint violations cleanly
      if (typeof e === 'object' && e !== null && 'code' in e) {
        if (e.code === 'P2002' && e.meta?.target?.includes('email')) {
          throw new ConflictException('Email already in use');
        }
      }
      throw e;
    }
  }

  // 6. also need to implement a findByEmail() to support login
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

}
```
---
# Current issue:
``` ts
@ISSUE
delete user.password;
return user;
```

currently the expected type for `user` is `<User>` as promised in **users.controller.ts:**
``` ts 
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() dto: CreateUserDto): Promise<User> {
    return await this.usersService.create(dto);
  }
}
```
---
# Solution: `Map to a DTO class`
## Create a class that represents the user data you expose publicly:

```ts
export class UserResponseDto {
  id: number;
  email: string;
  name?: string | null;
  createdAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.createdAt = user.createdAt;
  }
}

// In your service:
- async create(dto: CreateUserDto): Promise<User> {
+  //..
-  return user;

+ async create(dto: CreateUserDto): Promise<UserResponseDto> {
+  // ...
+  return new UserResponseDto(user);

// In your controller:
- async create(@Body() dto: CreateUserDto): Promise<User> {

+ async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {

```
