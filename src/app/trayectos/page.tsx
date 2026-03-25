"use client"

import { useEffect, useState, useRef } from "react"

interface Contrato {
  id: string
  lugar: string
  valor: number
  predeterminado: boolean
}

interface Vehiculo {
  id: string
  marca: string
  modelo: string
  predeterminado: boolean
}

interface Trayecto {
  id: string
  numero: string
  origen: string
  destino: string
  pasajeros: string[]
  hora: string
  dateM: string | null
  vehiculo: Vehiculo
  contrato: Contrato
}

export default function TrayectosPage() {
  const [trayectos, setTrayectos] = useState<Trayecto[]>([])
  const [origen, setOrigen] = useState("")
  const [destino, setDestino] = useState("SANTIAGO DE COMPOSTELA")
  const [pasajeros, setPasajeros] = useState<string[]>([])
  const [nuevoPasajero, setNuevoPasajero] = useState("")
  const [loading, setLoading] = useState(false)

  const destinoRef = useRef<HTMLInputElement>(null)
  const origenRef = useRef<HTMLInputElement>(null)

  const cargarTrayectos = async () => {
    const res = await fetch("/api/trayectos")
    const data = await res.json()
    setTrayectos(data)
  }

  useEffect(() => {
    cargarTrayectos()
    origenRef.current?.focus()
  }, [])

  const agregarPasajero = () => {
    const nombre = nuevoPasajero.trim().toUpperCase()

    if (!nombre) return

    if (pasajeros.length >= 8) {
      alert("Máximo 8 pasajeros")
      return
    }

    setPasajeros([...pasajeros, nombre])
    setNuevoPasajero("")
  }

  const eliminarPasajero = (index: number) => {
    setPasajeros(pasajeros.filter((_, i) => i !== index))
  }

  const guardarTrayecto = async () => {
    if (!origen || !destino) {
      alert("Debes ingresar origen y destino")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/trayectos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origen: origen.toUpperCase(),
          destino: destino.toUpperCase(),
          pasajeros
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        alert(error.error || "Error al crear trayecto")
        setLoading(false)
        return
      }

      const trayectoCreado: Trayecto = await res.json()

      const pdfRes = await fetch(`/api/trayectos/${trayectoCreado.id}/pdf`)
      if (pdfRes.ok) {
        const blob = await pdfRes.blob()
        const url = URL.createObjectURL(blob)
        window.open(url, "_blank")
      }

      setOrigen("")
      setDestino("SANTIAGO DE COMPOSTELA")
      setPasajeros([])
      setNuevoPasajero("")

      origenRef.current?.focus()

      cargarTrayectos()

    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const abrirPDF = async (id: string) => {
    try {
      const res = await fetch(`/api/trayectos/${id}/pdf`)
      if (!res.ok) {
        alert("Error generando PDF")
        return
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      window.open(url, "_blank")
    } catch (err) {
      console.error(err)
      alert("Error al abrir el PDF")
    }
  }

  return (
    <div className="space-y-6 w-full max-w-screen-lg mx-auto px-4 sm:px-6">

      <div className="card space-y-3">
        <h3 className="font-bold text-lg">Nuevo trayecto</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          <div className="relative">
            <input
              className="input uppercase pr-8"
              placeholder="Origen"
              value={origen}
              ref={origenRef}
              onChange={e => setOrigen(e.target.value.toUpperCase())}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  destinoRef.current?.focus()
                }
              }}
            />

            {origen && (
              <button
                type="button"
                onClick={() => {
                  setOrigen("")
                  origenRef.current?.focus()
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                ✕
              </button>
            )}
          </div>

          <input
            className="input uppercase"
            placeholder="Destino"
            value={destino}
            ref={destinoRef}
            onChange={e => setDestino(e.target.value.toUpperCase())}
          />

        </div>

        <div className="space-y-2">
          <div className="flex gap-2 items-center mt-2">

            <input
              className="input uppercase flex-1"
              placeholder="Agregar pasajero"
              value={nuevoPasajero}
              onChange={e => setNuevoPasajero(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === "Enter" && agregarPasajero()}
            />

            <button
              onClick={agregarPasajero}
              className="btn-success w-10 h-10 flex items-center justify-center text-xl p-0"
              title="Agregar pasajero"
            >
              +
            </button>

            <button
              onClick={guardarTrayecto}
              disabled={loading}
              className="btn-primary w-10 h-10 flex items-center justify-center text-lg p-0"
              title="Guardar trayecto"
            >
              💾
            </button>

          </div>

          {pasajeros.length > 0 && (
            <ul className="list-disc pl-5">
              {pasajeros.map((p, i) => (
                <li key={i} className="flex justify-between items-center">
                  {p}
                  <button
                    onClick={() => eliminarPasajero(i)}
                    className="btn-danger text-xs px-2 py-0.5"
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
          )}

        </div>
      </div>

      <div className="card overflow-x-auto">
        <table className="table text-sm min-w-full">
          <thead>
            <tr className="border-b">
              <th className="p-2">Número</th>
              <th className="p-2">Origen</th>
              <th className="p-2">Destino</th>
              <th className="p-2">Pasajeros</th>
              <th className="p-2">Vehículo</th>
              <th className="p-2">Contrato</th>
              <th className="p-2">Hora</th>
              <th className="p-2">DateM</th>
              <th className="p-2">PDF</th>
            </tr>
          </thead>

          <tbody>
            {trayectos.map(t => (
              <tr key={t.id} className="border-b hover:bg-gray-50">
                <td className="p-2">{t.numero}</td>
                <td className="p-2">{t.origen}</td>
                <td className="p-2">{t.destino}</td>
                <td className="p-2">{t.pasajeros.join(", ")}</td>
                <td className="p-2">{t.vehiculo.marca} {t.vehiculo.modelo}</td>
                <td className="p-2">{t.contrato.lugar}</td>
                <td className="p-2">{new Date(t.hora).toLocaleString()}</td>
                <td className="p-2">{t.dateM ? new Date(t.dateM).toLocaleString() : ""}</td>
                <td className="p-2">
                  <button
                    onClick={() => abrirPDF(t.id)}
                    className="btn-primary text-xs px-2 py-1"
                  >
                    PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}