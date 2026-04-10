"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { useLanguage } from "@/providers/LanguageProvider";
import { useAuth } from "@/providers/AuthProvider";

const CNN_FONT = '"CNN", "Helvetica Neue", Helvetica, Arial, sans-serif';

const utilityLinkStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  fontFamily: CNN_FONT,
  fontSize: "15px",
  fontWeight: 700,
  color: "#000000",
  textDecoration: "none",
  whiteSpace: "nowrap",
  letterSpacing: "-0.01em",
  lineHeight: 1.25,
  padding: "4px 0",
  flexShrink: 0,
};

const iconButtonStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "36px",
  height: "36px",
  padding: 0,
  backgroundColor: "transparent",
  border: "none",
  color: "#000000",
  cursor: "pointer",
  borderRadius: "6px",
  flexShrink: 0,
};

export function CNNHeaderRight() {
  const { language } = useLanguage();
  const { isAuthenticated } = useAuth();

  const watchLabel = language === "it" ? "Guarda" : "Watch";
  const listenLabel = language === "it" ? "Ascolta" : "Listen";
  const searchLabel = language === "it" ? "Cerca" : "Search";
  const accountLabel = language === "it" ? "Account" : "Account";

  return (
    <div
      className="header__right header__right--default header__right--international"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "clamp(14px, 1.8vw, 22px)",
        flexShrink: 0,
      }}
    >
      <Link
        href="/watch"
        prefetch={false}
        style={utilityLinkStyle}
        className="header__video-link header__video-link-desktop hidden sm:inline-flex"
      >
        <span
          aria-hidden
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "#CC0000",
            flexShrink: 0,
          }}
        />
        {watchLabel}
      </Link>

      <Link
        href="/audio"
        prefetch={false}
        style={utilityLinkStyle}
        className="header__audio-link header__audio-link-desktop header__audio-link--no-margin hidden md:inline-flex"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ flexShrink: 0 }}>
          <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
        </svg>
        {listenLabel}
      </Link>

      <Link
        href="/search"
        prefetch={false}
        aria-label={searchLabel}
        style={iconButtonStyle}
        className="header__search-icon header__search-link"
      >
        <svg
          className="header__search-icon-svg"
          width="22"
          height="22"
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          aria-hidden
        >
          <path d="M55.3,51.89,42.46,39a19.22,19.22,0,1,0-3.38,3.43L51.9,55.29a2.38,2.38,0,0,0,3.4,0A2.42,2.42,0,0,0,55.3,51.89ZM11.2,27.28a16,16,0,1,1,16,16.07A16.07,16.07,0,0,1,11.2,27.28Z" />
        </svg>
      </Link>

      <Link
        href={isAuthenticated ? "/profile" : "/login"}
        prefetch={false}
        aria-label={accountLabel}
        style={{
          ...iconButtonStyle,
          color: "#000000",
        }}
        className="header__account-link"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" aria-hidden>
          <path d="M12 20.674a8.654 8.654 0 01-6.483-2.92c.168-.397.523-.758 1.067-1.076 1.334-.782 3.268-1.23 5.305-1.23 2.027 0 3.955.445 5.288 1.22.628.365.998.787 1.125 1.283A8.649 8.649 0 0112 20.674m1.521-7.203c-3.033 1.496-6.04-1.51-4.544-4.543a2.831 2.831 0 011.282-1.282c3.032-1.491 6.035 1.512 4.543 4.543a2.833 2.833 0 01-1.28 1.282m1.69-9.564c2.334.85 4.161 2.752 4.958 5.106.974 2.873.47 5.65-.941 7.773-.307-.486-.765-.912-1.382-1.27-.912-.53-2.054-.922-3.303-1.155a4.642 4.642 0 001.89-4.755 4.567 4.567 0 00-3.745-3.62 4.648 4.648 0 00-5.442 4.574c0 1.571.787 2.96 1.986 3.8-1.258.235-2.407.63-3.323 1.167-.536.314-.953.674-1.256 1.076A8.617 8.617 0 013.326 12c0-5.821 5.765-10.322 11.885-8.093m.112-1.368A10.052 10.052 0 002.539 15.321a9.611 9.611 0 006.138 6.14A10.052 10.052 0 0021.461 8.679a9.611 9.611 0 00-6.138-6.14" />
        </svg>
      </Link>
    </div>
  );
}
