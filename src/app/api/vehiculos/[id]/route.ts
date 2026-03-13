import { prisma } from "@/lib/prisma"

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const vehiculo = await prisma.vehiculo.findUnique({
    where: { id: params.id }
  })

  if (vehiculo?.predeterminado) {
    return new Response(
      JSON.stringify({ error: "No se puede eliminar el vehículo predeterminado" }),
      { status: 400 }
    )
  }

  await prisma.vehiculo.delete({
    where: { id: params.id }
  })

  return Response.json({ ok: true })
}

// =======================================
// PATCH - Actualizar vehículo
// =======================================
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const data = await req.json()

  // si se marca predeterminado, quitar el anterior
  if (data.predeterminado) {
    await prisma.vehiculo.updateMany({
      where: { predeterminado: true },
      data: { predeterminado: false }
    })
  }

  const vehiculoActualizado = await prisma.vehiculo.update({
    where: { id: params.id },
    data
  })

  return Response.json(vehiculoActualizado)
}