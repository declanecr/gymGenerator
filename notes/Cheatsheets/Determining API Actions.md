#API #Cheatsheet #backend 
## Determining API Actions Cheat Sheet

1. **Map Models to Resources**  
   - For each Prisma model, define a top-level “resource” name (usually plural).  
     ```
     User         → /users
     TemplateWorkout → /template-workouts
     ```

2. **CRUD vs. Custom Actions**  
   - **CRUD**: Create (POST), Read (GET), Update (PUT/PATCH), Delete (DELETE)  
   - **Custom**: Actions not covered by CRUD (e.g. `/workouts/{id}/start`, `/templates/{id}/clone`)

3. **Ask the “What do clients need?” Questions**  
   - Create: What data must clients supply?  
   - Read: Do they need lists, single items, nested data?  
   - Update: Full replace or partial?  
   - Delete: Any cascade effects?  
   - Extras: Any workflows (start/stop, publish/unpublish, share)?

4. **Design Endpoints**  
   - **Keep it RESTful**: Resources and HTTP verbs represent intent.  
   - **Use nesting sparingly**: Only when it conveys true hierarchy.  
   - **Avoid verbs in paths**: Actions should be verbs via HTTP methods or custom sub-resources.  
     - ✅ `POST /orders/{id}/cancel`  
     - ❌ `POST /orders/{id}/cancelOrder`

5. **Define Input & Output (DTOs)**  
   - **Request DTO**: Define required vs. optional fields.  
   - **Response DTO**: Consistent shape, include IDs and timestamps.  
   - **Validation**: Zod / class-validator schemas per DTO.

6. **Versioning & Error Handling**  
   - **Version your API**: `/v1/users`, `/v2/users`  
   - **Use standard status codes**:  
     - `200 OK`, `201 Created`, `204 No Content`  
     - `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, `500 Internal Server Error`  
   - **Return a consistent error format**:  
     ```json
     {
       "status": 400,
       "error": "Bad Request",
       "message": "email is required"
     }
     ```