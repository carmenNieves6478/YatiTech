"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  BookOpen,
  CheckCircle2,
  PlayCircle,
  Signal,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  FileText,
  Video,
  Bot,
} from "lucide-react";

export interface LessonItem {
  id: string;
  titulo: string;
  orden: number;
  tipo: "teoria" | "practica" | "quiz" | "video";
}

export interface CourseDetail {
  id: string;
  titulo: string;
  descripcion: string | null;
  categoria: string;
  nivel: "principiante" | "intermedio" | "avanzado";
  portada_url: string | null;
  publicado: boolean;
  lessons: LessonItem[];
}

interface Props {
  courseId: string;
}

export const CourseDetailPreview: React.FC<Props> = ({ courseId }) => {
  const { user } = useAuth();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function fetchCourseDetail() {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch Course metadata
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: cData, error: cErr } = await (supabase.from("courses" as any) as any)
          .select("*")
          .eq("id", courseId)
          .single();

        if (cErr) throw cErr;

        // 2. Fetch Lessons of this course
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: lData, error: lErr } = await (supabase.from("lessons" as any) as any)
          .select("id, titulo, orden, tipo")
          .eq("course_id", courseId)
          .order("orden", { ascending: true });

        if (lErr) throw lErr;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const lessonsList: LessonItem[] = (lData || []).map((l: any) => ({
          id: l.id,
          titulo: l.titulo,
          orden: l.orden || 1,
          tipo: l.tipo || "teoria",
        }));

        if (cData) {
          setCourse({
            id: cData.id,
            titulo: cData.titulo,
            descripcion: cData.descripcion,
            categoria: cData.categoria,
            nivel: cData.nivel || "principiante",
            portada_url: cData.portada_url,
            publicado: cData.publicado,
            lessons: lessonsList,
          });
        }

        // 3. Fetch User Progress if logged in
        if (user) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: pData } = await (supabase.from("user_progress" as any) as any)
            .select("lesson_id, completado")
            .eq("user_id", user.id)
            .eq("completado", true);

          if (pData) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const set = new Set<string>(pData.map((p: any) => p.lesson_id));
            setCompletedLessonIds(set);
          }
        }
      } catch (err: unknown) {
        console.error("Error al cargar el detalle del curso:", err);
        setError("No se pudo cargar la información del curso.");
      } finally {
        setLoading(false);
      }
    }

    fetchCourseDetail();
  }, [courseId, user, supabase]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-24 text-center text-slate-500">
        Cargando programa educativo...
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <Card className="p-8 border-red-200 bg-red-50 text-red-900 max-w-lg mx-auto">
          <h3 className="text-xl font-bold text-red-900 mb-2">Curso no disponible</h3>
          <p className="text-slate-600 text-xs mb-6">
            {error || "El curso que buscas no existe o ha sido despublicado."}
          </p>
          <Link href="/cursos">
            <Button variant="primary" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Volver al Catálogo de Cursos
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const totalLessons = course.lessons.length;
  const completedCount = course.lessons.filter((l) => completedLessonIds.has(l.id)).length;
  const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const hasStarted = completedCount > 0;

  // First uncompleted lesson or first lesson
  const firstUncompleted = course.lessons.find((l) => !completedLessonIds.has(l.id));
  const targetLessonHref = firstUncompleted
    ? `/cursos/${course.id}/leccion/${firstUncompleted.id}`
    : totalLessons > 0
    ? `/cursos/${course.id}/leccion/${course.lessons[0].id}`
    : "#";

  const getLessonTypeIcon = (tipo: string) => {
    switch (tipo) {
      case "practica":
        return <PlayCircle className="w-4 h-4 text-emerald-600" />;
      case "quiz":
        return <HelpCircle className="w-4 h-4 text-amber-600" />;
      case "video":
        return <Video className="w-4 h-4 text-cyan-600" />;
      default:
        return <FileText className="w-4 h-4 text-teal-600" />;
    }
  };

  const getLessonTypeLabel = (tipo: string) => {
    switch (tipo) {
      case "practica":
        return "Práctica";
      case "quiz":
        return "Quiz Evaluativo";
      case "video":
        return "VideoLección";
      default:
        return "Artículo Teórico";
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-slate-50 min-h-[85vh]">
      {/* Back Button */}
      <Link
        href="/cursos"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-teal-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Volver a Cursos
      </Link>

      {/* Course Header Hero Card */}
      <Card className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 border-teal-700 text-white p-8 space-y-6 overflow-hidden relative shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-800/80 text-teal-200 border border-teal-600">
                {course.categoria}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-950/80 text-teal-200 border border-teal-700 flex items-center gap-1">
                <Signal className="w-3.5 h-3.5 text-emerald-400" /> Nivel {course.nivel}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              {course.titulo}
            </h1>

            <p className="text-teal-100 text-sm leading-relaxed">
              {course.descripcion || "Curso interactivo de alta especialización."}
            </p>
          </div>

          {/* Action Button & Progress */}
          <div className="w-full md:w-72 bg-teal-950/90 p-5 rounded-2xl border border-teal-700 space-y-4 shadow-xl">
            {user && totalLessons > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-teal-200">Progreso del curso:</span>
                  <span className="text-teal-400">{progressPercentage}%</span>
                </div>
                <div className="w-full h-2 bg-teal-900 rounded-full overflow-hidden border border-teal-800">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="text-[11px] text-teal-300 text-right">
                  {completedCount} de {totalLessons} lecciones completadas
                </div>
              </div>
            )}

            <Link href={targetLessonHref} className="block">
              <Button
                variant="primary"
                size="lg"
                className="w-full justify-center gap-2 shadow-md py-3 text-sm font-bold bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400"
              >
                {hasStarted ? (
                  <>
                    <PlayCircle className="w-4 h-4" /> Continuar Curso
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" /> Iniciar Curso
                  </>
                )}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <div className="flex items-center justify-center gap-2 text-[11px] text-teal-200">
              <Bot className="w-3.5 h-3.5 text-emerald-400" /> Amauta Tutor disponible en cada lección
            </div>
          </div>
        </div>

        {/* Cover image banner if available */}
        {course.portada_url && (
          <div className="relative h-56 w-full rounded-xl overflow-hidden border border-teal-700/60 shadow-md">
            <Image src={course.portada_url} alt={course.titulo} fill className="object-cover" />
          </div>
        )}
      </Card>

      {/* Syllabus / Programa de Estudios Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" /> Programa de Estudios
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            {totalLessons} {totalLessons === 1 ? "Lección" : "Lecciones"}
          </span>
        </div>

        {totalLessons === 0 ? (
          <Card className="text-center py-8 text-slate-500 text-xs bg-white">
            No hay lecciones registradas aún para este curso.
          </Card>
        ) : (
          <div className="space-y-3">
            {course.lessons.map((lesson, index) => {
              const isCompleted = completedLessonIds.has(lesson.id);

              return (
                <Card
                  key={lesson.id}
                  className={`p-4 transition-all duration-200 flex items-center justify-between gap-4 border ${
                    isCompleted
                      ? "bg-emerald-50/80 border-emerald-300 shadow-xs"
                      : "bg-white border-slate-200 hover:border-teal-300 shadow-xs"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Number / Completed Check */}
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-700">
                          {index + 1}
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        {lesson.titulo}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          {getLessonTypeIcon(lesson.tipo)}
                          {getLessonTypeLabel(lesson.tipo)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Link href={`/cursos/${course.id}/leccion/${lesson.id}`}>
                    <Button
                      variant={isCompleted ? "outline" : "secondary"}
                      size="sm"
                      className="gap-1.5 text-xs font-semibold"
                    >
                      {isCompleted ? "Repasar" : "Estudiar"}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
