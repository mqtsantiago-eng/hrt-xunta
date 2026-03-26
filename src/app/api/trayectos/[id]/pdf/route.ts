import { prisma } from "@/lib/prisma"
import { NextRequest } from "next/server"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import QRCode from "qrcode"
import { formatFecha, formatSoloFecha, formatSoloHora } from "@/utils/date"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const trayecto = await prisma.trayecto.findUnique({
      where: { id: params.id },
      include: {
        vehiculo: true,
        contrato: true,
      },
    })

    if (!trayecto) {
      return new Response(JSON.stringify({ error: "Trayecto no encontrado" }), { status: 404 })
    }

    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595, 842]) // A4
    const { width } = page.getSize()

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    let y = 760

    // ---------------------
    // CABECERA LOGOS
    // ---------------------
    const logos = [trayecto.contrato.logo1, trayecto.contrato.logo2].filter(Boolean)
    for (const logo of logos) {
      const img = await pdfDoc.embedPng(Buffer.from(logo!, "base64"))
      const dims = img.scale(0.8)
      page.drawImage(img, { x: width / 2 - dims.width / 2, y, width: dims.width, height: dims.height })
      y -= dims.height + 1
    }

    // ---------------------
    // TITULO
    // ---------------------
    page.drawText("HOJA DE RUTA - TAXI", { x: width / 2 - 90, y, size: 16, font: bold })
    y -= 18
    page.drawText(`Hoja de ruta Nº: ${trayecto.numero}`, { x: width / 2 - 90, y, size: 11, font })
    y -= 20
    page.drawLine({ start: { x: 40, y }, end: { x: width - 40, y }, thickness: 1 })
    y -= 25

    // ---------------------
    // VEHICULO
    // ---------------------
    page.drawText("DATOS DO VEHÍCULO", { x: 50, y, size: 12, font: bold })
    y -= 18
    const vehiculo = trayecto.vehiculo
    const vehiculoData = [
      `Marca: ${vehiculo.marca}`,
      `Modelo: ${vehiculo.modelo}`,
      `Tarxeta transporte: ${vehiculo.tarjetaTransporte}`,
      `Titular: ${vehiculo.titularNombre} - ${vehiculo.titularDNI}`,
      `Licenza Nº: ${vehiculo.licenciaNumero}`,
    ]
    vehiculoData.forEach(line => { page.drawText(line, { x: 60, y, size: 10, font }); y -= 14 })
    y -= 10

    // ---------------------
    // CONTRATO
    // ---------------------
    page.drawText("DATOS DO CONTRATO", { x: 50, y, size: 12, font: bold })
    y -= 18
    const fechaHora = trayecto.dateM ?? new Date()
    const contratoData = [
      `Contrato Nº: ${trayecto.numero}`,
      `Lugar: ${trayecto.contrato.lugar}`,
      `Fecha e hora: ${formatFecha(fechaHora)}`,
      `Contratante: ${trayecto.contrato.contratante}`,
      `Arrendatario: ${trayecto.contrato.arrendatario}`,
    ]
    contratoData.forEach(line => { page.drawText(line, { x: 60, y, size: 10, font }); y -= 14 })
    y -= 10

    // ---------------------
    // RUTA
    // ---------------------
    page.drawText("DATOS DA RUTA CONTRATADA", { x: 50, y, size: 12, font: bold })
    y -= 18
    const fechaRecogida = trayecto.dateM2 ?? trayecto.hora
    const rutaData = [
      `Fecha recollida: ${formatSoloFecha(fechaRecogida)}`,
      `Hora recollida: ${formatSoloHora(fechaRecogida)}`,
      `Lugar orixen: ${trayecto.origen}`,
      `Lugar destino: ${trayecto.destino}`,
      `Pasaxeiros: ${trayecto.pasajeros.join(", ")}`,
    ]
    rutaData.forEach(line => { page.drawText(line, { x: 60, y, size: 10, font }); y -= 14 })
    y -= 20

    // ---------------------
    // FIRMAS
    // ---------------------
    const firmaY = 140
    page.drawLine({ start: { x: 80, y: firmaY }, end: { x: 260, y: firmaY }, thickness: 1 })
    page.drawLine({ start: { x: width - 260, y: firmaY }, end: { x: width - 80, y: firmaY }, thickness: 1 })
    page.drawText("Contratante", { x: 130, y: firmaY - 15, size: 10, font })
    page.drawText("Arrendatario", { x: width - 210, y: firmaY - 15, size: 10, font })

    if (trayecto.contrato.firmaContratante) {
      const img = await pdfDoc.embedPng(Buffer.from(trayecto.contrato.firmaContratante, "base64"))
      const dims = img.scale(120 / img.width)
      page.drawImage(img, { x: 100, y: firmaY + 10, width: dims.width, height: dims.height })
    }

    if (trayecto.contrato.firmaArrendatario) {
      const img = await pdfDoc.embedPng(Buffer.from(trayecto.contrato.firmaArrendatario, "base64"))
      const dims = img.scale(120 / img.width)
      page.drawImage(img, { x: width - 220, y: firmaY + 10, width: dims.width, height: dims.height })
    }

    // ---------------------
// TEXTO LEGAL + QR
// ---------------------
const textoLegal = "De conformidad con el Real Decreto 1720/2007 de 21 de diciembre de protección de datos de carácter personal y a través de la cumplimentación de los formularios de inscripción o de cualquier otro formulario que nos envíe que contenga sus datos personales, Ud. expresamente consiente que sus datos personales facilitados sean incorporados a un fichero de TIC DIGITAL LLC con la finalidad de prestarle nuestros servicios profesionales. TIC DIGITAL LLC solo tratará los datos para los fines de prestar los servicios mencionados y no los aplicará o utilizará con distinto fin."

const qrSize = 90
const qrMargin = 40
const textoWidth = width - qrSize - qrMargin - 60 // espacio para texto legal a la izquierda
const fontSize = 8

// Generar QR
const urlVerificacion = `https://hrt-xunta.vercel.app/trayecto/${trayecto.id}`
const qrBase64 = await QRCode.toDataURL(urlVerificacion)
const qrImage = await pdfDoc.embedPng(Buffer.from(qrBase64.split(",")[1], "base64"))

// Dibujar QR a la derecha
page.drawImage(qrImage, {
  x: width - qrSize - qrMargin,
  y: 40,
  width: qrSize,
  height: qrSize,
})

// Dibujar texto legal a la izquierda del QR
let textY = 90
let line = ""
const words = textoLegal.split(" ")

for (const word of words) {
  const testLine = line + word + " "
  const testWidth = font.widthOfTextAtSize(testLine, fontSize)
  if (testWidth > textoWidth) {
    page.drawText(line.trim(), {
      x: 50,
      y: textY,
      size: fontSize,
      font,
      color: rgb(0.2, 0.2, 0.2),
    })
    textY -= 10
    line = word + " "
  } else {
    line = testLine
  }
}
if (line) {
  page.drawText(line.trim(), {
    x: 50,
    y: textY,
    size: fontSize,
    font,
    color: rgb(0.2, 0.2, 0.2),
  })
}

// Código y verificación debajo del QR
const codigoVerificacion = trayecto.id.slice(0, 8).toUpperCase()
page.drawText(`Código: ${codigoVerificacion}`, {
  x: width - 150,
  y: 35 + qrSize + 5,
  size: 9,
  font,
})
page.drawText("Verificación", {
  x: width - qrSize - 35,
  y: 35,
  size: 8,
  font,
})

    // ---------------------
    // GENERAR PDF
    // ---------------------
    const pdfBytes = await pdfDoc.save()
    return new Response(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=trayecto-${trayecto.numero}.pdf`,
      },
    })

  } catch (error: any) {
    console.error("Error generando PDF:", error)
    return new Response(JSON.stringify({ error: error.message || "Error generando PDF" }), { status: 500 })
  }
}