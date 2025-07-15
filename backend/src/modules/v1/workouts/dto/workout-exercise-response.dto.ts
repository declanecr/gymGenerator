import { Exercise, WorkoutExercise } from '@prisma/client';
import { ExerciseResponseDto } from '../../exercises-catalog/dto/exercise-response.dto';

// workout-exercise-response.dto.ts
export class WorkoutExerciseResponseDto extends ExerciseResponseDto {
  workoutExerciseId: string; // CUID PK on WorkoutExercise

  constructor(we: WorkoutExercise & { exercise: Exercise }) {
    super(we.exercise); // fills Exercise fields
    this.workoutExerciseId = we.id;
  }
}
