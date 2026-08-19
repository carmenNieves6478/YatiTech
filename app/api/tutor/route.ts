import { NextRequest, NextResponse } from "next/server";
import { getTutorModel } from "@/lib/gemini/client";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "placeholder_gemini_api_key") {
      return NextResponse.json(
        {
          error: "API key no configurada",
          reply:
            "El servidor no tiene configurada la clave GEMINI_API_KEY en el archivo .env.local. Por favor agrega una clave válida de Google AI Studio.",
        },
        { status: 200 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body: any = await req.json();

    // Support both payload formats: { message, history, lessonTitle } OR { messages }
    const userText = body.message || (Array.isArray(body.messages) && body.messages.length > 0 ? body.messages[body.messages.length - 1]?.content : null);

    if (!userText || typeof userText !== "string" || !userText.trim()) {
      return NextResponse.json(
        { error: "Formato de mensaje inválido. Se requiere un texto de consulta." },
        { status: 400 }
      );
    }

    const rawHistory = body.history || (Array.isArray(body.messages) ? body.messages.slice(0, -1) : []);
    const lessonTitle = body.lessonTitle || "";
    const courseTitle = body.courseTitle || "";
    const lessonContent = body.lessonContent || "";

    // Format chat history for Google Generative AI SDK
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedHistory = (Array.isArray(rawHistory) ? rawHistory : [])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((msg: any) => ({
        role: msg.role === "assistant" || msg.role === "model" ? "model" : "user",
        parts: [{ text: msg.content || msg.text || "" }],
      }))
      .filter((msg) => msg.parts[0].text.trim() !== "");

    // Google Generative AI SDK strictly requires that the first item in history has role 'user'
    const firstUserIndex = formattedHistory.findIndex((m) => m.role === "user");
    const validHistory = firstUserIndex !== -1 ? formattedHistory.slice(firstUserIndex) : [];

    const model = getTutorModel("gemini-3.6-flash");

    const chat = model.startChat({
      history: validHistory,
    });

    // Build rich prompt combining lesson context (if present) with the student's question
    let fullPrompt = userText;
    if (lessonTitle || courseTitle) {
      fullPrompt = `[Contexto de estudio: Curso "${courseTitle}", Lección "${lessonTitle}"]\n${lessonContent ? `[Resumen de la lección: ${lessonContent.slice(0, 500)}...]\n` : ""}\nConsulta del estudiante: ${userText}`;
    }

    const result = await chat.sendMessage(fullPrompt);
    const responseText = result.response.text();

    return NextResponse.json({
      reply: responseText,
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Error desconocido";
    console.error("Error en API Route de Gemini Tutor:", error);
    return NextResponse.json(
      {
        error: "Error interno del tutor",
        reply: `Ocurrió un inconveniente al comunicarse con Gemini IA: ${errMessage}`,
      },
      { status: 500 }
    );
  }
}
