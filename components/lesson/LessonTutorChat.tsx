"use client";

import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Bot, Send, User, Sparkles, X, Loader2 } from "lucide-react";
import { MarkdownViewer } from "./MarkdownViewer";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

interface Props {
  userId: string | null;
  lessonId: string;
  lessonTitle: string;
  courseTitle: string;
  lessonContent?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const LessonTutorChat: React.FC<Props> = ({
  userId,
  lessonId,
  lessonTitle,
  courseTitle,
  lessonContent = "",
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchingHistory, setFetchingHistory] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history from Supabase chat_history table
  useEffect(() => {
    async function loadHistory() {
      if (!userId || !lessonId) {
        setFetchingHistory(false);
        setMessages([
          {
            id: "welcome",
            role: "assistant",
            content: `¡Hola! Soy **Amauta**, tu tutor educativo. Estoy listo para ayudarte con la lección **"${lessonTitle}"** del curso **"${courseTitle}"**. ¿Qué duda deseas resolver?`,
          },
        ]);
        return;
      }

      try {
        setFetchingHistory(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase.from("chat_history" as any) as any)
          .select("*")
          .eq("user_id", userId)
          .eq("lesson_id", lessonId)
          .order("created_at", { ascending: true });

        if (!error && data && data.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const historyMessages: ChatMessage[] = data.map((m: any) => ({
            id: m.id,
            role: m.rol as "user" | "assistant",
            content: m.mensaje,
            timestamp: m.created_at,
          }));
          setMessages(historyMessages);
        } else {
          setMessages([
            {
              id: "welcome",
              role: "assistant",
              content: `¡Hola! Soy **Amauta**, tu tutor educativo. Estoy listo para ayudarte con la lección **"${lessonTitle}"** del curso **"${courseTitle}"**. ¿Qué duda deseas resolver?`,
            },
          ]);
        }
      } catch (err) {
        console.error("Error al cargar historial del chat:", err);
      } finally {
        setFetchingHistory(false);
      }
    }

    loadHistory();
  }, [userId, lessonId, lessonTitle, courseTitle, supabase]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput("");

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: userText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    // Save user message to Supabase chat_history if authenticated
    if (userId && lessonId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (supabase.from("chat_history" as any) as any).insert({
        user_id: userId,
        lesson_id: lessonId,
        rol: "user",
        mensaje: userText,
      }).then();
    }

    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          lessonTitle,
          courseTitle,
          lessonContent: lessonContent.slice(0, 1500),
          history: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al comunicarse con la IA.");
      }

      const botReplyText = data.reply || "No pude generar una respuesta en este momento.";

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: botReplyText,
      };

      setMessages((prev) => [...prev, botMsg]);

      // Save assistant message to Supabase chat_history if authenticated
      if (userId && lessonId) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (supabase.from("chat_history" as any) as any).insert({
          user_id: userId,
          lesson_id: lessonId,
          rol: "assistant",
          mensaje: botReplyText,
        }).then();
      }
    } catch (err: unknown) {
      console.error("Error en Amauta AI:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Disculpa, ocurrió un inconveniente de conexión con el servidor. Intenta enviar tu pregunta de nuevo.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-white/95 backdrop-blur-2xl border-l border-slate-200 shadow-2xl flex flex-col transition-transform duration-300">
      {/* Header */}
      <div className="p-4 border-b border-teal-800 bg-teal-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-700 flex items-center justify-center text-white shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
              Amauta Tutor <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </h3>
            <p className="text-[11px] text-teal-200 truncate max-w-[220px]">
              {lessonTitle}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-teal-200 hover:text-white rounded-lg hover:bg-teal-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
        {fetchingHistory ? (
          <div className="flex items-center justify-center py-10 text-xs text-slate-500 gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-teal-600" /> Cargando historial de Amauta...
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.role === "assistant" && (
                <div className="w-7 h-7 rounded-xl bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-800 text-xs flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  m.role === "user"
                    ? "bg-teal-600 text-white rounded-tr-none shadow-sm"
                    : "bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs"
                }`}
              >
                {m.role === "assistant" ? (
                  <MarkdownViewer content={m.content} />
                ) : (
                  <span className="whitespace-pre-wrap">{m.content}</span>
                )}
              </div>

              {m.role === "user" && (
                <div className="w-7 h-7 rounded-xl bg-teal-600 text-white text-xs flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))
        )}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-teal-700 bg-white p-3 rounded-xl border border-slate-200 w-fit shadow-xs">
            <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
            <span>Amauta está respondiendo...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Footer */}
      <form onSubmit={handleSendMessage} className="p-3.5 border-t border-slate-200 bg-white">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pregunta a Amauta sobre la lección..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 text-teal-600 hover:text-teal-800 disabled:text-slate-400 p-1.5"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
