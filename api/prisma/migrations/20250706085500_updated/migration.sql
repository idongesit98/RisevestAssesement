/*
  Warnings:

  - Added the required column `publicId` to the `UploadedFiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resourceType` to the `UploadedFiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UploadedFiles" ADD COLUMN     "publicId" TEXT NOT NULL,
ADD COLUMN     "resourceType" TEXT NOT NULL;
