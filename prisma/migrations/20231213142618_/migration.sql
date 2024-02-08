/*
  Warnings:

  - You are about to drop the column `documentTaxCode` on the `eb_sector_document` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "eb_sector_document" DROP COLUMN "documentTaxCode",
ADD COLUMN     "document_tax_code" INTEGER;
