-- CreateEnum
CREATE TYPE "FileStatus" AS ENUM ('SAFE', 'UNSAFE');

-- AlterTable
ALTER TABLE "UploadedFiles" ADD COLUMN     "safe" "FileStatus" NOT NULL DEFAULT 'SAFE';
