

## 🛠️ Skeleton Guide: Form Validation

This project uses **React Hook Form** with **Zod** to handle client-side validation. The backend uses **class-validator** within DTOs for server-side checks. Keeping schemas consistent across both layers prevents mismatched rules.

### 1. Define a Zod Schema

```ts
import { z } from "zod";

export const userFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).optional(),
});

export type UserFormInput = z.infer<typeof userFormSchema>;
```

*Why?* Zod provides type-safe schemas so you can infer `UserFormInput` directly and share validation rules.

### 2. Hook Schema into React Hook Form

```tsx
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<UserFormInput>({
  resolver: zodResolver(userFormSchema),
});
```

Use the `resolver` to connect Zod with React Hook Form. RHF now handles parsing and error messages for you.

### 3. Display Field Errors with MUI

```tsx
<TextField
  label="Email"
  {...register("email")}
  error={!!errors.email}
  helperText={errors.email?.message}
/>
```

*Why?* Leveraging MUI’s `error` and `helperText` props keeps the UI consistent.

### 4. Mirror Backend DTOs

When creating new endpoints, define DTOs with `class-validator`:

```ts
export class CreateExerciseDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
```

For the client, create a matching Zod schema so that both layers enforce the same rules.

### 5. Example: Workout Form

The existing `createWorkoutSchema` in `src/schemas/` is used by `WorkoutContainer`.
Adapt this pattern for new forms:

```ts
export const createWorkoutSchema = z.object({
  workoutTemplateId: z.string().optional(),
  name: z.string().min(1, "Name required"),
  notes: z.string().optional(),
});
```

Then consume it within a form component using `useForm` and `FormProvider` as shown in `WorkoutContainer` and `WorkoutForm`.

### 6. Server-side Verification

Ensure you enable Nest’s `ValidationPipe` (already set in `main.ts`) so every incoming request is checked against DTO rules. This guards against invalid payloads even if the client skips validation.

---
*Next Steps*: When adding new features, start with a Zod schema that mirrors the backend DTO. Use the schema in React Hook Form for immediate feedback, and rely on the backend’s DTO for final verification.
 
