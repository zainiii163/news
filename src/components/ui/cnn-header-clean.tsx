"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Link from "next/link";
import { useLanguage } from "@/providers/LanguageProvider";
import { useArticleChrome } from "@/providers/ArticleChromeProvider";
import { usePathname } from "next/navigation";

// CNN-style font family
const CNN_FONT = '"Helvetica Neue", Helvetica, Arial, sans-serif';

interface CNNHeaderCleanProps {
  isMobileMenuOpen?: boolean;
  onMobileMenuToggle?: () => void;
  onCloseMobileMenu?: () => void;
}

function categorySectionLabelFromPath(pathname: string | null): string | null {
  if (!pathname?.startsWith("/category/") && !pathname?.startsWith("/categories/")) return null;
  const slug = pathname.split("/")[2];
  if (!slug) return null;
  return slug
    .split("-")
    .map((w) => (w.length <= 2 ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
    .join(" ");
}

export function CNNHeaderClean({ isMobileMenuOpen, onMobileMenuToggle }: CNNHeaderCleanProps) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const { headerSectionLabel: articleSectionLabel } = useArticleChrome();
  const categorySectionLabel = useMemo(
    () => categorySectionLabelFromPath(pathname),
    [pathname]
  );
  const sectionLabel = articleSectionLabel || categorySectionLabel;
  const [isMounted, setIsMounted] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const lastToggleTimeRef = useRef<number>(0);
  const touchHandledRef = useRef<boolean>(false);

  // Set isMounted to true after hydration to avoid hydration mismatch
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  const handleToggle = useCallback(() => {
    const now = Date.now();
    if (now - lastToggleTimeRef.current < 100) return;
    lastToggleTimeRef.current = now;
    if (onMobileMenuToggle) {
      onMobileMenuToggle();
    }
  }, [onMobileMenuToggle]);

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (e.cancelable) e.preventDefault();
    touchHandledRef.current = true;
    handleToggle();
    setTimeout(() => { touchHandledRef.current = false; }, 300);
  }, [handleToggle]);

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === 'touch' || e.pointerType === 'pen') {
      e.stopPropagation();
      if (e.cancelable) e.preventDefault();
      touchHandledRef.current = true;
      handleToggle();
      setTimeout(() => { touchHandledRef.current = false; }, 300);
    }
  }, [handleToggle]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (touchHandledRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    e.stopPropagation();
    e.preventDefault();
    handleToggle();
  }, [handleToggle]);

  return (
    <div
      className="header__brand-cluster"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        minWidth: 0,
        flexShrink: 0,
      }}
    >
      {/* Single control toggles CNN menu / close classes (DOM parity with edition.cnn.com) */}
      <button
        ref={menuButtonRef}
        id={isMobileMenuOpen ? "headerCloseIcon" : "headerMenuIcon"}
        onClick={handleClick}
        onTouchEnd={handleTouchEnd}
        onPointerDown={handlePointerDown}
        type="button"
        data-testid="mobile-menu-button"
        aria-label={t("aria.toggleMenu") || "Toggle menu"}
        aria-expanded={isMobileMenuOpen}
        aria-controls="mobile-menu"
        className={isMobileMenuOpen ? "header__close-icon" : "header__menu-icon"}
        style={{
          cursor: "pointer",
          zIndex: 2,
          position: "relative",
          flexShrink: 0,
          touchAction: "manipulation",
          userSelect: "none",
          outline: "none",
        }}
      >
        {isMobileMenuOpen ? (
          <svg
            className="header__close-icon-svg"
            role="img"
            width={20}
            height={20}
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            style={{ pointerEvents: "none" }}
            aria-hidden
          >
            <path d="M29.1,32L10.6,50.6c-0.8,0.8-0.8,2.1,0,2.9c0.8,0.8,2.1,0.8,2.9,0L32,34.9l18.5,18.5c0.8,0.8,2.1,0.8,2.9,0c0.8-0.8,0.8-2.1,0-2.9L34.9,32l18.5-18.5c0.8-0.8,0.8-2.1,0-2.9s-2.1-0.8-2.9,0L32,29.1L13.5,10.6c-0.8-0.8-2.1-0.8-2.9,0c-0.8,0.8-0.8,2.1,0,2.9L29.1,32z" />
          </svg>
        ) : (
          <svg
            className="header__menu-icon-svg"
            width={28}
            height={28}
            viewBox="0 0 28 28"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            style={{ pointerEvents: "none" }}
            aria-hidden
          >
            <path fillRule="evenodd" clipRule="evenodd" d="M4.473 8.15263H23.5266C24.0643 8.15263 24.5 7.6777 24.5 7.09194C24.5 6.50618 24.0643 6.03174 23.5266 6.03174H4.473C3.93531 6.03174 3.5 6.50618 3.5 7.09194C3.5 7.6777 3.93531 8.15263 4.473 8.15263ZM19.0765 12.9327H4.25706C3.83886 12.9327 3.50028 13.4076 3.50028 13.9934C3.50028 14.5791 3.83886 15.0536 4.25706 15.0536H19.0765C19.4947 15.0536 19.8336 14.5791 19.8336 13.9934C19.8336 13.4076 19.4947 12.9327 19.0765 12.9327ZM4.47328 19.8337H23.5268C24.0645 19.8337 24.5003 20.3086 24.5003 20.8944C24.5003 21.4802 24.0645 21.9546 23.5268 21.9546H4.47328C3.9356 21.9546 3.50028 21.4802 3.50028 20.8944C3.50028 20.3086 3.9356 19.8337 4.47328 19.8337Z" />
          </svg>
        )}
      </button>

      {/* TG CALABRIA Logo - CNN-style red badge */}
      <div className="brand-logo" data-editable="settings" style={{ flexShrink: 0 }}>
        <Link 
          className="brand-logo__logo-link" 
          href="/" 
          title="TG CALABRIA"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            textDecoration: 'none',
          }}
        >
          <span 
            className="brand-logo__logo"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#CC0000',
              color: '#ffffff',
              fontFamily: CNN_FONT,
              fontSize: '16px',
              fontWeight: 900, // Extra bold like CNN
              letterSpacing: '-0.02em', // CNN letter spacing
              padding: '6px 12px',
              borderRadius: '4px',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              lineHeight: 1.1,
              textTransform: 'uppercase', // CNN uses uppercase
            }}
          >
            TG CALABRIA
          </span>
        </Link>
      </div>

      {sectionLabel && (
        <div
          className="hidden min-[1360px]:flex items-center gap-2 ml-1 min-w-0"
          style={{ alignItems: "center", overflow: "hidden", maxWidth: "min(200px, 18vw)" }}
        >
          <span
            style={{
              width: "1px",
              height: "28px",
              backgroundColor: "#E6E6E6",
              flexShrink: 0,
            }}
          />
          <span
            className="truncate"
            title={sectionLabel}
            style={{
              fontFamily: CNN_FONT,
              fontSize: "15px",
              fontWeight: 600,
              color: "#000000",
              letterSpacing: "-0.02em",
              minWidth: 0,
            }}
          >
            {sectionLabel}
          </span>
        </div>
      )}
    </div>
  );
}
