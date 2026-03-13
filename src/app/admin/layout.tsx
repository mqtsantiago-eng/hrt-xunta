import type { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex w-full min-h-[calc(100vh-4rem)]">
      {/* Contenido Admin */}
      <main className="flex-1 p-6 w-full max-w-screen-lg mx-auto">
        {children}
      </main>
    </div>
  );
}