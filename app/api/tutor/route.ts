import { NextRequest, NextResponse } from "next/server";
import { getTutorModel } from "@/lib/gemini/client";
import { TutorRequestBody } from "@/types/tutor";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "placeholder_gemini_api_key") {
      return NextResponse.json(
        {
          error: "API key non configurata",
          reply:
            "El servidor no tiene configurada la clave GEMINI_API_KEY en el archivo .env.local. Por favor indícale al administrador que agregue una clave válida de Google AI Studio.",
        },
        { status: 200 } // Returning 200 with fallback message for smooth UI demo
      );
    }

    const body: TutorRequestBody = await req.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Formato de mensaje inválido" },
        { status: 400 }
      );
    }

    const model = getTutorModel("gemini-1.5-flash");

    // Format chat history for Google Generative AI SDK
    const lastMessage = messages[messages.length - 1];
    const history = messages.slice(0, messages.length - 1).map((msg) => ({
      role: msg.role === "model" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history,
    });

    const result = await chat.sendMessage(lastMessage.content);
    const responseText = result.response.text();

    return NextResponse.json({
      reply: responseText,
    });
  } catch (error: any) {
    console.error("Gemini API tutor route error:", error);
    return NextResponse.json(
      {
        error: "Error interno del tutor",
        reply: `Error al consultar la API de Gemini: ${error.message || "Error desconocido"}`,
      },
      { status: 500 }
    );
  }
}
