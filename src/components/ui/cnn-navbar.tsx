"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useLanguage } from "@/providers/LanguageProvider";
import { usePathname } from "next/navigation";
import { useNavCategoryLinks } from "@/lib/hooks/useNavCategoryLinks";

/** Max primary links in the rail; remainder under “More” (CNN-style). Long CMS names need fewer primaries. */
const MAX_PRIMARY_NAV_LINKS = 6;

interface CNNNavbarProps {
  isMobileMenuOpen?: boolean;
  onMobileMenuToggle?: () => void;
  onCloseMobileMenu?: () => void;
}

export function CNNNavbar({
  isMobileMenuOpen: _isMobileMenuOpen,
  onMobileMenuToggle: _onMobileMenuToggle,
  onCloseMobileMenu: _onCloseMobileMenu,
}: CNNNavbarProps) {
  const { language } = useLanguage();
  const pathname = usePathname();
  const { items: navItems, subcategoryLinks, pageLinks } = useNavCategoryLinks();
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  const { visibleItems, moreItems } = useMemo(() => {
    const tail = [...subcategoryLinks, ...pageLinks];
    const n = navItems.length;
    if (n <= 1) {
      return { visibleItems: navItems, moreItems: tail };
    }
    const primary = Math.min(MAX_PRIMARY_NAV_LINKS, n);
    return {
      visibleItems: navItems.slice(0, primary),
      moreItems: [...navItems.slice(primary), ...tail],
    };
  }, [navItems, subcategoryLinks, pageLinks]);

  const moreLabel = language === "it" ? "Altro" : "More";

  const hasMoreMenu = moreItems.length > 0;
  const isMoreOpen = hasMoreMenu && moreDropdownOpen;

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setMoreDropdownOpen(false);
      }
    }
    if (isMoreOpen) {
      document.addEventListener("mousedown", handleOutside);
      return () => document.removeEventListener("mousedown", handleOutside);
    }
  }, [isMoreOpen]);

  return (
    <nav
      className="header__nav hidden lg:flex"
      style={{
        backgroundColor: "#ffffff",
        overflow: "visible",
      }}
    >
      <div
        className="header__nav-container"
        style={{
          flex: "1 1 auto",
          width: "100%",
          maxWidth: "100%",
          overflow: "visible",
        }}
      >
        {/* Scroll only the primary links; “More” + dropdown stay outside so overflow-y:hidden does not clip the panel */}
        <div className="header__nav-links-scroll">
          {visibleItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const displayName = language === "it" ? item.nameIt : item.nameEn;
            return (
              <div key={item.id} className="header__nav-item" style={{ display: "block" }}>
                <Link
                  href={item.href}
                  prefetch={true}
                  title={displayName}
                  className={`header__nav-item-link ${isActive ? "header__nav-item-link--active" : ""}`}
                >
                  {displayName}
                </Link>
              </div>
            );
          })}
        </div>

        {hasMoreMenu && (
          <div ref={moreMenuRef} className="header__nav-more" style={{ display: "block" }}>
            <button
              id="moreDropdown"
              type="button"
              className="header__nav-item-link header__nav-more-link header__nav-button"
              aria-expanded={isMoreOpen}
              aria-haspopup="true"
              onClick={() => setMoreDropdownOpen((prev) => !prev)}
            >
              <span
                className={`header__nav-more--toggle-caret ${isMoreOpen ? "header__nav-more--toggle-caret-up" : "header__nav-more--toggle-caret-down"}`}
              >
                {moreLabel}
              </span>
            </button>

            <div className={`header__nav-item-dropdown ${isMoreOpen ? "show" : ""}`}>
              <div className="header__nav-item-dropdown-inner">
                {moreItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  const displayName = language === "it" ? item.nameIt : item.nameEn;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      prefetch={true}
                      onClick={() => setMoreDropdownOpen(false)}
                      className={`header__nav-item-dropdown-item ${isActive ? "header__nav-item-dropdown-item--active" : ""}`}
                    >
                      {displayName}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
