"use client";

import { CNNHeader } from "@/components/ui/cnn-header";

export default function TestHeaderPage() {
  return (
    <div style={{ minHeight: '200vh', background: '#f5f5f5' }}>
      <CNNHeader />
      
      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '20px', color: '#333' }}>
          CNN-Style Header Test Page
        </h1>
        
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h2 style={{ color: '#CC0000', marginBottom: '10px' }}>Features Implemented:</h2>
          <ul style={{ lineHeight: '1.6' }}>
            <li>Sticky header behavior (scroll down to see it in action)</li>
            <li>Dynamic advertisement sizing (970x250 desktop, 320x50 mobile)</li>
            <li>Advertisement loading animation</li>
            <li>Ad feedback modal with emoji ratings</li>
            <li>CNN-style navigation with More dropdown</li>
            <li>Mobile responsive hamburger menu</li>
            <li>Smooth transitions and animations</li>
            <li>CNN red accent color (#CC0000)</li>
          </ul>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h2 style={{ color: '#CC0000', marginBottom: '10px' }}>How to Test:</h2>
          <ol style={{ lineHeight: '1.6' }}>
            <li><strong>Scroll Behavior:</strong> Scroll down - the header should become sticky and the ad should slide up</li>
            <li><strong>Ad Feedback:</strong> Click Ad Feedback below the advertisement to open the modal</li>
            <li><strong>Navigation:</strong> Try the More dropdown for additional menu items</li>
            <li><strong>Mobile Menu:</strong> Resize window to mobile size and click the hamburger menu</li>
            <li><strong>Responsive:</strong> Resize browser to see ad size changes</li>
          </ol>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h2 style={{ color: '#CC0000', marginBottom: '10px' }}>Advertisement Sizes:</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
              <strong>Desktop (&gt;1280px):</strong> 970x250
            </div>
            <div style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
              <strong>Tablet (992-1280px):</strong> 728x250
            </div>
            <div style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
              <strong>Mobile (&lt;768px):</strong> 320x50
            </div>
          </div>
        </div>

        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h2 style={{ color: '#CC0000', marginBottom: '10px' }}>Technical Details:</h2>
          <ul style={{ lineHeight: '1.6' }}>
            <li><strong>Sticky Threshold:</strong> 100px scroll</li>
            <li><strong>Ad Load Time:</strong> 1.5 seconds simulation</li>
            <li><strong>Animation:</strong> CSS cubic-bezier(0.4, 0, 0.2, 1)</li>
            <li><strong>Z-index:</strong> Header (1000), Ad (100), Modal (9999)</li>
          </ul>
        </div>

        {/* Add more content to enable scrolling */}
        <div style={{ height: '100vh', background: 'white', padding: '20px', borderRadius: '8px', marginTop: '40px' }}>
          <h2 style={{ color: '#CC0000' }}>Scroll Test Area</h2>
          <p>Keep scrolling to see the sticky header behavior in action. The advertisement should slide up and the navigation should remain sticky at the top.</p>
          <div style={{ height: '80vh', background: 'linear-gradient(to bottom, #f0f0f0, #e0e0e0)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ fontSize: '1.2rem', color: '#666' }}>Scroll down to test sticky behavior</p>
          </div>
        </div>
      </div>
    </div>
  );
}
