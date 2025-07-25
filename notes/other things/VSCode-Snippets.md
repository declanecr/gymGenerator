**Definition**  
VS Code snippets are JSON‐defined templates that expand a short prefix into reusable code with tab stops and placeholders.

```json
// .vscode/snippets/react.json
{
  "React FC": {
    "prefix": "rfc",
    "body": [
      "import React from 'react';",
      "",
      "const ${1:ComponentName}: React.FC<${2:Props}> = ({ ${3} }) => {",
      "  return (<div>${4}</div>);",
      "};",
      "",
      "export default ${1};"
    ],
    "description": "Generate a React functional component"
  }
}
```

> [!NOTE] #### Example Implementation
> ```tsx
> // In a .tsx file, type "rfc" and press Tab:
> 
> import React from 'react';
> 
> const MyComponent: React.FC<{ message: string }> = ({ message }) => {
>   return (<div>{message}</div>);
> };
> 
> export default MyComponent;
> ```
