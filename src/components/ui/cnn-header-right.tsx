"use client";

import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";

// CNN-style font family
const CNN_FONT = '"CNN", "Helvetica Neue", Helvetica, Arial, sans-serif';

export function CNNHeaderRight() {
  const { isAuthenticated } = useAuth();

  return (
    <div 
      className="header__right" 
      style={{ 
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        flexShrink: 0,
      }}
    >
      {/* Watch */}
      <Link
        href="/watch"
        className="header__video-link"
        style={{
          color: '#000000',
          textDecoration: 'none',
          fontSize: '15px',
          fontWeight: '500',
          fontFamily: CNN_FONT,
          transition: 'color 0.15s ease',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#CC0000')}
        onMouseLeave={e => (e.currentTarget.style.color = '#000000')}
      >
        Watch
      </Link>

      {/* Listen */}
      <Link
        href="/audio"
        className="header__audio-link"
        style={{
          color: '#000000',
          textDecoration: 'none',
          fontSize: '15px',
          fontWeight: '500',
          fontFamily: CNN_FONT,
          transition: 'color 0.15s ease',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#CC0000')}
        onMouseLeave={e => (e.currentTarget.style.color = '#000000')}
      >
        Listen
      </Link>

      {/* Search Icon */}
      <button
        className="header__search-icon"
        aria-label="Search Icon"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'transparent',
          border: 'none',
          color: '#000000',
          cursor: 'pointer',
          padding: '8px',
          borderRadius: '6px',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.color = '#CC0000';
          (e.currentTarget as HTMLElement).style.backgroundColor = '#f5f5f5';
          (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.color = '#000000';
          (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
          (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
        }}
      >
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 64 64" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M55.3,51.89,42.46,39a19.22,19.22,0,1,0-3.38,3.43L51.9,55.29a2.38,2.38,0,0,0,3.4,0A2.42,2.42,0,0,0,55.3,51.89ZM11.2,27.28a16,16,0,1,1,16,16.07A16.07,16.07,0,0,1,11.2,27.28Z"
            fill="currentColor"
          />
        </svg>
      </button>

      {/* Subscribe Button */}
      <button
        className="header__subscribe-button"
        aria-haspopup="true"
        aria-expanded="false"
        role="link"
        aria-label="Subscribe Button"
        style={{
          display: isAuthenticated ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#CC0000',
          color: '#ffffff',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '8px',
          fontSize: '15px',
          fontFamily: CNN_FONT,
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 4px rgba(204, 0, 0, 0.2)',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.backgroundColor = '#990000';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 8px rgba(204, 0, 0, 0.3)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.backgroundColor = '#CC0000';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 4px rgba(204, 0, 0, 0.2)';
        }}
      >
        Subscribe
      </button>

      {/* User Account Navigation */}
      <div 
        className="header__user-account-nav-icon"
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {isAuthenticated ? (
          <Link
            href="/profile"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#f0f0f0',
              color: '#000000',
              textDecoration: 'none',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e0e0e0')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
          >
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg" 
              aria-label="User Avatar" 
              role="img"
            >
              <path 
                d="M12 20.674a8.654 8.654 0 01-6.483-2.92c.168-.397.523-.758 1.067-1.076 1.334-.782 3.268-1.23 5.305-1.23 2.027 0 3.955.445 5.288 1.22.628.365.998.787 1.125 1.283A8.649 8.649 0 0112 20.674m1.521-7.203c-3.033 1.496-6.04-1.51-4.544-4.543a2.831 2.831 0 011.282-1.282c3.032-1.491 6.035 1.512 4.543 4.543a2.833 2.833 0 01-1.28 1.282m1.69-9.564c2.334.85 4.161 2.752 4.958 5.106.974 2.873.47 5.65-"
                fill="currentColor"
              />
            </svg>
          </Link>
        ) : (
          <Link
            href="/login"
            style={{
              color: '#000000',
              textDecoration: 'none',
              fontSize: '14px',
              fontFamily: CNN_FONT,
              fontWeight: '500',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#CC0000')}
            onMouseLeave={e => (e.currentTarget.style.color = '#000000')}
          >
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}
