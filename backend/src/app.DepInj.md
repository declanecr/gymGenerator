# NestJS Dependency Injection

think of DEPENDENCY INJECTION like NestJS handing you the tools - instead of building or importing
them manually

so instead of this

```
const prisma = new PrismaClient(); //manual creation
```

you do this:

```
constructor(private prisma: PrismaService) {}
```

Nest will automatically create the 'PrismaService', manage its lifecycle, and pass it into the constructor for you
