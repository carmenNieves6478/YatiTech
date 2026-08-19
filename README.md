# 🏔️ Amauta - Plataforma Educativa STEM & Sabiduría con Amauta Tutor IA (PWA)

**Amauta** es una plataforma educativa de nueva generación inspirada en el conocimiento Inca y andino (*"Amauta"* significa **Maestro Sabio y Educador** en idioma Quechua). Está diseñada para estudiantes de educación primaria y secundaria con un enfoque especializado en materias **STEM** (Ciencia, Tecnología, Ingeniería y Matemáticas), Humanidades e Historia.

Construida con **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS (Tema Claro con Paleta Turquesa)**, **Supabase** (Autenticación y Base de Datos PostgreSQL con RLS), **KaTeX** para renderizado matemático y la API de **Google Gemini** para la tutoría interactiva del asistente virtual **Amauta**. Cuenta además con soporte **Progressive Web App (PWA)** para funcionar en dispositivos móviles y de escritorio incluso sin conexión a internet.

---

## 🚀 Tecnologías Principales

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Components & Route Handlers)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Estilos & UI**: [Tailwind CSS](https://tailwindcss.com/) (Light Theme + Verde Turquesa / Teal Palette)
- **Fórmulas Matemáticas**: [KaTeX](https://katex.org/) (`remark-math` + `rehype-katex`)
- **Backend & Auth**: [Supabase](https://supabase.com/) (`@supabase/supabase-js` y `@supabase/ssr` con cookies HTTP-only)
- **IA Tutor (Amauta)**: [Google Generative AI SDK](https://www.npmjs.com/package/@google/generative-ai) (`gemini-3.6-flash`)
- **PWA**: `@ducanh2912/next-pwa` con Web Manifest dinámico y Service Worker para caché offline.

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

Desarrollado para la plataforma educativa **Amauta**.
