import { useMemo, useState } from 'react'
import { Box, Tabs, Tab, Typography, Grid } from '@mui/material'
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import { useWorkouts } from '../hooks/workouts/useWorkouts'
import type { Workout } from "../api/workouts"
import ProgressPageLayout from '../layouts/ProgressPageLayout'
import WorkoutModal from '../components/workouts/WorkoutModal'
import ExerciseSearch from '../components/catalog/ExerciseSearch'
import { useProgress } from '../hooks/progress/useProgress'
import { LineChart } from '@mui/x-charts'

export default function ProgressPage() {
  const [tab, setTab] = useState(0)
  const { data: workouts = [] } = useWorkouts()
  const [selected, setSelected] = useState<Workout[] | null>(null)
  const [selectedExerciseId, setSelectedExerciseId]=useState<number | null>(null)
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
    <ProgressPageLayout>
      <Grid container sx={{ height: '100%', width: '100%'}}>
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, p: 2}}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
            <Tab label="History" />
            <Tab label="Exercises" />
          </Tabs>
          {tab === 0 && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                onChange={handleSelect}
                shouldDisableDate={d => !daysWithWorkouts.has(dayjs(d).format('YYYY-MM-DD'))}
              />
            </LocalizationProvider>
          )}
          {tab === 1 && (
            <Box sx={{ mt: 2 }}>
              <ExerciseSearch onSelect={e => setSelectedExerciseId(e.exerciseId)}/>
                {selectedExerciseId && (progress.length ? (
                  <LineChart
                    xAxis={[{
                      data: progress.map(p => new Date(p.date)),
                      scaleType: 'time',
                      valueFormatter: (d: Date) => dayjs(d).format('MMM D'),
                    }]}
                    series={[{data: progress.map(p => p.volume)}]}
                    height={300}
                    width={500}
                  />
                ):(
                  <Typography>No data yet</Typography>
                )
                )}
            </Box>
          )}
          <WorkoutModal open={!!selected} workouts={selected || []} onClose={() => setSelected(null)} />
        </Box>
      </Grid>
    </ProgressPageLayout>
  )
}