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
            title="TG Calabria logo"
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
      </div>
    </>
  );
}
