export default function Sidebar() {
  return (
    <aside className="w-64 bg-white shadow-md p-4">
      <ul className="space-y-3">
        <li><a href="/admin/vehiculos" className="block p-2 rounded hover:bg-blue-100">Vehículos</a></li>
        <li><a href="/admin/contratos" className="block p-2 rounded hover:bg-blue-100">Contratos</a></li>
        <li><a href="/trayectos" className="block p-2 rounded hover:bg-blue-100">Trayectos</a></li>
      </ul>
    </aside>
  );
}