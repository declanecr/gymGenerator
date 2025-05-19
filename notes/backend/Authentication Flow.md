# (NestJS+JWT+bcrypt)
#backend
#auth


### Authentication FLOW

---

## 🛠️ Backend (NestJS + JWT + bcrypt)
### ✅ Registration (`POST /auth/signup`)

- Hash password with `bcrypt`
- Store user with hashed password in DB via [Prisma](Prisma.md)
- Return a JWT on success

**Password Hashing**

```ts
const salt = await bcrypt.genSalt();
const hash = await bcrypt.hash(password, salt);
```

#### Returned

```json
{
  "accessToken": "<JWT>",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

#### 🔑 Login (`POST /auth/login`)

- Find user by email
- Compare plaintext password with hashed password using `bcrypt.compare()`
- Return JWT if valid, error if not

#### 🔒 Protected Routes

- Use `@UseGuards(JwtAuthGuard)` to protect sensitive endpoints
- JWT is passed via `Authorization: Bearer <token>` header

##### JWT Strategy

```ts
JwtModule.register({
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: "1h" },
});
```

#### 📦 JWT Details

| Claim   | Value                       |
| ------- | --------------------------- |
| `sub`   | User ID                     |
| `email` | User email                  |
| `exp`   | Token expiry (e.g., 1 hour) |

---

### 🌐 Frontend (React + React Query + Axios)
#### ✅ After Login or Signup
- Store JWT in `localStorage` or `sessionStorage`
- Set it in Axios default headers via an `auth-header.js` helper
#### auth-header.js
```js
export default function authHeader() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.accessToken) {
    return { Authorization: `Bearer ${user.accessToken}` };
  }
  return {};
}
```
---
#### 🔄 Auth State
- App context or Zustand holds auth state (e.g., `user`, `token`)
- React Query automatically adds token to authenticated requests via Axios interceptor or manual headers
---
#### 🔁 Token Expiry + Refresh (Future Improvement)
##### Currently: No refresh token strategy
Planned:
- Store short-lived access token
- Use refresh token to rotate on expiry
---
#### 🚧 Common Issues / Debugging

| Issue                        | Fix                                                  |
| ---------------------------- | ---------------------------------------------------- |
| `accessToken` is `undefined` | Ensure backend returns token, and frontend stores it |
| `403 Unauthorized`           | Check Axios headers include the token                |
| `bcrypt.compare` fails       | Check that signup hashes password correctly          |
