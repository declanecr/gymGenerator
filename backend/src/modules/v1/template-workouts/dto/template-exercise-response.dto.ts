import { Exercise, TemplateExercise } from '@prisma/client';
import { ExerciseResponseDto } from '../../exercises-catalog/dto/exercise-response.dto';

// template-workout-exercise-response.dto.ts
export class TemplateExerciseResponseDto extends ExerciseResponseDto {
  templateExerciseId: string; //CUID PK on TemplateExercise
  workoutTemplateId: string;
  position: number;

  constructor(te: TemplateExercise & { exercise: Exercise }) {
    super(te.exercise); //fills Exercise fields
    this.templateExerciseId = te.id;
    this.workoutTemplateId = te.workoutTemplateId;
    this.position = te.position;
  }
}
