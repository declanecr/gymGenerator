#API
#Database #Cheatsheet #backend 

## HTTP Actions Cheat Sheet

| Method  | CRUD     | Idempotent? | Safe?       | Typical Use                                    |
|---------|----------|-------------|-------------|------------------------------------------------|
| **GET**    | Read     | Yes         | Yes         | Retrieve a resource or list of resources       |
| **POST**   | Create   | No          | No          | Create a new resource                          |
| **PUT**    | Replace  | Yes         | No          | Replace an existing resource entirely          |
| **PATCH**  | Update   | No          | No          | Partially update an existing resource          |
| **DELETE** | Delete   | Yes         | No          | Remove a resource                              |
| **HEAD**   | Metadata | Yes         | Yes         | Same as GET but only returns headers           |
| **OPTIONS**| Discovery| Yes         | Yes         | Describe communication options for the target  |

- **Idempotent?** Calling the same request multiple times has the same effect as calling it once.  
- **Safe?** Call has no side-effects on server state.