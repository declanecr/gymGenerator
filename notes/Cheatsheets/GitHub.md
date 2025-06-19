**Essentials**

- **`git clone <repo_url>`**  
    Copy a remote repository to your local machine.
    
- **`git status`**  
    See untracked, modified, and staged files.
    
- **`git add <file>` / `git add .`**  
    Stage specific files or all changes for commit.
    
- **`git commit -m "msg"`**  
    Record staged changes; write clear, concise messages.
    
- **`git push [remote] [branch]`**  
    Upload commits to the specified remote (e.g., `origin`) and branch (e.g., `main`).
    
- **`git pull [remote] [branch]`**  
    Fetch and merge changes from the remote branch into your local branch.
    

---

**Branching & Merging**

- **`git branch`**  
    List local branches.
    
- **`git branch <name>`**  
    Create a new branch called `<name>`.
    
- **`git checkout <name>`**  
    Switch to branch `<name>`. Use `git switch <name>` for newer Git.
    
- **`git checkout -b <name>`**  
    Create and switch to a new branch in one step.
    
- **`git merge <name>`**  
    Merge branch `<name>` into the current branch. Resolve conflicts promptly.
    
- **`git rebase <branch>`**  
    Reapply commits on top of `<branch>`. Cleaner history, but rewrite history carefully.
    

---

**Undo & Recovery**

- **`git reset --soft HEAD~1`**  
    Uncommit last commit, keep changes staged.
    
- **`git reset --hard HEAD~1`**  
    Discard last commit and its changes permanently. Use with extreme caution.
    
- **`git revert <commit>`**  
    Create a new commit that undoes `<commit>` without rewriting history.
    
- **`git stash` / `git stash pop`**  
    Temporarily set aside unstaged changes and reapply them later.
    

---

**Remote Management**

- **`git remote -v`**  
    List configured remotes and their URLs.
    
- **`git remote add <name> <url>`**  
    Add a new remote called `<name>`.
    
- **`git fetch <remote>`**  
    Download objects and refs from `<remote>`, but don’t merge.
    
- **`git push -u <remote> <branch>`**  
    Set `<branch>` to track `<remote>/<branch>`; subsequent pushes can omit `-u`.
    

---

**Logs & Inspection**

- **`git log --oneline --graph --decorate`**  
    Compact, visual commit history.
    
- **`git show <commit>`**  
    Display details of a specific commit.
    
- **`git diff`**  
    Show unstaged changes; `git diff --staged` for staged.
    

---

**Tips & Conventions**

- Always pull and inspect (`git fetch` + `git log ..origin/<branch>`) before pushing.
    
- Write commit messages in present tense and reference issue numbers when possible.
    
- Keep branches short-lived and descriptive (e.g., `feature/login-form`, `fix/auth-bug`).
    
- Avoid force-pushing (`git push --force`) on shared branches—use it only on personal feature branches.
    
- Tag releases: **`git tag -a v1.0.0 -m "Release v1.0.0"`** and **`git push origin --tags`**.