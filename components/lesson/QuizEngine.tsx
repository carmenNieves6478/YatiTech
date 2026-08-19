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
      <Card className="p-8 text-center bg-white border-dashed border-slate-300 shadow-xs">
        <HelpCircle className="w-10 h-10 text-teal-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-900 mb-1">Cuestionario en preparación</h3>
        <p className="text-xs text-slate-500">
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

  const failedQuestions = questions.filter(
    (_, idx) => submitted && selectedAnswers[idx] !== questions[idx].respuesta_correcta
  );

  return (
    <div className="space-y-6">
      {/* Quiz Top Header Card */}
      <Card className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 border-teal-700 text-white p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/30">
              Quiz Evaluativo
            </span>
            <span className="text-xs text-teal-200">
              {questions.length} {questions.length === 1 ? "Pregunta" : "Preguntas"}
            </span>
          </div>

          <h2 className="text-xl font-bold text-white">Evaluación de Aprendizaje</h2>
          <p className="text-xs text-teal-100 mt-1">
            Mide tu comprensión sobre la lección. Obtén 70% o más para aprobar.
          </p>
        </div>

        {/* View Mode Toggle & Score Badge */}
        <div className="flex flex-col items-end gap-3 w-full md:w-auto">
          {!submitted && (
            <div className="flex items-center gap-1 bg-teal-950 p-1 rounded-xl border border-teal-800 text-xs">
              <button
                type="button"
                onClick={() => setViewMode("step")}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  viewMode === "step"
                    ? "bg-teal-600 text-white"
                    : "text-teal-200 hover:text-white"
                }`}
              >
                Una por una
              </button>
              <button
                type="button"
                onClick={() => setViewMode("all")}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  viewMode === "all"
                    ? "bg-teal-600 text-white"
                    : "text-teal-200 hover:text-white"
                }`}
              >
                Todas juntas
              </button>
            </div>
          )}

          {submitted && (
            <div className="flex items-center gap-3 bg-teal-950/80 px-4 py-3 rounded-xl border border-teal-700">
              <Trophy className={`w-8 h-8 ${isHighScore ? "text-amber-400" : "text-slate-400"}`} />
              <div>
                <div className="text-xs text-teal-200">Puntaje final</div>
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
        <Card className="bg-emerald-50 border-emerald-300 p-6 space-y-4 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 flex-shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
                ¡Felicidades! Has aprobado el Quiz <Sparkles className="w-4 h-4 text-amber-500" />
              </h3>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Obtuviste un puntaje de <strong>{scorePercentage}%</strong>. Has demostrado un dominio sólido de los temas de esta lección.
              </p>
            </div>
          </div>

          {showAutoConfirm && (
            <div className="p-4 bg-white rounded-xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 shadow-xs">
              <span className="text-xs text-slate-700 font-medium">
                ¿Deseas marcar esta lección como completada en tu progreso?
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAutoConfirm(false)}
                  className="text-xs text-slate-600 border-slate-300"
                >
                  Más tarde
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleConfirmCompletion}
                  className="text-xs font-bold bg-emerald-600 hover:bg-emerald-500 gap-1.5 shadow-sm"
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
        <Card className="bg-amber-50 border-amber-300 p-6 space-y-4 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 flex-shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-amber-900">
                Puntaje obtenido: {scorePercentage}% — ¡Sigue intentando!
              </h3>
              <p className="text-xs text-amber-800 leading-relaxed">
                Necesitas 70% o más para aprobar. Te recomendamos repasar los temas de la lección o consultar directamente a tu Tutor IA sobre las preguntas falladas.
              </p>
            </div>
          </div>

          {/* Ask AI Tutor for Remediation Buttons */}
          {failedQuestions.length > 0 && onAskTutor && (
            <div className="space-y-2 pt-2 border-t border-amber-200">
              <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-teal-700" /> Consultar errores con Amauta Tutor:
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
                          `Hola Amauta Tutor, por favor ayúdame a entender por qué fallé en la pregunta: "${fq.pregunta}". ${
                            fq.explicacion ? "La explicación menciona: " + fq.explicacion : ""
                          }`
                        )
                      }
                      className="px-3 py-2 rounded-xl bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 text-xs font-semibold transition-all flex items-center gap-2 group shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
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
        <Card className="bg-white border-slate-200 p-6 space-y-6 shadow-sm">
          {/* Step Progress Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="text-xs font-bold text-teal-700 flex items-center gap-1.5">
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
                      ? "bg-teal-600 ring-2 ring-teal-600/40 scale-110"
                      : selectedAnswers[idx] !== undefined
                      ? "bg-emerald-500/80"
                      : "bg-slate-200"
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
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
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
                            ? "bg-teal-50 border-teal-600 text-teal-900 font-semibold ring-1 ring-teal-600 shadow-xs"
                            : "bg-slate-50 border-slate-200 text-slate-800 hover:border-teal-400 hover:bg-white"
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
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <Button
              variant="outline"
              size="sm"
              disabled={currentStepIndex === 0}
              onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
              className="gap-1 text-xs border-slate-300 text-slate-700"
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
                className="gap-2 text-xs font-bold shadow-sm"
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
                      ? "bg-emerald-50/70 border-emerald-300"
                      : "bg-red-50/70 border-red-300"
                    : "bg-white border-slate-200 shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-700">
                    {qIdx + 1}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 pt-0.5 leading-snug">
                    {q.pregunta}
                  </h3>
                </div>

                {/* Options List */}
                <div className="grid grid-cols-1 gap-2.5 pl-10">
                  {q.opciones.map((opt, optIdx) => {
                    const isSelected = userAnswer === optIdx;
                    const isCorrect = optIdx === q.respuesta_correcta;

                    let optionStyle =
                      "bg-slate-50 border-slate-200 text-slate-800 hover:border-teal-400 hover:bg-white";

                    if (submitted) {
                      if (isCorrect) {
                        optionStyle =
                          "bg-emerald-100 border-emerald-400 text-emerald-900 font-semibold";
                      } else if (isSelected && !isCorrect) {
                        optionStyle = "bg-red-100 border-red-400 text-red-900";
                      } else {
                        optionStyle = "bg-slate-50 border-slate-200 text-slate-400";
                      }
                    } else if (isSelected) {
                      optionStyle =
                        "bg-teal-50 border-teal-600 text-teal-900 font-semibold ring-1 ring-teal-600";
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
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        )}
                        {submitted && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-red-600" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation of Answer */}
                {submitted && q.explicacion && (
                  <div className="pl-10 pt-2">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                      <strong className="text-teal-700 flex items-center gap-1">
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
                className="gap-2 text-xs font-bold shadow-sm"
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
            className="gap-2 text-xs border-slate-300 text-slate-700"
          >
            <RotateCcw className="w-4 h-4" /> Reintentar Quiz
          </Button>

          {isHighScore && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleConfirmCompletion}
              className="gap-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              <CheckCircle2 className="w-4 h-4" /> Marcar Lección Completada
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
