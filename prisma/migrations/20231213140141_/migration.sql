-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "CertificateType" AS ENUM ('PRIMARY_KEY', 'PUBLIC_KEY');

-- CreateEnum
CREATE TYPE "StorageType" AS ENUM ('P12', 'X509', 'TEXT');

-- CreateTable
CREATE TABLE "ge_constant_group" (
    "code_group" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "ge_constant_group_pkey" PRIMARY KEY ("code_group")
);

-- CreateTable
CREATE TABLE "ge_constant" (
    "code" TEXT NOT NULL,
    "code_group" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "value" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "observation" TEXT,

    CONSTRAINT "ge_constant_pkey" PRIMARY KEY ("code","code_group")
);

-- CreateTable
CREATE TABLE "eb_system" (
    "id" SERIAL NOT NULL,
    "system_code" TEXT NOT NULL,
    "nit" BIGINT NOT NULL,
    "business" TEXT NOT NULL,
    "modality_code" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "image" BYTEA,

    CONSTRAINT "eb_system_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eb_token" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "start_at" TIMESTAMP(3) NOT NULL,
    "expiration_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "system_id" INTEGER NOT NULL,

    CONSTRAINT "eb_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eb_sucursal" (
    "id" SERIAL NOT NULL,
    "sucursal_code" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "modality_code" INTEGER NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "municipality" TEXT,
    "city" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "system_id" INTEGER NOT NULL,

    CONSTRAINT "eb_sucursal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eb_sale_point" (
    "id" SERIAL NOT NULL,
    "sale_point_code" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "modality_code" INTEGER NOT NULL,
    "type_sale_point" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "sucursal_id" INTEGER NOT NULL,

    CONSTRAINT "eb_sale_point_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eb_cuis" (
    "cuis" TEXT NOT NULL,
    "expiration_at" TIMESTAMP(3) NOT NULL,
    "system_code" TEXT NOT NULL,
    "nit" BIGINT NOT NULL,
    "sucursal_code" INTEGER NOT NULL,
    "sale_point_code" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "eb_cuis_pkey" PRIMARY KEY ("cuis")
);

-- CreateTable
CREATE TABLE "eb_cufd" (
    "cufd" TEXT NOT NULL,
    "expiration_at" TIMESTAMP(3) NOT NULL,
    "system_code" TEXT NOT NULL,
    "nit" BIGINT NOT NULL,
    "sucursal_code" INTEGER NOT NULL,
    "sale_point_code" INTEGER NOT NULL,
    "control_code" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "eb_cufd_pkey" PRIMARY KEY ("cufd")
);

-- CreateTable
CREATE TABLE "syn_date_hour" (
    "date_system" TIMESTAMP(3) NOT NULL,
    "date_sin" TIMESTAMP(3) NOT NULL,
    "system_code" TEXT NOT NULL,
    "nit" BIGINT NOT NULL,

    CONSTRAINT "syn_date_hour_pkey" PRIMARY KEY ("date_system","system_code","nit")
);

-- CreateTable
CREATE TABLE "syn_catalogue" (
    "code" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "system_code" TEXT NOT NULL,
    "nit" BIGINT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "visible" "Status" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "syn_catalogue_pkey" PRIMARY KEY ("code","type","system_code","nit")
);

-- CreateTable
CREATE TABLE "syn_invoice_legend" (
    "activity_code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "system_code" TEXT NOT NULL,
    "nit" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "syn_invoice_legend_pkey" PRIMARY KEY ("activity_code","description","system_code","nit")
);

-- CreateTable
CREATE TABLE "syn_product_service" (
    "product_code" TEXT NOT NULL,
    "system_code" TEXT NOT NULL,
    "nit" BIGINT NOT NULL,
    "activity_code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "syn_product_service_pkey" PRIMARY KEY ("product_code","system_code","nit","activity_code")
);

-- CreateTable
CREATE TABLE "syn_activity" (
    "activity_code" TEXT NOT NULL,
    "system_code" TEXT NOT NULL,
    "nit" BIGINT NOT NULL,
    "sector_document_code" TEXT NOT NULL,
    "activity_type" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "syn_activity_pkey" PRIMARY KEY ("activity_code","system_code","nit","sector_document_code","activity_type")
);

-- CreateTable
CREATE TABLE "eb_package_bill" (
    "package_id" BIGSERIAL NOT NULL,
    "cufd" TEXT,
    "bill_status_id" INTEGER NOT NULL DEFAULT 0,
    "nit_emitter" BIGINT NOT NULL,
    "sucursal_code" INTEGER NOT NULL,
    "sale_point_code" INTEGER NOT NULL,
    "emitte_type" INTEGER NOT NULL,
    "modality_code" INTEGER NOT NULL,
    "sector_document_code" TEXT NOT NULL,
    "document_tax_code" INTEGER NOT NULL,
    "recception_code" TEXT,
    "status_code" TEXT,
    "status_description" TEXT,
    "event_code" TEXT,
    "cafc" TEXT,
    "system_code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eb_package_bill_pkey" PRIMARY KEY ("package_id")
);

-- CreateTable
CREATE TABLE "eb_package_file" (
    "bill_id" BIGINT NOT NULL,
    "file" BYTEA,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eb_package_file_pkey" PRIMARY KEY ("bill_id")
);

-- CreateTable
CREATE TABLE "eb_bill_status" (
    "bill_status_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "eb_bill_status_pkey" PRIMARY KEY ("bill_status_id")
);

-- CreateTable
CREATE TABLE "eb_bill" (
    "bill_id" BIGSERIAL NOT NULL,
    "system_code" TEXT NOT NULL,
    "cuf" TEXT,
    "cufd" TEXT,
    "bill_number" INTEGER NOT NULL,
    "nit_emitter" BIGINT NOT NULL,
    "sucursal_code" INTEGER NOT NULL,
    "sale_point_code" INTEGER NOT NULL,
    "date_emitte" TIMESTAMP(3),
    "bill_name" TEXT NOT NULL,
    "document_type" TEXT NOT NULL,
    "bill_document" TEXT NOT NULL,
    "bill_complement" TEXT,
    "address" TEXT,
    "client_code" TEXT NOT NULL,
    "payment_method" TEXT NOT NULL,
    "card_number" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "amount_iva" DOUBLE PRECISION NOT NULL,
    "amount_discount" DOUBLE PRECISION,
    "amount_gift_card" DOUBLE PRECISION,
    "coin_code" TEXT NOT NULL,
    "exchange_rate" DOUBLE PRECISION NOT NULL,
    "legend" TEXT,
    "sector_document_code" TEXT NOT NULL,
    "modality_code" INTEGER NOT NULL,
    "emitte_type" INTEGER NOT NULL,
    "document_tax_code" INTEGER NOT NULL,
    "exception_documnet" INTEGER,
    "bill_external_code" TEXT NOT NULL,
    "billed_period" TEXT,
    "bill_status" INTEGER NOT NULL DEFAULT 0,
    "package_id" BIGINT NOT NULL,
    "bill_name_emitter" TEXT NOT NULL,
    "municipality" TEXT NOT NULL,
    "recception_code" TEXT,
    "status_code" TEXT,
    "status_description" TEXT,
    "reason_annulation_code" TEXT,
    "cafc" TEXT,
    "email" TEXT,
    "qr" TEXT,
    "note" TEXT,
    "event_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "address_buyer" TEXT,
    "place_destination" TEXT,
    "code_country" TEXT,
    "additional_information" TEXT,
    "bill_number_ref" INTEGER,
    "cuf_ref" TEXT,
    "date_emitte_ref" TIMESTAMP(3),
    "bill_id_ref" BIGINT,
    "amount_total_original" DOUBLE PRECISION,
    "amount_total_returned" DOUBLE PRECISION,
    "amount_discount_credit_debit" DOUBLE PRECISION,
    "amount_effective_credit_debit" DOUBLE PRECISION,

    CONSTRAINT "eb_bill_pkey" PRIMARY KEY ("bill_id")
);

-- CreateTable
CREATE TABLE "eb_bill_detail" (
    "bill_id" BIGINT NOT NULL,
    "economic_activity" TEXT NOT NULL,
    "product_code_sin" TEXT NOT NULL,
    "product_code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "measure_code" TEXT NOT NULL,
    "measure" TEXT,
    "unit_price" DOUBLE PRECISION NOT NULL,
    "amount_discount" DOUBLE PRECISION,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "order" INTEGER NOT NULL,
    "serie_number" TEXT,
    "imei_number" TEXT,
    "code_transaction_detail" INTEGER,
    "number_item" INTEGER,

    CONSTRAINT "eb_bill_detail_pkey" PRIMARY KEY ("bill_id","order")
);

-- CreateTable
CREATE TABLE "eb_bill_file" (
    "bill_id" BIGINT NOT NULL,
    "xml" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eb_bill_file_pkey" PRIMARY KEY ("bill_id")
);

-- CreateTable
CREATE TABLE "eb_transaction" (
    "transaction_id" BIGSERIAL NOT NULL,
    "reference_id" BIGINT NOT NULL,
    "operation" TEXT NOT NULL,
    "soap_request" TEXT,
    "soap_response" TEXT,
    "xml" TEXT,
    "recception_code" TEXT,
    "status_code" TEXT,
    "status_description" TEXT,
    "type" TEXT NOT NULL,
    "cuf" TEXT,
    "user" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eb_transaction_pkey" PRIMARY KEY ("transaction_id")
);

-- CreateTable
CREATE TABLE "eb_transaction_message" (
    "transaction_id" BIGINT NOT NULL,
    "order" INTEGER NOT NULL,
    "recception_code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "bill_id" BIGINT,

    CONSTRAINT "eb_transaction_message_pkey" PRIMARY KEY ("transaction_id","order")
);

-- CreateTable
CREATE TABLE "eb_sector_document" (
    "sector_code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url_ws" TEXT NOT NULL,
    "url_ws_fec" TEXT NOT NULL,
    "xsd_fe" BYTEA,
    "xsd_fec" BYTEA,
    "method_fe" TEXT NOT NULL,
    "method_fec" TEXT NOT NULL,
    "service_fe" TEXT NOT NULL,
    "service_fec" TEXT NOT NULL,
    "documentTaxCode" INTEGER,

    CONSTRAINT "eb_sector_document_pkey" PRIMARY KEY ("sector_code")
);

-- CreateTable
CREATE TABLE "app_certificate" (
    "id" SERIAL NOT NULL,
    "system_code" TEXT NOT NULL,
    "nit" BIGINT NOT NULL,
    "certificate" BYTEA,
    "certificate_type" "CertificateType" NOT NULL DEFAULT 'PRIMARY_KEY',
    "type_storage" "StorageType" NOT NULL DEFAULT 'TEXT',
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiration_at" TIMESTAMP(3) NOT NULL,
    "id_ref" INTEGER,

    CONSTRAINT "app_certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eb_event" (
    "event_id" SERIAL NOT NULL,
    "event_type" INTEGER NOT NULL,
    "system_code" TEXT NOT NULL,
    "nit" BIGINT NOT NULL,
    "description" TEXT NOT NULL,
    "sucursal_code" INTEGER NOT NULL,
    "sale_point_code" INTEGER NOT NULL,
    "sector_document_code" TEXT NOT NULL,
    "begin_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3),
    "cufd_event" TEXT NOT NULL,
    "event_status_id" INTEGER NOT NULL DEFAULT 0,
    "recepcion_code" TEXT,
    "cafc" TEXT,
    "self_manageable" TEXT,

    CONSTRAINT "eb_event_pkey" PRIMARY KEY ("event_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "eb_system_system_code_nit_key" ON "eb_system"("system_code", "nit");

-- CreateIndex
CREATE UNIQUE INDEX "eb_bill_cuf_key" ON "eb_bill"("cuf");

-- AddForeignKey
ALTER TABLE "eb_token" ADD CONSTRAINT "eb_token_system_id_fkey" FOREIGN KEY ("system_id") REFERENCES "eb_system"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eb_sucursal" ADD CONSTRAINT "eb_sucursal_system_id_fkey" FOREIGN KEY ("system_id") REFERENCES "eb_system"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eb_sale_point" ADD CONSTRAINT "eb_sale_point_sucursal_id_fkey" FOREIGN KEY ("sucursal_id") REFERENCES "eb_sucursal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eb_package_bill" ADD CONSTRAINT "eb_package_bill_bill_status_id_fkey" FOREIGN KEY ("bill_status_id") REFERENCES "eb_bill_status"("bill_status_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eb_bill" ADD CONSTRAINT "eb_bill_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "eb_package_bill"("package_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eb_bill" ADD CONSTRAINT "eb_bill_bill_status_fkey" FOREIGN KEY ("bill_status") REFERENCES "eb_bill_status"("bill_status_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eb_bill_detail" ADD CONSTRAINT "eb_bill_detail_bill_id_fkey" FOREIGN KEY ("bill_id") REFERENCES "eb_bill"("bill_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eb_transaction_message" ADD CONSTRAINT "eb_transaction_message_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "eb_transaction"("transaction_id") ON DELETE RESTRICT ON UPDATE CASCADE;
