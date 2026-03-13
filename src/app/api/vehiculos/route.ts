import { prisma } from "@/lib/prisma"

// =============================
// CREAR VEHÍCULO
// =============================
export async function POST(req: Request) {

  const body = await req.json()

  const {
    marca,
    modelo,
    matricula,
    tarjetaTransporte,
    licenciaNumero,
    titularDNI,
    titularNombre,
    predeterminado
  } = body

  // Validación mínima
  if (
    !marca ||
    !modelo ||
    !matricula ||
    !tarjetaTransporte ||
    !licenciaNumero ||
    !titularDNI ||
    !titularNombre
  ) {
    return new Response(
      JSON.stringify({ error: "Faltan datos obligatorios" }),
      { status: 400 }
    )
  }

  // Si se marca predeterminado, quitar el anterior
  if (predeterminado) {
    await prisma.vehiculo.updateMany({
      where: { predeterminado: true },
      data: { predeterminado: false }
    })
  }

  const vehiculo = await prisma.vehiculo.create({
    data: {
      marca,
      modelo,
      matricula,
      tarjetaTransporte,
      licenciaNumero,
      titularDNI,
      titularNombre,
      predeterminado
    }
  })

  return Response.json(vehiculo)
}


// =============================
// LISTAR VEHÍCULOS
// =============================
export async function GET() {

  const vehiculos = await prisma.vehiculo.findMany({
    orderBy: {
      createdAt: "desc"
    }
  })

  return Response.json(vehiculos)

}