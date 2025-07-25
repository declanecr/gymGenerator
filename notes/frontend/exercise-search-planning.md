## 🧱 SearchBar Component Design (Draft)

### Props
- `onSelect: (exercise: Exercise | Exercise[]) => void`
- `allowMultiSelect?: boolean`
- `placeholder?: string`
- `filters?: Record<string, string>` // (for future use)

### Behavior
- Controlled input field
- Autocomplete list of exercises (from API)
- Optional multiselect via checkboxes or chips
- Debounced query for suggestions
- Keyboard and mouse navigation support

### State
- `searchQuery: string`
- `suggestions: Exercise[]`
- `selected: Exercise[]` (if multiselect)

### Integration Points
- Uses `useExercisesQuery` or `useSearchExercises(query)` hook (via React Query)
- On select: emits result to parent
- ---
## 🧪 Step-by-Step Dev Plan

**Step 1: Build a minimal SearchBar component**

- Text input with controlled state
    
- Debounced fetch on input change (e.g. 300ms delay)
    
- Simple dropdown of matching names
    

**Step 2: Wrap it in a generic `ExerciseSearch.tsx` component**

- Inject your query logic via a `useSearchExercises(query)` hook (we'll build that)
    

**Step 3: Add multiselect logic**

- Keep track of selected exercises in component state
    
- Support chip-style selection or checkbox lists
    

**Step 4: Refactor to be reusable**

- Accept callback props like `onSelect` and flags like `allowMultiSelect`

---
# build so far:
### useExercisesCatalog.ts
#### updated hook to include `placeholderData: []` 
ensures `data` is never undefined. This prevents the need for a guard against undefined type
### ExerciseCatalogList:
#### implements:
- [[debounce]] 
- filters exercises using `useFilteredExercises` 
- maps exercises into ListItems
- search bar (TextField)
	- on change => setQuery

### useFilteredExercises.ts
uses [[useMemo]] to avoid unnecessary

---
moving mutation logic out of `WorkoutForm` to `WorkoutContainer`
