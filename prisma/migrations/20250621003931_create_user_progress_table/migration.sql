/*
  Warnings:

  - You are about to drop the `CompletedLesson` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `lastActivityDate` on the `UserProgress` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "CompletedLesson_progressId_lessonId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "CompletedLesson";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserProgress" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "completedLessons" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "UserProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserProgress" ("createdAt", "currentStreak", "id", "updatedAt", "userId") SELECT "createdAt", "currentStreak", "id", "updatedAt", "userId" FROM "UserProgress";
DROP TABLE "UserProgress";
ALTER TABLE "new_UserProgress" RENAME TO "UserProgress";
CREATE UNIQUE INDEX "UserProgress_userId_key" ON "UserProgress"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
