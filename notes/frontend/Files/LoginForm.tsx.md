### 📌 Purpose:

This is a **presentational + logic component** that:

- Renders a login form with inputs (`email`, `password`)
    
- Uses **React Hook Form** to manage input state
    
- Uses **Zod** to validate inputs on submit
    
- Calls a passed-in `onSubmit` function (which handles API logic externally)
    

> This separation makes it reusable, testable, and decoupled from routing or context logic.

