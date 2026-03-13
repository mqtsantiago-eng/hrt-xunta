import { prisma } from "@/lib/prisma"

async function fileToBase64Node(file: Blob | null): Promise<string | null> {
  if (!file) return null
  const arrayBuffer = await file.arrayBuffer()
  return Buffer.from(arrayBuffer).toString("base64")
}

// =============================
// ACTUALIZAR CONTRATO
// =============================
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const formData = await req.formData()

  const lugar = formData.get("lugar") as string
  const contratante = formData.get("contratante") as string
  const arrendatario = formData.get("arrendatario") as string
  const valor = parseFloat(formData.get("valor") as string)
  const predeterminado = formData.get("predeterminado") === "true"

  const firmaContratante = await fileToBase64Node(formData.get("firmaContratante") as Blob | null)
  const firmaArrendatario = await fileToBase64Node(formData.get("firmaArrendatario") as Blob | null)
  const logo1 = await fileToBase64Node(formData.get("logo1") as Blob | null)
  const logo2 = await fileToBase64Node(formData.get("logo2") as Blob | null)

  if (predeterminado) {
    await prisma.contrato.updateMany({
      where: { predeterminado: true },
      data: { predeterminado: false }
    })
  }

  const contrato = await prisma.contrato.update({
    where: { id: params.id },
    data: {
      lugar,
      contratante,
      arrendatario,
      valor,
      predeterminado,
      ...(firmaContratante !== null && { firmaContratante }),
      ...(firmaArrendatario !== null && { firmaArrendatario }),
      ...(logo1 !== null && { logo1 }),
      ...(logo2 !== null && { logo2 })
    }
  })

  return Response.json(contrato)
}

// =============================
// ELIMINAR CONTRATO
// =============================
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const contrato = await prisma.contrato.findUnique({ where: { id: params.id } })

  if (contrato?.predeterminado) {
    return new Response(
      JSON.stringify({ error: "No se puede eliminar el contrato predeterminado" }),
      { status: 400 }
    )
  }

  await prisma.contrato.delete({ where: { id: params.id } })
  return Response.json({ ok: true })
}