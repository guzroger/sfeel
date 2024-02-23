-- CreateTable
CREATE TABLE "eb_homologation_catalogue" (
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "system_code" TEXT NOT NULL,
    "nit" BIGINT NOT NULL,
    "code_homologated" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eb_homologation_catalogue_pkey" PRIMARY KEY ("code","type","system_code","nit")
);

-- CreateTable
CREATE TABLE "eb_homologation_product_service" (
    "product_code" TEXT NOT NULL,
    "system_code" TEXT NOT NULL,
    "nit" BIGINT NOT NULL,
    "activity_code" TEXT NOT NULL,
    "code_homologated" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eb_homologation_product_service_pkey" PRIMARY KEY ("product_code","system_code","nit","activity_code")
);
