> [!note] Document Object Model
> It’s the **in-memory tree representation** of your HTML page that browsers build as they parse HTML.

> [!question] Why does it matter in testing?
> When you render a React component in Jest+JSDOM, you get a simulated DOM in Node so you can query and assert on elements (e.g. `screen.getByText('…')`).

