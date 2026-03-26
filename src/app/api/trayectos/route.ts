// C:\dev\hrt-xunta\src\app\api\trayectos\route.ts
import { prisma } from "@/lib/prisma"

export async function GET() {
  // Listar todos los trayectos incluyendo vehiculo y contrato
  const trayectos = await prisma.trayecto.findMany({
    orderBy: { createdAt: "desc" },
    include: { vehiculo: true, contrato: true }
  })
  return Response.json(trayectos)
}

export async function POST(req: Request) {
  try {
    const { origen, destino, pasajeros } = await req.json()

    // Validaciones básicas
    if (!origen || !destino) {
      return new Response(JSON.stringify({ error: "Faltan campos" }), { status: 400 })
    }

    if (!Array.isArray(pasajeros) || pasajeros.length === 0 || pasajeros.length > 8) {
      return new Response(JSON.stringify({ error: "Debe haber entre 1 y 8 pasajeros" }), { status: 400 })
    }

    // Traer contrato predeterminado
    const contrato = await prisma.contrato.findFirst({ where: { predeterminado: true } })
    if (!contrato) {
      return new Response(JSON.stringify({ error: "No hay contrato predeterminado" }), { status: 400 })
    }

    // Vehículo predeterminado
    const vehiculo = await prisma.vehiculo.findFirst({ where: { predeterminado: true } })
    if (!vehiculo) {
      return new Response(JSON.stringify({ error: "No hay vehículo predeterminado" }), { status: 400 })
    }

    // --- Generar número de trayecto HRT-YYYY-###### ---
    const year = new Date().getFullYear()
    const count = await prisma.trayecto.count({
      where: { numero: { startsWith: `HRT-${year}-` } }
    })
    const sequential = String(count + 1).padStart(6, "0")
    const numero = `HRT-${year}-${sequential}`

    // Calcular dateM: hora actual menos contrato.valor en minutos
    const dateM = new Date(Date.now() - contrato.valor * 60_000)
    const dateM2 = new Date(Date.now() + contrato.valor2 * 60_000)

    // Crear trayecto
    const trayecto = await prisma.trayecto.create({
      data: {
        numero,
        origen,
        destino,
        pasajeros,
        hora: new Date(),
        dateM,
        dateM2,
        vehiculoId: vehiculo.id,
        contratoId: contrato.id
      },
      include: { vehiculo: true, contrato: true }
    })

    return Response.json(trayecto)
  } catch (error: any) {
    console.error("Error creando trayecto:", error)
    return new Response(JSON.stringify({ error: error.message || "Error al crear trayecto" }), { status: 500 })
  }
}