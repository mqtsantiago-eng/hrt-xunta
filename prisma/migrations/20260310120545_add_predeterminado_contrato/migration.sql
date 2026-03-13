-- CreateTable
CREATE TABLE "Vehiculo" (
    "id" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "tarjetaTransporte" TEXT NOT NULL,
    "titular" TEXT NOT NULL,
    "licenciaNumero" TEXT NOT NULL,
    "predeterminado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vehiculo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trayecto" (
    "id" TEXT NOT NULL,
    "origen" TEXT NOT NULL,
    "destino" TEXT NOT NULL,
    "pasajeros" TEXT[],
    "hora" TIMESTAMP(3) NOT NULL,
    "dateM" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vehiculoId" TEXT NOT NULL,

    CONSTRAINT "Trayecto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contrato" (
    "id" TEXT NOT NULL,
    "lugar" TEXT NOT NULL,
    "contratante" TEXT NOT NULL,
    "arrendatario" TEXT NOT NULL,
    "firmaContratante" TEXT,
    "firmaArrendatario" TEXT,
    "logo1" TEXT,
    "logo2" TEXT,
    "valor" DOUBLE PRECISION NOT NULL,
    "predeterminado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contrato_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Trayecto" ADD CONSTRAINT "Trayecto_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
