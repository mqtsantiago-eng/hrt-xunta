// src/componets/Button.tsx
import type { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={`px-4 py-3 rounded-lg font-semibold transition-colors ${className ?? ""}`}
      {...props}
    >
      {children}
    </button>
  );
}