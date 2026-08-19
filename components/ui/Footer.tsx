import React from "react";
import Link from "next/link";
import { Sparkles, Shield, Wifi, WifiOff } from "lucide-react";

interface FooterProps {
  isOnline?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ isOnline = true }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 py-10 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span className="text-lg font-bold text-white">YatiTech</span>
          </div>
          <p className="text-slate-400 max-w-sm text-xs leading-relaxed">
            Plataforma educativa de ciencia y tecnología inspirada en la sabiduría andina (&quot;Yati&quot; = Conocimiento en Aymara), optimizada como PWA e integrada con el tutor virtual Yati.
          </p>
          <div className="flex items-center gap-2 pt-1 text-xs text-slate-500">
            {isOnline ? (
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <Wifi className="w-3.5 h-3.5" /> En línea (Sincronizado)
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                <WifiOff className="w-3.5 h-3.5" /> Modo Offline (Cache PWA activa)
              </span>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-slate-200 mb-3 text-xs uppercase tracking-wider">
            Navegación
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/cursos" className="hover:text-indigo-400 transition-colors">
                Catálogo de Cursos
              </Link>
            </li>
            <li>
              <Link href="/tutor" className="hover:text-indigo-400 transition-colors">
                Yati Tutor IA
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-indigo-400 transition-colors">
                Panel de Estudiante
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-slate-200 mb-3 text-xs uppercase tracking-wider">
            Tecnología Stack
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li>Next.js 14 App Router</li>
            <li>Tailwind CSS</li>
            <li>Supabase Auth & Database</li>
            <li>Google Generative AI SDK</li>
            <li>Progressive Web App (PWA)</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <p>© {new Date().getFullYear()} YatiTech Educational Platform. Todos los derechos reservados.</p>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-indigo-400" /> Supabase & SSL Protected
          </span>
        </div>
      </div>
    </footer>
  );
};
