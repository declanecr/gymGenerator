#API #Cheatsheet #backend 
## Endpoint Syntax Cheat Sheet

### Base URL
https://api.example.com/v1

### Resource Paths
/resources → collection  
/resources/{id} → single item  
/resources/{id}/sub → nested collection

### Common Patterns

| Pattern                                 | Example                              |
|-----------------------------------------|--------------------------------------|
| List all resources                      | `GET  /users`                        |
| Get one resource by ID                  | `GET  /users/{userId}`               |
| Create a new resource                   | `POST /users`                        |
| Replace a resource                      | `PUT  /users/{userId}`               |
| Partially update a resource             | `PATCH /users/{userId}`              |
| Delete a resource                       | `DELETE /users/{userId}`             |
| Nested resource (belongs to parent)     | `GET  /users/{userId}/posts`         |
| Action on a resource (custom operation) | `POST /orders/{orderId}/cancel`      |

### Query Parameters & Filtering
GET /users?limit=20&offset=40  
GET /posts?author=123&sort=-createdAt

- **Pagination**: `?limit={n}&offset={m}` or Cursor-based (e.g. `?cursor={id}&limit={n}`)
- **Filtering**: `?field=value`
- **Sorting**: `?sort=field` or `?sort=-field` (descending)