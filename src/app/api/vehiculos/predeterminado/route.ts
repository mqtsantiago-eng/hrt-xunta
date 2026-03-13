import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {

  const { id } = await req.json()

  if (!id) {
    return new Response(
      JSON.stringify({ error: "ID de vehículo requerido" }),
      { status: 400 }
    )
  }

  // comprobar que el vehículo existe
  const existe = await prisma.vehiculo.findUnique({
    where: { id }
  })

  if (!existe) {
    return new Response(
      JSON.stringify({ error: "Vehículo no encontrado" }),
      { status: 404 }
    )
  }

  // quitar predeterminado actual
  await prisma.vehiculo.updateMany({
    where: { predeterminado: true },
    data: { predeterminado: false }
  })

  // poner nuevo predeterminado
  const vehiculo = await prisma.vehiculo.update({
    where: { id },
    data: { predeterminado: true }
  })

  return Response.json(vehiculo)

}