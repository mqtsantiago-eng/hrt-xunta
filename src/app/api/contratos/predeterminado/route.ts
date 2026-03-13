import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {

  const { id } = await req.json()

  if (!id) {
    return new Response(JSON.stringify({ error: "ID requerido" }), { status: 400 })
  }

  const existe = await prisma.contrato.findUnique({ where: { id } })
  if (!existe) {
    return new Response(JSON.stringify({ error: "Contrato no encontrado" }), { status: 404 })
  }

  // quitar predeterminado actual
  await prisma.contrato.updateMany({
    where: { predeterminado: true },
    data: { predeterminado: false }
  })

  // poner nuevo predeterminado
  const contrato = await prisma.contrato.update({
    where: { id },
    data: { predeterminado: true }
  })

  return Response.json(contrato)
}