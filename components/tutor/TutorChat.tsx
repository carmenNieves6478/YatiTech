"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTutor } from "@/hooks/useTutor";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Bot, Send, Sparkles, Trash2, User, RefreshCw } from "lucide-react";
import { MarkdownViewer } from "@/components/lesson/MarkdownViewer";

export const TutorChat: React.FC = () => {
  const { messages, loading, sendMessage, clearMessages } = useTutor();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const text = input;
    setInput("");
    sendMessage(text);
  };

  return (
    <Card className="flex flex-col h-[650px] max-w-4xl mx-auto border-slate-200 bg-white p-0 overflow-hidden shadow-lg">
      {/* Chat Header */}
      <div className="p-4 bg-teal-900 text-white border-b border-teal-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative p-2.5 bg-teal-700 rounded-xl text-white shadow-md">
            <Bot className="w-6 h-6" />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-teal-900 rounded-full"></span>
          </div>
          <div>
            <h3 className="font-bold text-white flex items-center gap-2 text-base">
              Amauta Tutor IA <Sparkles className="w-4 h-4 text-amber-300" />
            </h3>
            <p className="text-xs text-teal-200">
              Sabiduría Quechua & Inteligencia Artificial STEM • Método Socrático
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearMessages}
            className="text-teal-200 hover:text-white hover:bg-teal-800 text-xs gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> Limpiar chat
          </Button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600 mb-4 shadow-xs">
              <Bot className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-1">
              ¡Hola! Soy Amauta, tu Tutor Personal
            </h4>
            <p className="text-xs text-slate-600 max-w-md leading-relaxed mb-6">
              Puedo ayudarte a resolver dudas sobre matemática, programación Python, física, química, historia o explicarte cualquier tema paso a paso.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
              {[
                "¿Cómo funciona un bucle for en Python?",
                "Explícame las Leyes de Newton con ejemplos",
                "¿Qué es la masa atómica y cómo se calcula?",
                "Ayúdame a organizar un plan de estudio STEM",
              ].map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(prompt)}
                  className="text-left text-xs bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 p-3 rounded-xl text-slate-700 hover:text-teal-800 transition-all duration-200 shadow-xs"
                >
                  &quot;{prompt}&quot;
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "model" && (
                <div className="w-8 h-8 rounded-xl bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-800 flex-shrink-0 mt-1 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-teal-600 text-white rounded-tr-none shadow-md"
                    : msg.error
                    ? "bg-red-50 text-red-700 border border-red-200 rounded-tl-none"
                    : "bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm"
                }`}
              >
                {msg.role === "model" ? (
                  <MarkdownViewer content={msg.content} />
                ) : (
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                )}

                <div
                  className={`text-[10px] mt-2 text-right ${
                    msg.role === "user" ? "text-teal-100" : "text-slate-400"
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))
        )}

        {loading && (
          <div className="flex gap-3 justify-start items-center text-slate-500 text-xs">
            <div className="w-8 h-8 rounded-xl bg-teal-100 border border-teal-200 flex items-center justify-center text-teal-800 flex-shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 flex items-center gap-2 text-teal-700 shadow-xs">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Amauta está preparando tu explicación pedagógica...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pregunta a Amauta sobre tus materias o temas STEM..."
          disabled={loading}
          className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-600 focus:ring-1 focus:ring-teal-600 disabled:opacity-50"
        />
        <Button
          type="submit"
          disabled={loading || !input.trim()}
          variant="primary"
          size="md"
          className="gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Enviar</span>
        </Button>
      </form>
    </Card>
  );
};
