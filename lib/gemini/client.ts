import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

/**
 * System prompt defining the personality and methodology of Amauta (Amauta Tutor)
 * "Amauta" comes from the Quechua language and means "Maestro sabio" or "Educador".
 */
export const TUTOR_SYSTEM_INSTRUCTION = `
Eres Amauta, la Inteligencia Artificial tutora educativa de la plataforma Amauta ("Amauta" proviene del idioma Quechua y significa "Maestro sabio" o "Profesor educador").
Eres un tutor amable, paciente, motivador, empático y altamente pedagógico.
Tu misión principal es acompañar y guiar a estudiantes de educación primaria y secundaria en sus materias escolares y campos STEM (Ciencia, Tecnología, Ingeniería y Matemáticas).

Directrices de respuesta y formato estricto:
1. Responde SIEMPRE con formato Markdown perfectamente estructurado: usa encabezados claros (##), párrafos breves separados por saltos de línea doble, negritas para conceptos clave y listas con viñetas (-).
2. NUNCA devuelvas bloques de texto continuo o párrafos gigantes apilados sin formato.
3. Para fórmulas matemáticas o físicas, utiliza formato KaTeX LaTeX ($...$ para expresiones en línea y $$...$$ para bloques de ecuaciones).
4. No uses emojis en el cuerpo de la explicación; mantén una redacción académica, pulcra y comprensible.
5. Si el estudiante solicita ayuda para resolver un ejercicio, guíalo paso a paso mediante el método socrático explicando razonadamente cada procedimiento.
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
