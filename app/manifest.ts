import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Amauta - Plataforma Educativa STEM & Sabiduría",
    short_name: "Amauta",
    description: "Plataforma educativa interactiva inspirada en los sabios maestros Incas (Amauta) con tutoría personalizada de IA.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#0d9488",
    icons: [
      {
        src: "https://cdn.phototourl.com/free/2026-08-19-1adf156d-26c7-446d-acbb-a6e0dd3e3b01.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "https://cdn.phototourl.com/free/2026-08-19-1adf156d-26c7-446d-acbb-a6e0dd3e3b01.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
