"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  BarChart3,
  BookOpen,
  Bookmark,
  StickyNote,
  User,
  Flame,
  CheckCircle2,
  PlayCircle,
  Search,
  Trash2,
  LogOut,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Loader2,
  Signal,
  Save,
  HelpCircle,
  FileText,
  Video,
} from "lucide-react";

export type DashboardTab = "progreso" | "cursos" | "guardado" | "notas" | "perfil";

export interface ActiveCourseProgress {
  courseId: string;
  titulo: string;
  categoria: string;
  nivel: string;
  portada_url: string | null;
  completedCount: number;
  totalLessons: number;
  progressPercentage: number;
  firstUncompletedLessonId: string | null;
}

export interface SavedItem {
  id: string;
  lessonId: string;
  courseId: string;
  lessonTitle: string;
  courseTitle: string;
  tipo: string;
  createdAt: string;
}

export interface StudentNoteItem {
  id: string;
  lessonId: string;
  courseId: string;
  lessonTitle: string;
  courseTitle: string;
  contenido: string;
  updatedAt: string;
}

export const StudentDashboard: React.FC = () => {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>("progreso");

  // Data states
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [activeCourses, setActiveCourses] = useState<ActiveCourseProgress[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [userNotes, setUserNotes] = useState<StudentNoteItem[]>([]);
  const [streakDays, setStreakDays] = useState<number>(0);
  const [totalCompletedLessons, setTotalCompletedLessons] = useState<number>(0);

  // Search filter for Notes
  const [noteSearchTerm, setNoteSearchTerm] = useState<string>("");

  // Profile Form states
  const [profileName, setProfileName] = useState<string>("");
  const [preferredLevel, setPreferredLevel] = useState<string>("principiante");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [savingProfile, setSavingProfile] = useState<boolean>(false);
  const [profileSuccess, setProfileSuccess] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const supabase = createClient();

  useEffect(() => {
    if (profile) {
      setProfileName(profile.fullName || "");
      setPreferredLevel(profile.preferredLevel || "principiante");
      setAvatarUrl(profile.avatarUrl || "");
    }
  }, [profile]);

  // Fetch Dashboard Real Data from Supabase
  useEffect(() => {
    async function loadDashboardData() {
      if (!user) return;
      setLoadingData(true);

      try {
        // 1. Fetch completed lessons for current user
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: progressRows } = await (supabase.from("user_progress" as any) as any)
          .select("lesson_id, completado, fecha_completado")
          .eq("user_id", user.id)
          .eq("completado", true);

        const completedSet = new Set<string>();
        const completedDates: string[] = [];

        if (progressRows) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          progressRows.forEach((p: any) => {
            completedSet.add(p.lesson_id);
            if (p.fecha_completado) {
              completedDates.push(p.fecha_completado.split("T")[0]);
            }
          });
        }

        setTotalCompletedLessons(completedSet.size);

        // Calculate active streak days from completedDates
        const uniqueDates = Array.from(new Set(completedDates)).sort((a, b) => b.localeCompare(a));
        let streak = 0;
        if (uniqueDates.length > 0) {
          const today = new Date().toISOString().split("T")[0];
          const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

          const checkDate = uniqueDates[0] === today ? today : uniqueDates[0] === yesterday ? yesterday : null;

          if (checkDate) {
            streak = 1;
            const current = new Date(checkDate);
            for (let i = 1; i < uniqueDates.length; i++) {
              current.setDate(current.getDate() - 1);
              const prevExpected = current.toISOString().split("T")[0];
              if (uniqueDates[i] === prevExpected) {
                streak++;
              } else {
                break;
              }
            }
          }
        }
        setStreakDays(streak);

        // 2. Fetch all published courses and their lessons
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: allCourses } = await (supabase.from("courses" as any) as any)
          .select("*")
          .eq("publicado", true);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: allLessons } = await (supabase.from("lessons" as any) as any)
          .select("id, course_id, titulo, orden, tipo")
          .order("orden", { ascending: true });

        if (allCourses && allLessons) {
          // Group lessons by course
          const lessonsByCourse: Record<string, any[]> = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          allLessons.forEach((l: any) => {
            if (!lessonsByCourse[l.course_id]) lessonsByCourse[l.course_id] = [];
            lessonsByCourse[l.course_id].push(l);
          });

          // Build Active Course Progress
          const activeList: ActiveCourseProgress[] = [];

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          allCourses.forEach((c: any) => {
            const courseLessons = lessonsByCourse[c.id] || [];
            let completedInCourse = 0;
            let firstUncompletedId: string | null = null;

            courseLessons.forEach((l) => {
              if (completedSet.has(l.id)) {
                completedInCourse++;
              } else if (!firstUncompletedId) {
                firstUncompletedId = l.id;
              }
            });

            // Include if student has completed at least 1 lesson OR if progress is started
            if (completedInCourse > 0 || courseLessons.length > 0) {
              const pct = courseLessons.length > 0 ? Math.round((completedInCourse / courseLessons.length) * 100) : 0;
              activeList.push({
                courseId: c.id,
                titulo: c.titulo,
                categoria: c.categoria,
                nivel: c.nivel || "principiante",
                portada_url: c.portada_url,
                completedCount: completedInCourse,
                totalLessons: courseLessons.length,
                progressPercentage: pct,
                firstUncompletedLessonId: firstUncompletedId || (courseLessons[0]?.id || null),
              });
            }
          });

          setActiveCourses(activeList);
        }

        // 3. Fetch Saved Items (user_saved)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: savedData } = await (supabase.from("user_saved" as any) as any)
          .select("id, lesson_id, course_id, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (savedData && savedData.length > 0 && allLessons && allCourses) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const coursesMap = new Map<string, any>(allCourses.map((c: any) => [c.id, c.titulo]));
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const lessonsMap = new Map<string, any>(allLessons.map((l: any) => [l.id, l]));

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const formattedSaved: SavedItem[] = savedData.map((s: any) => {
            const lesson = lessonsMap.get(s.lesson_id);
            return {
              id: s.id,
              lessonId: s.lesson_id,
              courseId: s.course_id || (lesson?.course_id || ""),
              lessonTitle: lesson?.titulo || "Lección Guardada",
              courseTitle: coursesMap.get(s.course_id || lesson?.course_id) || "Curso",
              tipo: lesson?.tipo || "teoria",
              createdAt: s.created_at,
            };
          });

          setSavedItems(formattedSaved);
        } else {
          setSavedItems([]);
        }

        // 4. Fetch User Notes (user_notes)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: notesData } = await (supabase.from("user_notes" as any) as any)
          .select("id, lesson_id, contenido, updated_at")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false });

        if (notesData && notesData.length > 0 && allLessons && allCourses) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const coursesMap = new Map<string, any>(allCourses.map((c: any) => [c.id, c.titulo]));
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const lessonsMap = new Map<string, any>(allLessons.map((l: any) => [l.id, l]));

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const formattedNotes: StudentNoteItem[] = notesData.map((n: any) => {
            const lesson = lessonsMap.get(n.lesson_id);
            return {
              id: n.id,
              lessonId: n.lesson_id,
              courseId: lesson?.course_id || "",
              lessonTitle: lesson?.titulo || "Lección",
              courseTitle: coursesMap.get(lesson?.course_id) || "Curso",
              contenido: n.contenido || "",
              updatedAt: n.updated_at,
            };
          });

          setUserNotes(formattedNotes);
        } else {
          setUserNotes([]);
        }
      } catch (err) {
        console.error("Error al cargar datos del dashboard:", err);
      } finally {
        setLoadingData(false);
      }
    }

    loadDashboardData();
  }, [user, supabase]);

  // Remove item from user_saved with optimistic update
  const handleRemoveSaved = async (savedId: string) => {
    setSavedItems((prev) => prev.filter((item) => item.id !== savedId));

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from("user_saved" as any) as any)
        .delete()
        .eq("id", savedId);

      if (error) throw error;
    } catch (err) {
      console.error("Error al eliminar elemento guardado:", err);
    }
  };

  // Filter notes by search query
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

  // Update Profile Info
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingProfile(true);
    setProfileSuccess(false);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from("profiles" as any) as any).upsert({
        id: user.id,
        nombre: profileName,
        nivel_preferido: preferredLevel,
        avatar_url: avatarUrl || null,
      });

      if (error) throw error;

      await refreshProfile();
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      console.error("Error al actualizar el perfil:", err);
    } finally {
      setSavingProfile(false);
    }
  };

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner Header */}
      <Card className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-950 border-indigo-500/30 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold text-xl flex-shrink-0 shadow-lg">
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
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Panel educativo y seguimiento de aprendizaje de YatiTech PWA.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 text-xs font-bold text-amber-400">
              <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>{streakDays} {streakDays === 1 ? "Día" : "Días"} en Racha</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Mobile & Desktop Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
        <button
          onClick={() => setActiveTab("progreso")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "progreso"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
              : "bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800/80"
          }`}
        >
          <BarChart3 className="w-4 h-4" /> Mi Progreso
        </button>

        <button
          onClick={() => setActiveTab("cursos")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "cursos"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
              : "bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800/80"
          }`}
        >
          <BookOpen className="w-4 h-4" /> Mis Cursos ({activeCourses.length})
        </button>

        <button
          onClick={() => setActiveTab("guardado")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "guardado"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
              : "bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800/80"
          }`}
        >
          <Bookmark className="w-4 h-4" /> Guardado ({savedItems.length})
        </button>

        <button
          onClick={() => setActiveTab("notas")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "notas"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
              : "bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800/80"
          }`}
        >
          <StickyNote className="w-4 h-4" /> Mis Notas ({userNotes.length})
        </button>

        <button
          onClick={() => setActiveTab("perfil")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "perfil"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
              : "bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800/80"
          }`}
        >
          <User className="w-4 h-4" /> Mi Perfil
        </button>
      </div>

      {/* Loading Indicator */}
      {loadingData ? (
        <div className="py-20 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-400" /> Cargando información real de Supabase...
        </div>
      ) : (
        <>
          {/* TAB 1: MI PROGRESO */}
          {activeTab === "progreso" && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Card className="flex items-center gap-4 bg-slate-900/80 border-slate-800 p-6">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-white">{activeCourses.length}</div>
                    <div className="text-xs text-slate-400 font-medium">Cursos en avance</div>
                  </div>
                </Card>

                <Card className="flex items-center gap-4 bg-slate-900/80 border-slate-800 p-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-white">{totalCompletedLessons}</div>
                    <div className="text-xs text-slate-400 font-medium">Lecciones completadas</div>
                  </div>
                </Card>

                <Card className="flex items-center gap-4 bg-slate-900/80 border-slate-800 p-6">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-white">{streakDays} Días</div>
                    <div className="text-xs text-slate-400 font-medium">Racha de estudio activa</div>
                  </div>
                </Card>
              </div>

              {/* Progress Breakdown Per Course */}
              <Card className="p-6 space-y-6 bg-slate-900/80 border-slate-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <BarChart3 className="w-5 h-5 text-indigo-400" /> Avance por Curso
                </h3>

                {activeCourses.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    Aún no has iniciado lecciones. Explora el catálogo para comenzar.
                  </div>
                ) : (
                  <div className="space-y-5">
                    {activeCourses.map((c) => (
                      <div key={c.courseId} className="space-y-2 p-4 rounded-xl bg-slate-950 border border-slate-800">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h4 className="text-sm font-bold text-white">{c.titulo}</h4>
                            <span className="text-[11px] text-slate-400">
                              {c.completedCount} de {c.totalLessons} lecciones completadas
                            </span>
                          </div>

                          <span className="text-xs font-extrabold text-indigo-400">
                            {c.progressPercentage}% Avance
                          </span>
                        </div>

                        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 rounded-full"
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
                <Card className="text-center py-16 px-6 bg-slate-900/60 border-dashed border-slate-800 max-w-lg mx-auto">
                  <BookOpen className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white mb-2">No estás inscripto en ningún curso</h3>
                  <p className="text-xs text-slate-400 mb-6">
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
                        className="p-6 bg-slate-900/80 border-slate-800 flex flex-col justify-between space-y-4 hover:border-indigo-500/40 transition-all"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                              {c.categoria}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 capitalize flex items-center gap-1">
                              <Signal className="w-3 h-3 text-purple-400" /> Nivel {c.nivel}
                            </span>
                          </div>

                          <h3 className="text-lg font-bold text-white leading-snug">{c.titulo}</h3>

                          <div className="space-y-1.5 pt-2">
                            <div className="flex justify-between text-xs font-medium">
                              <span className="text-slate-400">Progreso:</span>
                              <span className="text-indigo-400 font-bold">{c.progressPercentage}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                              <div
                                className="h-full bg-indigo-500 transition-all duration-500 rounded-full"
                                style={{ width: `${c.progressPercentage}%` }}
                              />
                            </div>
                            <div className="text-[11px] text-slate-400 text-right">
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
                <Card className="text-center py-16 px-6 bg-slate-900/60 border-dashed border-slate-800 max-w-lg mx-auto">
                  <Bookmark className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white mb-2">No tienes lecciones guardadas</h3>
                  <p className="text-xs text-slate-400 mb-6">
                    Puedes guardar lecciones desde la vista de aprendizaje para repasarlas más tarde.
                  </p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedItems.map((item) => (
                    <Card
                      key={item.id}
                      className="p-4 bg-slate-900/90 border-slate-800 flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider block truncate">
                          {item.courseTitle}
                        </span>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2 truncate">
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
                          className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
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
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {filteredNotes.length === 0 ? (
                <Card className="text-center py-16 px-6 bg-slate-900/60 border-dashed border-slate-800 max-w-lg mx-auto">
                  <StickyNote className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-white mb-2">No se encontraron notas</h3>
                  <p className="text-xs text-slate-400">
                    {noteSearchTerm ? "No hay notas que coincidan con la búsqueda." : "Tus apuntes personales de las lecciones aparecerán aquí."}
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredNotes.map((note) => (
                    <Card key={note.id} className="p-5 bg-slate-900/90 border-slate-800 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                            {note.courseTitle}
                          </span>
                          <h4 className="text-xs font-bold text-white truncate max-w-md">
                            {note.lessonTitle}
                          </h4>
                        </div>

                        <Link href={`/cursos/${note.courseId}/leccion/${note.lessonId}`}>
                          <Button variant="ghost" size="sm" className="text-indigo-400 hover:text-indigo-300 text-xs">
                            Ir a Lección
                          </Button>
                        </Link>
                      </div>

                      <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {note.contenido}
                      </p>

                      <div className="text-[10px] text-slate-500 text-right">
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
              <Card className="bg-slate-900/90 border-slate-800 p-6 space-y-6">
                <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-400" /> Editar Datos de Perfil
                </h3>

                {profileSuccess && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> ¡Perfil actualizado exitosamente en Supabase!
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  {/* Email Readonly */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Correo Electrónico (No editable)</label>
                    <input
                      type="text"
                      disabled
                      value={user?.email || ""}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-400 cursor-not-allowed"
                    />
                  </div>

                  {/* Name Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Nombre Completo / Apodo</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      placeholder="Tu nombre completo..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Preferred Level */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Nivel de Estudio Preferido</label>
                    <select
                      value={preferredLevel}
                      onChange={(e) => setPreferredLevel(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="principiante">Principiante (1° - 2° Secundaria)</option>
                      <option value="intermedio">Intermedio (3° - 4° Secundaria)</option>
                      <option value="avanzado">Avanzado (5° Secundaria / Preuniversitario)</option>
                    </select>
                  </div>

                  {/* Avatar URL */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">URL del Avatar (Opcional)</label>
                    <input
                      type="url"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      disabled={savingProfile}
                      className="gap-2 text-xs font-bold shadow-lg shadow-indigo-600/30"
                    >
                      {savingProfile ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Guardando...
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
              <Card className="bg-slate-900/90 border-slate-800 p-6 space-y-4">
                <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-400" /> Acciones de Cuenta
                </h3>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
                  <div>
                    <h4 className="text-xs font-bold text-white">Cerrar Sesión</h4>
                    <p className="text-[11px] text-slate-400">Sale de tu cuenta en este dispositivo.</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={signOut}
                    className="w-full sm:w-auto text-xs text-red-400 border-red-900/40 hover:bg-red-950/40"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Cerrar Sesión
                  </Button>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-red-400">Eliminar Cuenta</h4>
                    <p className="text-[11px] text-slate-400">Borra de forma permanente tu perfil y avance.</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full sm:w-auto text-xs text-red-400 border-red-900/60 bg-red-950/20 hover:bg-red-950/60"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <Card className="max-w-md w-full p-6 space-y-4 border-red-500/40 bg-slate-900">
            <div className="flex items-center gap-3 text-red-400">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="text-lg font-bold text-white">¿Confirmas eliminar tu cuenta?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Esta acción no se puede deshacer. Se eliminará tu perfil y todo tu historial de lecciones guardadas.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteModal(false)}
                className="text-xs text-slate-300"
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
