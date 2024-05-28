-- AlterTable
ALTER TABLE "eb_bill" ADD COLUMN     "beneficiario_ley_1886" TEXT,
ADD COLUMN     "meter_number" TEXT,
ADD COLUMN     "monto_desc_tarifa_dig" DOUBLE PRECISION,
ADD COLUMN     "monto_descuento_ley_1886" DOUBLE PRECISION,
ADD COLUMN     "otras_tasas" DOUBLE PRECISION,
ADD COLUMN     "tasa_alumbrado" DOUBLE PRECISION,
ADD COLUMN     "tasa_aseo" DOUBLE PRECISION;
