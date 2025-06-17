// --- src/components/workout/WorkoutForm.tsx ---
import React from 'react';



export interface WorkoutFormProps {
    onSubmit: React.FormEventHandler<HTMLFormElement>
    children?: React.ReactNode
}

export function WorkoutForm({ onSubmit, children }: WorkoutFormProps) {

  return (

    <form onSubmit={onSubmit}>
      {/* your inputs: name, notes, exercises, etc. */}
      {children}
      <button type="submit">Finish</button>
      <button type="button">Cancel</button>
    </form>

  )
}