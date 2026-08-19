import { TutorChat } from "@/components/tutor/TutorChat";

export default function TutorPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-slate-50 min-h-[85vh]">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900">
          Amauta Tutor IA (Maestro Sabio STEM)
        </h1>
        <p className="text-sm text-slate-600">
          Haz preguntas, resuelve dudas sobre tus materias escolares y aprende interactuando con Amauta.
        </p>
      </div>

      <TutorChat />
    </div>
  );
}
