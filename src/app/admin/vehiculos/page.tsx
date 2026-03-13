"use client"

import { useEffect, useState } from "react"

export default function VehiculosAdmin() {

  const [vehiculos, setVehiculos] = useState<any[]>([])

  const [marca, setMarca] = useState("")
  const [modelo, setModelo] = useState("")
  const [matricula, setMatricula] = useState("")
  const [tarjeta, setTarjeta] = useState("")
  const [titularDNI, setTitularDNI] = useState("")
  const [titularNombre, setTitularNombre] = useState("")
  const [licencia, setLicencia] = useState("")
  const [predeterminado, setPredeterminado] = useState(false)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const cargarVehiculos = async () => {
    const res = await fetch("/api/vehiculos")
    const data = await res.json()
    setVehiculos(data)
  }

  useEffect(() => {
    cargarVehiculos()
  }, [])

  const limpiarFormulario = () => {
    setEditandoId(null)
    setMarca("")
    setModelo("")
    setMatricula("")
    setTarjeta("")
    setTitularDNI("")
    setTitularNombre("")
    setLicencia("")
    setPredeterminado(false)
  }

  const guardarVehiculo = async () => {
    setLoading(true)

    const data = {
      marca,
      modelo,
      matricula,
      tarjetaTransporte: tarjeta,
      titularDNI,
      titularNombre,
      licenciaNumero: licencia,
      predeterminado
    }

    if (editandoId) {
      await fetch(`/api/vehiculos/${editandoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
    } else {
      await fetch("/api/vehiculos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
    }

    limpiarFormulario()
    cargarVehiculos()
    setLoading(false)
  }

  const eliminarVehiculo = async (id: string) => {
    if (!confirm("¿Eliminar vehículo?")) return

    const res = await fetch(`/api/vehiculos/${id}`, { method: "DELETE" })
    const data = await res.json()

    if (data.error) {
      alert(data.error)
      return
    }

    cargarVehiculos()
  }

  const hacerPredeterminado = async (id: string) => {
    await fetch("/api/vehiculos/predeterminado", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    })
    cargarVehiculos()
  }

  const editarVehiculo = (v: any) => {
    setEditandoId(v.id)
    setMarca(v.marca)
    setModelo(v.modelo)
    setMatricula(v.matricula)
    setTarjeta(v.tarjetaTransporte)
    setTitularDNI(v.titularDNI)
    setTitularNombre(v.titularNombre)
    setLicencia(v.licenciaNumero)
    setPredeterminado(v.predeterminado)
  }

  return (
    <div className="space-y-6 max-w-screen-sm mx-auto px-3">

      <h1 className="text-2xl font-bold text-center">
        🚗 Vehículos
      </h1>

      {/* FORMULARIO */}
      <div className="card space-y-3 w-full">
        <h2 className="font-bold text-lg">
          {editandoId ? "Editar Vehículo" : "Nuevo Vehículo"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input className="input w-full" placeholder="Marca" value={marca} onChange={e => setMarca(e.target.value)} />
          <input className="input w-full" placeholder="Modelo" value={modelo} onChange={e => setModelo(e.target.value)} />
          <input className="input w-full" placeholder="Matrícula" value={matricula} onChange={e => setMatricula(e.target.value)} />
          <input className="input w-full" placeholder="Tarjeta transporte" value={tarjeta} onChange={e => setTarjeta(e.target.value)} />
          <input className="input w-full" placeholder="DNI Titular" value={titularDNI} onChange={e => setTitularDNI(e.target.value)} />
          <input className="input w-full" placeholder="Nombre Titular" value={titularNombre} onChange={e => setTitularNombre(e.target.value)} />
          <input className="input w-full" placeholder="Licencia nº" value={licencia} onChange={e => setLicencia(e.target.value)} />
        </div>

        <label className="flex items-center gap-2 mt-2">
          <input type="checkbox" checked={predeterminado} onChange={e => setPredeterminado(e.target.checked)} />
          Vehículo predeterminado
        </label>

        <button onClick={guardarVehiculo} disabled={loading} className="btn-success w-full">
          {loading ? (editandoId ? "Actualizando..." : "Creando...") : editandoId ? "Actualizar vehículo" : "Guardar Vehículo"}
        </button>
      </div>

      {/* LISTA VEHICULOS */}
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="p-2">Marca / Modelo</th>
              <th className="p-2">Matrícula</th>
              <th className="p-2">Titular</th>
              <th className="p-2">Licencia</th>
              <th className="p-2">Predeterminado</th>
              <th className="p-2 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {vehiculos.map(v => (
              <tr key={v.id} className={`border-b hover:bg-gray-50 ${v.predeterminado ? "bg-yellow-50" : ""}`}>
                <td className="p-2">{v.marca} {v.modelo}</td>
                <td className="p-2">{v.matricula}</td>
                <td className="p-2">{v.titularNombre} ({v.titularDNI})</td>
                <td className="p-2">{v.licenciaNumero}</td>
                <td className="p-2">{v.predeterminado && <span className="text-yellow-500 font-bold">⭐</span>}</td>
                <td className="p-2">
                  <div className="flex justify-end gap-2 flex-wrap">
                    <button onClick={() => editarVehiculo(v)} className="btn-primary">Editar</button>
                    {!v.predeterminado && <button onClick={() => hacerPredeterminado(v.id)} className="btn-warning">⭐</button>}
                    <button onClick={() => eliminarVehiculo(v.id)} className="btn-danger">Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  )
}