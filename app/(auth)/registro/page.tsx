import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

export default function RegistroPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="text-slate-400 text-sm">Cargando formulario...</div>}>
        <AuthForm mode="register" />
      </Suspense>
    </div>
  );
}
