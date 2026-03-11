"use client";

import { useState, useEffect } from "react";

// CNN Advertisement Configuration - Exact CNN values
const CNN_AD_CONFIG = {
  HEIGHT: 276,
  NAV_HEIGHT: 56,
  WRAPPER_HEIGHT: 332,
  WRAPPER_TOP: -276,
  BACKGROUND_COLOR: '#000000',
  BORDER_COLOR: '#333333',
  Z_INDEX: 100,
};

export function CNNAdvertisementSection() {
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [currentAdSize, setCurrentAdSize] = useState({ width: 970, height: 90 });

  // Simulate Ad Loading - CNN behavior
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAdLoaded(true);
    }, 1500); // Simulate ad load time
    
    return () => clearTimeout(timer);
  }, []);

  // Detect ad size based on viewport
  useEffect(() => {
    const detectAdSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setCurrentAdSize({ width: 320, height: 50 });
      } else {
        setCurrentAdSize({ width: 970, height: 90 });
      }
    };
    
    detectAdSize();
    window.addEventListener('resize', detectAdSize);
    
    return () => window.removeEventListener('resize', detectAdSize);
  }, []);

  return (
    <div 
      className="cnn-advertisement-wrapper"
      style={{
        position: 'relative',
        height: `${CNN_AD_CONFIG.HEIGHT}px`,
        backgroundColor: CNN_AD_CONFIG.BACKGROUND_COLOR,
        borderBottom: `1px solid ${CNN_AD_CONFIG.BORDER_COLOR}`,
      }}
    >
      <div 
        className="cnn-advertisement-container"
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px 0',
          height: '100%',
        }}
      >
        {/* CNN Advertisement Slot */}
        <div 
          className="cnn-ad-slot"
          style={{
            position: 'relative',
            background: '#1a1a1a',
            border: '1px solid #333333',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: `${currentAdSize.width}px`,
            height: `${currentAdSize.height}px`,
          }}
        >
          {isAdLoaded ? (
            <>
              {/* Ad Content Placeholder */}
              <div 
                className="cnn-ad-content"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(45deg, #333 25%, #444 25%, #444 50%, #333 50%, #333 75%, #444 75%, #444)',
                  backgroundSize: '20px 20px',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '500',
                  fontFamily: 'CNN, "Helvetica Neue", Helvetica, Arial, sans-serif',
                }}
              >
                Advertisement {currentAdSize.width}x{currentAdSize.height}
              </div>
              
              {/* Ad Feedback Link */}
              <div 
                className="cnn-ad-feedback"
                style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  color: '#ffffff',
                  fontSize: '10px',
                  padding: '2px 6px',
                  cursor: 'pointer',
                  fontFamily: 'CNN, "Helvetica Neue", Helvetica, Arial, sans-serif',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.9)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)')}
              >
                Ad Feedback
              </div>
            </>
          ) : (
            /* Loading State */
            <div 
              className="cnn-ad-loading"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                color: '#666666',
                fontSize: '12px',
                fontFamily: 'CNN, "Helvetica Neue", Helvetica, Arial, sans-serif',
              }}
            >
              Loading Ad...
            </div>
          )}
        </div>
        
        {/* Ad Label */}
        <div 
          className="cnn-ad-label"
          style={{
            position: 'absolute',
            top: '8px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: '#ffffff',
            fontSize: '10px',
            padding: '2px 8px',
            borderRadius: '2px',
            fontFamily: 'CNN, "Helvetica Neue", Helvetica, Arial, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Advertisement
        </div>
      </div>
    </div>
  );
}
