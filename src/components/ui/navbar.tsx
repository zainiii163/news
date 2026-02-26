"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/providers/LanguageProvider";
import { useAuth } from "@/providers/AuthProvider";
import { usePathname } from "next/navigation";

// CNN-style font family (clean Helvetica-like sans-serif)
const CNN_FONT = '"Helvetica Neue", Helvetica, Arial, sans-serif';

// TG Calabria Menu Items with bilingual support - Updated to match actual category slugs
const TG_CALABRIA_MENU_ITEMS = [
  { nameEn: "Italy | World", nameIt: "Italia | Mondo", href: "/category/italy-world" },
  { nameEn: "News", nameIt: "Notizie", href: "/news" }, // News links to news listing page
  { nameEn: "Politics", nameIt: "Politica", href: "/category/politics" },
  { nameEn: "Sport", nameIt: "Sport", href: "/category/sport" },
  { nameEn: "Business", nameIt: "Economia", href: "/category/business" },
  // More section items
  { nameEn: "Entertainment, Culture and Lifestyle", nameIt: "Intrattenimento, Cultura e Stile di Vita", href: "/category/entertainment" },
  { nameEn: "Health and Science", nameIt: "Salute e Scienza", href: "/category/health-science" },
  { nameEn: "Technology and Digital Media", nameIt: "Tecnologia e Media Digitali", href: "/category/technology" },
];

export function Navbar() {
  const { t, language } = useLanguage();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Set isMounted to true after hydration to avoid hydration mismatch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  // Max items visible in main nav (rest go into "More" dropdown like CNN)
  const MAX_VISIBLE = 5; // Show first 5 items, rest in "More" dropdown
  const visibleItems = TG_CALABRIA_MENU_ITEMS.slice(0, MAX_VISIBLE);
  const moreItems = TG_CALABRIA_MENU_ITEMS.slice(MAX_VISIBLE);

  // Close "More" dropdown when clicking outside
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setIsMoreOpen(false);
      }
    }
    if (isMoreOpen) {
      document.addEventListener("mousedown", handleOutside);
      return () => document.removeEventListener("mousedown", handleOutside);
    }
  }, [isMoreOpen]);

  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const lastToggleTimeRef = useRef<number>(0);
  const touchHandledRef = useRef<boolean>(false);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  // Close mobile menu on route change
  const prevPathnameRef = useRef(pathname);
  useEffect(() => {
    if (prevPathnameRef.current !== pathname && isMobileMenuOpen) {
      const timer = setTimeout(() => {
        setIsMobileMenuOpen(false);
      }, 0);
      prevPathnameRef.current = pathname;
      return () => clearTimeout(timer);
    }
    prevPathnameRef.current = pathname;
  }, [pathname, isMobileMenuOpen]);

  // Close mobile menu on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleToggle = useCallback(() => {
    const now = Date.now();
    if (now - lastToggleTimeRef.current < 100) return;
    lastToggleTimeRef.current = now;
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

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
    <>
      {/* ── CNN-STYLE NAVBAR: white bg, black text ── */}
      <nav
        className="sticky top-0 z-50 w-full"
        role="navigation"
        aria-label={t("aria.mainNavigation")}
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e6e6e6',
          fontFamily: CNN_FONT,
        }}
      >
        <div className="cnn-container">
          <div className="flex items-center justify-between" style={{ height: '52px' }}>

            {/* ── LEFT: Hamburger + Logo ── */}
            <div className="flex items-center shrink-0" style={{ gap: '12px' }}>

              {/* Hamburger — CNN exact SVG, mobile/tablet only */}
              <button
                ref={menuButtonRef}
                onClick={handleClick}
                onTouchEnd={handleTouchEnd}
                onPointerDown={handlePointerDown}
                type="button"
                data-testid="mobile-menu-button"
                aria-label={t("aria.toggleMenu") || "Toggle menu"}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                className="lg:hidden"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#000000',
                  cursor: 'pointer',
                  padding: '6px',
                  zIndex: 10000,
                  position: 'relative',
                  touchAction: 'manipulation',
                  userSelect: 'none',
                  outline: 'none',
                }}
              >
                {isMobileMenuOpen ? (
                  /* CNN exact close icon — 64×64 viewBox X */
                  <svg width="22" height="22" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="currentColor" style={{ pointerEvents: 'none' }}>
                    <path d="M29.1,32L10.6,50.6c-0.8,0.8-0.8,2.1,0,2.9c0.8,0.8,2.1,0.8,2.9,0L32,34.9l18.5,18.5c0.8,0.8,2.1,0.8,2.9,0c0.8-0.8,0.8-2.1,0-2.9L34.9,32l18.5-18.5c0.8-0.8,0.8-2.1,0-2.9s-2.1-0.8-2.9,0L32,29.1L13.5,10.6c-0.8-0.8-2.1-0.8-2.9,0c-0.8,0.8-0.8,2.1,0,2.9L29.1,32z" />
                  </svg>
                ) : (
                  /* CNN exact hamburger — 28×28 viewBox, middle bar shorter */
                  <svg width="24" height="24" viewBox="0 0 28 28" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ pointerEvents: 'none' }}>
                    <path fillRule="evenodd" clipRule="evenodd" d="M4.473 8.15263H23.5266C24.0643 8.15263 24.5 7.6777 24.5 7.09194C24.5 6.50618 24.0643 6.03174 23.5266 6.03174H4.473C3.93531 6.03174 3.5 6.50618 3.5 7.09194C3.5 7.6777 3.93531 8.15263 4.473 8.15263ZM19.0765 12.9327H4.25706C3.83886 12.9327 3.50028 13.4076 3.50028 13.9934C3.50028 14.5791 3.83886 15.0536 4.25706 15.0536H19.0765C19.4947 15.0536 19.8336 14.5791 19.8336 13.9934C19.8336 13.4076 19.4947 12.9327 19.0765 12.9327ZM4.47328 19.8337H23.5268C24.0645 19.8337 24.5003 20.3086 24.5003 20.8944C24.5003 21.4802 24.0645 21.9546 23.5268 21.9546H4.47328C3.9356 21.9546 3.50028 21.4802 3.50028 20.8944C3.50028 20.3086 3.9356 19.8337 4.47328 19.8337Z" />
                  </svg>
                )}
              </button>

              {/* Logo — CNN-style: red badge with white text */}
              <Link
                href="/"
                aria-label="TG CALABRIA Home"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#CC0000',
                  color: '#ffffff',
                  fontFamily: CNN_FONT,
                  fontSize: '14px',
                  fontWeight: 900,
                  letterSpacing: '0.01em',
                  padding: '5px 10px',
                  borderRadius: '3px',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  lineHeight: 1.2,
                }}
              >
                TG CALABRIA
              </Link>
            </div>

            {/* ── CENTER: Desktop Nav Links ── */}
            <div
              className="hidden lg:flex items-center"
              style={{ gap: '20px', flex: 1, justifyContent: 'center' }}
            >
              {visibleItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                const displayName = language === "it" ? item.nameIt : item.nameEn;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={true}
                    style={{
                      fontFamily: CNN_FONT,
                      fontSize: '15px',
                      fontWeight: 400,
                      color: isActive ? '#CC0000' : '#000000',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      transition: 'color 0.15s ease',
                    }}
                    onMouseEnter={e => { if (!isActive) (e.target as HTMLElement).style.color = '#CC0000'; }}
                    onMouseLeave={e => { if (!isActive) (e.target as HTMLElement).style.color = '#000000'; }}
                  >
                    {displayName}
                  </Link>
                );
              })}

              {/* "More ↓" dropdown — shows overflow items */}
              {moreItems.length > 0 && (
                <div ref={moreMenuRef} style={{ position: 'relative' }}>
                  <button
                    onClick={() => setIsMoreOpen(prev => !prev)}
                    aria-expanded={isMoreOpen}
                    aria-haspopup="true"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontFamily: CNN_FONT,
                      fontSize: '15px',
                      fontWeight: 400,
                      color: '#000000',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      padding: 0,
                      transition: 'color 0.15s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#CC0000')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#000000')}
                  >
                    More
                    <svg
                      width="12"
                      height="12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{
                        transition: 'transform 0.2s ease',
                        transform: isMoreOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isMoreOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 8px)',
                        left: 0,
                        backgroundColor: '#ffffff',
                        border: '1px solid #e6e6e6',
                        minWidth: '180px',
                        zIndex: 1000,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                      }}
                    >
                      {moreItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        const displayName = language === "it" ? item.nameIt : item.nameEn;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            prefetch={true}
                            onClick={() => setIsMoreOpen(false)}
                            style={{
                              display: 'block',
                              padding: '10px 18px',
                              fontFamily: CNN_FONT,
                              fontSize: '14px',
                              fontWeight: 400,
                              color: isActive ? '#CC0000' : '#000000',
                              textDecoration: 'none',
                              borderBottom: '1px solid #eeeeee',
                              transition: 'background 0.15s ease, color 0.15s ease',
                            }}
                            onMouseEnter={e => {
                              (e.currentTarget as HTMLElement).style.backgroundColor = '#f5f5f5';
                              (e.currentTarget as HTMLElement).style.color = '#CC0000';
                            }}
                            onMouseLeave={e => {
                              (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                              (e.currentTarget as HTMLElement).style.color = isActive ? '#CC0000' : '#000000';
                            }}
                          >
                            {displayName}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── RIGHT: Search · Sign In ── */}
            <div className="flex items-center shrink-0" style={{ gap: '18px' }}>

              {/* 🔍 Search */}
              <button
                aria-label="Search"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#000000',
                  cursor: 'pointer',
                  padding: '4px',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#CC0000')}
                onMouseLeave={e => (e.currentTarget.style.color = '#000000')}
              >
                {/* CNN exact search SVG — 64×64 viewBox */}
                <svg width="20" height="20" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                  <path d="M55.3,51.89,42.46,39a19.22,19.22,0,1,0-3.38,3.43L51.9,55.29a2.38,2.38,0,0,0,3.4,0A2.42,2.42,0,0,0,55.3,51.89ZM11.2,27.28a16,16,0,1,1,16,16.07A16.07,16.07,0,0,1,11.2,27.28Z" />
                </svg>
              </button>

              {/* Register / Sign In / Profile */}
              {!isMounted || authLoading ? null : isAuthenticated ? (
                <Link
                  href="/profile"
                  style={{
                    fontFamily: CNN_FONT,
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#000000',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    transition: 'color 0.15s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#CC0000')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#000000')}
                >
                  Profile
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    style={{
                      fontFamily: CNN_FONT,
                      fontSize: '15px',
                      fontWeight: 400,
                      color: '#000000',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      transition: 'color 0.15s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#CC0000')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#000000')}
                  >
                    {t("nav.register") || "Register"}
                  </Link>
                  <Link
                    href="/login"
                    style={{
                      fontFamily: CNN_FONT,
                      fontSize: '15px',
                      fontWeight: 700,
                      color: '#ffffff',
                      backgroundColor: '#CC0000',
                      textDecoration: 'none',
                      whiteSpace: 'nowrap',
                      padding: '6px 16px',
                      borderRadius: '4px',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#B30000')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#CC0000')}
                  >
                    {t("nav.signIn")}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ── MOBILE MENU: white bg, black text ── */}
      {isMounted && isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="fixed lg:hidden"
          data-open="true"
          style={{
            top: '52px',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e6e6e6',
            zIndex: 40,
            overflowY: 'auto',
            fontFamily: CNN_FONT,
          }}
        >
          <div className="cnn-container" style={{ paddingTop: '8px', paddingBottom: '24px' }}>
            {/* All nav items */}
            {TG_CALABRIA_MENU_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const displayName = language === "it" ? item.nameIt : item.nameEn;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  onClick={closeMobileMenu}
                  style={{
                    display: 'block',
                    padding: '13px 16px',
                    fontSize: '15px',
                    fontWeight: 400,
                    color: isActive ? '#CC0000' : '#000000',
                    textDecoration: 'none',
                    borderBottom: '1px solid #eeeeee',
                    transition: 'color 0.15s ease',
                  }}
                >
                  {displayName}
                </Link>
              );
            })}

            {/* Register / Sign In / Profile */}
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e6e6e6' }}>
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/register"
                    onClick={closeMobileMenu}
                    style={{
                      display: 'block',
                      padding: '13px 16px',
                      fontSize: '15px',
                      fontWeight: 400,
                      color: '#000000',
                      textDecoration: 'none',
                      transition: 'color 0.15s ease',
                      borderBottom: '1px solid #eeeeee',
                    }}
                  >
                    {t("nav.register") || "Register"}
                  </Link>
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    style={{
                      display: 'block',
                      padding: '13px 16px',
                      fontSize: '15px',
                      fontWeight: 700,
                      color: '#ffffff',
                      backgroundColor: '#CC0000',
                      textDecoration: 'none',
                      borderRadius: '4px',
                      marginTop: '8px',
                      textAlign: 'center',
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    {t("nav.signIn")}
                  </Link>
                </>
              ) : (
                <Link
                  href="/profile"
                  onClick={closeMobileMenu}
                  style={{
                    display: 'block',
                    padding: '13px 16px',
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#000000',
                    textDecoration: 'none',
                  }}
                >
                  Profile
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
