-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TemplateWorkout" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" INTEGER,
    CONSTRAINT "TemplateWorkout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_TemplateWorkout" ("createdAt", "id", "name", "notes", "updatedAt", "userId") SELECT "createdAt", "id", "name", "notes", "updatedAt", "userId" FROM "TemplateWorkout";
DROP TABLE "TemplateWorkout";
ALTER TABLE "new_TemplateWorkout" RENAME TO "TemplateWorkout";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
