import { TutorChat } from "@/components/tutor/TutorChat";

export default function TutorPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-white">
          Tutor Personal con IA Gemini
        </h1>
        <p className="text-sm text-slate-400">
          Haz preguntas, resuelve dudas sobre tus materias y aprende interactuando con Ayme.
        </p>
      </div>

      <TutorChat />
    </div>
  );
}
