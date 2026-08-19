"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Trophy,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Bot,
  Sparkles,
  BookOpen,
  AlertCircle,
} from "lucide-react";

export interface QuizQuestion {
  id?: string;
  pregunta: string;
  opciones: string[];
  respuesta_correcta: number; // 0-based index
  explicacion?: string;
  tema?: string;
}

interface Props {
  questions: QuizQuestion[];
  onCompleteQuiz: () => void;
  onAskTutor?: (promptText: string) => void;
  isCompleted?: boolean;
}

export const QuizEngine: React.FC<Props> = ({
  questions,
  onCompleteQuiz,
  onAskTutor,
  isCompleted = false,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(isCompleted);
  const [viewMode, setViewMode] = useState<"step" | "all">("step");
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [showAutoConfirm, setShowAutoConfirm] = useState<boolean>(false);

  if (!questions || questions.length === 0) {
    return (
      <Card className="p-8 text-center bg-slate-900/60 border-dashed border-slate-800">
        <HelpCircle className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white mb-1">Cuestionario en preparación</h3>
        <p className="text-xs text-slate-400">
          Las preguntas para este quiz están siendo elaboradas por los profesores.
        </p>
      </Card>
    );
  }

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    if (submitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const calculateScore = () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.respuesta_correcta) {
        correctCount++;
      }
    });
    return correctCount;
  };

  const scoreCount = calculateScore();
  const scorePercentage = Math.round((scoreCount / questions.length) * 100);
  const isHighScore = scorePercentage >= 70;

  const handleSubmit = () => {
    setSubmitted(true);
    if (scorePercentage >= 70) {
      setShowAutoConfirm(true);
    }
  };

  const handleConfirmCompletion = () => {
    onCompleteQuiz();
    setShowAutoConfirm(false);
  };

  const handleRetry = () => {
    setSelectedAnswers({});
    setSubmitted(false);
    setCurrentStepIndex(0);
    setShowAutoConfirm(false);
  };

  const allAnswered = Object.keys(selectedAnswers).length === questions.length;

  // Collect failed questions / topics for low score remediation
  const failedQuestions = questions.filter(
    (_, idx) => submitted && selectedAnswers[idx] !== questions[idx].respuesta_correcta
  );

  return (
    <div className="space-y-6">
      {/* Quiz Top Header Card */}
      <Card className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-indigo-500/30 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
              Quiz Evaluativo
            </span>
            <span className="text-xs text-slate-400">
              {questions.length} {questions.length === 1 ? "Pregunta" : "Preguntas"}
            </span>
          </div>

          <h2 className="text-xl font-bold text-white">Evaluación de Aprendizaje</h2>
          <p className="text-xs text-slate-400 mt-1">
            Mide tu comprensión sobre la lección. Obtén 70% o más para aprobar.
          </p>
        </div>

        {/* View Mode Toggle & Score Badge */}
        <div className="flex flex-col items-end gap-3 w-full md:w-auto">
          {!submitted && (
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setViewMode("step")}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  viewMode === "step"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Una por una
              </button>
              <button
                type="button"
                onClick={() => setViewMode("all")}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  viewMode === "all"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Todas juntas
              </button>
            </div>
          )}

          {submitted && (
            <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-3 rounded-xl border border-slate-800">
              <Trophy className={`w-8 h-8 ${isHighScore ? "text-amber-400" : "text-slate-500"}`} />
              <div>
                <div className="text-xs text-slate-400">Puntaje final</div>
                <div className="text-lg font-bold text-white">
                  {scoreCount} / {questions.length} ({scorePercentage}%)
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* High Score Banner (>= 70%) with Auto-Completion Confirmation */}
      {submitted && isHighScore && (
        <Card className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-emerald-950/40 border-emerald-500/40 p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                ¡Felicidades! Has aprobado el Quiz <Sparkles className="w-4 h-4 text-amber-300" />
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Obtuviste un puntaje de <strong>{scorePercentage}%</strong>. Has demostrado un dominio sólido de los temas de esta lección.
              </p>
            </div>
          </div>

          {showAutoConfirm && (
            <div className="p-4 bg-slate-950/80 rounded-xl border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3">
              <span className="text-xs text-slate-300 font-medium">
                ¿Deseas marcar esta lección como completada en tu progreso?
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAutoConfirm(false)}
                  className="text-xs text-slate-400 border-slate-700"
                >
                  Más tarde
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleConfirmCompletion}
                  className="text-xs font-bold bg-emerald-600 hover:bg-emerald-500 gap-1.5 shadow-lg shadow-emerald-600/30"
                >
                  <CheckCircle2 className="w-4 h-4" /> Marcar Lección Completada
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Low Score Remediation Banner (< 70%) */}
      {submitted && !isHighScore && (
        <Card className="bg-gradient-to-r from-amber-950/30 via-slate-900 to-amber-950/30 border-amber-500/40 p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">
                Puntaje obtenido: {scorePercentage}% — ¡Sigue intentando!
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Necesitas 70% o más para aprobar. Te recomendamos repasar los temas de la lección o consultar directamente a tu Tutor IA sobre las preguntas falladas.
              </p>
            </div>
          </div>

          {/* Ask AI Tutor for Remediation Buttons */}
          {failedQuestions.length > 0 && onAskTutor && (
            <div className="space-y-2 pt-2 border-t border-amber-500/20">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-purple-400" /> Consultar errores con el Tutor IA:
              </span>

              <div className="flex flex-wrap gap-2">
                {failedQuestions.map((fq, idx) => {
                  const topicText = fq.tema || fq.pregunta;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        onAskTutor(
                          `Hola Yati Tutor, por favor ayúdame a entender por qué fallé en la pregunta: "${fq.pregunta}". ${
                            fq.explicacion ? "La explicación menciona: " + fq.explicacion : ""
                          }`
                        )
                      }
                      className="px-3 py-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-200 hover:bg-purple-900/50 hover:text-white text-xs font-semibold transition-all flex items-center gap-2 group"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 group-hover:scale-110 transition-transform" />
                      <span>Ayúdame a entender: &quot;{topicText.slice(0, 45)}...&quot;</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Step-by-Step Mode UI */}
      {viewMode === "step" && !submitted && (
        <Card className="bg-slate-900/80 border-slate-800 p-6 space-y-6">
          {/* Step Progress Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> Pregunta {currentStepIndex + 1} de {questions.length}
            </span>

            {/* Question Step Dots */}
            <div className="flex items-center gap-1.5">
              {questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    idx === currentStepIndex
                      ? "bg-indigo-500 ring-2 ring-indigo-500/40 scale-110"
                      : selectedAnswers[idx] !== undefined
                      ? "bg-emerald-500/60"
                      : "bg-slate-800"
                  }`}
                  title={`Ir a pregunta ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Current Step Question */}
          {(() => {
            const q = questions[currentStepIndex];
            const qIdx = currentStepIndex;
            const userAnswer = selectedAnswers[qIdx];

            return (
              <div className="space-y-5">
                <h3 className="text-lg font-bold text-white leading-snug">
                  {q.pregunta}
                </h3>

                <div className="grid grid-cols-1 gap-3">
                  {q.opciones.map((opt, optIdx) => {
                    const isSelected = userAnswer === optIdx;

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(qIdx, optIdx)}
                        className={`w-full text-left px-4 py-3.5 rounded-xl border text-xs transition-all duration-200 flex items-center justify-between ${
                          isSelected
                            ? "bg-indigo-600/20 border-indigo-500 text-indigo-200 font-semibold ring-1 ring-indigo-500"
                            : "bg-slate-950 border-slate-800 text-slate-300 hover:border-indigo-500/50 hover:bg-slate-900"
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-full border border-current/40 flex items-center justify-center text-[10px] font-bold">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          {opt}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Step Navigation Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <Button
              variant="outline"
              size="sm"
              disabled={currentStepIndex === 0}
              onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
              className="gap-1 text-xs border-slate-800 text-slate-300"
            >
              <ChevronLeft className="w-4 h-4" /> Anterior
            </Button>

            {currentStepIndex < questions.length - 1 ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setCurrentStepIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="gap-1 text-xs font-semibold"
              >
                Siguiente <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                disabled={!allAnswered}
                onClick={handleSubmit}
                className="gap-2 text-xs font-bold shadow-lg shadow-indigo-600/30"
              >
                Finalizar y Evaluar <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* All Questions Mode OR Submitted Summary View */}
      {(viewMode === "all" || submitted) && (
        <div className="space-y-6">
          {questions.map((q, qIdx) => {
            const userAnswer = selectedAnswers[qIdx];

            return (
              <Card
                key={q.id || qIdx}
                className={`p-6 space-y-4 border ${
                  submitted
                    ? userAnswer === q.respuesta_correcta
                      ? "bg-emerald-950/10 border-emerald-500/30"
                      : "bg-red-950/10 border-red-500/30"
                    : "bg-slate-900/80 border-slate-800"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                    {qIdx + 1}
                  </span>
                  <h3 className="text-base font-bold text-white pt-0.5 leading-snug">
                    {q.pregunta}
                  </h3>
                </div>

                {/* Options List */}
                <div className="grid grid-cols-1 gap-2.5 pl-10">
                  {q.opciones.map((opt, optIdx) => {
                    const isSelected = userAnswer === optIdx;
                    const isCorrect = optIdx === q.respuesta_correcta;

                    let optionStyle =
                      "bg-slate-950 border-slate-800 text-slate-300 hover:border-indigo-500/50 hover:bg-slate-900";

                    if (submitted) {
                      if (isCorrect) {
                        optionStyle =
                          "bg-emerald-500/10 border-emerald-500 text-emerald-300 font-semibold";
                      } else if (isSelected && !isCorrect) {
                        optionStyle = "bg-red-500/10 border-red-500 text-red-300";
                      } else {
                        optionStyle = "bg-slate-950/50 border-slate-800/50 text-slate-500";
                      }
                    } else if (isSelected) {
                      optionStyle =
                        "bg-indigo-600/20 border-indigo-500 text-indigo-200 font-semibold ring-1 ring-indigo-500";
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={submitted}
                        onClick={() => handleSelectOption(qIdx, optIdx)}
                        className={`w-full text-left px-4 py-3 rounded-xl border text-xs transition-all duration-200 flex items-center justify-between ${optionStyle}`}
                      >
                        <span className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-full border border-current/40 flex items-center justify-center text-[10px] font-bold">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          {opt}
                        </span>

                        {submitted && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        )}
                        {submitted && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation of Answer */}
                {submitted && q.explicacion && (
                  <div className="pl-10 pt-2">
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                      <strong className="text-indigo-400 flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5" /> Explicación:
                      </strong>
                      <p>{q.explicacion}</p>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}

          {/* Bottom Actions when in "all" mode */}
          {!submitted && (
            <div className="pt-4 flex justify-end">
              <Button
                variant="primary"
                size="md"
                disabled={!allAnswered}
                onClick={handleSubmit}
                className="gap-2 text-xs font-bold shadow-lg shadow-indigo-600/30"
              >
                Enviar Respuestas <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Re-try Button when submitted */}
      {submitted && (
        <div className="pt-4 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetry}
            className="gap-2 text-xs border-slate-700 text-slate-300"
          >
            <RotateCcw className="w-4 h-4" /> Reintentar Quiz
          </Button>

          {isHighScore && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirmCompletion}
              className="gap-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500"
            >
              <CheckCircle2 className="w-4 h-4" /> Marcar Lección Completada
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
