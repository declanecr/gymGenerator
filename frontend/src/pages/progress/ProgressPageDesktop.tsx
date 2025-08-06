import React from 'react';
import { Tabs, Tab, Grid, Box } from '@mui/material';
import {  LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import  { Dayjs } from 'dayjs';
import ProgressPageLayout from '../../layouts/ProgressPageLayout';
import WorkoutModal from '../../components/workouts/WorkoutModal';
import ExerciseSearch from '../../components/catalog/ExerciseSearch';
import type { Workout } from '../../api/workouts';
import ProgressLineChart from '../../components/progress/LineChart';
import WorkoutDateCalendar from '../../components/progress/WorkoutDateCalendar';

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
        <Grid container spacing={2} sx={{ p: 2 }}>
          <Grid size={12}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
              <Tab label="History" />
              <Tab label="Exercises" />
            </Tabs>
          </Grid>
          <Grid size={12}>
            {tab === 0 && (
              <Box>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <WorkoutDateCalendar
                    onChange={handleSelect}
                    workoutDates={daysWithWorkouts}
                    
                    /* You can still pass any DateCalendar prop, e.g. defaultValue, minDate, etc. */
                  />
                </LocalizationProvider>
              </Box>
            )}
          </Grid>
          <Grid size={12}>
            {tab === 1 && (
              <Box>
                <ExerciseSearch onSelect={e => setSelectedExerciseId(e.exerciseId)} />
                <Box sx={{ height: 600, width: 1}}>
                  <ProgressLineChart
                    progress={progress}
                    selectedExerciseId={selectedExerciseId}
                  />
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
        <WorkoutModal open={!!selected} workouts={selected || []} onClose={() => setSelected(null)} />
    </ProgressPageLayout>
  );
}