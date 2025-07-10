/*
  Warnings:

  - You are about to drop the column `safe` on the `UploadedFiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UploadedFiles" DROP COLUMN "safe",
ADD COLUMN     "status" "FileStatus" NOT NULL DEFAULT 'SAFE';
