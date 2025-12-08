-- CreateTable
CREATE TABLE "app_log" (
    "log_id" BIGSERIAL NOT NULL,
    "service" TEXT NOT NULL,
    "param_in" TEXT NOT NULL,
    "param_out" TEXT NOT NULL,
    "date_tran" TIMESTAMP(3) NOT NULL,
    "tran_id" BIGINT NOT NULL,
    "user_Id" INTEGER NOT NULL,
    "error_id" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "ip_client" TEXT NOT NULL,

    CONSTRAINT "app_log_pkey" PRIMARY KEY ("log_id")
);

-- AddForeignKey
ALTER TABLE "app_log" ADD CONSTRAINT "app_log_user_Id_fkey" FOREIGN KEY ("user_Id") REFERENCES "se_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
