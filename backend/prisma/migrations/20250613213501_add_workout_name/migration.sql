/*
  Warnings:

  - Added the required column `name` to the `Workout` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Workout" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "workoutTemplateId" TEXT,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Workout_workoutTemplateId_fkey" FOREIGN KEY ("workoutTemplateId") REFERENCES "TemplateWorkout" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Workout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Workout" ("createdAt", "id", "updatedAt", "userId", "workoutTemplateId") SELECT "createdAt", "id", "updatedAt", "userId", "workoutTemplateId" FROM "Workout";
DROP TABLE "Workout";
ALTER TABLE "new_Workout" RENAME TO "Workout";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
