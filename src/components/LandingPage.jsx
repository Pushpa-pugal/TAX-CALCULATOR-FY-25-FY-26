import React from 'react';
import { Shield, Zap, Calculator } from 'lucide-react';
import './LandingPage.css';

const LandingPage = ({ onStart }) => {
  return (
    <div className="landing-container">
      <div className="container landing-content">
        
        {/* Left Side: Copy and CTA */}
        <div className="landing-text-section">
          <div className="badge">
            <Zap size={16} />
            <span>Updated for FY 2025-26</span>
          </div>
          
          <h1 className="landing-headline">
            Find out which tax regime saves you <span className="highlight-text">more money</span> in 5 minutes.
          </h1>
          
          <p className="landing-subheadline text-muted">
            A simple, plain-English calculator for salaried professionals. 
            No finance degree required.
          </p>
          
          <button className="btn btn-primary btn-large cta-button" onClick={onStart}>
            <Calculator size={20} className="cta-icon" />
            Start Calculation
          </button>
          
          <div className="trust-markers">
            <div className="trust-marker">
              <Shield size={20} className="trust-icon" />
              <div>
                <strong>100% Private</strong>
                <p>Runs entirely in your browser. No data is saved or shared.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Mock Preview Card */}
        <div className="landing-visual-section">
          <div className="glass-panel mock-card">
            <div className="mock-card-header">
              <h3>Live Tax Comparison</h3>
              <span className="pulse-indicator"></span>
            </div>
            
            <div className="mock-comparison">
              <div className="mock-column">
                <h4>Old Regime</h4>
                <div className="mock-value blur-text">₹ 1,24,500</div>
              </div>
              <div className="mock-divider"></div>
              <div className="mock-column winner">
                <h4>New Regime</h4>
                <div className="mock-value">₹ 98,200</div>
                <div className="mock-badge">Winner</div>
              </div>
            </div>
            
            <div className="mock-footer">
              <p>You save <strong>₹ 26,300</strong> with the New Regime!</p>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
        </div>
        
      </div>
    </div>
  );
};

export default LandingPage;
