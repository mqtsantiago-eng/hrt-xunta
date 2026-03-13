// src/lib/pdf/templates/trayectoTemplate.ts
export function trayectoTemplate(data: {
  inicio: string
  destino: string
  fecha: string // ejemplo: "11/03/2026"
  hora: string // ejemplo: "09:30"
  pasajeros: string[] // máximo 8
  logo1?: string
  logo2?: string
  firmaConductor?: string
  firmaContratante?: string
}) {
  const listaPasajeros = data.pasajeros
    .slice(0, 8)
    .map((p, i) => `<tr><td>${i + 1}</td><td>${p}</td></tr>`)
    .join("")

  return `
  <html>
    <head>
      <style>
        @font-face {
          font-family: 'GeistVF';
          src: url('/fonts/GeistVF.woff') format('woff');
        }
        body { font-family: 'GeistVF', sans-serif; margin: 40px; color: #1a1a1a; }
        header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        header img { height: 80px; object-fit: contain; }
        h1 { text-align: center; color: #004080; font-size: 24px; margin-bottom: 20px; }
        .info { font-size: 16px; line-height: 1.8; margin-bottom: 20px; }
        .info p { margin: 6px 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #000; padding: 8px; text-align: left; }
        th { background-color: #f0f0f0; }
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

      <h1>TRAYECTO DE VEHÍCULO</h1>

      <div class="info">
        <p><strong>Inicio:</strong> ${data.inicio}</p>
        <p><strong>Destino:</strong> ${data.destino}</p>
        <p><strong>Fecha:</strong> ${data.fecha}</p>
        <p><strong>Hora:</strong> ${data.hora}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Pasajero</th>
          </tr>
        </thead>
        <tbody>
          ${listaPasajeros}
        </tbody>
      </table>

      <div class="firma">
        <div>
          <p class="firma-line">${data.firmaConductor ?? ''}</p>
          <p>Firma Conductor</p>
        </div>
        <div>
          <p class="firma-line">${data.firmaContratante ?? ''}</p>
          <p>Firma Contratante</p>
        </div>
      </div>

      <footer>
        Documento generado por el sistema de transporte Xunta de Galicia
      </footer>
    </body>
  </html>
  `
}