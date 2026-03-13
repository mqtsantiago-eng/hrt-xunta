import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { trayectoTemplate } from "@/lib/pdf/templates/trayectoTemplate"
import { createPdfFromHtml } from "@/lib/pdf/pdfGenerator"

export async function POST(req: Request) {
  const { trayectoId } = await req.json()

  // 1️⃣ Traer trayecto de la DB
  const trayecto = await prisma.trayecto.findUnique({
    where: { id: trayectoId },
    include: { vehiculo: true } // opcional, si quieres info del vehículo
  })

  if (!trayecto) {
    return NextResponse.json({ error: "Trayecto no encontrado" }, { status: 404 })
  }

  // 2️⃣ Mapear datos a lo que espera el template
  const html = trayectoTemplate({
    inicio: trayecto.origen,                  // origen → inicio
    destino: trayecto.destino,
    fecha: trayecto.hora.toLocaleDateString(),// Date → string
    hora: trayecto.hora.toLocaleTimeString(), // Date → string
    pasajeros: trayecto.pasajeros,
    logo1: "/logo1.png",                       // default si no existe
    logo2: "/logo2.png",
    firmaConductor: "",
    firmaContratante: ""
  })

  // 3️⃣ Crear PDF
  const pdfBuffer = await createPdfFromHtml(html)

  // 4️⃣ Devolver PDF
  return new NextResponse(Buffer.from(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="trayecto_${trayecto.id}.pdf"`
    }
  })
}