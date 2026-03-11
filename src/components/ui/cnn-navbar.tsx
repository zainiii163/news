"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/providers/LanguageProvider";
import { usePathname } from "next/navigation";

// CNN-style font family
const CNN_FONT = '"CNN", "Helvetica Neue", Helvetica, Arial, sans-serif';

// CNN Navigation Menu Items - Exact match to CNN
const CNN_MENU_ITEMS = [
  { nameEn: "US", nameIt: "USA", href: "/us" },
  { nameEn: "World", nameIt: "Mondo", href: "/world" },
  { nameEn: "Politics", nameIt: "Politica", href: "/politics" },
  { nameEn: "Business", nameIt: "Economia", href: "/business" },
  { nameEn: "Health", nameIt: "Salute", href: "/health" },
  { nameEn: "Entertainment", nameIt: "Intrattenimento", href: "/entertainment" },
  { nameEn: "Style", nameIt: "Stile", href: "/style" },
  { nameEn: "Travel", nameIt: "Viaggi", href: "/travel" },
  { nameEn: "Sports", nameIt: "Sport", href: "/sports" },
  { nameEn: "Science", nameIt: "Scienza", href: "/science" },
];

interface CNNNavbarProps {
  isMobileMenuOpen?: boolean;
  onMobileMenuToggle?: () => void;
  onCloseMobileMenu?: () => void;
}

export function CNNNavbar({ isMobileMenuOpen, onMobileMenuToggle, onCloseMobileMenu }: CNNNavbarProps) {
  const { language } = useLanguage();
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const lastToggleTimeRef = useRef<number>(0);
  const touchHandledRef = useRef<boolean>(false);

  // Max items visible in main nav (CNN shows 8-9 items, rest in "More")
  const MAX_VISIBLE = 8;
  const visibleItems = CNN_MENU_ITEMS.slice(0, MAX_VISIBLE);
  const moreItems = CNN_MENU_ITEMS.slice(MAX_VISIBLE);

  // Close "More" dropdown when clicking outside
  const handleOutside = useCallback((e: MouseEvent) => {
    if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
      setIsMoreOpen(false);
    }
  }, []);

  // Setup outside click listener - move to useEffect
  useEffect(() => {
    if (isMoreOpen) {
      document.addEventListener("mousedown", handleOutside);
      return () => document.removeEventListener("mousedown", handleOutside);
    }
  }, [isMoreOpen, handleOutside]);

  const closeMobileMenu = useCallback(() => {
    if (onCloseMobileMenu) {
      onCloseMobileMenu();
    }
  }, [onCloseMobileMenu]);

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
    <>
      {/* Desktop Navigation */}
      <nav className="cnn-nav-container hidden md:flex">
        {visibleItems.map((item, index) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const displayName = language === "it" ? item.nameIt : item.nameEn;
          return (
            <div 
              key={item.href} 
              className="cnn-nav-item"
            >
              <Link
                href={item.href}
                prefetch={true}
                className={`cnn-nav-link ${isActive ? 'active' : ''}`}
                data-zjs="click"
                data-zjs-component_id={item.href}
                data-zjs-component_text={displayName}
                data-zjs-component_type="link"
                data-zjs-container_id="cms.cnn.com/_components/header/instances/cnn-v2@published"
                data-zjs-container_type="navigation"
                data-zjs-destination_url={item.href}
                data-zjs-page_type="section"
                data-zjs-page_variant="landing_homepage"
                data-zjs-navigation-type="main"
                data-zjs-navigation_location="header"
              >
                {displayName}
              </Link>
            </div>
          );
        })}

        {/* More Dropdown */}
        {moreItems.length > 0 && (
          <div className="cnn-more-dropdown">
            <button
              className="cnn-more-button"
              aria-expanded={isMoreOpen}
              aria-haspopup="true"
            >
              <span>More</span>
              <svg className="cnn-more-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div className="cnn-dropdown-menu">
              {moreItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                const displayName = language === "it" ? item.nameIt : item.nameEn;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={true}
                    className={`cnn-dropdown-item ${isActive ? 'active' : ''}`}
                    onClick={() => setIsMoreOpen(false)}
                  >
                    {displayName}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Menu Icons - Only show on mobile */}
      <button 
        id="headerMenuIcon"
        className="cnn-mobile-menu-button md:hidden" 
        aria-label="Open Menu Icon"
        onClick={handleClick}
        onTouchEnd={handleTouchEnd}
        onPointerDown={handlePointerDown}
        type="button"
        data-testid="mobile-menu-button"
      >
        <svg 
          className="w-5 h-5" 
          width="20" 
          height="20" 
          viewBox="0 0 28 28" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            fillRule="evenodd" 
            clipRule="evenodd" 
            d="M4.473 8.15263H23.5266C24.0643 8.15263 24.5 7.6777 24.5 7.09194C24.5 6.50618 24.0643 6.03174 23.5266 6.03174H4.473C3.93531 6.03174 3.5 6.50618 3.5 7.09194C3.5 7.6777 3.93531 8.15263 4.473 8.15263ZM19.0765 12.9327H4.25706C3.83886 12.9327 3.50028 13.4076 3.50028 13.9934C3.50028 14.5791 3.83886 15.0536 4.25706 15.0536H19.0765C19.4947 15.0536 19.8336 14.5791 19.8336 13.9934C19.8336 13.4076 19.4947 12.9327 19.0765 12.9327ZM4.47328 19.8337H23.5268C24.0645 19.8337 24.5003 20.3086 24.5003 20.8944C24.5003 21.4802 24.0645 21.9546 23.5268 21.9546H4.47328C3.9356 21.9546 3.50028 21.4802 3.50028 20.8944C3.50028 20.3086 3.9356 19.8337 4.47328 19.8337Z"
            fill="currentColor"
          />
        </svg>
      </button>

      {/* Close Menu Icon */}
      <button 
        id="headerCloseIcon"
        className={`cnn-mobile-menu-button md:hidden ${isMobileMenuOpen ? 'flex' : 'hidden'}`} 
        aria-label="Close Menu Icon"
        onClick={handleClick}
        onTouchEnd={handleTouchEnd}
        onPointerDown={handlePointerDown}
        type="button"
      >
        <svg 
          className="w-8 h-8" 
          role="img" 
          width="32" 
          height="32" 
          viewBox="0 0 32 32" 
          xmlns="http://www.w3.org/2000/svg" 
          aria-labelledby="closeIconTitle" 
          aria-haspopup="true" 
          aria-expanded="false"
        >
          <title id="closeIconTitle">Close icon</title>
          <path 
            d="M29.1,32L10.6,50.6c-0.8,0.8-0.8,2.1,0,2.9c0.8,0.8,2.1,0.8,2.9,0L32,34.9l18.5,18.5c0.8,0.8,2.1,0.8,2.9,0c0.8-0.8,0.8-2.1,0-2.9s-2.1-0.8-2.9,0L32,29.1l18.5-18.5c0.8-0.8,0.8-2.1,0-2.9s-2.1-0.8-2.9,0L32,29.1Z"
            fill="currentColor"
          />
        </svg>
      </button>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`cnn-mobile-menu ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}
        data-open={isMobileMenuOpen ? "true" : "false"}
      >
        {CNN_MENU_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const displayName = language === "it" ? item.nameIt : item.nameEn;
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              onClick={closeMobileMenu}
              className={`cnn-mobile-menu-item ${isActive ? 'active' : ''}`}
            >
              {displayName}
            </Link>
          );
        })}
      </div>
    </>
  );
}
