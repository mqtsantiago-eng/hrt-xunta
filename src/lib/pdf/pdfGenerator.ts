import puppeteer from 'puppeteer'

export async function createPdfFromHtml(html: string, options?: { landscape?: boolean }) {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
  const page = await browser.newPage()

  // Configura el contenido HTML
  await page.setContent(html, { waitUntil: 'networkidle0' })

  // Generar PDF
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    landscape: options?.landscape || false,
    margin: { top: '20mm', bottom: '20mm', left: '20mm', right: '20mm' }
  })

  await browser.close()
  return pdfBuffer
}