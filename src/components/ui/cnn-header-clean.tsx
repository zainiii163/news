"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/providers/LanguageProvider";
import { useAuth } from "@/providers/AuthProvider";
import { usePathname } from "next/navigation";

// CNN-style font family
const CNN_FONT = '"CNN", "Helvetica Neue", Helvetica, Arial, sans-serif';

export function CNNHeaderClean() {
  const { t, language } = useLanguage();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [technicalIssues, setTechnicalIssues] = useState(false);
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [adRelevance, setAdRelevance] = useState("");

  // Set isMounted to true after hydration to avoid hydration mismatch
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

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

  return (
    <>
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
                    ].map((rating, index) => (
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
                        'Ad prevented/slowed the page from loading',
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

      {/* Clean Header without Navigation */}
      <div className="header__left">
        {/* CNN-style Logo */}
        <div className="brand-logo" data-editable="settings">
          <Link 
            className="brand-logo__logo-link" 
            href="/" 
            title="CNN logo"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              textDecoration: 'none',
            }}
          >
            <span className="brand-logo__logo">
              {/* CNN-style SVG logo */}
              <svg 
                className="brand-logo__icon" 
                width="116" 
                height="30" 
                viewBox="0 0 116 30" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <text
                  x="0"
                  y="25"
                  fontFamily="CNN, 'Helvetica Neue', Helvetica, Arial, sans-serif"
                  fontSize="28"
                  fontWeight="900"
                  fill="#000000"
                >
                  CNN
                </text>
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}
