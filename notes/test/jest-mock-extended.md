#testing 
## 🧱 `mockDeep<Type>()`

This function **creates a fully deep mock** of a type — meaning all nested properties and functions are also mocked. Think of it as a recursive `jest.fn()` builder that preserves your type definitions.

### Example:

```ts
import { mockDeep } from 'jest-mock-extended'; 
import type { UserService } from '../users.service';  

const mockUserService = mockDeep<UserService>();
```

Here, `mockUserService` is:
- Fully typed like `UserService`
    
- Deeply mocked — all nested objects, functions, and return types are mockable
    
- Safe to pass into a NestJS controller for unit testing

---

## 🤖 `DeepMockProxy<Type>`

This is the **type you assign** to your mock when you want TypeScript to treat it as a fully-deep mock (so it knows what `.mockResolvedValue()` or `.mockReturnValue()` methods are available on deeply nested functions).

### Why it’s needed:

By default, TypeScript sees your mock as a `Type`, not as a `Mock`. So when you call `mockFn.mockResolvedValue(...)`, TS complains unless it knows it’s a `DeepMockProxy`.

### Example:

``` ts
import { DeepMockProxy } from 'jest-mock-extended';  

let mockUserService: DeepMockProxy<UserService>;
```

Then assign it with:

```ts
mockUserService = mockDeep<UserService>();
```
---

> [!NOTE] # My current understanding
> `DeepMockProxy` is the TYPE used to define an object/variable's type as fully mocked
> `mockDeep` is the **FUNCTION** used to CREATE a fully mocked object of a specified type

> [!question] # Quiz Time:
> How would you mock a `PrismaService` in your tests using `mockDeep`?
> Where in your test setup would you cast it to `DeepMockProxy`?
> And once that's in place:
> - How would you control return values from e.g. `prisma.user.findUnique()`?
> - How would this differ from a shall mock (like `jest.fn()`)?


> [!NOTE] # My Response
> I would mock PrismaService in my tests by:
> const mockPrismaService = deepMock<PrismaService>();
> 
> in my test setup i would cast it to DeepMockProxy using let at the top of the test (before the mock itself?)
> 
> I would control return values by:
> const res = await mockPrismaService.user.findUnique()
> 
> this differs from a shallow mock by inherently mocking all nested things instead of just the top function, allowing you to access a mocked `user` and `.findUnique`

> [!success] # What I Got RIGHT
> - **Use `mockDeep<PrismaService>()`**: Yep — this gives you recursive, type-safe mocks.
>     
> - **You’d cast with `DeepMockProxy`**: Yes — you do that so TS knows `.mockResolvedValue(...)` and friends exist.
>     
> - **Return values**: Exactly — `mockPrismaService.user.findUnique.mockResolvedValue(...)` is possible because of the deep mock.
>     
> - **Difference from shallow mock**: Correct — a `jest.fn()` mock would require you to manually mock every nested layer (`user`, then `findUnique`, etc.).

> [!failure] # Small fix
> You wrote:
> `const res = await mockPrismaService.user.findUnique()`
> 
> That works in a real app — but in a **test**, you usually want to control the return value of that call. So instead, you’d do:
> 
> `mockPrismaService.user.findUnique.mockResolvedValue(mockUser);`
> 
> Then your app code would call it, and it would return `mockUser`.