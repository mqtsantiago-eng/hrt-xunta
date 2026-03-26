"use client"

import { useEffect, useState } from "react"

export default function ContratosAdmin() {
  const [contratos, setContratos] = useState<any[]>([])

  const [lugar, setLugar] = useState("")
  const [contratante, setContratante] = useState("")
  const [arrendatario, setArrendatario] = useState("")
  const [valor, setValor] = useState<number>(0)
  const [valor2, setValor2] = useState<number>(0)
  const [predeterminado, setPredeterminado] = useState(false)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Archivos
  const [firmaContratante, setFirmaContratante] = useState<File | null>(null)
  const [firmaArrendatario, setFirmaArrendatario] = useState<File | null>(null)
  const [logo1, setLogo1] = useState<File | null>(null)
  const [logo2, setLogo2] = useState<File | null>(null)

  const cargarContratos = async () => {
    const res = await fetch("/api/contratos")
    const data = await res.json()
    setContratos(data)
  }

  useEffect(() => {
    cargarContratos()
  }, [])

  const limpiarFormulario = () => {
    setEditandoId(null)
    setLugar("")
    setContratante("")
    setArrendatario("")
    setValor(0)
    setValor2(0)
    setPredeterminado(false)
    setFirmaContratante(null)
    setFirmaArrendatario(null)
    setLogo1(null)
    setLogo2(null)
  }

  const guardarContrato = async () => {
    setLoading(true)
    const formData = new FormData()
    formData.append("lugar", lugar)
    formData.append("contratante", contratante)
    formData.append("arrendatario", arrendatario)
    formData.append("valor", valor.toString())
    formData.append("valor2", valor2.toString())
    formData.append("predeterminado", predeterminado ? "true" : "false")

    if (firmaContratante) formData.append("firmaContratante", firmaContratante)
    if (firmaArrendatario) formData.append("firmaArrendatario", firmaArrendatario)
    if (logo1) formData.append("logo1", logo1)
    if (logo2) formData.append("logo2", logo2)

    if (editandoId) {
      await fetch(`/api/contratos/${editandoId}`, {
        method: "PATCH",
        body: formData,
      })
    } else {
      await fetch("/api/contratos", {
        method: "POST",
        body: formData,
      })
    }

    limpiarFormulario()
    cargarContratos()
    setLoading(false)
  }

  const eliminarContrato = async (id: string) => {
    if (!confirm("¿Eliminar contrato?")) return
    const res = await fetch(`/api/contratos/${id}`, { method: "DELETE" })
    const data = await res.json()
    if (data.error) {
      alert(data.error)
      return
    }
    cargarContratos()
  }

  const hacerPredeterminado = async (id: string) => {
    await fetch("/api/contratos/predeterminado", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
    cargarContratos()
  }

  const editarContrato = (c: any) => {
    setEditandoId(c.id)
    setLugar(c.lugar)
    setContratante(c.contratante)
    setArrendatario(c.arrendatario)
    setValor(c.valor)
    setValor2(c.valor2)
    setPredeterminado(c.predeterminado)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">🧾 Contratos</h1>

      {/* FORMULARIO */}
      <div className="card space-y-3">
        <h2 className="font-bold text-lg">
          {editandoId ? "Editar contrato" : "Crear contrato"}
        </h2>

        <input className="input" placeholder="Lugar" value={lugar} onChange={e => setLugar(e.target.value)} />
        <input className="input" placeholder="Contratante" value={contratante} onChange={e => setContratante(e.target.value)} />
        <input className="input" placeholder="Arrendatario" value={arrendatario} onChange={e => setArrendatario(e.target.value)} />
        <input type="number" className="input" placeholder="Valor" value={valor} onChange={e => setValor(Number(e.target.value))} />

        <input
          type="number"
          className="input"
          placeholder="Valor 2"
          value={valor2}
          onChange={e => setValor2(Number(e.target.value))}
        />

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={predeterminado} onChange={e => setPredeterminado(e.target.checked)} />
          Contrato predeterminado
        </label>

        {/* Inputs de archivos */}
        <div className="flex flex-col gap-2">
          <label>
            Firma Contratante:
            <input type="file" onChange={e => setFirmaContratante(e.target.files?.[0] ?? null)} />
          </label>
          <label>
            Firma Arrendatario:
            <input type="file" onChange={e => setFirmaArrendatario(e.target.files?.[0] ?? null)} />
          </label>
          <label>
            Logo 1:
            <input type="file" onChange={e => setLogo1(e.target.files?.[0] ?? null)} />
          </label>
          <label>
            Logo 2:
            <input type="file" onChange={e => setLogo2(e.target.files?.[0] ?? null)} />
          </label>
        </div>

        <button onClick={guardarContrato} disabled={loading} className="btn-primary w-full">
          {loading ? (editandoId ? "Actualizando..." : "Creando...") : editandoId ? "Actualizar contrato" : "Crear contrato"}
        </button>
      </div>

      {/* LISTA CONTRATOS */}
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="p-2">Contratante</th>
              <th className="p-2">Lugar</th>
              <th className="p-2">Arrendatario</th>
              <th className="p-2">Valor</th>
              <th className="p-2">Estado</th>
              <th className="p-2 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {contratos.map(c => (
              <tr key={c.id} className={`border-b hover:bg-gray-50 ${c.predeterminado ? "bg-yellow-50" : ""}`}>
                <td className="p-2">{c.contratante}</td>
                <td className="p-2">{c.lugar}</td>
                <td className="p-2">{c.arrendatario}</td>
                <td className="p-2">{c.valor} €</td>
                <td className="p-2">{c.predeterminado && <span className="text-yellow-500 font-bold">⭐ Predeterminado</span>}</td>
                <td className="p-2">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => editarContrato(c)} className="btn-primary">Editar</button>
                    {!c.predeterminado && <button onClick={() => hacerPredeterminado(c.id)} className="btn-warning">⭐</button>}
                    <button onClick={() => eliminarContrato(c.id)} className="btn-danger">Eliminar</button>
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