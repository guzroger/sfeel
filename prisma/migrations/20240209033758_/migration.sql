-- CreateTable
CREATE TABLE "eb_dosification" (
    "code" TEXT NOT NULL,
    "sector_document_code" TEXT NOT NULL,
    "begin_" INTEGER NOT NULL,
    "last_" INTEGER NOT NULL,
    "current_" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "type_" TEXT NOT NULL,
    "system_code" TEXT NOT NULL,
    "nit" BIGINT NOT NULL,

    CONSTRAINT "eb_dosification_pkey" PRIMARY KEY ("code")
);
