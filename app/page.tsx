import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  Bot,
  BookOpen,
  Sparkles,
  Zap,
  ShieldCheck,
  Smartphone,
  ArrowRight,
  BrainCircuit,
  Database,
} from "lucide-react";

export default function Home() {
  const logoUrl = "https://cdn.phototourl.com/free/2026-08-19-1adf156d-26c7-446d-acbb-a6e0dd3e3b01.png";

  return (
    <div className="space-y-20 pb-20 bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="relative pt-12 lg:pt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Background Glow Accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-teal-400/20 via-emerald-400/15 to-cyan-300/20 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="text-center space-y-6 max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Sabiduría Andina + Educación STEM & Tutor IA (Amauta)</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            El futuro del aprendizaje escolar guiado por{" "}
            <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              Amauta
            </span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Plataforma educativa web y móvil instalable (PWA) inspirada en los sabios maestros Incas, con autenticación segura y tutoría socrática impulsada por IA.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/tutor" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full gap-2 shadow-md shadow-teal-600/20">
                <Bot className="w-5 h-5 text-teal-100" /> Probar Amauta Tutor IA <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/cursos" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full gap-2 border-slate-300 hover:border-teal-500">
                <BookOpen className="w-5 h-5 text-teal-600" /> Ver Cursos Escolares
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Visual Card / App Mockup */}
        <div className="mt-12 max-w-5xl mx-auto relative rounded-3xl p-2 bg-gradient-to-b from-teal-500/20 via-slate-200/50 to-white border border-slate-200 shadow-xl">
          <div className="bg-white rounded-2xl overflow-hidden p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-slate-100 shadow-sm">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-700">
                <BrainCircuit className="w-4 h-4" /> Demostración Amauta Tutor Virtual
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                Respuestas pedagógicas explicativas paso a paso, adaptadas a tu nivel
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                El tutor Amauta razona contigo usando el método socrático para que comprendas el porqué de los conceptos de matemática, física, química y programación.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1 bg-teal-50 text-teal-800 rounded-lg border border-teal-200 font-medium">
                  ⚡ Amauta AI (Gemini 3.6)
                </span>
                <span className="px-3 py-1 bg-teal-50 text-teal-800 rounded-lg border border-teal-200 font-medium">
                  📱 Soporte PWA Offline
                </span>
                <span className="px-3 py-1 bg-teal-50 text-teal-800 rounded-lg border border-teal-200 font-medium">
                  🔒 Supabase Auth & DB
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 relative h-64 w-full rounded-2xl overflow-hidden border border-teal-200 shadow-md bg-teal-50/50 flex items-center justify-center p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt="Amauta Logo Preview"
                className="max-h-48 max-w-full object-contain p-2 hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs font-bold text-white bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700">
                  Amauta Educational Platform
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Arquitectura de la Plataforma
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Construida con las tecnologías más eficientes del desarrollo moderno full-stack.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:border-teal-400 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Next.js 14 App Router</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Renderizado ultrarrápido en servidor (SSR), optimización automática de imágenes y rutas API ligeras con TypeScript.
            </p>
          </Card>

          <Card className="hover:border-emerald-400 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Backend con Supabase</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Base de datos PostgreSQL relacional, autenticación de usuarios segura con SSR cookies y políticas RLS avanzadas.
            </p>
          </Card>

          <Card className="hover:border-cyan-400 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 mb-4">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Soporte Mobile PWA</h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Instalable directamente en dispositivos iOS y Android con Service Worker para caché, manifests y modo offline.
            </p>
          </Card>
        </div>
      </section>

      {/* Gemini AI Highlight Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 text-white border border-teal-700/50 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-800/60 text-teal-200 text-xs font-medium border border-teal-600/40">
              <Bot className="w-3.5 h-3.5" /> Amauta Generative AI Integration
            </div>
            <h2 className="text-3xl font-extrabold text-white">
              Prueba la experiencia con Amauta Tutor
            </h2>
            <p className="text-teal-100 text-sm leading-relaxed">
              Inicia una conversación con el tutor Amauta para responder tus preguntas académicas, revisar código Python o preparar exámenes.
            </p>
            <div className="pt-2">
              <Link href="/tutor">
                <Button variant="secondary" size="md" className="gap-2 bg-white text-teal-800 hover:bg-teal-50 border-none font-bold">
                  Abrir Chat con Amauta <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="w-full md:w-80 p-6 rounded-2xl bg-teal-950/80 border border-teal-700/60 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-200 border-b border-teal-800 pb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Estado del Servidor Amauta
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-teal-200">
                <span>Cliente Supabase:</span>
                <span className="text-emerald-400 font-semibold">Listo</span>
              </div>
              <div className="flex justify-between text-teal-200">
                <span>Tutor Amauta AI:</span>
                <span className="text-emerald-400 font-semibold">Configurado</span>
              </div>
              <div className="flex justify-between text-teal-200">
                <span>Service Worker PWA:</span>
                <span className="text-emerald-400 font-semibold">Activo</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
