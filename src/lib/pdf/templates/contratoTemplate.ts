// src/lib/pdf/templates/contratoTemplate.ts
export function contratoTemplate(data: {
  lugar: string
  contratante: string
  arrendatario: string
  firmaContratante?: string
  firmaArrendatario?: string
  valor: number
  logo1?: string
  logo2?: string
}) {
  const fecha = new Date().toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  return `
  <html>
    <head>
      <style>
        @font-face {
          font-family: 'GeistVF';
          src: url('/fonts/GeistVF.woff') format('woff');
        }
        body { font-family: 'GeistVF', sans-serif; margin: 40px; color: #1a1a1a; }
        header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        header img { height: 80px; object-fit: contain; }
        h1 { text-align: center; color: #004080; font-size: 24px; margin-bottom: 20px; }
        .info { font-size: 16px; line-height: 1.8; margin-bottom: 20px; }
        .info p { margin: 6px 0; }
        .valor { font-weight: bold; font-size: 18px; margin-top: 10px; }
        .fecha { text-align: right; font-size: 14px; margin-bottom: 30px; }
        .firma { margin-top: 50px; display: flex; justify-content: space-around; }
        .firma div { text-align: center; width: 40%; }
        .firma-line { border-top: 1px solid #000; margin-top: 60px; }
        footer { position: fixed; bottom: 20px; width: 100%; text-align: center; font-size: 12px; color: #555; }
      </style>
    </head>
    <body>
      <header>
        <img src="${data.logo1 ?? ''}" alt="Logo 1"/>
        <img src="${data.logo2 ?? ''}" alt="Logo 2"/>
      </header>

      <h1>CONTRATO DE ARRENDAMIENTO DE VEHÍCULO</h1>

      <div class="fecha">
        <p>Fecha: ${fecha}</p>
      </div>

      <div class="info">
        <p><strong>Lugar:</strong> ${data.lugar}</p>
        <p><strong>Contratante:</strong> ${data.contratante}</p>
        <p><strong>Arrendatario:</strong> ${data.arrendatario}</p>
        <p class="valor"><strong>Valor del arrendamiento:</strong> ${data.valor} €</p>
      </div>

      <div class="firma">
        <div>
          <p class="firma-line">${data.firmaContratante ?? ''}</p>
          <p>Firma Contratante</p>
        </div>
        <div>
          <p class="firma-line">${data.firmaArrendatario ?? ''}</p>
          <p>Firma Arrendatario</p>
        </div>
      </div>

      <footer>
        Documento generado por el sistema de transporte Xunta de Galicia
      </footer>
    </body>
  </html>
  `
}