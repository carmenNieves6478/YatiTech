import { CourseCatalog } from "@/components/courses/CourseCatalog";

export default function CursosPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-white">Catálogo de Cursos</h1>
        <p className="text-sm text-slate-400">
          Explora nuestros cursos interactivos con lecciones estructuradas y tutoría de IA Gemini.
        </p>
      </div>
      <CourseCatalog />
    </div>
  );
}
