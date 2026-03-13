// C:\dev\hrt-xunta\src\app\layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "HRT Xunta",
  description: "Gestión de trayectos, vehículos y contratos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="icon" href="/favicon.ico" />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900 min-h-screen`}
      >
        {/* Header y Sidebar solo para la sección normal */}
        <Header />
        <div className="flex min-h-[calc(100vh-4rem)] w-full">
          <aside className="hidden md:block w-64 border-r bg-white">
            <Sidebar />
          </aside>

          <main className="flex-1 p-4 sm:p-6 w-full max-w-screen-lg mx-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}