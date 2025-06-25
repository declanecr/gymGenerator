/*
  Warnings:

  - A unique constraint covering the columns `[workoutTemplateId,position]` on the table `TemplateExercise` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[templateExerciseId,position]` on the table `TemplateSet` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[workoutId,position]` on the table `WorkoutExercise` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[workoutExerciseId,position]` on the table `WorkoutSet` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "TemplateExercise_position_key";

-- DropIndex
DROP INDEX "TemplateSet_position_key";

-- DropIndex
DROP INDEX "WorkoutExercise_position_key";

-- DropIndex
DROP INDEX "WorkoutSet_position_key";

-- CreateIndex
CREATE UNIQUE INDEX "TemplateExercise_workoutTemplateId_position_key" ON "TemplateExercise"("workoutTemplateId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "TemplateSet_templateExerciseId_position_key" ON "TemplateSet"("templateExerciseId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "WorkoutExercise_workoutId_position_key" ON "WorkoutExercise"("workoutId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "WorkoutSet_workoutExerciseId_position_key" ON "WorkoutSet"("workoutExerciseId", "position");
