#frontend #auth
## 🧰 `zod`

### ➤ What it is:

A **TypeScript-first schema validation library**. Think of it like Yup, but built from the ground up for TS.

### ➤ Why it's useful:

- **Schema-first validation** — you define exactly what data is valid.
    
- **Type inference** — no need to define separate interfaces.
    
- **Chainable + composable** — readable, modular logic.
    

### ➤ How it works:

You define a Zod schema like this:
```ts
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
```

---
> [!question]+ ## ✅ Why use [[Zod]] and [[React-Hook-Form]] _together_?
> Using RHF with Zod gives you:- Great performance (RHF)
   > 
> - Strong, type-safe validation (Zod)
>    
> - Clean, centralized form logic
 >   
>- Easy error display and API submission handling


