/*
  Warnings:

  - The primary key for the `Exercise` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Exercise` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `exerciseId` on the `TemplateExercise` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `exerciseId` on the `WorkoutExercise` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - Added the required column `primaryMuscle` to the `Exercise` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Exercise" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "primaryMuscle" TEXT NOT NULL,
    "equipment" TEXT,
    "default" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER,
    CONSTRAINT "Exercise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Exercise" ("id", "name") SELECT "id", "name" FROM "Exercise";
DROP TABLE "Exercise";
ALTER TABLE "new_Exercise" RENAME TO "Exercise";
CREATE UNIQUE INDEX "Exercise_name_userId_key" ON "Exercise"("name", "userId");
CREATE TABLE "new_TemplateExercise" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "workoutTemplateId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    CONSTRAINT "TemplateExercise_workoutTemplateId_fkey" FOREIGN KEY ("workoutTemplateId") REFERENCES "TemplateWorkout" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TemplateExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TemplateExercise" ("createdAt", "exerciseId", "id", "position", "updatedAt", "workoutTemplateId") SELECT "createdAt", "exerciseId", "id", "position", "updatedAt", "workoutTemplateId" FROM "TemplateExercise";
DROP TABLE "TemplateExercise";
ALTER TABLE "new_TemplateExercise" RENAME TO "TemplateExercise";
CREATE UNIQUE INDEX "TemplateExercise_position_key" ON "TemplateExercise"("position");
CREATE TABLE "new_WorkoutExercise" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "workoutId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,
    "templateExerciseId" TEXT,
    CONSTRAINT "WorkoutExercise_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WorkoutExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WorkoutExercise_templateExerciseId_fkey" FOREIGN KEY ("templateExerciseId") REFERENCES "TemplateExercise" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_WorkoutExercise" ("createdAt", "exerciseId", "id", "position", "templateExerciseId", "updatedAt", "workoutId") SELECT "createdAt", "exerciseId", "id", "position", "templateExerciseId", "updatedAt", "workoutId" FROM "WorkoutExercise";
DROP TABLE "WorkoutExercise";
ALTER TABLE "new_WorkoutExercise" RENAME TO "WorkoutExercise";
CREATE UNIQUE INDEX "WorkoutExercise_position_key" ON "WorkoutExercise"("position");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
