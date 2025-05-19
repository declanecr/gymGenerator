**Definition**:  
**I/O** = Input/Output (e.g., reading a file, querying a database, making an API call).  
**Non-blocking** means Node doesn't wait for one task to finish before starting the next.

#### ❌ Blocking I/O (e.g., traditional PHP):
``` js
const data = fs.readFileSync('bigfile.txt');  // Waits here until done
console.log("After reading file");            // Runs only *after* reading
```
#### ✅ Non-blocking I/O (Node.js):
``` js
fs.readFile('bigfile.txt', (err, data) => {
  console.log("File read complete");
});
console.log("After reading file"); // Runs immediately, before file finishes
```
#### 🧠 Analogy:

A barista takes your order (I/O), starts making it, but **doesn't stop** taking other orders while waiting for your coffee to brew. That’s non-blocking.