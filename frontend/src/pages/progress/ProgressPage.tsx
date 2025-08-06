import { useMemo, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { useWorkouts } from '../../hooks/workouts/useWorkouts'
import type { Workout } from '../../api/workouts'
import { useProgress } from '../../hooks/progress/useProgress'
import { Tabs, Tab, Grid, Box } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import WorkoutModal from '../../components/workouts/WorkoutModal'
import ExerciseSearch from '../../components/catalog/ExerciseSearch'
import ProgressLineChart from '../../components/progress/LineChart'
import WorkoutDateCalendar from '../../components/progress/WorkoutDateCalendar'
import DefaultLayout from '../../layouts/DefaultLayout'

export default function ProgressPage() {
  const [tab, setTab] = useState(0)
  const { data: workouts = [] } = useWorkouts()
  const [selected, setSelected] = useState<Workout[] | null>(null)
  const [selectedExerciseId, setSelectedExerciseId] = useState<number | null>(null)
  const { data: progress = [] } = useProgress(selectedExerciseId ?? 0)

  const byDate = useMemo(() => {
    const map: Record<string, Workout[]> = {}
    workouts.forEach(w => {
      const d = dayjs(w.createdAt).format('YYYY-MM-DD')
      if (!map[d]) map[d] = []
      map[d].push(w)
    })
    return map
  }, [workouts])

  const daysWithWorkouts = new Set(Object.keys(byDate))

  function handleSelect(date: Dayjs | null) {
    if (!date) return
    const key = date.format('YYYY-MM-DD')
    if (byDate[key]) setSelected(byDate[key])
  }

  return (
    <DefaultLayout>
      <Grid container spacing={2} sx={{ p: 2 }}>
        <Grid size={{ xs: 12 }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
            <Tab label="History" />
            <Tab label="Exercises" />
          </Tabs>
        </Grid>
        <Grid size={{ xs: 12 }}>
          {tab === 0 && (
            <Box>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <WorkoutDateCalendar onChange={handleSelect} workoutDates={daysWithWorkouts} />
              </LocalizationProvider>
            </Box>
          )}
        </Grid>
        <Grid size={{ xs: 12 }}>
          {tab === 1 && (
            <Box>
              <ExerciseSearch onSelect={e => setSelectedExerciseId(e.exerciseId)} />
              <Box sx={{ height: 600, width: 1 }}>
                <ProgressLineChart progress={progress} selectedExerciseId={selectedExerciseId} />
              </Box>
            </Box>
          )}
        </Grid>
      </Grid>
      <WorkoutModal open={!!selected} workouts={selected || []} onClose={() => setSelected(null)} />
    </DefaultLayout>
  )
}