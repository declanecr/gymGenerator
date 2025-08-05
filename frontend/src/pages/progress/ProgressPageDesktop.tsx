import React from 'react';
import { Tabs, Tab, Grid } from '@mui/material';
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import ProgressPageLayout from '../../layouts/ProgressPageLayout';
import WorkoutModal from '../../components/workouts/WorkoutModal';
import ExerciseSearch from '../../components/catalog/ExerciseSearch';
import type { Workout } from '../../api/workouts';
import ProgressLineChart from '../../components/progress/LineChart';

interface Progress {
  date: string;
  volume: number;
}

interface Props {
  tab: number;
  setTab: React.Dispatch<React.SetStateAction<number>>;
  daysWithWorkouts: Set<string>;
  handleSelect: (date: Dayjs | null) => void;
  selected: Workout[] | null;
  setSelected: React.Dispatch<React.SetStateAction<Workout[] | null>>;
  selectedExerciseId: number | null;
  setSelectedExerciseId: React.Dispatch<React.SetStateAction<number | null>>;
  progress: Progress[];
}

export default function ProgressPageDesktop({
  tab,
  setTab,
  daysWithWorkouts,
  handleSelect,
  selected,
  setSelected,
  selectedExerciseId,
  setSelectedExerciseId,
  progress,
}: Props) {
  return (
    <ProgressPageLayout>
      <Grid>
        <Grid sx={{minWidth: '100vw'}}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
            <Tab label="History" />
            <Tab label="Exercises" />
          </Tabs>
        </Grid>
        <Grid container sx={{minWidth: '100vw', minHeight:'100vh'}}>
          {tab === 0 && (
            <Grid container sx={{minWidth: '100vw', minHeight:'100vh'}}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                  onChange={handleSelect}
                  shouldDisableDate={d => !daysWithWorkouts.has(dayjs(d).format('YYYY-MM-DD'))}
                />
              </LocalizationProvider>
            </Grid>
          )}
          {tab === 1 && (
            <Grid>
              <Grid sx={{ minHeight:350, minWidth: 350}}>
                <ExerciseSearch onSelect={e => setSelectedExerciseId(e.exerciseId)} />
                <ProgressLineChart
                  progress={progress}
                  selectedExerciseId={selectedExerciseId}
                />
              </Grid>
            </Grid>
          )}
        </Grid>
        <WorkoutModal open={!!selected} workouts={selected || []} onClose={() => setSelected(null)} />
      </Grid>
    </ProgressPageLayout>
  );
}