"use client";

import { useState, useLayoutEffect, useRef, useMemo } from "react";
import { usePathname } from "next/navigation";
import { CNNHeaderClean } from "./cnn-header-clean";
import { CNNNavbar } from "./cnn-navbar";
import { CNNHeaderRight } from "./cnn-header-right";
import { CNNMobileMenu } from "./cnn-mobile-menu";
import { StickyHeaderAd } from "@/components/ads/sticky-header-ad";
import { cn } from "@/lib/helpers/cn";

function isNewsArticlePath(pathname: string | null): boolean {
  if (!pathname?.startsWith("/news/")) return false;
  const segment = pathname.slice("/news/".length).split("/")[0];
  return Boolean(segment?.length);
}

function isAdminChromePath(pathname: string | null): boolean {
  return Boolean(
    pathname?.startsWith("/admin") ||
      pathname?.startsWith("/advertiser") ||
      pathname?.startsWith("/editor") ||
      pathname?.startsWith("/admin-login")
  );
}

const CNN_HEADER_CONFIG = {
  Z_INDEX: 1000,
  BACKGROUND_COLOR: "#ffffff",
  SHADOW: "0 2px 4px rgba(0, 0, 0, 0.1)",
  /** Nav shadow: wider band than y>0 / y===0 to avoid jitter at scroll rest */
  SCROLL_ELEVATED_ENTER: 56,
  SCROLL_ELEVATED_EXIT: 14,
  /** Below this scrollY the header stack is always "at top" (scrolled class off) */
  SCROLL_AT_TOP_EXIT: 12,
  /** Above this we consider the page scrolled (sticky ad behavior) */
  SCROLL_AT_TOP_ENTER: 18,
  /**
   * Leaderboard strip: CNN-style hysteresis — show again only near top, hide after modest scroll.
   * Avoids flicker from tiny wheel/trackpad deltas (single-threshold y>2 felt jumpy).
   */
  AD_STRIP_EXPAND_BELOW_SCROLL_Y: 12,
  AD_STRIP_COLLAPSE_ABOVE_SCROLL_Y: 56,
};

export function CNNHeaderExact() {
  const pathname = usePathname();
  const showArticleReadProgress = useMemo(
    () => isNewsArticlePath(pathname),
    [pathname]
  );
  const isAppChromeLayout = useMemo(() => isAdminChromePath(pathname), [pathname]);
  const hideTopAdStrip = isAppChromeLayout;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isElevatedRef = useRef(false);
  const isScrolledRef = useRef(false);
  const isAdHiddenRef = useRef(false);
  const lastMeasuredAdStripHeightRef = useRef(0);
  const outerHeaderRef = useRef<HTMLElement | null>(null);
  const adStripRef = useRef<HTMLDivElement | null>(null);
  const navRailRef = useRef<HTMLDivElement | null>(null);
  const readProgressRef = useRef<HTMLDivElement | null>(null);

  /** Match measured ad strip height for CNN-style sticky top offset */
  useLayoutEffect(() => {
    const outer = outerHeaderRef.current;
    if (!outer) return;
    const strip = adStripRef.current;
    if (hideTopAdStrip || !strip) {
      outer.style.removeProperty("--cnn-ad-strip-height");
      return;
    }
    const syncHeight = () => {
      const h = Math.ceil(
        Math.max(
          strip.getBoundingClientRect().height,
          strip.offsetHeight,
          strip.scrollHeight
        )
      );
      if (h > 0) {
        lastMeasuredAdStripHeightRef.current = h;
        outer.style.setProperty("--cnn-ad-strip-height", `${h}px`);
      } else if (lastMeasuredAdStripHeightRef.current > 0) {
        /* Strip is display:none while collapsed — keep last height for top offset */
        outer.style.setProperty(
          "--cnn-ad-strip-height",
          `${lastMeasuredAdStripHeightRef.current}px`
        );
      }
    };
    syncHeight();
    requestAnimationFrame(() => {
      syncHeight();
      requestAnimationFrame(syncHeight);
    });
    const ro = new ResizeObserver(() => syncHeight());
    ro.observe(strip);
    window.addEventListener("load", syncHeight, { once: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("load", syncHeight);
    };
  }, [hideTopAdStrip, pathname]);

  useLayoutEffect(() => {
    let rafId = 0;

    const applyAdCompact = (compact: boolean) => {
      const el = outerHeaderRef.current;
      if (!el) return;
      el.classList.toggle("cnn-page-header-outer--ad-collapsed", compact);
    };

    const applyScrolled = (scrolled: boolean) => {
      const el = outerHeaderRef.current;
      if (!el) return;
      el.classList.toggle("cnn-page-header-outer--scrolled", scrolled);
    };

    const syncScrolledFromScrollY = (y: number) => {
      let next = isScrolledRef.current;
      if (!isScrolledRef.current && y > CNN_HEADER_CONFIG.SCROLL_AT_TOP_ENTER) {
        next = true;
      } else if (isScrolledRef.current && y < CNN_HEADER_CONFIG.SCROLL_AT_TOP_EXIT) {
        next = false;
      }
      if (next !== isScrolledRef.current) {
        isScrolledRef.current = next;
        applyScrolled(next);
      }
    };

    const applyElevatedStyles = (elevated: boolean) => {
      const el = navRailRef.current;
      if (!el) return;
      el.style.boxShadow = elevated ? CNN_HEADER_CONFIG.SHADOW : "none";
    };

    const syncElevatedFromScrollY = (y: number) => {
      let next = isElevatedRef.current;
      if (!isElevatedRef.current && y > CNN_HEADER_CONFIG.SCROLL_ELEVATED_ENTER) {
        next = true;
      } else if (isElevatedRef.current && y < CNN_HEADER_CONFIG.SCROLL_ELEVATED_EXIT) {
        next = false;
      }
      if (next !== isElevatedRef.current) {
        isElevatedRef.current = next;
        applyElevatedStyles(next);
      }
    };

    /** Hide leaderboard after scroll; show again near top — matches edition.cnn.com-style sticky stack */
    const syncAdHiddenFromScrollY = (y: number) => {
      if (hideTopAdStrip) {
        if (isAdHiddenRef.current) {
          isAdHiddenRef.current = false;
          applyAdCompact(false);
        }
        return;
      }

      const { AD_STRIP_EXPAND_BELOW_SCROLL_Y, AD_STRIP_COLLAPSE_ABOVE_SCROLL_Y } = CNN_HEADER_CONFIG;
      let next = isAdHiddenRef.current;
      if (y <= AD_STRIP_EXPAND_BELOW_SCROLL_Y) {
        next = false;
      } else if (y >= AD_STRIP_COLLAPSE_ABOVE_SCROLL_Y) {
        next = true;
      }
      /* Between the two thresholds: keep current state (hysteresis). */

      if (next !== isAdHiddenRef.current) {
        isAdHiddenRef.current = next;
        applyAdCompact(next);
      }
    };

    const syncReadProgress = () => {
      const el = readProgressRef.current;
      if (!el || !showArticleReadProgress) {
        return;
      }
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      const p = maxScroll > 0 ? Math.min(1, Math.max(0, y / maxScroll)) : 0;
      el.style.width = `${p * 100}%`;
    };

    const run = () => {
      rafId = 0;
      const y = window.scrollY;
      syncScrolledFromScrollY(y);
      syncAdHiddenFromScrollY(y);
      syncElevatedFromScrollY(y);
      syncReadProgress();
    };

    const onScroll = () => {
      if (rafId === 0) {
        rafId = window.requestAnimationFrame(run);
      }
    };

    const y0 = typeof window !== "undefined" ? window.scrollY : 0;
    isScrolledRef.current = y0 > CNN_HEADER_CONFIG.SCROLL_AT_TOP_ENTER;
    applyScrolled(isScrolledRef.current);
    if (hideTopAdStrip) {
      isAdHiddenRef.current = false;
      applyAdCompact(false);
    } else {
      const { AD_STRIP_EXPAND_BELOW_SCROLL_Y, AD_STRIP_COLLAPSE_ABOVE_SCROLL_Y } = CNN_HEADER_CONFIG;
      let startHidden: boolean;
      if (y0 <= AD_STRIP_EXPAND_BELOW_SCROLL_Y) {
        startHidden = false;
      } else if (y0 >= AD_STRIP_COLLAPSE_ABOVE_SCROLL_Y) {
        startHidden = true;
      } else {
        startHidden = y0 > (AD_STRIP_EXPAND_BELOW_SCROLL_Y + AD_STRIP_COLLAPSE_ABOVE_SCROLL_Y) / 2;
      }
      isAdHiddenRef.current = startHidden;
      applyAdCompact(startHidden);
    }
    syncElevatedFromScrollY(y0);
    syncReadProgress();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("load", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("load", onScroll);
      if (rafId !== 0) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [showArticleReadProgress, hideTopAdStrip, pathname]);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header
        ref={outerHeaderRef}
        className={cn(
          "cnn-page-header-outer header__wrapper-outer",
          isAppChromeLayout && "cnn-page-header-outer--full-bleed"
        )}
        style={{
          zIndex: CNN_HEADER_CONFIG.Z_INDEX,
          marginBottom: 0,
        }}
      >
        <div className="header__wrapper-inner" data-editable="header">
          {!hideTopAdStrip && (
            <div className="cnn-sticky-ad-strip">
              <div
                ref={adStripRef}
                data-uri="cms.cnn.com/_components/ad-slot-header/instances/cnn-v1@published"
                className="ad-slot-header__wrapper"
              >
                <div className="ad-slot-header">
                  <div className="ad-slot-header__container adSlotHeaderContainer">
                    <StickyHeaderAd />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div
            ref={navRailRef}
            className="cnn-nav-rail cnn-header-sticky-root"
            style={{
              position: "relative",
              zIndex: CNN_HEADER_CONFIG.Z_INDEX + 1,
              backgroundColor: CNN_HEADER_CONFIG.BACKGROUND_COLOR,
              boxShadow: "none",
            }}
          >
            <nav
              id="pageHeader"
              data-uri="cms.cnn.com/_components/header/instances/cnn-v2@published"
              data-editable="settings"
              className="header"
              data-analytics-aggregate-events="true"
            >
              <div className="header__inner header__inner--subscription">
                <div className="header__subnav-mount">
                  <div className="header__container">
                    <div
                      className="header__left cnn-header-primary-cluster"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        minWidth: 0,
                        flex: "1 1 auto",
                        gap: "clamp(10px, 1.5vw, 20px)",
                        overflow: "visible",
                      }}
                    >
                      <CNNHeaderClean
                        isMobileMenuOpen={isMobileMenuOpen}
                        onMobileMenuToggle={handleMobileMenuToggle}
                        onCloseMobileMenu={handleMobileMenuClose}
                      />
                      <CNNNavbar
                        isMobileMenuOpen={isMobileMenuOpen}
                        onMobileMenuToggle={handleMobileMenuToggle}
                        onCloseMobileMenu={handleMobileMenuClose}
                      />
                    </div>
                    <CNNHeaderRight />
                  </div>
                  <hr className="header__navigation-separator" />
                </div>
              </div>
            </nav>

            {showArticleReadProgress && (
              <div
                ref={readProgressRef}
                aria-hidden
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  height: "2px",
                  width: "0%",
                  backgroundColor: "#CC0000",
                  pointerEvents: "none",
                  zIndex: 2,
                }}
              />
            )}
          </div>
        </div>
      </header>

      <CNNMobileMenu isOpen={isMobileMenuOpen} onClose={handleMobileMenuClose} />
    </>
  );
}
