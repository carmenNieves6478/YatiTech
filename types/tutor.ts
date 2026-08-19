export type MessageRole = "user" | "model" | "system";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  error?: boolean;
}

export interface TutorSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
}

export interface TutorRequestBody {
  messages: Array<{
    role: MessageRole;
    content: string;
  }>;
  context?: {
    courseTitle?: string;
    topic?: string;
    userLevel?: string;
  };
}

export interface TutorResponseBody {
  reply: string;
  sessionId?: string;
}
