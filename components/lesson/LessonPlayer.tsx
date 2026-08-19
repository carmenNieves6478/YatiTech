"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LessonSidebar } from "./LessonSidebar";
import { MarkdownViewer } from "./MarkdownViewer";
import { QuizEngine, QuizQuestion } from "./QuizEngine";
import { PersonalNotes } from "./PersonalNotes";
import { LessonTutorChat } from "./LessonTutorChat";
import { LessonItem } from "@/components/courses/CourseDetailPreview";
import {
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  Bot,
  Menu,
  ArrowLeft,
} from "lucide-react";

interface Props {
  courseId: string;
  lessonId: string;
}

export interface CurrentLesson {
  id: string;
  course_id: string;
  titulo: string;
  contenido_markdown: string;
  orden: number;
  tipo: "teoria" | "practica" | "quiz" | "video";
}

export const LessonPlayer: React.FC<Props> = ({ courseId, lessonId }) => {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [courseTitle, setCourseTitle] = useState<string>("");
  const [currentLesson, setCurrentLesson] = useState<CurrentLesson | null>(null);
  const [lessonsList, setLessonsList] = useState<LessonItem[]>([]);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [tutorChatOpen, setTutorChatOpen] = useState<boolean>(false);

  // Fetch Course, Lessons, Current Lesson, Progress, and Saved state
  useEffect(() => {
    async function loadLessonData() {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch Course Title
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: courseData, error: courseErr } = await (supabase.from("courses" as any) as any)
          .select("titulo")
          .eq("id", courseId)
          .single();

        if (courseErr) throw courseErr;
        setCourseTitle(courseData?.titulo || "Curso");

        // 2. Fetch All Lessons in Course
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: rawLessons, error: lessonsErr } = await (supabase.from("lessons" as any) as any)
          .select("id, titulo, orden, tipo")
          .eq("course_id", courseId)
          .order("orden", { ascending: true });

        if (lessonsErr) throw lessonsErr;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedLessons: LessonItem[] = (rawLessons || []).map((l: any) => ({
          id: l.id,
          titulo: l.titulo,
          orden: l.orden || 1,
          tipo: l.tipo || "teoria",
        }));

        setLessonsList(formattedLessons);

        // 3. Fetch Current Lesson Detail
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: lessonData, error: lErr } = await (supabase.from("lessons" as any) as any)
          .select("*")
          .eq("id", lessonId)
          .single();

        if (lErr) throw lErr;

        if (lessonData) {
          setCurrentLesson({
            id: lessonData.id,
            course_id: lessonData.course_id,
            titulo: lessonData.titulo,
            contenido_markdown: lessonData.contenido_markdown || "",
            orden: lessonData.orden || 1,
            tipo: lessonData.tipo || "teoria",
          });
        }

        // 4. Fetch User Progress if logged in
        if (user) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: progressData } = await (supabase.from("user_progress" as any) as any)
            .select("lesson_id, completado")
            .eq("user_id", user.id)
            .eq("completado", true);

          if (progressData) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const set = new Set<string>(progressData.map((p: any) => p.lesson_id));
            setCompletedLessonIds(set);
          }

          // Fetch Saved status for this lesson
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: savedData } = await (supabase.from("user_saved" as any) as any)
            .select("id")
            .eq("user_id", user.id)
            .eq("lesson_id", lessonId)
            .maybeSingle();

          setIsSaved(!!savedData);
        }

        // 5. Fetch Quiz questions if lesson is type 'quiz'
        if (lessonData?.tipo === "quiz") {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: quizData } = await (supabase.from("quizzes" as any) as any)
            .select("preguntas")
            .eq("lesson_id", lessonId)
            .maybeSingle();

          if (quizData && Array.isArray(quizData.preguntas)) {
            setQuizQuestions(quizData.preguntas);
          } else {
            setQuizQuestions([]);
          }
        }
      } catch (err: unknown) {
        console.error("Error al cargar la lección:", err);
        setError("No se pudo cargar el contenido de esta lección.");
      } finally {
        setLoading(false);
      }
    }

    loadLessonData();
  }, [courseId, lessonId, user, supabase]);

  // Toggle Optimistic Progress Completion
  const handleToggleCompleted = async () => {
    if (!user) {
      router.push(`/login?redirectTo=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    if (!currentLesson) return;

    const isCurrentlyCompleted = completedLessonIds.has(lessonId);
    const newCompletedState = !isCurrentlyCompleted;

    // Optimistic Update UI
    setCompletedLessonIds((prev) => {
      const next = new Set(prev);
      if (newCompletedState) {
        next.add(lessonId);
      } else {
        next.delete(lessonId);
      }
      return next;
    });

    try {
      // Upsert into Supabase user_progress
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: upsertErr } = await (supabase.from("user_progress" as any) as any).upsert(
        {
          user_id: user.id,
          lesson_id: lessonId,
          completado: newCompletedState,
          fecha_completado: newCompletedState ? new Date().toISOString() : null,
        },
        { onConflict: "user_id,lesson_id" }
      );

      if (upsertErr) {
        console.error("Error al guardar el progreso en Supabase:", upsertErr);
        throw upsertErr;
      }
    } catch (err) {
      console.error("Rollback del progreso por error de permisos o red:", err);
      // Rollback on error
      setCompletedLessonIds((prev) => {
        const next = new Set(prev);
        if (isCurrentlyCompleted) {
          next.add(lessonId);
        } else {
          next.delete(lessonId);
        }
        return next;
      });
    }
  };

  // Toggle Save for later (user_saved)
  const handleToggleSaved = async () => {
    if (!user) return;

    const nextSaved = !isSaved;
    setIsSaved(nextSaved);

    try {
      if (nextSaved) {
        // Insert into user_saved
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from("user_saved" as any) as any).insert({
          user_id: user.id,
          lesson_id: lessonId,
          course_id: courseId,
        });
      } else {
        // Delete from user_saved
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from("user_saved" as any) as any)
          .delete()
          .eq("user_id", user.id)
          .eq("lesson_id", lessonId);
      }
    } catch (err) {
      console.error("Error al guardar lección:", err);
      setIsSaved(!nextSaved);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center text-slate-400">
        Cargando lección interactiva...
      </div>
    );
  }

  if (error || !currentLesson) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <Card className="p-8 border-red-900/40 bg-red-950/20">
          <h3 className="text-xl font-bold text-white mb-2">Lección no encontrada</h3>
          <p className="text-slate-400 text-xs mb-6">
            {error || "La lección que buscas no existe o ha sido despublicada."}
          </p>
          <Link href={`/cursos/${courseId}`}>
            <Button variant="primary" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" /> Volver al Programa del Curso
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Find index of current lesson for Prev / Next navigation
  const currentIndex = lessonsList.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? lessonsList[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessonsList.length - 1 ? lessonsList[currentIndex + 1] : null;
  const isLessonCompleted = completedLessonIds.has(lessonId);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Top Mobile Bar with Sidebar Toggle */}
      <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-16 z-30">
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="flex items-center gap-2 text-xs font-semibold text-slate-200 hover:text-indigo-400"
        >
          <Menu className="w-4 h-4 text-indigo-400" /> Ver Programa ({lessonsList.length})
        </button>

        <button
          onClick={() => setTutorChatOpen(true)}
          className="flex items-center gap-1.5 text-xs font-bold text-purple-300 bg-purple-600/20 px-3 py-1.5 rounded-full border border-purple-500/30"
        >
          <Bot className="w-4 h-4" /> Tutor IA
        </button>
      </div>

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar */}
        <LessonSidebar
          courseId={courseId}
          courseTitle={courseTitle}
          currentLessonId={lessonId}
          lessons={lessonsList}
          completedLessonIds={completedLessonIds}
          isOpenMobile={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-4xl space-y-8">
          {/* Top Action Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
                Lección {currentIndex + 1} de {lessonsList.length}
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {currentLesson.titulo}
              </h1>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {user && (
                <>
                  {/* Bookmark Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleToggleSaved}
                    className={`gap-2 text-xs ${
                      isSaved
                        ? "text-amber-400 border-amber-500/40 bg-amber-500/10"
                        : "text-slate-400 border-slate-800 hover:text-white"
                    }`}
                  >
                    {isSaved ? (
                      <>
                        <BookmarkCheck className="w-4 h-4 text-amber-400" /> Guardado
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-4 h-4" /> Guardar para después
                      </>
                    )}
                  </Button>

                  {/* Complete Lesson Button (Optimistic) */}
                  <Button
                    variant={isLessonCompleted ? "secondary" : "primary"}
                    size="sm"
                    onClick={handleToggleCompleted}
                    className={`gap-2 text-xs font-bold transition-all duration-300 ${
                      isLessonCompleted
                        ? "bg-emerald-950/60 text-emerald-300 border border-emerald-500/40"
                        : "shadow-lg shadow-indigo-600/30"
                    }`}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 ${
                        isLessonCompleted ? "text-emerald-400" : "text-slate-300"
                      }`}
                    />
                    {isLessonCompleted ? "Completada ✓" : "Marcar como completada"}
                  </Button>
                </>
              )}

              {/* Toggle AI Tutor Drawer Button (Desktop) */}
              <button
                onClick={() => setTutorChatOpen(!tutorChatOpen)}
                className="hidden lg:flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30 transition-colors shadow-md"
              >
                <Bot className="w-4 h-4 text-purple-400" /> Tutor IA
              </button>
            </div>
          </div>

          {/* Main Lesson Content or Quiz */}
          {currentLesson.tipo === "quiz" ? (
            <QuizEngine
              questions={quizQuestions}
              isCompleted={isLessonCompleted}
              onCompleteQuiz={handleToggleCompleted}
              onAskTutor={() => {
                setTutorChatOpen(true);
              }}
            />
          ) : (
            <Card className="bg-slate-900/80 border-slate-800 p-6 sm:p-8">
              <MarkdownViewer content={currentLesson.contenido_markdown} />
            </Card>
          )}

          {/* Personal Student Notes Area */}
          {user && (
            <PersonalNotes userId={user.id} lessonId={lessonId} />
          )}

          {/* Previous / Next Lesson Navigation */}
          <div className="pt-6 border-t border-slate-800 flex items-center justify-between gap-4">
            {prevLesson ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/cursos/${courseId}/leccion/${prevLesson.id}`)}
                className="gap-2 text-xs border-slate-800 text-slate-300 hover:text-white"
              >
                <ChevronLeft className="w-4 h-4" /> Lección Anterior
              </Button>
            ) : (
              <div />
            )}

            {nextLesson ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push(`/cursos/${courseId}/leccion/${nextLesson.id}`)}
                className="gap-2 text-xs font-semibold shadow-md shadow-indigo-600/20"
              >
                Siguiente Lección <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Link href={`/cursos/${courseId}`}>
                <Button variant="outline" size="sm" className="gap-2 text-xs border-indigo-500/40 text-indigo-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Finalizar Curso
                </Button>
              </Link>
            )}
          </div>
        </main>
      </div>

      {/* Floating AI Tutor Toggle Button for Mobile / Desktop */}
      {!tutorChatOpen && (
        <button
          onClick={() => setTutorChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xl hover:scale-110 transition-transform duration-300 flex items-center gap-2 border border-purple-400/40"
          title="Consultar al Tutor IA Gemini"
        >
          <Bot className="w-6 h-6 animate-pulse" />
          <span className="hidden sm:inline text-xs font-bold pr-1">Preguntar al Tutor</span>
        </button>
      )}

      {/* Slide-Over AI Tutor Chat Drawer */}
      <LessonTutorChat
        userId={user?.id || null}
        lessonId={lessonId}
        lessonTitle={currentLesson.titulo}
        courseTitle={courseTitle}
        lessonContent={currentLesson.contenido_markdown}
        isOpen={tutorChatOpen}
        onClose={() => setTutorChatOpen(false)}
      />
    </div>
  );
};
