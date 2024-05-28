/*
  Warnings:

  - You are about to drop the column `username` on the `se_user` table. All the data in the column will be lost.
  - Added the required column `email` to the `se_user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "se_user" DROP COLUMN "username",
ADD COLUMN     "email" TEXT NOT NULL;
