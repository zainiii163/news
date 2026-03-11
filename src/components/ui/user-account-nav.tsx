"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";

export function UserAccountNav() {
  const { isAuthenticated, isLoading, user } = useAuth();
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

  if (isLoading) {
    return (
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: '#f0f0f0',
        animation: 'pulse 1.5s ease-in-out infinite',
      }} />
    );
  }

  return (
    <nav 
      className="user-account-nav user-account-nav--subscriptions user-account-nav--unauth"
      aria-label="User Account Nav"
      data-avatar-enabled="false"
      data-follow-tooltip-enabled="true"
      style={{
        visibility: 'visible',
      }}
    >
      <div className="user-account-nav__icons" style={{ display: 'flex', alignItems: 'center' }}>
        {isAuthenticated ? (
          /* Authenticated User Menu */
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              className="user-account-nav__icon-button user-account-nav__icon-button--auth userAccountButton show"
              aria-haspopup="true"
              aria-expanded={isOpen}
              aria-label="User Account Nav Button"
              onClick={() => setIsOpen(prev => !prev)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#f0f0f0',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e: React.MouseEvent) => (e.currentTarget as HTMLElement).style.backgroundColor = '#e0e0e0'}
              onMouseLeave={(e: React.MouseEvent) => (e.currentTarget as HTMLElement).style.backgroundColor = '#f0f0f0'}
            >
              {/* User Avatar Icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#666666" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 20.674a8.654 8.654 0 01-6.483-2.92c.168-.397.523-.758 1.067-1.076 1.334-.782 3.268-1.23 5.305-1.23 2.027 0 3.955.445 5.288 1.22.628.365.998.787 1.125 1.283A8.649 8.649 0 0112 20.674m1.521-7.203c-3.033 1.496-6.04-1.51-4.544-4.543a2.831 2.831 0 011.282-1.282c3.032-1.491 6.035 1.512 4.543 4.543a2.833 2.833 0 01-1.281 1.282M12 3.326c-4.823 0-8.734 3.91-8.734 8.734 0 4.823 3.91 8.734 8.734 8.734 4.823 0 8.734-3.91 8.734-8.734 0-4.823-3.91-8.734-8.734-8.734"/>
              </svg>
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
                  minWidth: '200px',
                  zIndex: 1000,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                  padding: '8px 0',
                }}
              >
                {/* User Info */}
                <div style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid #e6e6e6',
                  marginBottom: '8px',
                }}>
                  <div style={{
                    fontFamily: CNN_FONT,
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#000000',
                    marginBottom: '2px',
                  }}>
                    {user?.name || 'User'}
                  </div>
                  <div style={{
                    fontFamily: CNN_FONT,
                    fontSize: '12px',
                    color: '#666666',
                  }}>
                    {user?.email || 'user@example.com'}
                  </div>
                </div>

                {/* Menu Items */}
                <a
                  href="/profile"
                  style={{
                    display: 'block',
                    padding: '10px 16px',
                    fontFamily: CNN_FONT,
                    fontSize: '14px',
                    color: '#000000',
                    textDecoration: 'none',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e: React.MouseEvent) => (e.currentTarget as HTMLElement).style.backgroundColor = '#f5f5f5'}
                  onMouseLeave={(e: React.MouseEvent) => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
                >
                  My Profile
                </a>
                
                <a
                  href="/settings"
                  style={{
                    display: 'block',
                    padding: '10px 16px',
                    fontFamily: CNN_FONT,
                    fontSize: '14px',
                    color: '#000000',
                    textDecoration: 'none',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e: React.MouseEvent) => (e.currentTarget as HTMLElement).style.backgroundColor = '#f5f5f5'}
                  onMouseLeave={(e: React.MouseEvent) => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
                >
                  Settings
                </a>

                <a
                  href="/saved"
                  style={{
                    display: 'block',
                    padding: '10px 16px',
                    fontFamily: CNN_FONT,
                    fontSize: '14px',
                    color: '#000000',
                    textDecoration: 'none',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e: React.MouseEvent) => (e.currentTarget as HTMLElement).style.backgroundColor = '#f5f5f5'}
                  onMouseLeave={(e: React.MouseEvent) => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
                >
                  Saved Articles
                </a>

                <div style={{
                  height: '1px',
                  backgroundColor: '#e6e6e6',
                  margin: '8px 0',
                }} />

                <a
                  href="/newsletter"
                  style={{
                    display: 'block',
                    padding: '10px 16px',
                    fontFamily: CNN_FONT,
                    fontSize: '14px',
                    color: '#000000',
                    textDecoration: 'none',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e: React.MouseEvent) => (e.currentTarget as HTMLElement).style.backgroundColor = '#f5f5f5'}
                  onMouseLeave={(e: React.MouseEvent) => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
                >
                  Newsletter Preferences
                </a>

                <div style={{
                  height: '1px',
                  backgroundColor: '#e6e6e6',
                  margin: '8px 0',
                }} />

                <button
                  onClick={() => {
                    // Handle logout
                    window.location.href = '/logout';
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '10px 16px',
                    fontFamily: CNN_FONT,
                    fontSize: '14px',
                    color: '#CC0000',
                    backgroundColor: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e: React.MouseEvent) => (e.currentTarget as HTMLElement).style.backgroundColor = '#f5f5f5'}
                  onMouseLeave={(e: React.MouseEvent) => (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Unauthenticated User */
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <a
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
              onMouseEnter={(e: React.MouseEvent) => (e.currentTarget as HTMLElement).style.color = '#CC0000'}
              onMouseLeave={(e: React.MouseEvent) => (e.currentTarget as HTMLElement).style.color = '#000000'}
            >
              Register
            </a>
            
            <a
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
              onMouseEnter={(e: React.MouseEvent) => (e.currentTarget as HTMLElement).style.backgroundColor = '#B30000'}
              onMouseLeave={(e: React.MouseEvent) => (e.currentTarget as HTMLElement).style.backgroundColor = '#CC0000'}
            >
              Sign In
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
