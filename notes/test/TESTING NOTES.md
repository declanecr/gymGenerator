#testing 
# KEY LESSONS
- Tests are defined by **what** they exercise -- **NOT** just where the bug might show up
# Unit Tests
> _“Does this function/class work in isolation?”_

- Example: `UserService.createUser()` returns a user with a hashed password.
    
- Uses: Jest (`*.spec.ts`)
    
- Trade-off: Fast & reliable, but can’t catch integration bugs.
> [!note] Think of each component/module like a **self-container circuit board**
> - Goal: *Does this unit behave correctly under all expected conditions?*
> - Scope: One function/class at a time. No database. No network.
> - Example: 
> ``` ts
it('hashes password before saving', async () => {
  const result = await userService.createUser(dto);
  expect(result.password).not.toBe(dto.password);
});

# Integration Tests
> _“Do these components work correctly together?”_

- Example: Calling `POST /auth/register` writes to SQLite via Prisma.
    
- Tools: Jest + [Supertest](https://github.com/visionmedia/supertest) (backend), MSW (frontend)
    
- Trade-off: Higher coverage, but slower and more fragile.
> [!note] Now imagine connecting several circuit boards together -- do they **communicate properly**
> - Goal: *Does the flow between modules work as expected?*
> - Scope: e.g., `POST /auth/register` -> controller -> service -> DB
> - These often:
> 	- His a real DB (SQLite in dev)
> 	- Use Realistic data
> - Example: 
> ``` ts
const res = await request(app.getHttpServer())
  .post('/auth/register')
  .send({ email: 'a@test.com', password: 'pass' });
expect(res.status).toBe(201);

# e2e Tests
> _“Does the entire app work from user perspective?”_

- Example: A real user registers → logs in → sees profile page.
    
- Tools: Playwright, Cypress (not yet in your stack)

---


> [!question] Quiz Time:
> Let’s check if this has clicked — how would you classify each of the following?
> 1. Testing that a Zod schema rejects a missing email in a login form?
> 2. Testing that `users.controller.ts` throws a 403 if user is not authenticated
> 3. Testing that a user can register and then immediately login?

> [!note] My Answers
> 1. integration, because zod schema is existing separate from the login form, and the test is checking the INTEGRATION of a zod schema w/ a login form 
> 2. unit, because the user can be defined within the test case, meaning this is dealing with "internal wiring". 
> 3. could be either, it depends on whether the forms/pages are defined independently of one another, where the functionality is defined, etc. But, under the assumption that this is checking whether a registration immediately triggers a log in/navigate action: i would say this is a unit test because it is ensuring the order of actions and that each action correctly executes, INSTEAD of checking that separate Login and Register components work independently of each other



> [!success] # 1. Zod Schema rejecting missing email in login form
> Your call: **Integration**  
> **Evaluation**: ⭐ Mostly correct — and your _why_ is sound.
> 
> - If you're testing how `React Hook Form` uses your Zod schema inside a _form component_, you're verifying integration.
>     
> - But if you test the Zod schema _on its own_, it’s a **unit test**.

> [!failure] # 2. users.controller.ts throws 403 if user is not authenticated
> Your call: **Unit**  
> **Evaluation**: ❌ Mostly **integration** (but this one’s tricky).
> 
> Here’s why:
> 
> - `@UseGuards(AuthGuard())` is a NestJS **decorator** injected by the framework.
>     
> - When you test `users.controller.ts` with `supertest`, you’re testing how Nest wires **routing → controller → guard → service**.
>     
> - That’s integration across **layers**, even if you mock the user.
>     
> 
> If instead you isolated the `JwtStrategy` class and tested `validate(payload)`? That’s **unit**.

> [!success] # 3. Register and immediately login
> Your call: **Unit**, conditionally  
> **Evaluation**: ✔️ Great insight — this depends on what _you_ define the test boundary to be.
> Let’s break it down:
> 
> | Variant                                                                   | Scope                   | Type                |
> | ------------------------------------------------------------------------- | ----------------------- | ------------------- |
> | Test that `register` mutation runs → `login` mutation runs → `navigate()` | Custom hook or function | **Unit**            |
> | Test that UI flow from RegisterPage to Dashboard works with real API      | Full React flow         | **Integration/E2E** |
> | Test that both mutations return success in a single backend test          | API + DB                | **Integration**     |

---
> [!tldr] # Key Takeaways
> 1. **Boundary defines type** — what are you testing _in isolation_, and what’s treated as a _black box_?
>     
> 2. **Don't overthink labels** — categorize tests _to inform how you write them_, not for purity.
>     
> 3. **Be intentional** — e.g., _“I’m writing an integration test to verify that the AuthGuard works with the controller in the NestJS context.”_

