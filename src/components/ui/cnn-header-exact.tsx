"use client";

import { useState, useEffect } from "react";
import { CNNHeaderClean } from "./cnn-header-clean";
import { CNNNavbar } from "./cnn-navbar";
import { CNNHeaderRight } from "./cnn-header-right";
import { CNNAdvertisementSection } from "./cnn-advertisement-section";

// CNN Header Configuration - Exact CNN values
const CNN_HEADER_CONFIG = {
  AD_HEIGHT: 276,
  NAV_HEIGHT: 56,
  TOTAL_HEIGHT: 332,
  STICKY_OFFSET: 0,
  Z_INDEX: 1000,
  BACKGROUND_COLOR: '#ffffff',
  BORDER_COLOR: '#e0e0e0',
  SHADOW: '0 2px 4px rgba(0, 0, 0, 0.1)',
  TRANSITION: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
};

export function CNNHeaderExact() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // CNN Sticky Header Logic - Exact CNN behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
      
      // Show/hide header based on scroll direction
      if (scrollDirection === 'up' && currentScrollY > 100) {
        setIsHeaderSticky(true);
      } else if (scrollDirection === 'down' && currentScrollY > 100) {
        setIsHeaderSticky(false);
      }
      
      // Add shadow when scrolled
      setIsScrolled(currentScrollY > 10);
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <>
      {/* CNN Complete Header Wrapper - Exact Structure */}
      <div 
        className="cnn-header-wrapper-outer"
        style={{
          position: 'fixed',
          top: isHeaderSticky ? 0 : `-${CNN_HEADER_CONFIG.TOTAL_HEIGHT}px`,
          left: 0,
          right: 0,
          height: `${CNN_HEADER_CONFIG.TOTAL_HEIGHT}px`,
          zIndex: CNN_HEADER_CONFIG.Z_INDEX,
          backgroundColor: CNN_HEADER_CONFIG.BACKGROUND_COLOR,
          transition: CNN_HEADER_CONFIG.TRANSITION,
          transform: isHeaderSticky ? 'translateY(0)' : 'translateY(-100%)',
        }}
      >
        {/* CNN Advertisement Section */}
        <CNNAdvertisementSection />

        {/* CNN Navigation Bar */}
        <header 
          className={`cnn-header-exact ${isScrolled ? 'scrolled' : ''} ${isHeaderSticky ? 'visible' : 'hidden'}`}
          style={{
            position: 'relative',
            height: `${CNN_HEADER_CONFIG.NAV_HEIGHT}px`,
            backgroundColor: CNN_HEADER_CONFIG.BACKGROUND_COLOR,
            borderBottom: isScrolled ? `1px solid ${CNN_HEADER_CONFIG.BORDER_COLOR}` : 'none',
            boxShadow: isScrolled ? CNN_HEADER_CONFIG.SHADOW : 'none',
          }}
        >
          <div 
            className="cnn-header-container"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 20px',
              height: '100%',
              maxWidth: '1200px',
              margin: '0 auto',
            }}
          >
            {/* Left Section - Logo */}
            <div className="cnn-header-left" style={{ flexShrink: 0 }}>
              <CNNHeaderClean />
            </div>

            {/* Center Section - Navigation */}
            <div className="cnn-header-center" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <CNNNavbar />
            </div>

            {/* Right Section - Watch, Listen, Search, Sign In */}
            <div className="cnn-header-right" style={{ flexShrink: 0 }}>
              <CNNHeaderRight />
            </div>
          </div>
        </header>
      </div>

      {/* Spacer to prevent content jump */}
      <div 
        className="cnn-header-spacer"
        style={{
          height: `${CNN_HEADER_CONFIG.TOTAL_HEIGHT}px`,
          width: '100%',
        }}
      />
    </>
  );
}
