// src/components/progress/WorkoutDateCalendar.tsx
import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Badge from '@mui/material/Badge';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';

/* ---------- 1.  Custom day cell (48 px + badge) ---------- */
type WorkoutDayExtra = { workoutDates: Set<string> };
type WorkoutDayProps = PickersDayProps & WorkoutDayExtra;

const WorkoutDay: React.FC<WorkoutDayProps> = ({
  workoutDates,
  day,
  outsideCurrentMonth,
  ...other
}) => {
  const iso = day.format('YYYY-MM-DD');
  const hasWorkout = workoutDates.has(iso);

  return (
    <Badge overlap="circular" badgeContent={hasWorkout ? '🏋️' : undefined}>
      <PickersDay
        {...other}
        day={day}
        outsideCurrentMonth={outsideCurrentMonth}
        disabled={!hasWorkout}
        sx={{ width: 48, height: 48 }}
      />
    </Badge>
  );
};

/* ---------- 2.  Calendar wrapper ---------- */
export interface WorkoutDateCalendarProps
  extends Omit<
    React.ComponentProps<typeof DateCalendar>,
    'slots' | 'slotProps' | 'shouldDisableDate'
  > {
  /** ISO strings (`YYYY-MM-DD`) that contain workouts */
  workoutDates: Set<string>;
}

export default function WorkoutDateCalendar({
  workoutDates,
  ...calendarProps
}: WorkoutDateCalendarProps) {
  /* capture the workoutDates in a wrapper component */
  const DayComponent = React.useCallback(
    (props: PickersDayProps) => (
      <WorkoutDay {...props} workoutDates={workoutDates} />
    ),
    [workoutDates]
  );

  return (
    <DateCalendar
      {...calendarProps}
      slots={{ day: DayComponent }}
      shouldDisableDate={(d) =>
        !workoutDates.has(dayjs(d as Dayjs).format('YYYY-MM-DD'))
      }
    />
  );
}
