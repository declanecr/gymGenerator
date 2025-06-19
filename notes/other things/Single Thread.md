**Definition**:  
Node.js runs your code on **one main thread** — it doesn’t spin up new threads per request like some other platforms (e.g., Java, Python).

But thanks to **non-blocking I/O**, it can **handle thousands of tasks concurrently** by handing off slow tasks (like I/O) to the background.

#### 🧠 Analogy:

Imagine a chef (single thread) in a kitchen who **delegates long tasks** (baking, boiling) to timers, while continuing to prep other things.