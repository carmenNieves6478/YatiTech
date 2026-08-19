-- ==============================================================================
-- MIGRACIÓN DE INICIALIZACIÓN DE BASE DE DATOS SUPABASE (AYME PLATAFORMA EDUCATIVA)
-- ==============================================================================

-- 1. TABLA DE PERFILES DE USUARIO (Extiende auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT,
  avatar_url TEXT,
  nivel_preferido TEXT DEFAULT 'principiante' CHECK (nivel_preferido IN ('principiante', 'intermedio', 'avanzado')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TABLA DE CURSOS
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descripcion TEXT,
  categoria TEXT NOT NULL,
  nivel TEXT DEFAULT 'principiante' CHECK (nivel IN ('principiante', 'intermedio', 'avanzado')),
  portada_url TEXT,
  publicado BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TABLA DE LECCIONES
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  contenido_markdown TEXT,
  orden INT NOT NULL DEFAULT 1,
  tipo TEXT DEFAULT 'teoria' CHECK (tipo IN ('teoria', 'practica', 'quiz', 'video')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABLA DE QUIZZES (EXÁMENES / EVALUACIONES)
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  preguntas JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABLA DE PROGRESO DE USUARIOS
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completado BOOLEAN DEFAULT false NOT NULL,
  fecha_completado TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_user_lesson_progress UNIQUE (user_id, lesson_id)
);

-- 6. TABLA DE NOTAS DE USUARIOS
CREATE TABLE IF NOT EXISTS public.user_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  contenido TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. TABLA DE ELEMENTOS GUARDADOS / MARCADORES
CREATE TABLE IF NOT EXISTS public.user_saved (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT user_saved_target_check CHECK (lesson_id IS NOT NULL OR course_id IS NOT NULL)
);

-- 8. TABLA DE HISTORIAL DE CHAT CON TUTOR IA
CREATE TABLE IF NOT EXISTS public.chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE SET NULL,
  rol TEXT NOT NULL CHECK (rol IN ('user', 'assistant')),
  mensaje TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ÍNDICES PARA OPTIMIZACIÓN DE CONSULTAS
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_lessons_course_id_orden ON public.lessons(course_id, orden);
CREATE INDEX IF NOT EXISTS idx_quizzes_lesson_id ON public.quizzes(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_lesson_id ON public.user_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_notes_user_lesson ON public.user_notes(user_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_saved_user_id ON public.user_saved(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_user_lesson ON public.chat_history(user_id, lesson_id);

-- ==============================================================================
-- TRIGGER AUTOMÁTICO PARA CREACIÓN DE PERFIL TRAS REGISTRO EN AUTH.USERS
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nombre, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'nombre', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Disparador después de insertar en auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- POLÍTICAS DE SEGURIDAD A NIVEL DE FILA (ROW LEVEL SECURITY - RLS)
-- ==============================================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_saved ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 1. POLÍTICAS DE PROFILES
-- ------------------------------------------------------------------------------
CREATE POLICY "Usuarios autenticados pueden ver perfiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Solo el propio usuario puede actualizar su perfil"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- 2. POLÍTICAS DE COURSES
-- ------------------------------------------------------------------------------
CREATE POLICY "Cualquier usuario autenticado puede leer cursos publicados"
  ON public.courses FOR SELECT
  TO authenticated
  USING (publicado = true);

-- ------------------------------------------------------------------------------
-- 3. POLÍTICAS DE LESSONS
-- ------------------------------------------------------------------------------
CREATE POLICY "Usuarios autenticados pueden leer lecciones de cursos publicados"
  ON public.lessons FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE courses.id = lessons.course_id
      AND courses.publicado = true
    )
  );

-- ------------------------------------------------------------------------------
-- 4. POLÍTICAS DE QUIZZES
-- ------------------------------------------------------------------------------
CREATE POLICY "Usuarios autenticados pueden leer quizzes de lecciones publicadas"
  ON public.quizzes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.lessons
      JOIN public.courses ON lessons.course_id = courses.id
      WHERE lessons.id = quizzes.lesson_id
      AND courses.publicado = true
    )
  );

-- ------------------------------------------------------------------------------
-- 5. POLÍTICAS DE USER_PROGRESS (Solo el propio usuario LEER/ESCRIBIR)
-- ------------------------------------------------------------------------------
CREATE POLICY "Usuarios pueden ver su propio progreso"
  ON public.user_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden registrar su propio progreso"
  ON public.user_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden actualizar su propio progreso"
  ON public.user_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar su propio progreso"
  ON public.user_progress FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 6. POLÍTICAS DE USER_NOTES (Solo el propio usuario LEER/ESCRIBIR)
-- ------------------------------------------------------------------------------
CREATE POLICY "Usuarios pueden ver sus propias notas"
  ON public.user_notes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden crear sus propias notas"
  ON public.user_notes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden editar sus propias notas"
  ON public.user_notes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar sus propias notas"
  ON public.user_notes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 7. POLÍTICAS DE USER_SAVED (Solo el propio usuario LEER/ESCRIBIR)
-- ------------------------------------------------------------------------------
CREATE POLICY "Usuarios pueden ver sus elementos guardados"
  ON public.user_saved FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden guardar elementos"
  ON public.user_saved FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar elementos guardados"
  ON public.user_saved FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 8. POLÍTICAS DE CHAT_HISTORY (Solo el propio usuario LEER/ESCRIBIR)
-- ------------------------------------------------------------------------------
CREATE POLICY "Usuarios pueden ver su historial de chat"
  ON public.chat_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden insertar mensajes en su historial de chat"
  ON public.chat_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuarios pueden eliminar su historial de chat"
  ON public.chat_history FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
