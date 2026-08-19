import Link from "next/link";
import Image from "next/image";
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
  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 lg:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Background Glow Accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/30 via-purple-600/20 to-pink-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="text-center space-y-6 max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-md shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Sabiduría Andina + Educación STEM & Tutor IA (Yati)</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            El futuro del aprendizaje escolar guiado por{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              YatiTech
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Plataforma educativa web y móvil (PWA) inspirada en el saber Aymara con autenticación en tiempo real mediante Supabase y tutoría interactiva impulsada por IA.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/tutor" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full gap-2 shadow-xl shadow-indigo-600/30">
                <Bot className="w-5 h-5 text-purple-200" /> Probar Yati Tutor IA <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/cursos" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full gap-2 border-slate-700 hover:border-slate-500">
                <BookOpen className="w-5 h-5" /> Ver Cursos Escolares
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Visual Card / App Mockup */}
        <div className="mt-12 max-w-5xl mx-auto relative rounded-3xl p-2 bg-gradient-to-b from-indigo-500/30 via-slate-800/40 to-slate-900/80 border border-slate-800 shadow-2xl">
          <div className="bg-slate-950 rounded-2xl overflow-hidden p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
                <BrainCircuit className="w-4 h-4" /> Demostración Yati Tutor Virtual
              </div>
              <h3 className="text-2xl font-bold text-white">
                Respuestas pedagógicas explicativas paso a paso, adaptadas a tu nivel
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                El tutor Yati razona contigo usando el método socrático para que comprendas el porqué de los conceptos de matemática, física, química y programación.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1 bg-slate-900 rounded-lg border border-slate-800 text-slate-300">
                  ⚡ Yati AI (Gemini 3.6 Flash)
                </span>
                <span className="px-3 py-1 bg-slate-900 rounded-lg border border-slate-800 text-slate-300">
                  📱 Soporte PWA Offline
                </span>
                <span className="px-3 py-1 bg-slate-900 rounded-lg border border-slate-800 text-slate-300">
                  🔒 Supabase Auth & DB
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 relative h-64 w-full rounded-2xl overflow-hidden border border-indigo-500/30 shadow-xl group">
              <Image
                src="/icon.png"
                alt="YatiTech App Preview"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex items-end p-4">
                <span className="text-xs font-bold text-white bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800">
                  YatiTech Mobile PWA Card
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Feature Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-2">
          <h2 className="text-3xl font-extrabold text-white">
            Arquitectura de YatiTech
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Construida con las tecnologías más eficientes del desarrollo moderno full-stack.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:border-indigo-500/50 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Next.js 14 App Router</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Renderizado ultrarrápido en servidor (SSR), optimización automática de imágenes y rutas API ligeras con TypeScript.
            </p>
          </Card>

          <Card className="hover:border-purple-500/50 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Backend con Supabase</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Base de datos PostgreSQL relacional, autenticación de usuarios segura con SSR cookies y políticas RLS avanzadas.
            </p>
          </Card>

          <Card className="hover:border-pink-500/50 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 mb-4">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Soporte Mobile PWA</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Instalable directamente en dispositivos iOS y Android con Service Worker para caché, manifests y modo offline.
            </p>
          </Card>
        </div>
      </section>

      {/* Gemini AI Highlight Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/30 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-medium border border-purple-500/30">
              <Bot className="w-3.5 h-3.5" /> Yati AI Integration
            </div>
            <h2 className="text-3xl font-extrabold text-white">
              Prueba la experiencia con Yati Tutor
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Inicia una conversación con el tutor Yati para responder tus preguntas académicas, revisar código Python o preparar exámenes.
            </p>
            <div className="pt-2">
              <Link href="/tutor">
                <Button variant="primary" size="md" className="gap-2">
                  Abrir Chat con Yati <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="w-full md:w-80 p-6 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 border-b border-slate-800 pb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Estado del Servidor YatiTech
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Cliente Supabase:</span>
                <span className="text-emerald-400 font-semibold">Listo</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Tutor Yati AI:</span>
                <span className="text-emerald-400 font-semibold">Configurado</span>
              </div>
              <div className="flex justify-between text-slate-400">
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
