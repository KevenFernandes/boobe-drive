/*
  Warnings:

  - You are about to drop the column `ext` on the `files` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "files" DROP COLUMN "ext";

-- DropEnum
DROP TYPE "FileExtension";
