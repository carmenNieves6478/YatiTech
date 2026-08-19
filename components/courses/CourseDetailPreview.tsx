"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  BookOpen,
  CheckCircle2,
  PlayCircle,
  HelpCircle,
  FileText,
  Video,
  ArrowRight,
  Sparkles,
  Signal,
  ArrowLeft,
  Bot,
} from "lucide-react";

export interface LessonItem {
  id: string;
  titulo: string;
  orden: number;
  tipo: "teoria" | "practica" | "quiz" | "video";
  completada?: boolean;
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
    async function fetchCourseDetails() {
      setLoading(true);
      try {
        // 1. Fetch course info
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: courseData, error: courseError } = await (supabase.from("courses" as any) as any)
          .select("*")
          .eq("id", courseId)
          .single();

        if (courseError) throw courseError;

        if (courseData) {
          // 2. Fetch lessons for this course ordered by 'orden'
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: rawLessons } = await (supabase.from("lessons" as any) as any)
            .select("*")
            .eq("course_id", courseId)
            .order("orden", { ascending: true });

          const sortedLessons: LessonItem[] = Array.isArray(rawLessons)
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              rawLessons.map((l: any) => ({
                id: l.id,
                titulo: l.titulo,
                orden: l.orden || 1,
                tipo: l.tipo || "teoria",
              }))
            : [];

          setCourse({
            id: courseData.id,
            titulo: courseData.titulo,
            descripcion: courseData.descripcion,
            categoria: courseData.categoria,
            nivel: courseData.nivel || "principiante",
            portada_url: courseData.portada_url,
            publicado: courseData.publicado,
            lessons: sortedLessons,
          });

          // Fetch user progress if authenticated
          if (user && sortedLessons.length > 0) {
            const lessonIds = sortedLessons.map((l) => l.id);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { data: progressData } = await (supabase.from("user_progress" as any) as any)
              .select("lesson_id, completado")
              .eq("user_id", user.id)
              .in("lesson_id", lessonIds)
              .eq("completado", true);

            if (progressData) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const completedSet = new Set<string>(progressData.map((p: any) => p.lesson_id));
              setCompletedLessonIds(completedSet);
            }
          }
        }
      } catch (err: unknown) {
        console.error("Error al cargar detalles del curso:", err);
        setError("No se pudo cargar el curso especificado.");
      } finally {
        setLoading(false);
      }
    }

    fetchCourseDetails();
  }, [courseId, user, supabase]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-slate-400">
        Cargando detalles del curso...
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <Card className="p-8 border-red-900/40 bg-red-950/20">
          <h3 className="text-xl font-bold text-white mb-2">Curso no encontrado</h3>
          <p className="text-slate-400 text-xs mb-6">
            {error || "El curso que estás buscando no existe o no está publicado."}
          </p>
          <Link href="/cursos">
            <Button variant="primary" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Volver al Catálogo
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const totalLessons = course.lessons.length;
  const completedCount = completedLessonIds.size;
  const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const hasStarted = completedCount > 0;

  // Find the first uncompleted lesson, or default to lesson 1
  const nextLesson = course.lessons.find((l) => !completedLessonIds.has(l.id)) || course.lessons[0];
  const targetLessonHref = nextLesson
    ? `/cursos/${course.id}/leccion/${nextLesson.id}`
    : `/tutor`;

  const getLessonTypeIcon = (tipo: string) => {
    switch (tipo) {
      case "practica":
        return <PlayCircle className="w-4 h-4 text-emerald-400" />;
      case "quiz":
        return <HelpCircle className="w-4 h-4 text-amber-400" />;
      case "video":
        return <Video className="w-4 h-4 text-purple-400" />;
      default:
        return <FileText className="w-4 h-4 text-indigo-400" />;
    }
  };

  const getLessonTypeLabel = (tipo: string) => {
    switch (tipo) {
      case "practica":
        return "Práctica";
      case "quiz":
        return "Quiz / Evaluación";
      case "video":
        return "Video";
      default:
        return "Teoría";
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Button */}
      <Link
        href="/cursos"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Volver a Cursos
      </Link>

      {/* Course Header Hero Card */}
      <Card className="bg-gradient-to-r from-slate-900 via-slate-950 to-indigo-950 border-slate-800 p-8 space-y-6 overflow-hidden relative">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                {course.categoria}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                <Signal className="w-3.5 h-3.5 text-purple-400" /> Nivel {course.nivel}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              {course.titulo}
            </h1>

            <p className="text-slate-300 text-sm leading-relaxed">
              {course.descripcion || "Curso interactivo de alta especialización."}
            </p>
          </div>

          {/* Action Button & Progress */}
          <div className="w-full md:w-72 bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
            {user && totalLessons > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-400">Progreso del curso:</span>
                  <span className="text-indigo-400">{progressPercentage}%</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-500 text-right">
                  {completedCount} de {totalLessons} lecciones completadas
                </div>
              </div>
            )}

            <Link href={targetLessonHref} className="block">
              <Button
                variant="primary"
                size="lg"
                className="w-full justify-center gap-2 shadow-lg shadow-indigo-600/30 py-3 text-sm font-bold"
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

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <Bot className="w-3.5 h-3.5 text-purple-400" /> Tutor IA disponible en cada lección
            </div>
          </div>
        </div>

        {/* Cover image banner if available */}
        {course.portada_url && (
          <div className="relative h-56 w-full rounded-xl overflow-hidden border border-slate-800">
            <Image src={course.portada_url} alt={course.titulo} fill className="object-cover" />
          </div>
        )}
      </Card>

      {/* Syllabus / Programa de Estudios Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" /> Programa de Estudios
          </h2>
          <span className="text-xs font-semibold text-slate-400">
            {totalLessons} {totalLessons === 1 ? "Lección" : "Lecciones"}
          </span>
        </div>

        {totalLessons === 0 ? (
          <Card className="text-center py-8 text-slate-400 text-xs">
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
                      ? "bg-slate-900/40 border-emerald-900/30"
                      : "bg-slate-900/90 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Number / Completed Check */}
                    <div className="flex-shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                          {index + 1}
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        {lesson.titulo}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
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
                      className="text-xs gap-1.5"
                    >
                      {isCompleted ? "Repasar" : "Ver Lección"} <ArrowRight className="w-3.5 h-3.5" />
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
