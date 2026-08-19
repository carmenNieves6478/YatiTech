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
            content: `¡Hola! Soy **Yati**, tu tutor educativo en **YatiTech**. Estoy listo para ayudarte con la lección **"${lessonTitle}"** del curso **"${courseTitle}"**. ¿Qué duda deseas resolver?`,
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
              content: `¡Hola! Soy **Yati**, tu tutor educativo en **YatiTech**. Estoy listo para ayudarte con la lección **"${lessonTitle}"** del curso **"${courseTitle}"**. ¿Qué duda deseas resolver?`,
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
      console.error("Error en YatiTech AI:", err);
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
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-slate-950/95 backdrop-blur-2xl border-l border-slate-800 shadow-2xl flex flex-col transition-transform duration-300">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
              YatiTech Tutor <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </h3>
            <p className="text-[11px] text-indigo-300 truncate max-w-[220px]">
              {lessonTitle}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {fetchingHistory ? (
          <div className="flex items-center justify-center py-10 text-xs text-slate-400 gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-400" /> Cargando historial de Yati...
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
                <div className="w-7 h-7 rounded-xl bg-purple-600/30 border border-purple-500/30 flex items-center justify-center text-purple-300 text-xs flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  m.role === "user"
                    ? "bg-indigo-600 text-white rounded-tr-none shadow-md"
                    : "bg-slate-900/90 border border-slate-800/80 text-slate-200 rounded-tl-none shadow-inner"
                }`}
              >
                {m.role === "assistant" ? (
                  <MarkdownViewer content={m.content} />
                ) : (
                  <span className="whitespace-pre-wrap">{m.content}</span>
                )}
              </div>

              {m.role === "user" && (
                <div className="w-7 h-7 rounded-xl bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-300 text-xs flex-shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))
        )}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-indigo-400 bg-slate-900/80 p-3 rounded-xl border border-slate-800 w-fit">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
            <span>Yati está respondiendo...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Footer */}
      <form onSubmit={handleSendMessage} className="p-3.5 border-t border-slate-800 bg-slate-900/90">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pregunta a Yati sobre la lección..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 text-indigo-400 hover:text-indigo-300 disabled:text-slate-600 p-1.5"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
