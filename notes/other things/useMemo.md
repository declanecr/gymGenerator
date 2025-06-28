**Definition**  
`useMemo(fn, deps)` returns a cached value; `fn` re-runs only when a listed dependency changes, trimming rerender work and preserving stable object/array references.

```tsx
// React FC – memoize filtered exercise list
const ExerciseCatalog: React.FC<Props> = ({ catalog, includeCustom }) => {
  const visibleExercises = useMemo(
    () => catalog.filter(e => includeCustom || e.default),
    [catalog, includeCustom],
  );

  return (
    <List>
      {visibleExercises.map(ex => (
        <ListItem key={ex.id}>{ex.name}</ListItem>
      ))}
    </List>
  );
};
```
> [!note] in this example
> the `fn` only "wakes up" to rerun when **either** `catalog` or `includeCustom` changes
