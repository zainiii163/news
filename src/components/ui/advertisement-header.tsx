"use client";

import { useState, useEffect } from "react";

export function AdvertisementHeader() {
  const [isMounted, setIsMounted] = useState(false);
  const [adDimensions, setAdDimensions] = useState({ width: 970, height: 250 });
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [technicalIssues, setTechnicalIssues] = useState(false);
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Simulate dynamic ad dimensions - in real app this would come from API
    const adSizes = [
      { width: 970, height: 250 }, // Large banner
      { width: 728, height: 90 },  // Standard leaderboard
      { width: 300, height: 250 }, // Medium rectangle
      { width: 320, height: 50 },  // Mobile banner
    ];
    
    // Randomly select ad size for demo - in production this would be controlled by ad server
    const timer = setTimeout(() => {
      const randomAd = adSizes[Math.floor(Math.random() * adSizes.length)];
      setAdDimensions(randomAd);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  // CNN-style font family
  const CNN_FONT = '"Helvetica Neue", Helvetica, Arial, sans-serif';

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate feedback submission
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setShowFeedbackModal(false);
      setFeedbackSubmitted(false);
      setTechnicalIssues(false);
      setSelectedIssues([]);
      setComment("");
    }, 2000);
  };

  const handleIssueToggle = (issue: string) => {
    setSelectedIssues(prev => 
      prev.includes(issue) 
        ? prev.filter(i => i !== issue)
        : [...prev, issue]
    );
  };

  return (
    <div style={{ fontFamily: CNN_FONT }}>
      {/* CNN-Style Header Wrapper */}
      <div 
        className="header__wrapper-outer"
        style={{
          height: '316px',
          top: '-276px',
          marginBottom: '0px',
          position: 'sticky',
        }}
      >
        <div className="header__wrapper-inner" data-editable="header">
          {/* Ad Feedback Modal */}
          {showFeedbackModal && (
            <div 
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
                  <form onSubmit={handleSubmitFeedback}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
                        TG Calabria values your feedback
                      </h3>
                      <button
                        type="button"
                        onClick={() => setShowFeedbackModal(false)}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '20px',
                          cursor: 'pointer',
                          padding: '4px',
                        }}
                      >
                        ✕
                      </button>
                    </div>

                    {/* Question 1: Relevance */}
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ marginBottom: '12px', fontSize: '14px' }}>
                        1. How relevant is this ad to you?
                      </div>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                        {['Bad', 'Not Good', 'Okay', 'Good', 'Great'].map((rating, index) => (
                          <label key={rating} style={{ textAlign: 'center', cursor: 'pointer' }}>
                            <input
                              type="radio"
                              name="relevance"
                              value={index + 1}
                              style={{ display: 'none' }}
                              required
                            />
                            <div
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                border: '2px solid #ddd',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '20px',
                              }}
                            >
                              {index === 0 && '😞'}
                              {index === 1 && '😕'}
                              {index === 2 && '😐'}
                              {index === 3 && '😊'}
                              {index === 4 && '😃'}
                            </div>
                            <div style={{ fontSize: '10px', marginTop: '4px' }}>{rating}</div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Question 2: Technical Issues */}
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ marginBottom: '12px', fontSize: '14px' }}>
                        2. Did you encounter any technical issues?
                      </div>
                      <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={technicalIssues}
                          onChange={(e) => setTechnicalIssues(e.target.checked)}
                          style={{ marginRight: '8px' }}
                        />
                        <span>No</span>
                      </label>
                    </div>

                    {/* Technical Issues Details */}
                    {technicalIssues && (
                      <div style={{ marginBottom: '20px' }}>
                        <div style={{ marginBottom: '12px', fontSize: '14px' }}>
                          Please specify the issues:
                        </div>
                        {[
                          'Ad never loaded',
                          'Ad prevented/slowed the page from loading',
                          'Content moved around while ad loaded',
                          'Ad was repetitive to ads I\'ve seen previously',
                          'Other issues'
                        ].map(issue => (
                          <label key={issue} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: '8px' }}>
                            <input
                              type="checkbox"
                              checked={selectedIssues.includes(issue)}
                              onChange={() => handleIssueToggle(issue)}
                              style={{ marginRight: '8px' }}
                            />
                            <span style={{ fontSize: '13px' }}>{issue}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* Comment */}
                    <div style={{ marginBottom: '20px' }}>
                      <textarea
                        rows={4}
                        maxLength={1000}
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
                        }}
                      />
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => setShowFeedbackModal(false)}
                        style={{
                          padding: '8px 16px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          backgroundColor: '#fff',
                          cursor: 'pointer',
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        style={{
                          padding: '8px 16px',
                          border: 'none',
                          borderRadius: '4px',
                          backgroundColor: '#CC0000',
                          color: '#fff',
                          cursor: 'pointer',
                        }}
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Success Message */
                  <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>
                      Thank You!
                    </div>
                    <div style={{ fontSize: '14px', color: '#666', lineHeight: '1.4' }}>
                      Your effort and contribution in providing this feedback is much appreciated.
                    </div>
                    <button
                      onClick={() => setShowFeedbackModal(false)}
                      style={{
                        marginTop: '20px',
                        padding: '8px 16px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        backgroundColor: '#fff',
                        cursor: 'pointer',
                      }}
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Ad Slot Header */}
          <div 
            className="ad-slot-header__wrapper"
            style={{
              height: '276px',
              position: 'relative',
            }}
          >
            <div 
              className="ad-slot-header"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '276px',
                backgroundColor: '#000000',
                borderBottom: '1px solid #333333',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 100,
              }}
            >
              <div 
                className="ad-slot-header__container"
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {/* Advertisement Container */}
                {isMounted && (
                  <div
                    className="ad-slot adSlotLoaded"
                    data-path="header/ad-slot-header[0]/items"
                    data-desktop-slot-id="ad_bnr_atf_01"
                    data-mobile-slot-id="ad_bnr_atf_01"
                    data-ad-label-text="Advertisement"
                    data-unselectable="true"
                    data-ad-slot-rendered-size={`${adDimensions.width}x${adDimensions.height}`}
                    style={{
                      width: `${adDimensions.width}px`,
                      height: `${adDimensions.height}px`,
                      backgroundColor: '#1a1a1a',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #333333',
                      overflow: 'hidden',
                      color: '#ffffff',
                      fontSize: adDimensions.width > 700 ? '24px' : adDimensions.width > 400 ? '18px' : '14px',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      padding: '10px',
                    }}
                  >
                    {/* Dynamic Ad Content Placeholder */}
                    <div>
                      <div style={{ marginBottom: '8px' }}>
                        {adDimensions.width} x {adDimensions.height}
                      </div>
                      <div style={{ fontSize: '12px', opacity: 0.7 }}>
                        Live Advertisement Space
                      </div>
                    </div>
                  </div>
                )}

                {/* Ad Feedback Link */}
                <div 
                  className="ad-slot__feedback ad-feedback-link-container"
                  style={{
                    width: `${adDimensions.width}px`,
                    marginTop: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div 
                    className="ad-slot__ad-label"
                    data-ad-label-text="Advertisement"
                    style={{
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: '#666666',
                    }}
                  >
                    Advertisement
                  </div>
                  
                  <button
                    data-ad-type="DISPLAY"
                    data-ad-identifier="ad_bnr_atf_01"
                    className="ad-feedback-link"
                    onClick={() => setShowFeedbackModal(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'none',
                      border: 'none',
                      color: '#666666',
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: '2px',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.backgroundColor = '#f5f5f5';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.backgroundColor = 'transparent';
                    }}
                  >
                    <span className="ad-feedback-link__label">Ad Feedback</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
