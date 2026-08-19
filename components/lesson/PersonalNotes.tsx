"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { StickyNote, CheckCircle2, Loader2, Save } from "lucide-react";

interface Props {
  userId: string;
  lessonId: string;
}

export const PersonalNotes: React.FC<Props> = ({ userId, lessonId }) => {
  const [content, setContent] = useState<string>("");
  const [savingStatus, setSavingStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [initialLoaded, setInitialLoaded] = useState<boolean>(false);
  const supabase = createClient();

  // Fetch existing notes from user_notes
  useEffect(() => {
    async function loadNotes() {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase.from("user_notes" as any) as any)
          .select("contenido")
          .eq("user_id", userId)
          .eq("lesson_id", lessonId)
          .maybeSingle();

        if (!error && data) {
          setContent(data.contenido || "");
        }
      } catch (err) {
        console.error("Error al cargar notas:", err);
      } finally {
        setInitialLoaded(true);
      }
    }

    loadNotes();
  }, [userId, lessonId, supabase]);

  // Save ONLY when user clicks the "Guardar Nota" button
  const handleManualSave = useCallback(async () => {
    if (!content.trim() && !initialLoaded) return;
    setSavingStatus("saving");

    try {
      // 1. Check if note row already exists
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: existing } = await (supabase.from("user_notes" as any) as any)
        .select("id")
        .eq("user_id", userId)
        .eq("lesson_id", lessonId)
        .maybeSingle();

      if (existing?.id) {
        // Update existing row
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: updateErr } = await (supabase.from("user_notes" as any) as any)
          .update({
            contenido: content,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);

        if (updateErr) throw updateErr;
      } else {
        // Insert new row
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: insertErr } = await (supabase.from("user_notes" as any) as any)
          .insert({
            user_id: userId,
            lesson_id: lessonId,
            contenido: content,
            updated_at: new Date().toISOString(),
          });

        if (insertErr) throw insertErr;
      }

      setSavingStatus("saved");
      setTimeout(() => setSavingStatus("idle"), 3000);
    } catch (err) {
      console.error("Error al guardar notas en Supabase:", err);
      setSavingStatus("error");
    }
  }, [userId, lessonId, content, initialLoaded, supabase]);

  // Only update local input value while typing (no background requests)
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (savingStatus !== "idle") {
      setSavingStatus("idle");
    }
  };

  return (
    <Card className="bg-slate-900/90 border-slate-800 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-white">
          <StickyNote className="w-4 h-4 text-amber-400" />
          <span>Mis Notas de la Lección</span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {savingStatus === "saving" && (
            <span className="text-amber-400 flex items-center gap-1 font-semibold">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Guardando en BD...
            </span>
          )}
          {savingStatus === "saved" && (
            <span className="text-emerald-400 flex items-center gap-1 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" /> ¡Nota Guardada! ✓
            </span>
          )}
          {savingStatus === "error" && (
            <span className="text-red-400 text-[11px] font-semibold">Error al guardar</span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <textarea
          rows={4}
          value={content}
          onChange={handleChange}
          placeholder="Escribe aquí tus apuntes personales o fórmulas. Presiona 'Guardar Nota' cuando termines..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 leading-relaxed resize-y"
        />

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            {content.length} caracteres
          </span>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={handleManualSave}
            disabled={savingStatus === "saving"}
            className="gap-2 text-xs font-bold shadow-md shadow-indigo-600/20"
          >
            {savingStatus === "saving" ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Guardando...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" /> Guardar Nota
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};
