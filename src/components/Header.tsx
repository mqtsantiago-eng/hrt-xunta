"use client"

import React from "react"
import { useRouter, usePathname } from "next/navigation"

interface HeaderProps {
  className?: string
  title?: string
}

export default function Header({ className = "", title }: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const showBack = pathname !== "/"

  return (
    <header
      className={`bg-blue-600 text-white h-16 flex items-center px-6 shadow-md ${className}`}
    >
      {showBack && (
        <button
          onClick={() => router.back()}
          className="mr-4 p-2 rounded hover:bg-blue-500 transition-colors"
          title="Volver"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      <h1 className="text-xl font-bold">{title || "HRT Xunta"}</h1>
    </header>
  )
}