import React from "react";
import Link from "next/link";
import { Sparkles, Shield, Wifi, WifiOff } from "lucide-react";

interface FooterProps {
  isOnline?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isOnline = true }) => {
  return (
    <footer className="bg-white border-t border-slate-200 py-10 text-slate-600 text-sm shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-600" />
            <span className="text-lg font-bold text-slate-900">Amauta</span>
          </div>
          <p className="text-slate-600 max-w-sm text-xs leading-relaxed">
            Plataforma educativa de ciencia y tecnología inspirada en los sabios maestros Incas (&quot;Amauta&quot;), optimizada como PWA e integrada con el tutor virtual Amauta.
          </p>
          <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
            {isOnline ? (
              <span className="flex items-center gap-1.5 text-teal-700 font-medium">
                <Wifi className="w-3.5 h-3.5" /> En línea (Sincronizado)
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-600 font-medium">
                <WifiOff className="w-3.5 h-3.5" /> Modo Offline (Cache PWA activa)
              </span>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900 mb-3 text-xs uppercase tracking-wider">
            Navegación
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/cursos" className="hover:text-teal-600 transition-colors">
                Catálogo de Cursos
              </Link>
            </li>
            <li>
              <Link href="/tutor" className="hover:text-teal-600 transition-colors">
                Amauta Tutor IA
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-teal-600 transition-colors">
                Panel de Estudiante
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-900 mb-3 text-xs uppercase tracking-wider">
            Tecnología Stack
          </h4>
          <ul className="space-y-2 text-xs text-slate-600">
            <li>Next.js 14 App Router</li>
            <li>Tailwind CSS (Turquoise Light)</li>
            <li>Supabase Auth & Database</li>
            <li>Google Generative AI SDK</li>
            <li>Progressive Web App (PWA)</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© {new Date().getFullYear()} Amauta Educational Platform. Todos los derechos reservados.</p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 text-slate-600">
            <Shield className="w-3.5 h-3.5 text-teal-600" /> Supabase & SSL Protected
          </span>
        </div>
      </div>
    </footer>
  );
};
