-- CreateEnum
CREATE TYPE "DataType" AS ENUM ('NUMBER', 'STRING');

-- AlterTable
ALTER TABLE "eb_homologation_catalogue" ADD COLUMN     "validate_type" "DataType";
