# 🏔️ YatiTech - Plataforma Educativa STEM con Yati Tutor IA (PWA)

**YatiTech** es una plataforma educativa de nueva generación inspirada en el conocimiento andino (*"Yati"* significa **Sabiduría y Conocimiento** en idioma Aymara). Está diseñada para estudiantes de educación primaria y secundaria con un enfoque especializado en materias **STEM** (Ciencia, Tecnología, Ingeniería y Matemáticas), Humanidades e Historia.

Construida con **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Supabase** (Autenticación y Base de Datos PostgreSQL con RLS), **KaTeX** para renderizado matemático y la API de **Google Gemini** para la tutoría interactiva del asistente virtual **Yati**. Cuenta además con soporte **Progressive Web App (PWA)** para funcionar en dispositivos móviles y de escritorio incluso sin conexión a internet.

---

## 🚀 Tecnologías Principales

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Components & Route Handlers)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Estilos & UI**: [Tailwind CSS](https://tailwindcss.com/) + Glassmorphism
- **Fórmulas Matemáticas**: [KaTeX](https://katex.org/) (`remark-math` + `rehype-katex`)
- **Backend & Auth**: [Supabase](https://supabase.com/) (`@supabase/supabase-js` y `@supabase/ssr` con cookies HTTP-only)
- **IA Tutor (Yati)**: [Google Generative AI SDK](https://www.npmjs.com/package/@google/generative-ai) (`gemini-3.6-flash`)
- **PWA**: `@ducanh2912/next-pwa` con Web Manifest dinámico y Service Worker para caché offline.

---

## 📁 Estructura del Proyecto

```text
yati-tech/
├── app/                        # Rutas de Next.js 14 App Router
│   ├── (auth)/                 # Grupo de rutas de autenticación (login, registro)
│   ├── (dashboard)/            # Grupo de rutas protegidas (dashboard, tutor, cursos)
│   ├── api/                    # API Route Handlers (Tutor Yati, callback Supabase)
│   ├── layout.tsx              # Layout raíz con PWA Meta, KaTeX CSS, Navbar y Footer
│   ├── page.tsx                # Landing page principal
│   └── globals.css             # Estilos globales y tokens CSS
├── components/                 # Componentes de React reutilizables
│   ├── auth/                   # Formularios de autenticación
│   ├── courses/                # Catálogo de cursos y tarjetas
│   ├── dashboard/              # Panel del estudiante (Progreso, Cursos, Guardados, Notas, Perfil)
│   ├── lesson/                 # Reproductor de lecciones, Visor Markdown, Quizzes y Yati Chat
│   ├── pwa/                    # Banner interactivo de instalación PWA
│   └── ui/                     # Componentes base (Button, Card, Navbar, Footer)
├── hooks/                      # Custom React Hooks (usePWA, useUser, useTutor)
├── lib/                        # Clientes y utilidades (Gemini Yati, Supabase, utils)
├── scripts/                    # Script de sembrado de datos (seed.ts)
├── supabase/                   # Esquema SQL y migraciones
├── types/                      # Definiciones de TypeScript
└── .env.example                # Plantilla de variables de entorno (sin credenciales)
```

---

## ⚙️ Configuración de Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto copiando el contenido de `.env.example`:

```bash
cp .env.example .env.local
```

Configura tus credenciales reales en `.env.local` (**este archivo nunca se sube a Git**):

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-de-supabase
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-de-supabase

# Google Gemini API Key (Obtenla en Google AI Studio: https://aistudio.google.com/)
GEMINI_API_KEY=tu-gemini-api-key
```

---

## 🛠️ Sembrado de Datos e Instalación

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Sembrar Cursos y Lecciones Educativas (Idempotente)

```bash
npm run seed
```

### 3. Ejecutar Servidor de Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la plataforma en funcionamiento.

### 4. Compilar para Producción

```bash
npm run build
npm run start
```

---

## 📝 Licencia

Desarrollado para la plataforma educativa **YatiTech**.
