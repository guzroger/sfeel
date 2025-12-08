/*
  Warnings:

  - The primary key for the `eb_package_file` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bill_id` on the `eb_package_file` table. All the data in the column will be lost.
  - Added the required column `package_id` to the `eb_package_file` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "eb_package_file" DROP CONSTRAINT "eb_package_file_pkey",
DROP COLUMN "bill_id",
ADD COLUMN     "package_id" BIGINT NOT NULL,
ADD CONSTRAINT "eb_package_file_pkey" PRIMARY KEY ("package_id");
