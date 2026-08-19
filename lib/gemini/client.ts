import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

/**
 * System prompt defining the personality and methodology of the educational AI Tutor
 */
export const TUTOR_SYSTEM_INSTRUCTION = `
Eres Ayme, una Inteligencia Artificial tutora educativa avanzada, amable, paciente y pedagógica.
Tu objetivo principal es ayudar a los estudiantes a aprender conceptos complejos guiándolos mediante el método socrático, explicaciones claras, ejemplos prácticos y retroalimentación constructiva.

Directrices de respuesta:
1. Adapta tus explicaciones al nivel del estudiante.
2. Utiliza un tono motivador, profesional y empático.
3. No des simplemente la respuesta final si el estudiante está resolviendo un problema; ayúdale a pensar paso a paso.
4. Formatea las respuestas usando Markdown estructurado, listas, negritas y bloques de código cuando sea relevante.
5. Puedes usar fórmulas matemáticas en formato LaTeX cuando sea necesario.
`;

/**
 * Initializes and returns the Google Generative AI client instance
 */
export function getGeminiClient(): GoogleGenerativeAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "placeholder_gemini_api_key") {
    console.warn("GEMINI_API_KEY is not set properly in environment variables.");
  }
  return new GoogleGenerativeAI(apiKey || "");
}

/**
 * Returns a configured Generative Model instance (defaults to gemini-1.5-flash)
 */
export function getTutorModel(modelName: string = "gemini-1.5-flash"): GenerativeModel {
  const ai = getGeminiClient();
  return ai.getGenerativeModel({
    model: modelName,
    systemInstruction: TUTOR_SYSTEM_INSTRUCTION,
  });
}
