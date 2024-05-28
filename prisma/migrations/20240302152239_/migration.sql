/*
  Warnings:

  - Added the required column `modality_code` to the `eb_dosification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "eb_dosification" ADD COLUMN     "modality_code" INTEGER NOT NULL;
