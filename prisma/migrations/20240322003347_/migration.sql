-- CreateTable
CREATE TABLE "se_user" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "salePointCode" INTEGER NOT NULL,
    "system_id" INTEGER NOT NULL,

    CONSTRAINT "se_user_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "se_user" ADD CONSTRAINT "se_user_system_id_fkey" FOREIGN KEY ("system_id") REFERENCES "eb_system"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
