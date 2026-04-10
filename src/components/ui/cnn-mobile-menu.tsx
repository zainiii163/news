"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/providers/LanguageProvider";
import { useAuth } from "@/providers/AuthProvider";
import { usePathname } from "next/navigation";
import { useNavCategoryLinks } from "@/lib/hooks/useNavCategoryLinks";

// CNN-style font family
const CNN_FONT = '"Helvetica Neue", Helvetica, Arial, sans-serif';

interface CNNMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CNNMobileMenu({ isOpen, onClose }: CNNMobileMenuProps) {
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const { allItems: navItems } = useNavCategoryLinks();
  const [isMounted, setIsMounted] = useState(false);
  const scrollYLockRef = useRef(0);

  // Set isMounted to true after hydration to avoid hydration mismatch
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Lock background scroll without jumping to top (fixed + top:0 alone loses scroll position)
  useEffect(() => {
    if (!isMounted || !isOpen) return;

    const y = window.scrollY;
    scrollYLockRef.current = y;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${y}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollYLockRef.current);
    };
  }, [isOpen, isMounted]);

  // Close mobile menu on escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Don't render until mounted to avoid hydration errors
  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="cnn-mobile-menu-overlay"
          style={{
            position: 'fixed',
            top: '56px',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e6e6e6',
            zIndex: 999,
            overflowY: 'auto',
            fontFamily: CNN_FONT,
          }}
        >
          <div style={{ paddingTop: '8px', paddingBottom: '24px' }}>
            {/* All nav items */}
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const displayName = language === "it" ? item.nameIt : item.nameEn;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  prefetch={true}
                  onClick={onClose}
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
                    onClick={onClose}
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
                    onClick={onClose}
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
                    {t("nav.signIn") || "Sign In"}
                  </Link>
                </>
              ) : (
                <Link
                  href="/profile"
                  onClick={onClose}
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
