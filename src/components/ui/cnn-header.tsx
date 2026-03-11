"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/providers/LanguageProvider";
import { useAuth } from "@/providers/AuthProvider";
import { usePathname } from "next/navigation";

// CNN-style font family
const CNN_FONT = '"CNN", "Helvetica Neue", Helvetica, Arial, sans-serif';

// CNN Advertisement Sizes and Configuration - Exact CNN values
const AD_SIZES = {
  DESKTOP: {
    HEADER: { width: 970, height: 90, slotId: 'ad_bnr_atf_01' },
    RECTANGLE: { width: 300, height: 250, slotId: 'ad_rect_atf_01' },
  },
  MOBILE: {
    HEADER: { width: 320, height: 50, slotId: 'ad_bnr_atf_01' },
    RECTANGLE: { width: 300, height: 250, slotId: 'ad_rect_atf_01' },
  }
};

// CNN Sticky Header Configuration - Exact CNN values
const HEADER_CONFIG = {
  AD_HEIGHT: 276,
  NAV_HEIGHT: 56,
  STICKY_THRESHOLD: 100,
  AD_SLOT_HEIGHT: 276,
  WRAPPER_HEIGHT: 316,
  WRAPPER_TOP: -276,
};

// TG Calabria Menu Items with bilingual support - CNN navigation structure
const TG_CALABRIA_MENU_ITEMS = [
  { nameEn: "US", nameIt: "USA", href: "/category/us" },
  { nameEn: "World", nameIt: "Mondo", href: "/category/world" },
  { nameEn: "Politics", nameIt: "Politica", href: "/category/politics" },
  { nameEn: "Business", nameIt: "Economia", href: "/category/business" },
  { nameEn: "Health", nameIt: "Salute", href: "/category/health" },
  { nameEn: "Entertainment", nameIt: "Intrattenimento", href: "/category/entertainment" },
  { nameEn: "Style", nameIt: "Stile", href: "/category/style" },
  { nameEn: "Travel", nameIt: "Viaggi", href: "/category/travel" },
  { nameEn: "Sports", nameIt: "Sport", href: "/category/sport" },
  { nameEn: "Science", nameIt: "Scienza", href: "/category/science" },
  { nameEn: "Climate", nameIt: "Clima", href: "/category/climate" },
  { nameEn: "Weather", nameIt: "Tempo", href: "/category/weather" },
  { nameEn: "Winter Olympics 2026", nameIt: "Olimpiadi Invernali 2026", href: "/sport/milan-cortina-winter-olympics-2026" },
  { nameEn: "Ukraine-Russia War", nameIt: "Guerra Ucraina-Russia", href: "/world/europe/ukraine" },
  { nameEn: "Israel-Hamas War", nameIt: "Guerra Israele-Hamas", href: "/world/middleeast/israel" },
  { nameEn: "Games", nameIt: "Giochi", href: "/games" },
];

export function CNNHeader() {
  const { t, language } = useLanguage();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [technicalIssues, setTechnicalIssues] = useState(false);
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [adRelevance, setAdRelevance] = useState("");
  
  // CNN Sticky Header State - Exact CNN behavior
  const [scrollY, setScrollY] = useState(0);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const [adSlotHeight, setAdSlotHeight] = useState(HEADER_CONFIG.AD_HEIGHT);
  const [currentAdSize, setCurrentAdSize] = useState(AD_SIZES.DESKTOP.HEADER);
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);
  
  // Set isMounted to true after hydration to avoid hydration mismatch
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
      setViewportWidth(window.innerWidth);
      
      // Detect ad size based on viewport
      const detectAdSize = () => {
        const width = window.innerWidth;
        if (width < 768) {
          setCurrentAdSize(AD_SIZES.MOBILE.HEADER);
          setAdSlotHeight(HEADER_CONFIG.AD_HEIGHT);
        } else {
          setCurrentAdSize(AD_SIZES.DESKTOP.HEADER);
          setAdSlotHeight(HEADER_CONFIG.AD_HEIGHT);
        }
      };
      
      detectAdSize();
      window.addEventListener('resize', detectAdSize);
      
      return () => window.removeEventListener('resize', detectAdSize);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);
  
  // CNN Sticky Header Logic - Exact CNN behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      
      // Make header sticky when scrolling past threshold
      if (currentScrollY > HEADER_CONFIG.STICKY_THRESHOLD) {
        setIsHeaderSticky(true);
      } else {
        setIsHeaderSticky(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Simulate Ad Loading - CNN behavior
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAdLoaded(true);
    }, 1500); // Simulate ad load time
    
    return () => clearTimeout(timer);
  }, []);
  
  // Close "More" dropdown when clicking outside
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    
    if (isMoreOpen) {
      document.addEventListener("mousedown", handleOutside);
      return () => document.removeEventListener("mousedown", handleOutside);
    }
  }, [isMoreOpen]);

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
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = '0';
      document.body.style.left = '0';
      document.body.style.right = '0';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
    };
  }, [isMobileMenuOpen]);

  const lastToggleTimeRef = useRef<number>(0);
  const touchHandledRef = useRef<boolean>(false);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

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

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setShowFeedbackModal(false);
      setFeedbackSubmitted(false);
      setTechnicalIssues(false);
      setSelectedIssues([]);
      setComment("");
      setAdRelevance("");
    }, 2000);
  };

  const handleIssueToggle = (issue: string) => {
    setSelectedIssues(prev => 
      prev.includes(issue) 
        ? prev.filter(i => i !== issue)
        : [...prev, issue]
    );
  };

  // Max items visible in main nav (rest go into "More" dropdown like CNN)
  const MAX_VISIBLE = 5; // CNN shows 5 items in main nav
  const visibleItems = TG_CALABRIA_MENU_ITEMS.slice(0, MAX_VISIBLE);
  const moreItems = TG_CALABRIA_MENU_ITEMS.slice(MAX_VISIBLE);

  return (
    <>
      {/* CNN Header Wrapper - Exact Structure */}
      <header 
        className="header__wrapper-outer" 
        style={{ 
          height: `${HEADER_CONFIG.WRAPPER_HEIGHT}px`, 
          top: `${HEADER_CONFIG.WRAPPER_TOP}px`, 
          marginBottom: '0px', 
          position: 'sticky' 
        }}
      >
        <div className="header__wrapper-inner" data-editable="header">
          
          {/* Ad Feedback Modal - Exact CNN structure */}
          {showFeedbackModal && (
            <div 
              id="ad-feedback__modal-overlay"
              className="ad-feedback__modal modal__overlay"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={() => setShowFeedbackModal(false)}
            >
              <div 
                className="ad-feedback__container"
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  maxWidth: '500px',
                  width: '90%',
                  maxHeight: '80vh',
                  overflowY: 'auto',
                  padding: '24px',
                  position: 'relative',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {!feedbackSubmitted ? (
                  <form className="ad-feedback__form" onSubmit={handleSubmitFeedback}>
                    {/* Header */}
                    <div className="ad-feedback__heading">
                      <h3 className="ad-feedback__heading__text">TG Calabria values your feedback</h3>
                      <div 
                        id="ad-feedback__close-icon" 
                        className="ad-feedback__heading__close"
                        onClick={() => setShowFeedbackModal(false)}
                        style={{
                          position: 'absolute',
                          top: '16px',
                          right: '16px',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          fontSize: '20px',
                        }}
                      >
                        ✕
                      </div>
                    </div>

                    {/* Question 1: Relevance */}
                    <div className="ad-feedback__content-container" data-sentiment="ad">
                      <div className="ad-feedback__question-container">
                        1. How relevant is this ad to you?
                      </div>
                      <div className="ad-feedback__answers-container">
                        {[
                          { value: "1", label: "Bad", emoji: "😞" },
                          { value: "2", label: "Not Good", emoji: "😕" },
                          { value: "3", label: "Okay", emoji: "😐" },
                          { value: "4", label: "Good", emoji: "😊" },
                          { value: "5", label: "Great", emoji: "😃" },
                        ].map((rating) => (
                          <div key={rating.value} className="ad-feedback__emoji-container">
                            <input 
                              className="ad-feedback__emoji-radio-input" 
                              id={`ad-feedback__0-${rating.label.toLowerCase()}`}
                              name="ad" 
                              type="radio" 
                              value={rating.value} 
                              aria-label={rating.label}
                              required
                            />
                            <label 
                              htmlFor={`ad-feedback__0-${rating.label.toLowerCase()}`} 
                              className={`ad-feedback__emoji-base ad-feedback__emoji-${rating.label.toLowerCase()}`}
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                cursor: 'pointer',
                                padding: '8px',
                                borderRadius: '4px',
                                transition: 'background-color 0.15s ease',
                              }}
                            >
                              <div style={{ fontSize: '24px', marginBottom: '4px' }}>{rating.emoji}</div>
                              <div style={{ fontSize: '10px' }}>{rating.label}</div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Question 2: Technical Issues */}
                    <div className="ad-feedback__content-container">
                      <div className="ad-feedback__question-container">
                        2. Did you encounter any technical issues?
                      </div>
                      <div className="ad-feedback__technical-issues-checkbox-container">
                        <label className="switch">
                          <input 
                            id="ad-feedback__technical-issues-checkbox" 
                            className="ad-feedback__technical-issues-slider" 
                            type="checkbox" 
                            name="didEncounterIssues" 
                            aria-label="Toggle Button"
                            checked={technicalIssues}
                            onChange={(e) => setTechnicalIssues(e.target.checked)}
                          />
                          <span className="slider round"></span>
                        </label>
                        <span className="ad-feedback__technical-issues-checkbox-label">No</span>
                      </div>
                    </div>

                    {/* Technical Issues Details */}
                    {technicalIssues && (
                      <div className="ad-feedback__technical-issues-container" style={{ display: 'block' }}>
                        <div className="ad-feedback__content-container display_ad_issues issues-checkboxes-container">
                          {[
                            'Ad never loaded',
                            'Ad prevented/slowed page from loading',
                            'Content moved around while ad loaded',
                            'Ad was repetitive to ads I\'ve seen previously',
                            'Other issues'
                          ].map(issue => (
                            <label key={issue} className="ad-feedback__checkbox-container" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: '8px' }}>
                              <input
                                className="ad-feedback__checkbox__input display_ad_issue"
                                type="checkbox"
                                value={issue}
                                name="issues"
                                checked={selectedIssues.includes(issue)}
                                onChange={() => handleIssueToggle(issue)}
                                style={{ marginRight: '8px' }}
                              />
                              <span className="ad-feedback__checkmark"></span>
                              <span style={{ fontSize: '13px' }}>{issue}</span>
                            </label>
                          ))}
                        </div>
                        
                        {/* Comment */}
                        <div className="ad-feedback__content-container">
                          <textarea
                            rows={5}
                            className="ad-feedback__comment"
                            maxLength={1000}
                            name="comment"
                            placeholder="Additional comments (optional)"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px',
                              border: '1px solid #ddd',
                              borderRadius: '4px',
                              fontSize: '14px',
                              resize: 'vertical',
                              fontFamily: CNN_FONT,
                            }}
                          />
                          <div className="ad-feedback__comment-error-msg"></div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="ad-feedback__content-container">
                      <div className="ad-feedback__actions">
                        <button 
                          type="button" 
                          id="ad-feedback__cancel" 
                          className="ad-feedback__cancel button"
                          onClick={() => setShowFeedbackModal(false)}
                          style={{
                            padding: '8px 16px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            backgroundColor: '#fff',
                            cursor: 'pointer',
                            marginRight: '8px',
                            fontFamily: CNN_FONT,
                          }}
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          id="ad-feedback__submit" 
                          className="ad-feedback__submit button"
                          style={{
                            padding: '8px 16px',
                            border: 'none',
                            borderRadius: '4px',
                            backgroundColor: '#CC0000',
                            color: '#fff',
                            cursor: 'pointer',
                            fontFamily: CNN_FONT,
                          }}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  /* Success Message */
                  <div className="ad-feedback__submitted">
                    <div className="ad-feedback__submitted__checkmark">✓</div>
                    <div className="ad-feedback__submitted__title">Thank You!</div>
                    <div className="ad-feedback__submitted__message">
                      Your effort and contribution in providing this feedback is much
                      appreciated.
                    </div>
                    <div 
                      id="ad-feedback__submitted__close" 
                      className="ad-feedback__submitted__close"
                      onClick={() => setShowFeedbackModal(false)}
                      style={{
                        marginTop: '20px',
                        padding: '8px 16px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        backgroundColor: '#fff',
                        cursor: 'pointer',
                        fontFamily: CNN_FONT,
                      }}
                    >
                      Close
                    </div>
                    <div 
                      className="ad-feedback__submitted__close-icon" 
                      id="ad-feedback__submitted__close-icon"
                      style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                        fontSize: '20px',
                      }}
                    >
                      ✕
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CNN Sport Banner with Advertisement - Exact Structure */}
          <div 
            data-uri="cms.cnn.com/_components/ad-slot-header/instances/cnn-v1@published" 
            className="ad-slot-header__wrapper" 
            style={{ height: `${adSlotHeight}px` }}
          >
            <div className="ad-slot-header" style={{ position: 'fixed' }}>
              <div className="ad-slot-header__container adSlotHeaderContainer">
                <div 
                  data-uri="cms.cnn.com/_components/ad-slot/instances/cnn-v1@published" 
                  className="ad-slot adSlotLoaded" 
                  data-path="header/ad-slot-header[0]/items" 
                  data-desktop-slot-id="ad_bnr_atf_01" 
                  data-mobile-slot-id="ad_bnr_atf_01" 
                  data-ad-label-text="Advertisement" 
                  data-unselectable="true" 
                  data-ad-slot-rendered-size="970x90"
                >
                  <div id="ad_bnr_atf_01" className="ad adfuel-rendered" style={{}}>
                    <div id="google_ads_iframe_/8663477/CNNi/homepage/landing_1__container__" style={{ border: '0pt none' }}>
                      <iframe 
                        id="google_ads_iframe_/8663477/CNNi/homepage/landing_1" 
                        name="google_ads_iframe_/8663477/CNNi/homepage/landing_1" 
                        title="3rd party ad content" 
                        width={currentAdSize.width}
                        height={currentAdSize.height}
                        scrolling="no" 
                        marginWidth={0}
                        marginHeight={0} 
                        frameBorder="0" 
                        aria-label="Advertisement" 
                        tabIndex={0}
                        style={{ border: '0px', verticalAlign: 'bottom' }}
                      />
                    </div>
                  </div>
                  <div className="ad-slot__feedback ad-feedback-link-container" style={{ width: `${currentAdSize.width}px` }}>
                    <div className="ad-slot__ad-label" data-ad-label-text="Advertisement"></div>
                    <div data-ad-type="DISPLAY" data-ad-identifier="ad_bnr_atf_01" className="ad-feedback-link">
                      <div className="ad-feedback-link__label">Ad Feedback</div>
                    </div>
                  </div>
                  <iframe className="resizeListenerIframe" src="about:blank" tabIndex={-1} frameBorder="0" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>

          {/* CNN Navigation Bar - Exact Structure */}
          <nav 
            data-uri="cms.cnn.com/_components/header/instances/cnn-v2@published" 
            id="pageHeader" 
            data-editable="settings" 
            className="header cnn-app-display-none" 
            data-analytics-aggregate-events="true"
          >
            <div className="header__inner header__inner--subscription">
              <div className="header__subnav-mount">
                <div className="header__container">
                  <div className="header__left">
                    
                    {/* Hamburger Menu Icon - CNN exact SVG */}
                    <button 
                      id="headerMenuIcon"
                      className="header__menu-icon" 
                      aria-label="Open Menu Icon"
                      onClick={handleClick}
                      onTouchEnd={handleTouchEnd}
                      onPointerDown={handlePointerDown}
                      type="button"
                      data-testid="mobile-menu-button"
                      data-zjs="click"
                      data-zjs-component_id="header__menu-icon"
                      data-zjs-component_text="Open Menu Icon"
                      data-zjs-component_type="icon"
                      data-zjs-container_id="cms.cnn.com/_components/header/instances/cnn-v2@published"
                      data-zjs-container_type="navigation"
                      data-zjs-destination_url=""
                      data-zjs-page_type="section"
                      data-zjs-page_variant="landing_homepage"
                      data-zjs-navigation-type="main"
                      data-zjs-navigation-location="header"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#000000',
                        cursor: 'pointer',
                        padding: '0',
                        marginRight: '12px',
                      }}
                    >
                      <svg 
                        className="header__menu-icon-svg" 
                        width="28" 
                        height="28" 
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

                    {/* Close Menu Icon - CNN exact SVG */}
                    <button 
                      id="headerCloseIcon"
                      className="header__close-icon" 
                      aria-label="Close Menu Icon"
                      onClick={handleClick}
                      onTouchEnd={handleTouchEnd}
                      onPointerDown={handlePointerDown}
                      type="button"
                      style={{
                        display: isMobileMenuOpen ? 'flex' : 'none',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '28px',
                        height: '28px',
                        backgroundColor: 'transparent',
                        border: 'none',
                        color: '#000000',
                        cursor: 'pointer',
                        padding: '0',
                        marginRight: '12px',
                      }}
                    >
                      <svg 
                        className="header__close-icon-svg" 
                        role="img" 
                        width="64" 
                        height="64" 
                        viewBox="0 0 64 64" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path 
                          d="M29.1,32L10.6,50.6c-0.8,0.8-0.8,2.1,0,2.9c0.8,0.8,2.1,0.8,2.9,0L32,34.9l18.5,18.5c0.8,0.8,2.1,0.8,2.9,0c0.8-0.8,0.8-2.1,0-2.9L34.9,32l18.5-18.5c0.8-0.8,0.8-2.1,0-2.9s-2.1-0.8-2.9,0L32,29.1L13.5,10.6c-0.8-0.8-2.1-0.8-2.9,0c-0.8,0.8-0.8,2.1,0,2.9L29.1,32z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>

                    {/* CNN-style Logo */}
                    <div className="brand-logo" data-editable="settings">
                      <Link 
                        className="brand-logo__logo-link" 
                        href="/" 
                        title="TG Calabria logo"
                        data-zjs="click"
                        data-zjs-component_id="/"
                        data-zjs-component_text="Main Logo"
                        data-zjs-component_type="icon"
                        data-zjs-container_id=""
                        data-zjs-container_type="navigation"
                        data-zjs-destination_url="/"
                        data-zjs-page_type="section"
                        data-zjs-page_variant="landing_homepage"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          textDecoration: 'none',
                        }}
                      >
                        <span className="brand-logo__logo">
                          {/* CNN-style SVG logo adapted for TG Calabria */}
                          <svg 
                            className="brand-logo__icon" 
                            width="46" 
                            height="22" 
                            viewBox="0 0 46 22" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path 
                              fillRule="evenodd" 
                              clipRule="evenodd" 
                              d="M6.10447 11.0001C6.10447 8.531 8.10642 6.52954 10.5752 6.52954H13.9675V3.99665H10.5476C6.68578 3.99665 3.5437 7.13824 3.5437 11.0003C3.5437 14.8619 6.68578 18.0039 10.5476 18.0039L17.1326 18.0037C17.5009 18.0037 17.797 17.6415 17.797 17.3414V4.36936C17.797 3.65427 18.2455 3.05144 18.9127 2.86949C19.482 2.71444 20.2803 2.87169 20.8136 3.77851C20.8386 3.82033 22.4563 6.60902 24.922 10.8592C26.8569 14.1962 28.8589 17.6469 28.8951 17.7083C29.102 18.0599 29.3861 18.2262 29.6561 18.1529C29.8261 18.1067 30.0254 17.9421 30.0254 17.6303V4.36936C30.0256 3.65329 30.4725 3.05021 31.1372 2.869C31.7028 2.71517 32.4971 2.87291 33.0303 3.77851C33.054 3.81813 34.4842 6.28449 36.8376 10.3412C38.9187 13.9289 41.0706 17.6391 41.1112 17.708C41.3184 18.0599 41.603 18.2262 41.8725 18.1529C42.0425 18.1067 42.2418 17.9421 42.2418 17.6305V0.450564H39.703V10.679C39.703 10.679 35.4619 3.3723 35.267 3.04141C32.5744 -1.53207 27.4866 0.358121 27.4866 4.29526V10.679C27.4866 10.679 23.2455 3.3723 23.0506 3.04141C20.358 -1.53207 15.2705 0.358121 15.2702 4.29526V14.7582C15.2715 15.1387 14.9853 15.4703 14.5689 15.4708H10.5752C8.10642 15.4708 6.10447 13.4691 6.10447 11.0001Z"
                              fill="#CC0000"
                            />
                            <path 
                              fillRule="evenodd" 
                              clipRule="evenodd" 
                              d="M43.2542 0.450562V17.6305C43.2542 18.3456 42.8057 18.9487 42.1385 19.1306C42.0158 19.1639 41.8825 19.183 41.7433 19.183C41.2371 19.183 40.6563 18.9328 40.2373 18.2216C40.2148 18.1834 38.5294 15.2776 35.961 10.8494C34.1077 7.65523 32.1919 4.35248 32.1564 4.29208C31.9495 3.94089 31.6683 3.7741 31.4027 3.84649C31.2347 3.89247 31.0378 4.05706 31.0378 4.3696V17.6305C31.0378 18.3458 30.5893 18.9487 29.9219 19.1306C29.3526 19.2854 28.5546 19.1284 28.0209 18.2216C27.9994 18.1849 26.4323 15.484 24.0449 11.3674C22.0449 7.92033 19.9772 4.35542 19.94 4.29208C19.7326 3.94016 19.448 3.77361 19.1787 3.84698C19.0085 3.89345 18.8099 4.05803 18.8099 4.36936L18.8094 17.3414C18.8094 18.2341 18.0256 19.0169 17.132 19.0169H10.547C6.12642 19.0169 2.5302 15.4207 2.5302 11.0003C2.5302 6.57967 6.12642 2.9832 10.5497 2.9832H13.9669V0.450562H10.5497C4.72339 0.450562 0 5.17371 0 11.0003C0 16.8264 4.72339 21.5495 10.5497 21.5495H17.1988C19.726 21.5513 21.3514 20.0702 21.3487 17.3385V11.3214C21.3487 11.3214 25.5893 18.6278 25.7845 18.9587C28.477 23.5322 33.5651 21.642 33.5651 17.7048V11.3214C33.5651 11.3214 37.8062 18.6278 38.0006 18.9587C40.693 23.5322 45.781 21.642 45.7815 17.7048V0.450562H43.2542Z"
                              fill="#CC0000"
                            />
                          </svg>
                          <span 
                            style={{
                              color: '#ffffff',
                              fontSize: '14px',
                              fontWeight: '900',
                              letterSpacing: '0.5px',
                              marginLeft: '8px',
                            }}
                          >
                            CALABRIA
                          </span>
                        </span>
                      </Link>
                    </div>

                    {/* Main Navigation */}
                    <nav className="header__nav" style={{ visibility: 'visible' }}>
                      <div className="header__nav-container">
                        {/* Visible Navigation Items - CNN exact structure */}
                        {visibleItems.map((item) => {
                          const displayName = language === "it" ? item.nameIt : item.nameEn;
                          return (
                            <div key={item.href} className="header__nav-item" style={{ display: 'block' }}>
                              <a
                                className="header__nav-item-link"
                                href={item.href}
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
                                data-zjs-navigation-location="header"
                              >
                                {displayName}
                              </a>
                            </div>
                          );
                        })}

                        {/* More Dropdown - CNN exact structure */}
                        <div className="header__nav-more" style={{ display: 'block' }}>
                          <button 
                            id="moreDropdown" 
                            className="header__nav-item-link header__nav-more-link header__nav-button"
                            onClick={() => setIsMoreOpen(!isMoreOpen)}
                          >
                            <span className="header__nav-more--toggle-caret header__nav-more--toggle-caret-down">
                              More
                            </span>
                          </button>
                          <div className="header__nav-item-dropdown">
                            <div className="header__nav-item-dropdown-inner">
                              {moreItems.map((item) => {
                                const displayName = language === "it" ? item.nameIt : item.nameEn;
                                return (
                                  <a key={item.href} className="header__nav-item-dropdown-item" href={item.href} style={{ display: 'block' }}>
                                    {displayName}
                                  </a>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </nav>
                  </div>

                  {/* Right Side Actions - CNN exact structure */}
                  <div className="header__right header__right--default header__right--international" style={{ visibility: 'visible' }}>
                    <a className="header__video-link header__video-link-desktop" href="/watch">
                      Watch
                    </a>
                    <a className="header__audio-link header__audio-link-desktop header__audio-link--no-margin" href="/audio">
                      Listen
                    </a>
                    <a className="header__live-tv-link header__live-tv-link-desktop header__live-tv-link--hidden" href="/live-tv" style={{ display: 'none' }}>
                      Live TV
                    </a>
                    <button id="headerSearchIcon" className="header__search-icon" aria-label="Search Icon">
                      <svg className="header__search-icon-svg" role="img" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="M55.3,51.89,42.46,39a19.22,19.22,0,1,0-3.38,3.43L51.9,55.29a2.38,2.38,0,0,0,3.4,0A2.42,2.42,0,0,0,55.3,51.89ZM11.2,27.28a16,16,0,1,1,16,16.07A16.07,16.07,0,0,1,11.2,27.28Z"></path>
                      </svg>
                    </button>
                    <button id="headerSubscribeButton" className="header__subscribe-button subscribe-button subscribe-button--hide" data-source="sub_web_nav" aria-haspopup="true" aria-expanded="false" role="link" aria-label="Subscribe Button" style={{ display: 'none' }}>
                      Subscribe
                    </button>
                    <div id="desktop-header-account-nav" className="header__user-account-nav-icon header__user-account-nav-desktop">
                      <nav className="user-account-nav user-account-nav--subscriptions user-account-nav--unauth" data-uri="cms.cnn.com/_components/user-account-nav/instances/user-account-nav@published" data-editable="settings" data-one-tap-enabled="true" data-one-tap-enabled-mw="false" aria-label="User Account Nav" data-avatar-enabled="false" data-follow-tooltip-enabled="true" tabIndex={0} style={{ visibility: 'visible' }}>
                        <div className="user-account-nav__icons">
                          <button className="user-account-nav__icon-button user-account-nav__icon-button--auth userAccountButton show" aria-haspopup="true" aria-expanded="false" aria-label="User Account Nav Button">
                            <svg className="icon-ui-avatar-default" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-label="User Avatar" role="img">
                              <path d="M12 20.674a8.654 8.654 0 01-6.483-2.92c.168-.397.523-.758 1.067-1.076 1.334-.782 3.268-1.23 5.305-1.23 2.027 0 3.955.445 5.288 1.22.628.365.998.787 1.125 1.283A8.649 8.649 0 0112 20.674m1.521-7.203c-3.033 1.496-6.04-1.51-4.544-4.543a2.831 2.831 0 011.282-1.282c3.032-1.491 6.035 1.512 4.543 4.543a2.833 2.833 0 01-1.28 1.282m1.69-9.564c2.334.85 4.161 2.752 4.958 5.106.974 2.873.47 5.65-.941 7.773-.307-.486-.765-.912-1.382-1.27-.912-.53-2.054-.922-3.303-1.155a4.642 4.642 0 001.89-4.755 4.567 4.567 0 00-3.745-3.62 4.648 4.648 0 00-5.442 4.574c0 1.571.787 2.96 1.986 3.8-1.258.235-2.407.63-3.323 1.167-.536.314-.953.674-1.256 1.076A8.617 8.617 0 013.326 12c0-5.821 5.765-10.322 11.885-8.093m.112-1.368A10.052 10.052 0 002.539 15.321a9.611 9.611 0 006.138 6.14A10.052 10.052 0 0021.461 8.679a9.611 9.611 0 00-6.138-6.14"></path>
                            </svg>
                          </button>
                        </div>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Mobile Menu */}
          <div
            id="mobile-menu"
            className="cnn-mobile-menu"
            data-open={isMobileMenuOpen ? "true" : "false"}
            style={{
              position: 'fixed',
              top: '56px',
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#ffffff',
              borderTop: '1px solid #e6e6e6',
              zIndex: 40,
              overflowY: 'auto',
              fontFamily: CNN_FONT,
              transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(-100%)',
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
              <div style={{ padding: '16px' }}>
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

                {/* Auth Section */}
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
                        {t("nav.signIn") || "Sign In"}
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
        </div>
      </header>
      
      {/* Spacer to prevent content overlap */}
      <div style={{ height: '56px' }} />
    </>
  );
}
