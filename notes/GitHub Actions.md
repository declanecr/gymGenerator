# Caching

## 🧠 Why Cache?

Without caching, **every GitHub Actions run installs fresh dependencies**, even if nothing changed — slowing down the pipeline by 20–60 seconds.

By caching `~/.npm`, GitHub Actions reuses previously installed packages **if the lockfile hasn’t changed**, which speeds things up.

---

## 🔍 Breaking Down the `cache` Step

```yaml
- name: Cache npm dependencies
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

### 🔑 `path: ~/.npm`

- This is where global npm packages live on the runner.
    
- GitHub saves and restores this folder between runs.
    

---

### 🔑 `key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}`

- This creates a unique cache key based on:
    
    - The OS (e.g., `ubuntu`)
        
    - The hash of `package-lock.json` files (in all subdirs)
        
- **If any lockfile changes, the cache is invalidated** (which is what you want).
    

---

### 🔑 `restore-keys`

- Fallbacks in case the exact hash key isn’t found.
    
- Here, `ubuntu-node-` is a partial match. It allows GitHub to reuse a previous cache if the hash isn't found.
    

---

## ⚠️ Note:

- This only caches the **downloaded packages**, not the `node_modules` directory. That’s fine for now because `npm ci` or `npm install` will be fast using the cache.
    

---

✅ Make sense?  
If so, let's move on to **STEP 4: Run `tsc`, `lint`, and tests`.  
How would you write those next 3 steps? (assume each is a separate shell command run from root)