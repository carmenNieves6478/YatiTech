export * from "./supabase";
export * from "./tutor";

export interface UserProfile {
  id: string;
  email?: string;
  fullName?: string;
  avatarUrl?: string;
  preferredLevel?: string;
  role: "student" | "teacher" | "admin";
}

export interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  imageUrl?: string;
  progress?: number;
}
