"use client";

import { useState, useRef, useEffect } from "react";

export function AppDownloadDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleOutside);
      return () => document.removeEventListener("mousedown", handleOutside);
    }
  }, [isOpen]);

  // CNN-style font family
  const CNN_FONT = '"Helvetica Neue", Helvetica, Arial, sans-serif';

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Download the TG Calabria App"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontFamily: CNN_FONT,
          fontSize: '13px',
          fontWeight: 400,
          color: '#000000',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          padding: 0,
          transition: 'color 0.15s ease',
        }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#CC0000'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#000000'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
        </svg>
        App
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            backgroundColor: '#ffffff',
            border: '1px solid #e6e6e6',
            borderRadius: '8px',
            minWidth: '280px',
            zIndex: 1000,
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            padding: '16px',
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{
              fontFamily: CNN_FONT,
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#000000',
              marginBottom: '4px',
            }}>
              Download TG Calabria App
            </div>
            <div style={{
              fontFamily: CNN_FONT,
              fontSize: '12px',
              color: '#666666',
            }}>
              Stay connected with breaking news
            </div>
          </div>

          {/* App Store Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Apple App Store */}
            <button
              onClick={() => window.open('#', '_blank')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                backgroundColor: '#000000',
                color: '#ffffff',
                textDecoration: 'none',
                borderRadius: '6px',
                transition: 'background-color 0.15s ease',
                cursor: 'pointer',
                border: 'none',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#333333'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#000000'}
            >
              {/* Apple Logo */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div>
                <div style={{ fontSize: '10px', lineHeight: 1 }}>Download on the</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', lineHeight: 1 }}>App Store</div>
              </div>
            </button>

            {/* Google Play Store */}
            <button
              onClick={() => window.open('#', '_blank')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                backgroundColor: '#000000',
                color: '#ffffff',
                textDecoration: 'none',
                borderRadius: '6px',
                transition: 'background-color 0.15s ease',
                cursor: 'pointer',
                border: 'none',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#333333'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = '#000000'}
            >
              {/* Google Play Logo */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
              </svg>
              <div>
                <div style={{ fontSize: '10px', lineHeight: 1 }}>Get it on</div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', lineHeight: 1 }}>Google Play</div>
              </div>
            </button>
          </div>

          {/* QR Code Section */}
          <div style={{
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: '1px solid #e6e6e6',
            textAlign: 'center',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#f5f5f5',
              margin: '0 auto 8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
              border: '1px solid #ddd',
            }}>
              <div style={{
                fontSize: '10px',
                color: '#666',
                textAlign: 'center',
              }}>
                QR Code
              </div>
            </div>
            <div style={{
              fontFamily: CNN_FONT,
              fontSize: '11px',
              color: '#666666',
            }}>
              Scan to download
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
