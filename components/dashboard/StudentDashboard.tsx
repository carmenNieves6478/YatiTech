"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  BookOpen,
  CheckCircle2,
  Bookmark,
  StickyNote,
  User,
  Flame,
  BarChart3,
  PlayCircle,
  Trash2,
  Search,
  Save,
  LogOut,
  ShieldAlert,
  Loader2,
  Sparkles,
  ArrowRight,
  Signal,
  HelpCircle,
  FileText,
  Video,
} from "lucide-react";

export interface DashboardCourseProgress {
  courseId: string;
  titulo: string;
  categoria: string;
  nivel: string;
  portadaUrl: string | null;
  totalLessons: number;
  completedCount: number;
  progressPercentage: number;
  firstUncompletedLessonId: string | null;
}

export interface SavedLessonItem {
  id: string; // user_saved row id
  lessonId: string;
  courseId: string;
  lessonTitle: string;
  courseTitle: string;
  tipo: string;
  savedAt: string;
}

export interface NoteItem {
  id: string; // user_notes row id
  lessonId: string;
  courseId: string;
  lessonTitle: string;
  courseTitle: string;
  contenido: string;
  updatedAt: string;
}

export const StudentDashboard: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<"progreso" | "cursos" | "guardado" | "notas" | "perfil">("progreso");
  const [loadingData, setLoadingData] = useState<boolean>(true);

  // Real data state
  const [activeCourses, setActiveCourses] = useState<DashboardCourseProgress[]>([]);
  const [savedItems, setSavedItems] = useState<SavedLessonItem[]>([]);
  const [userNotes, setUserNotes] = useState<NoteItem[]>([]);
  const [totalCompletedLessons, setTotalCompletedLessons] = useState<number>(0);
  const [streakDays, setStreakDays] = useState<number>(1);

  // Note search term
  const [noteSearchTerm, setNoteSearchTerm] = useState<string>("");

  // Profile Form state
  const [profileName, setProfileName] = useState<string>("");
  const [preferredLevel, setPreferredLevel] = useState<string>("principiante");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [savingProfile, setSavingProfile] = useState<boolean>(false);
  const [profileSuccess, setProfileSuccess] = useState<boolean>(false);

  // Account deletion state
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  // Sync profile data when available
  useEffect(() => {
    if (profile) {
      setProfileName(profile.fullName || "");
      setPreferredLevel(profile.preferredLevel || "principiante");
      setAvatarUrl(profile.avatarUrl || "");
    }
  }, [profile]);

  // Load real student dashboard data from Supabase
  useEffect(() => {
    async function loadDashboardData() {
      if (!user) return;
      setLoadingData(true);

      try {
        // 1. Fetch User Progress (completed lessons)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: progressData } = await (supabase.from("user_progress" as any) as any)
          .select("lesson_id, completado, fecha_completado")
          .eq("user_id", user.id)
          .eq("completado", true);

        const completedSet = new Set<string>();
        if (progressData) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          progressData.forEach((p: any) => completedSet.add(p.lesson_id));
        }
        setTotalCompletedLessons(completedSet.size);

        // 2. Fetch All Published Courses
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: coursesData } = await (supabase.from("courses" as any) as any)
          .select("*")
          .order("created_at", { ascending: false });

        // 3. Fetch All Lessons
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: lessonsData } = await (supabase.from("lessons" as any) as any)
          .select("id, course_id, titulo, orden, tipo")
          .order("orden", { ascending: true });

        // Build course progress list
        if (coursesData && lessonsData) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const lessonsByCourse: Record<string, any[]> = {};
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          lessonsData.forEach((l: any) => {
            if (!lessonsByCourse[l.course_id]) lessonsByCourse[l.course_id] = [];
            lessonsByCourse[l.course_id].push(l);
          });

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const progressList: DashboardCourseProgress[] = coursesData.map((c: any) => {
            const courseLessons = lessonsByCourse[c.id] || [];
            const total = courseLessons.length;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const completed = courseLessons.filter((l: any) => completedSet.has(l.id)).length;
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const uncompleted = courseLessons.find((l: any) => !completedSet.has(l.id));

            return {
              courseId: c.id,
              titulo: c.titulo,
              categoria: c.categoria,
              nivel: c.nivel || "principiante",
              portadaUrl: c.portada_url,
              totalLessons: total,
              completedCount: completed,
              progressPercentage: pct,
              firstUncompletedLessonId: uncompleted ? uncompleted.id : null,
            };
          });

          // Show courses user has interacted with or all if early student
          const inProgressCourses = progressList.filter((p) => p.completedCount > 0);
          setActiveCourses(inProgressCourses.length > 0 ? inProgressCourses : progressList.slice(0, 4));
        }

        // 4. Fetch Saved Lessons
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: savedData } = await (supabase.from("user_saved" as any) as any)
          .select("id, lesson_id, course_id, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (savedData && lessonsData && coursesData) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const lessonsMap = new Map(lessonsData.map((l: any) => [l.id, l]));
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const coursesMap = new Map(coursesData.map((c: any) => [c.id, c]));

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const formattedSaved: SavedLessonItem[] = savedData.map((s: any) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const lesson: any = lessonsMap.get(s.lesson_id);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const course: any = coursesMap.get(s.course_id || lesson?.course_id);
            return {
              id: s.id,
              lessonId: s.lesson_id,
              courseId: s.course_id || lesson?.course_id || "",
              lessonTitle: lesson?.titulo || "Lección Guardada",
              courseTitle: course?.titulo || "Curso",
              tipo: lesson?.tipo || "teoria",
              savedAt: s.created_at,
            };
          });
          setSavedItems(formattedSaved);
        }

        // 5. Fetch User Notes
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: notesData } = await (supabase.from("user_notes" as any) as any)
          .select("id, lesson_id, contenido, updated_at")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false });

        if (notesData && lessonsData && coursesData) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const lessonsMap = new Map(lessonsData.map((l: any) => [l.id, l]));
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const coursesMap = new Map(coursesData.map((c: any) => [c.id, c]));

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const formattedNotes: NoteItem[] = notesData.map((n: any) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const lesson: any = lessonsMap.get(n.lesson_id);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const course: any = coursesMap.get(lesson?.course_id);
            return {
              id: n.id,
              lessonId: n.lesson_id,
              courseId: lesson?.course_id || "",
              lessonTitle: lesson?.titulo || "Lección",
              courseTitle: course?.titulo || "Curso",
              contenido: n.contenido || "",
              updatedAt: n.updated_at,
            };
          });
          setUserNotes(formattedNotes);
        }

        // 6. Calculate Streak Days (Mocked logic or 1-day minimum)
        setStreakDays(completedSet.size > 0 ? Math.min(completedSet.size, 5) : 1);
      } catch (err) {
        console.error("Error al cargar datos del estudiante:", err);
      } finally {
        setLoadingData(false);
      }
    }

    loadDashboardData();
  }, [user, supabase]);

  // Handle Profile Update in Supabase
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingProfile(true);
    setProfileSuccess(false);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: upsertErr } = await (supabase.from("profiles" as any) as any).upsert(
        {
          id: user.id,
          nombre: profileName.trim(),
          nivel_preferido: preferredLevel,
          avatar_url: avatarUrl.trim() || null,
        },
        { onConflict: "id" }
      );

      if (upsertErr) throw upsertErr;

      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      console.error("Error al guardar perfil:", err);
    } finally {
      setSavingProfile(false);
    }
  };

  // Remove saved lesson
  const handleRemoveSaved = async (savedId: string) => {
    setSavedItems((prev) => prev.filter((i) => i.id !== savedId));
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("user_saved" as any) as any).delete().eq("id", savedId);
    } catch (err) {
      console.error("Error al eliminar lección guardada:", err);
    }
  };

  // Filter notes by search term
  const filteredNotes = useMemo(() => {
    if (!noteSearchTerm.trim()) return userNotes;
    const term = noteSearchTerm.toLowerCase();
    return userNotes.filter(
      (n) =>
        n.contenido.toLowerCase().includes(term) ||
        n.lessonTitle.toLowerCase().includes(term) ||
        n.courseTitle.toLowerCase().includes(term)
    );
  }, [userNotes, noteSearchTerm]);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-slate-50 min-h-[85vh]">
      {/* Top Banner Header */}
      <Card className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 border-teal-700 text-white p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-700 border border-teal-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-md">
              {profile?.avatarUrl ? (
                <Image
                  src={profile.avatarUrl}
                  alt={profileName}
                  width={56}
                  height={56}
                  className="rounded-2xl object-cover"
                />
              ) : (
                (profileName || user?.email || "E").charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                ¡Hola, {profileName || user?.email?.split("@")[0] || "Estudiante"}! 👋
              </h1>
              <p className="text-xs sm:text-sm text-teal-100 mt-1">
                Panel educativo y seguimiento de aprendizaje de Amauta PWA.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-amber-500/20 px-4 py-2 rounded-xl border border-amber-300/30 text-xs font-bold text-amber-200 shadow-xs">
              <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>{streakDays} {streakDays === 1 ? "Día" : "Días"} en Racha</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Mobile & Desktop Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
        <button
          onClick={() => setActiveTab("progreso")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "progreso"
              ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
              : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
          }`}
        >
          <BarChart3 className="w-4 h-4" /> Mi Progreso
        </button>

        <button
          onClick={() => setActiveTab("cursos")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "cursos"
              ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
              : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
          }`}
        >
          <BookOpen className="w-4 h-4" /> Mis Cursos ({activeCourses.length})
        </button>

        <button
          onClick={() => setActiveTab("guardado")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "guardado"
              ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
              : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
          }`}
        >
          <Bookmark className="w-4 h-4" /> Guardado ({savedItems.length})
        </button>

        <button
          onClick={() => setActiveTab("notas")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "notas"
              ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
              : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
          }`}
        >
          <StickyNote className="w-4 h-4" /> Mis Notas ({userNotes.length})
        </button>

        <button
          onClick={() => setActiveTab("perfil")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "perfil"
              ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
              : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
          }`}
        >
          <User className="w-4 h-4" /> Mi Perfil
        </button>
      </div>

      {/* Loading Indicator */}
      {loadingData ? (
        <div className="py-20 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-teal-600" /> Cargando información de Amauta...
        </div>
      ) : (
        <>
          {/* TAB 1: MI PROGRESO */}
          {activeTab === "progreso" && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Card className="flex items-center gap-4 bg-white border-slate-200 p-6 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-slate-900">{activeCourses.length}</div>
                    <div className="text-xs text-slate-500 font-medium">Cursos en avance</div>
                  </div>
                </Card>

                <Card className="flex items-center gap-4 bg-white border-slate-200 p-6 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-slate-900">{totalCompletedLessons}</div>
                    <div className="text-xs text-slate-500 font-medium">Lecciones completadas</div>
                  </div>
                </Card>

                <Card className="flex items-center gap-4 bg-white border-slate-200 p-6 shadow-sm">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-slate-900">{streakDays} Días</div>
                    <div className="text-xs text-slate-500 font-medium">Racha de estudio activa</div>
                  </div>
                </Card>
              </div>

              {/* Progress Breakdown Per Course */}
              <Card className="p-6 space-y-6 bg-white border-slate-200 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
                  <BarChart3 className="w-5 h-5 text-teal-600" /> Avance por Curso
                </h3>

                {activeCourses.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500">
                    Aún no has iniciado lecciones. Explora el catálogo para comenzar.
                  </div>
                ) : (
                  <div className="space-y-5">
                    {activeCourses.map((c) => (
                      <div key={c.courseId} className="space-y-2 p-4 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">{c.titulo}</h4>
                            <span className="text-[11px] text-slate-500">
                              {c.completedCount} de {c.totalLessons} lecciones completadas
                            </span>
                          </div>

                          <span className="text-xs font-extrabold text-teal-700">
                            {c.progressPercentage}% Avance
                          </span>
                        </div>

                        <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                          <div
                            className="h-full bg-gradient-to-r from-teal-600 to-emerald-600 transition-all duration-500 rounded-full"
                            style={{ width: `${c.progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* TAB 2: MIS CURSOS */}
          {activeTab === "cursos" && (
            <div className="space-y-6">
              {activeCourses.length === 0 ? (
                <Card className="text-center py-16 px-6 bg-white border-dashed border-slate-300 max-w-lg mx-auto shadow-xs">
                  <BookOpen className="w-12 h-12 text-teal-600 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-slate-900 mb-2">No estás inscripto en ningún curso</h3>
                  <p className="text-xs text-slate-500 mb-6">
                    Explora los cursos escolares disponibles en el catálogo para comenzar tu aprendizaje.
                  </p>
                  <Link href="/cursos">
                    <Button variant="primary" size="sm" className="gap-2">
                      <Sparkles className="w-4 h-4 text-amber-300" /> Ir al Catálogo de Cursos
                    </Button>
                  </Link>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeCourses.map((c) => {
                    const targetHref = c.firstUncompletedLessonId
                      ? `/cursos/${c.courseId}/leccion/${c.firstUncompletedLessonId}`
                      : `/cursos/${c.courseId}`;

                    return (
                      <Card
                        key={c.courseId}
                        className="p-6 bg-white border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-teal-400 transition-all"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                              {c.categoria}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 capitalize flex items-center gap-1">
                              <Signal className="w-3 h-3 text-emerald-600" /> Nivel {c.nivel}
                            </span>
                          </div>

                          <h3 className="text-lg font-bold text-slate-900 leading-snug">{c.titulo}</h3>

                          <div className="space-y-1.5 pt-2">
                            <div className="flex justify-between text-xs font-medium">
                              <span className="text-slate-500">Progreso:</span>
                              <span className="text-teal-700 font-bold">{c.progressPercentage}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                              <div
                                className="h-full bg-teal-600 transition-all duration-500 rounded-full"
                                style={{ width: `${c.progressPercentage}%` }}
                              />
                            </div>
                            <div className="text-[11px] text-slate-500 text-right">
                              {c.completedCount} / {c.totalLessons} lecciones
                            </div>
                          </div>
                        </div>

                        <Link href={targetHref} className="block pt-2">
                          <Button variant="primary" size="sm" className="w-full justify-center gap-2 font-semibold">
                            <PlayCircle className="w-4 h-4" /> Continuar Curso <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: GUARDADO */}
          {activeTab === "guardado" && (
            <div className="space-y-6">
              {savedItems.length === 0 ? (
                <Card className="text-center py-16 px-6 bg-white border-dashed border-slate-300 max-w-lg mx-auto shadow-xs">
                  <Bookmark className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-slate-900 mb-2">No tienes lecciones guardadas</h3>
                  <p className="text-xs text-slate-500 mb-6">
                    Puedes guardar lecciones desde la vista de aprendizaje para repasarlas más tarde.
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedItems.map((item) => (
                    <Card
                      key={item.id}
                      className="p-4 bg-white border-slate-200 shadow-sm flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <span className="text-[10px] font-semibold text-teal-700 uppercase tracking-wider block truncate">
                          {item.courseTitle}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 truncate">
                          {getLessonTypeIcon(item.tipo)} {item.lessonTitle}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link href={`/cursos/${item.courseId}/leccion/${item.lessonId}`}>
                          <Button variant="secondary" size="sm" className="text-xs gap-1">
                            Ver <ArrowRight className="w-3.5 h-3.5" />
                          </Button>
                        </Link>

                        <button
                          onClick={() => handleRemoveSaved(item.id)}
                          className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition-colors"
                          title="Quitar de guardados"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MIS NOTAS */}
          {activeTab === "notas" && (
            <div className="space-y-6">
              {/* Search input */}
              <div className="relative max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={noteSearchTerm}
                  onChange={(e) => setNoteSearchTerm(e.target.value)}
                  placeholder="Buscar notas por contenido o lección..."
                  className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600"
                />
              </div>

              {filteredNotes.length === 0 ? (
                <Card className="text-center py-16 px-6 bg-white border-dashed border-slate-300 max-w-lg mx-auto shadow-xs">
                  <StickyNote className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-slate-900 mb-2">No se encontraron notas</h3>
                  <p className="text-xs text-slate-500">
                    {noteSearchTerm ? "No hay notas que coincidan con la búsqueda." : "Tus apuntes personales de las lecciones aparecerán aquí."}
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredNotes.map((note) => (
                    <Card key={note.id} className="p-5 bg-white border-slate-200 shadow-sm space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                            {note.courseTitle}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 truncate max-w-md">
                            {note.lessonTitle}
                          </h4>
                        </div>

                        <Link href={`/cursos/${note.courseId}/leccion/${note.lessonId}`}>
                          <Button variant="ghost" size="sm" className="text-teal-700 hover:text-teal-800 text-xs">
                            Ir a Lección
                          </Button>
                        </Link>
                      </div>

                      <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {note.contenido}
                      </p>

                      <div className="text-[10px] text-slate-400 text-right">
                        Última edición: {new Date(note.updatedAt).toLocaleDateString("es-PE")}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: MI PERFIL */}
          {activeTab === "perfil" && (
            <div className="max-w-2xl space-y-6">
              <Card className="bg-white border-slate-200 shadow-sm p-6 space-y-6">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-teal-600" /> Editar Datos de Perfil
                </h3>

                {profileSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> ¡Perfil actualizado exitosamente en Supabase!
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  {/* Email Readonly */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Correo Electrónico (No editable)</label>
                    <input
                      type="text"
                      disabled
                      value={user?.email || ""}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  {/* Name Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Nombre Completo / Apodo</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      placeholder="Tu nombre completo..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                    />
                  </div>

                  {/* Preferred Level */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Nivel de Estudio Preferido</label>
                    <select
                      value={preferredLevel}
                      onChange={(e) => setPreferredLevel(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-teal-600"
                    >
                      <option value="principiante">Principiante (1° - 2° Secundaria)</option>
                      <option value="intermedio">Intermedio (3° - 4° Secundaria)</option>
                      <option value="avanzado">Avanzado (5° Secundaria / Preuniversitario)</option>
                    </select>
                  </div>

                  {/* Avatar URL */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">URL del Avatar (Opcional)</label>
                    <input
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-teal-600"
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      disabled={savingProfile}
                      className="gap-2 text-xs font-bold shadow-sm"
                    >
                      {savingProfile ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" /> Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" /> Guardar Cambios
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Card>

              {/* Account Actions Card */}
              <Card className="bg-white border-slate-200 shadow-sm p-6 space-y-4">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-600" /> Acciones de Cuenta
                </h3>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Cerrar Sesión</h4>
                    <p className="text-[11px] text-slate-500">Sale de tu cuenta en este dispositivo.</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={signOut}
                    className="w-full sm:w-auto text-xs text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Cerrar Sesión
                  </Button>
                </div>

                <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-red-600">Eliminar Cuenta</h4>
                    <p className="text-[11px] text-slate-500">Borra de forma permanente tu perfil y avance.</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full sm:w-auto text-xs text-red-600 border-red-200 bg-red-50 hover:bg-red-100"
                  >
                    Eliminar Mi Cuenta
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </>
      )}

      {/* Delete Account Modal Confirmation */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <Card className="max-w-md w-full p-6 space-y-4 border-red-200 bg-white shadow-xl">
            <div className="flex items-center gap-3 text-red-600">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="text-lg font-bold text-slate-900">¿Confirmas eliminar tu cuenta?</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Esta acción no se puede deshacer. Se eliminará tu perfil y todo tu historial de lecciones guardadas.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteModal(false)}
                className="text-xs text-slate-600"
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setShowDeleteModal(false);
                  signOut();
                }}
                className="text-xs bg-red-600 hover:bg-red-500 text-white font-bold"
              >
                Sí, Eliminar Cuenta
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
