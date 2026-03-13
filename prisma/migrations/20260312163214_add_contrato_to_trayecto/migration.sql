/*
  Warnings:

  - Added the required column `contratoId` to the `Trayecto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trayecto" ADD COLUMN     "contratoId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Trayecto" ADD CONSTRAINT "Trayecto_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "Contrato"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
