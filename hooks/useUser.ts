"use client";

import { useAuth } from "@/components/auth/AuthProvider";

/**
 * Custom hook to consume the global Auth Context
 */
export function useUser() {
  return useAuth();
}
