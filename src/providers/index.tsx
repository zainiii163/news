"use client";

import { AuthProvider } from "./AuthProvider";
import { LanguageProvider } from "./LanguageProvider";
import { QueryProvider } from "./QueryProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <LanguageProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </LanguageProvider>
    </QueryProvider>
  );
}
