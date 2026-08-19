"use client";

import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Mail, Lock, LogIn, UserPlus, AlertCircle, CheckCircle2, Loader2, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface AuthFormProps {
  mode?: "login" | "register";
}

/**
 * Friendly translation for Supabase Auth error messages
 */
function getFriendlyErrorMessage(errorMsg: string): string {
  const msg = errorMsg.toLowerCase();
  if (msg.includes("invalid login credentials")) {
    return "Correo electrónico o contraseña incorrectos. Por favor verifica tus datos.";
  }
  if (msg.includes("user already registered") || msg.includes("already exists")) {
    return "Este correo electrónico ya está registrado. Intenta iniciar sesión.";
  }
  if (msg.includes("password should be at least")) {
    return "La contraseña debe tener al menos 6 caracteres.";
  }
  if (msg.includes("email not confirmed")) {
    return "Tu correo electrónico no ha sido confirmado aún. Revisa tu bandeja de entrada.";
  }
  if (msg.includes("rate limit")) {
    return "Demasiados intentos. Por favor espera un momento antes de volver a intentarlo.";
  }
  return errorMsg || "Ocurrió un error inesperado al procesar la solicitud.";
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode = "login" }) => {
  const [isLogin, setIsLogin] = useState(mode === "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Client-side validations
    if (!email.trim() || !email.includes("@")) {
      setMessage({ type: "error", text: "Por favor ingresa un correo electrónico válido." });
      return;
    }

    if (password.length < 6) {
      setMessage({ type: "error", text: "La contraseña debe tener un mínimo de 6 caracteres." });
      return;
    }

    if (!isLogin && !fullName.trim()) {
      setMessage({ type: "error", text: "Por favor ingresa tu nombre completo." });
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // Sign in with Email + Password
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;

        setMessage({ type: "success", text: "¡Inicio de sesión exitoso! Redirigiendo..." });
        
        // Refresh router & navigate to destination
        router.refresh();
        setTimeout(() => {
          window.location.href = redirectTo;
        }, 500);

      } else {
        // Sign up with Email + Password
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          // Explicit profile insertion (backup if trigger didn't execute)
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (supabase.from("profiles" as any) as any).insert({
              id: data.user.id,
              nombre: fullName.trim(),
              nivel_preferido: "principiante",
            });
          } catch {
            // Ignore error if profile was already inserted by DB trigger
          }
        }

        if (data.session) {
          setMessage({ type: "success", text: "¡Cuenta creada exitosamente! Redirigiendo..." });
          router.refresh();
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 800);
        } else {
          setMessage({
            type: "success",
            text: "¡Registro completado! Si se requiere confirmación de correo, revisa tu bandeja de entrada para activar tu cuenta.",
          });
        }
      }
    } catch (err: unknown) {
      const originalMessage = err instanceof Error ? err.message : "Error desconocido";
      setMessage({
        type: "error",
        text: getFriendlyErrorMessage(originalMessage),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md w-full mx-auto border-slate-200 bg-white/95 shadow-xl p-8 backdrop-blur-xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-1">
          {isLogin ? "Iniciar Sesión en Amauta" : "Crear Nueva Cuenta"}
        </h2>
        <p className="text-xs text-slate-500">
          {isLogin
            ? "Ingresa tu correo y contraseña para acceder a la plataforma"
            : "Completa el formulario para registrarte con tu correo"}
        </p>
      </div>

      {message && (
        <div
          className={`p-3.5 rounded-xl text-xs mb-5 flex items-start gap-2.5 transition-all animate-in fade-in duration-200 ${
            message.type === "error"
              ? "bg-red-50 border border-red-200 text-red-700"
              : "bg-emerald-50 border border-emerald-200 text-emerald-800"
          }`}
        >
          {message.type === "error" ? (
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          )}
          <span className="leading-relaxed">{message.text}</span>
        </div>
      )}

      <form onSubmit={handleAuth} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nombre Completo
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej. María García"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Correo Electrónico
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="estudiante@ejemplo.com"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Contraseña
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          variant="primary"
          className="w-full gap-2 py-3 rounded-xl mt-2 font-semibold shadow-md shadow-teal-600/20"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : isLogin ? (
            <>
              <LogIn className="w-4 h-4" /> Iniciar Sesión con Email
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" /> Registrarse con Email
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 pt-5 border-t border-slate-200 text-center">
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage(null);
          }}
          className="text-xs text-teal-700 hover:text-teal-800 font-medium transition-colors"
        >
          {isLogin
            ? "¿No tienes cuenta aún? Regístrate aquí"
            : "¿Ya tienes cuenta? Inicia sesión aquí"}
        </button>
      </div>
    </Card>
  );
};
