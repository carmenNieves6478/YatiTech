"use client";

import React, { useState } from "react";
import { usePWA } from "@/hooks/usePWA";
import { Button } from "@/components/ui/Button";
import { Download, Smartphone, X } from "lucide-react";

export const PWAInstallPrompt: React.FC = () => {
  const { isInstallable, installPWA } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  if (!isInstallable || dismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-96 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-indigo-500/40 rounded-2xl p-4 shadow-2xl shadow-indigo-950/50 flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl text-white shadow-md">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Instalar Ayme App</h4>
              <p className="text-xs text-slate-300">
                Accede más rápido y estudia sin conexión en tu dispositivo.
              </p>
            </div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-slate-400 hover:text-white p-1"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <Button
            variant="primary"
            size="sm"
            onClick={installPWA}
            className="w-full gap-2 text-xs"
          >
            <Download className="w-4 h-4" /> Instalar Ahora
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDismissed(true)}
            className="text-xs"
          >
            Quizás luego
          </Button>
        </div>
      </div>
    </div>
  );
};
