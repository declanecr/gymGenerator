// frontend\src\components\ExerciseCatalogList.tsx
import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemButton, 
  TextField, 
  IconButton,
  Box 
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add'
import { ExerciseCatalogItem } from "../../api/exerciseCatalog";
import { useState } from "react";
import { useFilteredExercises } from "../../hooks/catalog/useFilteredExercise";
import { useDebounce } from "../../hooks/useDebounce";

export interface ExerciseCatalogListProps {
  showCustom?: boolean;
  onSelect?: (exercise: ExerciseCatalogItem) => void;   //for details
  onAdd?: (ex: ExerciseCatalogItem) => void;     // direct add
}

export function ExerciseCatalogList({ showCustom =true, onSelect, onAdd, }: ExerciseCatalogListProps){
  const [query, setQuery] = useState(""); // state for the search term
  const debouncedQuery = useDebounce(query, 300);
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const {filtered: exercises, isLoading, error}=useFilteredExercises(debouncedQuery, showCustom)

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message} </div>;

  return (
    <Box>
      <TextField 
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search exercises..."
        fullWidth
        sx={{mb:2}}
      />
      <List>
        {exercises.map((exercise)=>(
          <ListItem 
            key={exercise.id} 
            disablePadding
            secondaryAction={
              hoveredId === exercise.id && onAdd ? (
                <IconButton
                  edge="end"
                  size="small"
                  onClick={(e)=> {
                    e.stopPropagation();
                    onAdd(exercise);
                  }}
                >
                  <AddIcon />
                </IconButton>
              ) :null
            }
            onMouseEnter={() => setHoveredId(exercise.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => onSelect?.(exercise)}
          >
            <ListItemButton>
              <ListItemText primary={exercise.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}