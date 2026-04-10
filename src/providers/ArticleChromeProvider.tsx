"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type ArticleChromeContextValue = {
  headerSectionLabel: string | null;
  setHeaderSectionLabel: (value: string | null) => void;
};

const ArticleChromeContext = createContext<ArticleChromeContextValue | null>(
  null
);

export function ArticleChromeProvider({ children }: { children: ReactNode }) {
  const [headerSectionLabel, setHeaderSectionLabelState] = useState<
    string | null
  >(null);

  const setHeaderSectionLabel = useCallback((value: string | null) => {
    setHeaderSectionLabelState(value);
  }, []);

  const value = useMemo(
    () => ({ headerSectionLabel, setHeaderSectionLabel }),
    [headerSectionLabel, setHeaderSectionLabel]
  );

  return (
    <ArticleChromeContext.Provider value={value}>
      {children}
    </ArticleChromeContext.Provider>
  );
}

export function useArticleChrome(): ArticleChromeContextValue {
  const ctx = useContext(ArticleChromeContext);
  if (!ctx) {
    return {
      headerSectionLabel: null,
      setHeaderSectionLabel: () => {},
    };
  }
  return ctx;
}
