export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          nombre: string | null;
          avatar_url: string | null;
          nivel_preferido: "principiante" | "intermedio" | "avanzado";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          nombre?: string | null;
          avatar_url?: string | null;
          nivel_preferido?: "principiante" | "intermedio" | "avanzado";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nombre?: string | null;
          avatar_url?: string | null;
          nivel_preferido?: "principiante" | "intermedio" | "avanzado";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      courses: {
        Row: {
          id: string;
          titulo: string;
          descripcion: string | null;
          categoria: string;
          nivel: "principiante" | "intermedio" | "avanzado";
          portada_url: string | null;
          publicado: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          titulo: string;
          descripcion?: string | null;
          categoria: string;
          nivel?: "principiante" | "intermedio" | "avanzado";
          portada_url?: string | null;
          publicado?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          titulo?: string;
          descripcion?: string | null;
          categoria?: string;
          nivel?: "principiante" | "intermedio" | "avanzado";
          portada_url?: string | null;
          publicado?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      lessons: {
        Row: {
          id: string;
          course_id: string;
          titulo: string;
          contenido_markdown: string | null;
          orden: number;
          tipo: "teoria" | "practica" | "quiz" | "video";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          titulo: string;
          contenido_markdown?: string | null;
          orden?: number;
          tipo?: "teoria" | "practica" | "quiz" | "video";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          titulo?: string;
          contenido_markdown?: string | null;
          orden?: number;
          tipo?: "teoria" | "practica" | "quiz" | "video";
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      quizzes: {
        Row: {
          id: string;
          lesson_id: string;
          preguntas: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          lesson_id: string;
          preguntas?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          lesson_id?: string;
          preguntas?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          completado: boolean;
          fecha_completado: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          completado?: boolean;
          fecha_completado?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          lesson_id?: string;
          completado?: boolean;
          fecha_completado?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      user_notes: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          contenido: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          contenido: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          lesson_id?: string;
          contenido?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_saved: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string | null;
          course_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id?: string | null;
          course_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          lesson_id?: string | null;
          course_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      chat_history: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string | null;
          rol: "user" | "assistant";
          mensaje: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id?: string | null;
          rol: "user" | "assistant";
          mensaje: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          lesson_id?: string | null;
          rol?: "user" | "assistant";
          mensaje?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
