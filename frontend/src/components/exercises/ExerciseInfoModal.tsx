import { Dialog, DialogContent, DialogTitle, Typography, Chip, DialogActions, Button } from "@mui/material";
import { ExerciseCatalogItem } from "../../api/exerciseCatalog";

interface ExerciseInfoModalProps {
  open: boolean;
  exercise: ExerciseCatalogItem | null;
  onClose: () => void;
}

export function ExerciseInfoModal({
    open,
    exercise,
    onClose,
}: ExerciseInfoModalProps) {
    return (
      <Dialog open={open} onClose={onClose}>
        {exercise && (
          <>
            <DialogTitle>{exercise.name}</DialogTitle>
            <DialogContent>
              {/* e.g. */}
              <Typography>{exercise.description}</Typography>
              <Chip label={exercise.primaryMuscle} />
              {/* any other fields */}
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    );
}
