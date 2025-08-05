import { useMemo, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { useWorkouts } from '../../hooks/workouts/useWorkouts'
import type { Workout } from "../../api/workouts"
import { useProgress } from '../../hooks/progress/useProgress'
import { useDevice } from '../../context/DeviceContext'
import ProgressPageMobile from './ProgressPageMobile'
import ProgressPageTablet from './ProgressPageTablet'
import ProgressPageDesktop from './ProgressPageDesktop'

export default function ProgressPage() {
  const [tab, setTab] = useState(0)
  const { data: workouts = [] } = useWorkouts()
  const [selected, setSelected] = useState<Workout[] | null>(null)
  const [selectedExerciseId, setSelectedExerciseId]=useState<number | null>(null)
  const { data: progress = [] } = useProgress(selectedExerciseId ?? 0)

  const { isMobile, isTablet } = useDevice();

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

  const View = isMobile ? ProgressPageMobile : isTablet ? ProgressPageTablet : ProgressPageDesktop
  return (
    <View
      tab={tab}
      setTab={setTab}
      daysWithWorkouts={daysWithWorkouts}
      handleSelect={handleSelect}
      selected={selected}
      setSelected={setSelected}
      selectedExerciseId={selectedExerciseId}
      setSelectedExerciseId={setSelectedExerciseId}
      progress={progress}
    />
  )
}