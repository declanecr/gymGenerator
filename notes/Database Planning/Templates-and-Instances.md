#database
## 🔍 Why you might need both `TemplateExercise` and `WorkoutExercise`

### 🎯 **Your app supports both planning and logging**

You have **Workout Templates** (plans) and **Workout Logs** (actuals). The exercises in each serve different purposes:

| Concept      | Template Side (`TemplateExercise`)    | Log Side (`WorkoutExercise`)                         |
| ------------ | ------------------------------------- | ---------------------------------------------------- |
| Purpose      | Defines _what the user intends to do_ | Records _what the user actually did_                 |
| Relationship | Belongs to `WorkoutTemplate`          | Belongs to a `Workout`                               |
| Stability    | May change (users edit templates)     | Immutable (historical record of a performed workout) |
| Fields       | Suggested reps, sets, load, order     | Actual reps, sets, load, perceived effort, notes     |
| Life Cycle   | Reused many times                     | Created once per workout log                         |

---
### ⚖️ Trade-Offs of **not** separating them

If you reused `Exercise` directly in both templates and logs:

- You’d have to overload a single model with two very different responsibilities.
    
- You’d risk corrupting old logs if templates change (since logs would point to editable entities).
    
- You'd lose flexibility in storing different data per context (suggested vs actual load, RPE, etc).
    

---

### ✅ A simple analogy

Think of a `TemplateExercise` as **a recipe instruction**, and `WorkoutExercise` as **what you actually cooked that day**. Same dish, different context.


<hr style="border: 8px solid #444; margin: 1em 0;" />




## My Understanding

>[!question]
>so what you're suggesting is I should have a template of both workouts and exercises, with the exercise template being what is used in the workout template. this would allow for all sorts of future planning for the user, while only after a workout has been completed ( or potentially at least after it has been started), would the information be transferred over to a "exercise" or "workout"?

---
>[!tip] ChatGPT's Response:
> Exactly—you're thinking about this the right way. ✅

---
## 🧱 Split the data into **template models** and **instance models**

That separation gives you:

### 🔧 **Planning Power**

- Users can edit templates freely.
    
- You can build features like: “Preview next week,” “Generate a 6-week progression,” or “Share a template.”
    

### 📝 **Reliable Logging**

- Once a workout is _started_ or _completed_, you snapshot relevant data (like which exercises, rep schemes, etc.)
    
- Logs don’t break if the user later edits the template.

---
### 🎯 So yes:

- `WorkoutTemplate` contains many `TemplateExercise`s
    
- When a user **starts** a workout, you:
    
    - Create a `Workout` instance
        
    - Duplicate the relevant `TemplateExercise`s into `WorkoutExercise`s
        
    - Those now belong to the specific `Workout`
        
- From there, users log `Set`s and optionally `Rep`s

