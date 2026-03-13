/*
  Warnings:

  - You are about to drop the column `titular` on the `Vehiculo` table. All the data in the column will be lost.
  - Added the required column `numero` to the `Trayecto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titularDNI` to the `Vehiculo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titularNombre` to the `Vehiculo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trayecto" ADD COLUMN     "numero" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Vehiculo" DROP COLUMN "titular",
ADD COLUMN     "titularDNI" TEXT NOT NULL,
ADD COLUMN     "titularNombre" TEXT NOT NULL;
