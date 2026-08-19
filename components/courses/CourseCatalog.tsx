"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Search, BookOpen, Signal, Sparkles, Filter, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export interface CourseWithStats {
  id: string;
  titulo: string;
  descripcion: string | null;
  categoria: string;
  nivel: "principiante" | "intermedio" | "avanzado";
  portada_url: string | null;
  publicado: boolean;
  lesson_count: number;
}

export const CourseCatalog: React.FC = () => {
  const [courses, setCourses] = useState<CourseWithStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [selectedLevel, setSelectedLevel] = useState<string>("todos");

  const supabase = createClient();

  // Debounce search term by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch real courses from Supabase with resilient fallback
  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: rawCourses, error: coursesError } = await (supabase.from("courses" as any) as any)
          .select("*")
          .order("created_at", { ascending: false });

        if (coursesError) {
          console.error("Error directo de Supabase al consultar la tabla courses:", coursesError);
          throw coursesError;
        }

        if (rawCourses && rawCourses.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: rawLessons } = await (supabase.from("lessons" as any) as any)
            .select("id, course_id");

          const countsMap: Record<string, number> = {};
          if (rawLessons) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            rawLessons.forEach((l: any) => {
              countsMap[l.course_id] = (countsMap[l.course_id] || 0) + 1;
            });
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const formatted: CourseWithStats[] = rawCourses.map((c: any) => ({
            id: c.id,
            titulo: c.titulo,
            descripcion: c.descripcion,
            categoria: c.categoria,
            nivel: c.nivel || "principiante",
            portada_url: c.portada_url,
            publicado: c.publicado,
            lesson_count: countsMap[c.id] || 0,
          }));

          setCourses(formatted);
        } else {
          setCourses([]);
        }
      } catch (err) {
        console.error("Error al cargar cursos desde Supabase:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, [supabase]);

  // Derive unique categories from fetched courses
  const categories = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => {
      if (c.categoria) set.add(c.categoria);
    });
    return Array.from(set);
  }, [courses]);

  // Filter courses by search, category, and level
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        debouncedSearch === "" ||
        course.titulo.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (course.descripcion &&
          course.descripcion.toLowerCase().includes(debouncedSearch.toLowerCase()));

      const matchesCategory =
        selectedCategory === "todos" ||
        course.categoria.toLowerCase() === selectedCategory.toLowerCase();

      const matchesLevel =
        selectedLevel === "todos" ||
        course.nivel.toLowerCase() === selectedLevel.toLowerCase();

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [courses, debouncedSearch, selectedCategory, selectedLevel]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("todos");
    setSelectedLevel("todos");
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "principiante":
        return "text-emerald-700 border-emerald-300 bg-emerald-50";
      case "intermedio":
        return "text-teal-700 border-teal-300 bg-teal-50";
      case "avanzado":
        return "text-cyan-700 border-cyan-300 bg-cyan-50";
      default:
        return "text-slate-600 border-slate-300 bg-slate-100";
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Bar & Filters Section */}
      <Card className="bg-white border-slate-200 p-6 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Text Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar curso por título o descripción..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Level Filter Dropdown */}
          <div className="w-full md:w-48">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-teal-600"
            >
              <option value="todos">Todos los niveles</option>
              <option value="principiante">Principiante</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200">
          <span className="text-xs font-semibold text-slate-600 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Categorías:
          </span>
          <button
            onClick={() => setSelectedCategory("todos")}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
              selectedCategory === "todos"
                ? "bg-teal-600 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            Todas
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}

          {(searchTerm || selectedCategory !== "todos" || selectedLevel !== "todos") && (
            <button
              onClick={clearFilters}
              className="ml-auto text-xs text-teal-700 hover:text-teal-800 font-medium underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </Card>

      {/* Courses Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <Card key={n} className="h-64 animate-pulse bg-slate-100 border-slate-200" />
          ))}
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="flex flex-col justify-between hover:border-teal-400 transition-all duration-300 group p-4 sm:p-5 overflow-hidden bg-white shadow-sm hover:shadow-md"
            >
              <div className="space-y-3">
                {/* Course Cover Image if available */}
                {course.portada_url ? (
                  <div className="relative w-full h-44 sm:h-48 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs">
                    <Image
                      src={course.portada_url}
                      alt={course.titulo}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 right-2.5">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-md shadow-xs ${getLevelBadgeColor(course.nivel)}`}>
                        {course.nivel.toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/90 text-teal-800 border border-teal-200 backdrop-blur-md shadow-xs">
                        {course.categoria}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full border border-teal-200 bg-teal-50 text-teal-800">
                      {course.categoria}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getLevelBadgeColor(course.nivel)}`}>
                      {course.nivel.toUpperCase()}
                    </span>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug line-clamp-2">
                    {course.titulo}
                  </h3>
                  <p className="text-slate-600 text-xs mt-2 line-clamp-3 leading-relaxed">
                    {course.descripcion || "Sin descripción disponible para este curso."}
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-6 border-t border-slate-200 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                  <span className="flex items-center gap-1.5 font-medium">
                    <BookOpen className="w-4 h-4 text-teal-600" />
                    <strong className="text-slate-900 font-bold">{course.lesson_count}</strong> {course.lesson_count === 1 ? "Lección" : "Lecciones"}
                  </span>
                  <span className="flex items-center gap-1.5 capitalize font-medium text-slate-700">
                    <Signal className="w-3.5 h-3.5 text-emerald-600" /> {course.nivel}
                  </span>
                </div>

                <Link href={`/cursos/${course.id}`} className="block pt-1">
                  <Button variant="primary" size="sm" className="w-full justify-center gap-2 py-2.5 shadow-sm font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Ver Programa de Curso
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Elegant Empty State */
        <Card className="text-center py-16 px-6 bg-white border-dashed border-slate-300 max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 mx-auto mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No se encontraron cursos</h3>
          <p className="text-slate-600 text-xs leading-relaxed max-w-sm mx-auto mb-6">
            No hay cursos registrados o no coinciden con la búsqueda &quot;{searchTerm}&quot; o con los filtros seleccionados.
          </p>
          <Button variant="outline" size="sm" onClick={clearFilters} className="mx-auto">
            Restablecer Filtros
          </Button>
        </Card>
      )}
    </div>
  );
};
