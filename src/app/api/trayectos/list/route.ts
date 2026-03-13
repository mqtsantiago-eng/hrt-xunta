import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const trayectos = await prisma.trayecto.findMany({
      orderBy: { createdAt: "desc" },
      include: { vehiculo: true } // Incluye datos del vehículo
    })

    return new Response(JSON.stringify(trayectos), {
      headers: { "Content-Type": "application/json" }
    })
  } catch (error: any) {
    console.error("Error obteniendo trayectos:", error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}