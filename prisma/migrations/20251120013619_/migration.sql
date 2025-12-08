/*
  Warnings:

  - You are about to drop the column `exception_documnet` on the `eb_bill` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "eb_bill" DROP COLUMN "exception_documnet",
ADD COLUMN     "annulled" TEXT,
ADD COLUMN     "exception_document" INTEGER;
