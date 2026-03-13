import type { ReactNode } from "react";

interface CardProps {
  title: string;
  icon?: string;
  color?: string;
  children?: ReactNode;
}

export default function Card({ title, icon, color = "bg-blue-100 text-blue-600", children }: CardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col items-center text-center gap-4 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all">

      {/* Icono */}
      {icon && (
        <div className={`w-12 h-12 flex items-center justify-center rounded-full text-xl ${color}`}>
          {icon}
        </div>
      )}

      {/* Título */}
      <h2 className="font-semibold text-gray-800">
        {title}
      </h2>

      {/* Acción */}
      <div className="w-full">
        {children}
      </div>

    </div>
  );
}