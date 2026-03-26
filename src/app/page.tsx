import Link from "next/link";
import Card from "../components/Card";
import Button from "../components/Button";

export default function Home() {
  return (
    <div className="w-full">

      <main className="w-full max-w-screen-xl mx-auto py-8 px-3">

        {/* imagen debajo del título */}
        <div className="flex justify-center mb-8">
          <img 
            src="/img/Logo-Xunta-Galicia.png"
            alt="Hoja de ruta" 
            className="w-full max-w-md object-contain"
          />
        </div>

        {/* título móvil */}
        <h1 className="text-2xl font-bold text-center mb-8 md:hidden">
         FOLLA DE RUTA - TAXI
        </h1>

        {/* grid dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

          {/* Trayectos ocupa toda la primera fila */}
          <div className="col-span-2 md:col-span-3 lg:col-span-4">
            <Card title="Trayectos" icon="🚐" color="bg-yellow-200 text-yellow-700">
              <Link href="/trayectos">
                <Button className="btn btn-primary w-full">
                  Abrir
                </Button>
              </Link>
            </Card>
          </div>

          {/* Vehículos y Contratos en dos columnas */}
          <Card title="Vehículos" icon="🚗" color="bg-green-100 text-green-600">
            <Link href="/admin/vehiculos">
              <Button className="btn btn-success w-full">
                Abrir
              </Button>
            </Link>
          </Card>

          <Card title="Empresa" icon="🧾" color="bg-purple-100 text-purple-600">
            <Link href="/admin/contratos">
              <Button className="btn btn-success w-full">
                Abrir
              </Button>
            </Link>
          </Card>

        </div>

      </main>

    </div>
  );
}