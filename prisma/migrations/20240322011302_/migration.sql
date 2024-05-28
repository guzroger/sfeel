/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `se_user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "se_user_email_key" ON "se_user"("email");
