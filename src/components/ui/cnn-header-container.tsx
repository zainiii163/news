"use client";

import { useState, useEffect } from "react";
import { CNNHeaderClean } from "./cnn-header-clean";
import { CNNNavbarWrapper } from "./cnn-navbar-wrapper";
import { CNNHeaderRight } from "./cnn-header-right";

export function CNNHeaderContainer() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className="cnn-header-container"
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: '#ffffff',
        boxShadow: isScrolled 
          ? '0 2px 8px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08)' 
          : 'none',
        transition: 'box-shadow 0.2s ease',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      <div 
        className="header__container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          height: '56px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <CNNHeaderClean />
        <CNNNavbarWrapper />
        <CNNHeaderRight />
      </div>
    </div>
  );
}
