import { Dialog, DialogTitle, DialogContent, Card, CardContent, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Workout } from '../../api/workouts'
import { useWorkoutExercises } from '../../hooks/workoutExercises/useExercises'
import { useQueries } from '@tanstack/react-query'
import { fetchWorkoutSets } from '../../api/sets'
import { WorkoutSet } from '../../api/sets'

interface WorkoutModalProps {
  open: boolean
  workouts: Workout[]
  onClose: () => void
}

function WorkoutDetailCard({ workout }: { workout: Workout }) {
  const { data: exercises = [], isLoading } = useWorkoutExercises(workout.id)

  const setsQueries = useQueries({
    queries: exercises.map(ex => ({
      queryKey: ['sets', workout.id, ex.workoutExerciseId],
      queryFn: () => fetchWorkoutSets(workout.id, ex.workoutExerciseId)
    }))
  })

  const loadingSets = setsQueries.some(q => q.isLoading)
  const setsErrors = setsQueries.some(q => q.error)

  if (isLoading || loadingSets) return <Typography>Loading...</Typography>
  if (setsErrors) return <Typography>Error loading sets</Typography>

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>{workout.name}</Typography>
        {exercises.map((ex, idx) => {
          const sets = (setsQueries[idx].data || []) as WorkoutSet[]
          return (
            <Accordion key={ex.workoutExerciseId} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{ex.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {sets.map(set => (
                  <Typography key={set.id} sx={{ ml: 1 }}>
                    Set {set.position}: {set.reps} reps @ {set.weight}
                  </Typography>
                ))}
              </AccordionDetails>
            </Accordion>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default function WorkoutModal({ open, workouts, onClose }: WorkoutModalProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Workouts</DialogTitle>
      <DialogContent>
        {workouts.map(w => (
          <WorkoutDetailCard key={w.id} workout={w} />
        ))}
      </DialogContent>
    </Dialog>
  )
}