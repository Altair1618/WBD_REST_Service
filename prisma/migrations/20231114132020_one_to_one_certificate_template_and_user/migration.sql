/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `CertificateTemplate` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `CertificateTemplate_user_id_key` ON `CertificateTemplate`(`user_id`);
