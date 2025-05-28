#API #auth #backend 
## 🔐 bcrypt Cheatsheet

### 1. Installation
```bash
# Native bindings (recommended for performance)
npm install bcrypt

# If you hit troubles compiling, fallback to JS-only:
npm install bcryptjs
```
---
### 2. Imports

``` ts
// with native bcrypt
import * as bcrypt from 'bcrypt';

// or, with the bcryptjs drop-in
import * as bcrypt from 'bcryptjs';
```
---
### 3. Core Concepts

- **Salt**: random data mixed into the hash to protect against rainbow-table attacks
    
- **Salt Rounds**: how many times to process the data—higher = slower but more secure
    
- **Hash**: the salted, iterated digest of your password
---
### 4. Generating a Hash

#### Async (non-blocking)

``` ts
const SALT_ROUNDS = 10;            // configurable via env var 
const passwordPlain = 'P@ssw0rd!';  
const hash = await bcrypt.hash(passwordPlain, SALT_ROUNDS); 
// → a string like '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36v9Y...'
```

#### Sync (blocking)

```ts
const salt    = bcrypt.genSaltSync(SALT_ROUNDS);
const hashSync = bcrypt.hashSync(passwordPlain, salt);
```
---
### 5. Verifying a Password

#### Async

```ts
const isMatch = await bcrypt.compare(passwordPlain, storedHash); 
if (isMatch) {   
	// ✅ password is correct 
} else {   
	// ❌ invalid credentials 
}
```

#### Sync

```ts
const isMatchSync = bcrypt.compareSync(passwordPlain, storedHash);
```
---
### 6. Manually Generating/Using a Salt
```ts
// Generate salt separately (async or sync)
const salt = await bcrypt.genSalt(12);
// or: const salt = bcrypt.genSaltSync(12);

// Then:
const hashWithCustomSalt = await bcrypt.hash(passwordPlain, salt);
```
---
### 7. Error Handling

- **Common pitfalls**
    
    - Forgetting to `await` the async calls (you get a Promise object, not the hash)
        
    - Confusing `hash()` salt-rounds argument with an explicit salt string
        
- **Wrap in try/catch**:
``` ts
try {
  const hash = await bcrypt.hash(passwordPlain, SALT_ROUNDS);
} catch (err) {
  // Handle error (e.g. log, rethrow, user-friendly message)
}
```
---
### 8. Configuration & Best Practices

- **Env-configurable rounds**:
```ts
const rounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;
```
- **Performance trade-off**
    
    - 10–12 rounds → ~100–200 ms/hash on modern hardware (good default)
        
    - Higher rounds → stronger but slower (beware blocking user requests)
        
- **Always use async** in production code to avoid blocking the event loop.
    
- **Never store plaintext** or the salt separately—`hash` includes the salt.
---
### 9. Testing Tips

- Use **sync** versions in unit tests for simplicity/faster teardown.
    
- Or mock `bcrypt.hash` / `compare` to return predictable values.
---
### Quick Reference

- **Hash a password**  
  ```ts
  const hash = await bcrypt.hash(password, rounds);
  // ⇒ Promise<string>
```

- **Compare password & hash**
```ts
const isMatch = await bcrypt.compare(password, hash);
// ⇒ Promise<boolean>
```
- **Generate a salt**
```ts
const salt = await bcrypt.genSalt(rounds);
// ⇒ Promise<string>
```
