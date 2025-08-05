import React from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import { DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import ProgressPageLayout from '../../layouts/ProgressPageLayout';
import WorkoutModal from '../../components/workouts/WorkoutModal';
import ExerciseSearch from '../../components/catalog/ExerciseSearch';
import { LineChart } from '@mui/x-charts';
import type { Workout } from '../../api/workouts';

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

export default function ProgressPageTablet({
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
          <ExerciseSearch onSelect={e => setSelectedExerciseId(e.exerciseId)} />
          {selectedExerciseId &&
            (progress.length ? (
              <LineChart
                xAxis={[{
                  data: progress.map(p => new Date(p.date)),
                  scaleType: 'time',
                  valueFormatter: (d: Date) => dayjs(d).format('MMM D'),
                }]}
                series={[{ data: progress.map(p => p.volume) }]}
                height={300}
              />
            ) : (
              <Typography>No data yet</Typography>
            ))}
        </Box>
      )}
      <WorkoutModal open={!!selected} workouts={selected || []} onClose={() => setSelected(null)} />
    </ProgressPageLayout>
  );
}