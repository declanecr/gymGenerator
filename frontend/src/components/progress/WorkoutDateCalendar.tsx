// WorkoutDateCalendar.tsx
import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import Badge from '@mui/material/Badge';
import { DateCalendar, DateCalendarProps } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';

/** Custom day cell: 48 px high, shows a 🏋️ badge on workout days, disables the rest. */
function WorkoutDay(
  props: PickersDayProps<Dayjs> & { workoutDates: Set<string> }
) {
  const { workoutDates, day, outsideCurrentMonth, ...other } = props;
  const iso = day.format('YYYY-MM-DD');
  const hasWorkout = workoutDates.has(iso);

  return (
    <Badge overlap="circular" badgeContent={hasWorkout ? '🏋️' : undefined}>
      <PickersDay
        {...other}
        day={day}
        outsideCurrentMonth={outsideCurrentMonth}
        disabled={!hasWorkout}
        sx={{ height: 48, width: 48 }}   // Original is 36×36
      />
    </Badge>
  );
}

export interface WorkoutDateCalendarProps
  extends Omit<
    DateCalendarProps<Dayjs>,
    'slots' | 'slotProps' | 'shouldDisableDate'
  > {
  /** ISO-8601 strings (`YYYY-MM-DD`) for days that contain workouts */
  workoutDates: Set<string>;
}

/**
 * Replacement for MUI’s `<DateCalendar>` that:
 * • badges workout days
 * • enlarges day cells to 48 px
 * • disables everything else
 * • otherwise behaves exactly like the stock component
 */
export default function WorkoutDateCalendar({
  workoutDates,
  ...calendarProps
}: WorkoutDateCalendarProps) {
  return (
    <DateCalendar
      {...calendarProps}
      /* Disable any day not in the workout set */
      shouldDisableDate={(d) => !workoutDates.has(dayjs(d).format('YYYY-MM-DD'))}
      /* Inject custom day renderer */
      slots={{ day: WorkoutDay }}
      /* Pass the workout set down to each cell */
      slotProps={{ day: { workoutDates } as any }}
    />
  );
}
