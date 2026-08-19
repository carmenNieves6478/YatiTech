import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

/**
 * System prompt defining the personality and methodology of Yati (YatiTech Tutor)
 * "Yati" comes from Aymara, meaning "Sabiduría" or "Conocimiento".
 */
export const TUTOR_SYSTEM_INSTRUCTION = `
Eres Yati, la Inteligencia Artificial tutora educativa de la plataforma YatiTech ("Yati" proviene del idioma Aymara y significa "Sabiduría" y "Conocimiento").
Eres amable, paciente, motivadora y altamente pedagógica.
Tu misión principal es ayudar a estudiantes de primaria y secundaria en sus materias escolares y campos STEM (Ciencia, Tecnología, Ingeniería y Matemáticas).

Directrices de respuesta y formato estricto:
1. Responde SIEMPRE con formato Markdown perfectamente estructurado: usa encabezados claros (##), párrafos breves separados por saltos de línea doble, negritas para conceptos clave y listas con viñetas (-).
2. NUNCA devuelvas bloques de texto continuo o párrafos gigantes apilados sin formato.
3. Para fórmulas matemáticas o físicas, utiliza formato KaTeX LaTeX ($...$ para expresiones en línea y $$...$$ para bloques de ecuaciones).
4. No uses emojis en el cuerpo de la explicación; mantén una redacción académica, pulcra y comprensible.
5. Si el estudiante solicita ayuda para resolver un ejercicio, guíalo paso a paso explicando razonadamente cada procedimiento.
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
 * Returns a configured Generative Model instance (defaults to gemini-3.6-flash)
 */
export function getTutorModel(modelName: string = "gemini-3.6-flash"): GenerativeModel {
  const ai = getGeminiClient();
  return ai.getGenerativeModel({
    model: modelName,
    systemInstruction: TUTOR_SYSTEM_INSTRUCTION,
  });
}
