import { prisma } from "@/lib/prisma"

// Función auxiliar: convertir archivo de FormData a Base64 en Node
async function fileToBase64Node(file: Blob | null): Promise<string | null> {
  if (!file) return null
  const arrayBuffer = await file.arrayBuffer()
  return Buffer.from(arrayBuffer).toString("base64")
}

// =============================
// CREAR CONTRATO
// =============================
export async function POST(req: Request) {
  const formData = await req.formData()

  const lugar = formData.get("lugar") as string
  const contratante = formData.get("contratante") as string
  const arrendatario = formData.get("arrendatario") as string
  const valor = parseFloat(formData.get("valor") as string)
  const valor2 = parseFloat(formData.get("valor2") as string)
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

  const contrato = await prisma.contrato.create({
    data: {
      lugar,
      contratante,
      arrendatario,
      valor,
      valor2,
      predeterminado,
      firmaContratante,
      firmaArrendatario,
      logo1,
      logo2
    }
  })

  return Response.json(contrato)
}

// =============================
// LISTAR CONTRATOS
// =============================
export async function GET() {
  const contratos = await prisma.contrato.findMany({
    orderBy: { createdAt: "desc" }
  })
  return Response.json(contratos)
}