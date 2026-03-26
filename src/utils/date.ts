// src/utils/date.ts
export function formatFecha(fecha: string | Date | null) {
  if (!fecha) return ""
  return new Date(fecha).toLocaleString("es-ES", {
    timeZone: "Europe/Madrid",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatSoloFecha(fecha: string | Date | null) {
  if (!fecha) return ""
  return new Date(fecha).toLocaleDateString("es-ES", {
    timeZone: "Europe/Madrid",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

export function formatSoloHora(fecha: string | Date | null) {
  if (!fecha) return ""
  return new Date(fecha).toLocaleTimeString("es-ES", {
    timeZone: "Europe/Madrid",
    hour: "2-digit",
    minute: "2-digit",
  })
}