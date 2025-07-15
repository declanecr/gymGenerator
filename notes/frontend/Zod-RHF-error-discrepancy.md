

 **Title**: Discrepancy between Zod array-level errors and RHF error structure
 
 **Problem**  
 When you write a Zod schema like
 
 ```ts
 exercises: z.array(exerciseSchema).min(1, 'Add at least one exercise')
 ```
 
 you naturally look for the message on `errors.exercises.message`. But React Hook Form (via `zodResolver`) flattens Zod’s array-level errors into an internal `_errors` array:
 
 ```ts
 errors = {
   exercises: {
     _errors: ['Add at least one exercise'],
     // …per-item errors by index…
   }
 }
 ```
 
 There is **no** `errors.exercises.message`, so your UI never sees the text.
 
 **Workarounds**
 
 1. **Fallback literal**: `{errors.exercises?.message ?? 'Add at least one exercise'}`
     
 2. **Read the internal array**:
     
     ```ts
     const arrErr = errors.exercises as { _errors?: string[] }
     const msg = arrErr._errors?.[0]
     ```
     
 3. **Derive from form state**: use `watch('exercises').length === 0` + `submitCount  0` and display the known string.
     
 
 **Next Steps**
 
 - Decide whether to expose `_errors` in our types or standardize on a fallback.
     
 - Update docs or add a helper util (e.g. `getArrayError(fieldErrors)`) so array-level messages are surfaced consistently.
