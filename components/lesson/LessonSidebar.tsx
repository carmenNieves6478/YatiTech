"use client";

import React from "react";
import Link from "next/link";
import { LessonItem } from "@/components/courses/CourseDetailPreview";
import { CheckCircle2, ArrowLeft, BookOpen, PlayCircle, HelpCircle, FileText, Video, X } from "lucide-react";

interface Props {
  courseId: string;
  courseTitle: string;
  currentLessonId: string;
  lessons: LessonItem[];
  completedLessonIds: Set<string>;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const LessonSidebar: React.FC<Props> = ({
  courseId,
  courseTitle,
  currentLessonId,
  lessons,
  completedLessonIds,
  isOpenMobile,
  onCloseMobile,
}) => {
  const total = lessons.length;
  const completedCount = completedLessonIds.size;
  const progressPercentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  const getLessonTypeIcon = (tipo: string) => {
    switch (tipo) {
      case "practica":
        return <PlayCircle className="w-3.5 h-3.5 text-emerald-600" />;
      case "quiz":
        return <HelpCircle className="w-3.5 h-3.5 text-amber-600" />;
      case "video":
        return <Video className="w-3.5 h-3.5 text-cyan-600" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-teal-600" />;
    }
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-white border-r border-slate-200">
      {/* Header Info & Course Progress */}
      <div className="p-5 border-b border-slate-200 space-y-4">
        <Link
          href={`/cursos/${courseId}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Volver al Curso
        </Link>

        <div>
          <h2 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
            {courseTitle}
          </h2>
          <span className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-teal-600" /> {total} Lecciones
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-[11px] font-semibold">
            <span className="text-slate-500">Progreso:</span>
            <span className="text-teal-700 font-bold">{progressPercentage}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-teal-600 to-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Lessons List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5">
          Contenido del Curso
        </div>

        {lessons.map((lesson, idx) => {
          const isCurrent = lesson.id === currentLessonId;
          const isCompleted = completedLessonIds.has(lesson.id);

          return (
            <Link
              key={lesson.id}
              href={`/cursos/${courseId}/leccion/${lesson.id}`}
              onClick={onCloseMobile}
              className={`flex items-center justify-between p-3 rounded-xl text-xs transition-all duration-200 group ${
                isCurrent
                  ? "bg-teal-50 text-teal-900 border border-teal-300 font-bold shadow-xs"
                  : isCompleted
                  ? "text-slate-800 hover:bg-slate-50"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <span className="flex-shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                        isCurrent
                          ? "border-teal-600 text-teal-700 font-bold"
                          : "border-slate-300 text-slate-400"
                      }`}
                    >
                      {idx + 1}
                    </span>
                  )}
                </span>

                <span className="truncate leading-snug">{lesson.titulo}</span>
              </div>

              <span className="flex-shrink-0 opacity-70 group-hover:opacity-100">
                {getLessonTypeIcon(lesson.tipo)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden lg:block w-72 flex-shrink-0 h-[calc(100vh-4rem)] sticky top-16">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Overlay) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative w-80 max-w-full bg-white h-full z-10 shadow-2xl">
            <button
              onClick={onCloseMobile}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
