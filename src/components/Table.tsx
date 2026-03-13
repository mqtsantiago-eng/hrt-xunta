import { ReactNode } from "react";

export default function Table({ children }: { children: ReactNode }) {
  return (
    <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
      {children}
    </table>
  );
}