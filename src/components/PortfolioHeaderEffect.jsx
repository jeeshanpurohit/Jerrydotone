import React from "react";

export default function PortfolioHeaderEffect({ onPrev, onNext }) {
  return (
    <div className="sp-portfolio-hero">
      {/* Top Meta Line */}
      <div className="sp-hero-meta-top">
        <div className="sp-hero-eyebrow">
          <span>WELCOME</span>
          <span>TO MY</span>
        </div>
        <div className="sp-hero-emblem" title="Jeeshan Purohit Portfolio">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
            <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
          </svg>
        </div>
      </div>

      {/* Main 3-Layer Split Inversion Typography Stage */}
      <div className="sp-portfolio-stack-stage">
        {/* Flanking Arrow Controls */}
        <button
          className="sp-flank-arrow sp-flank-left"
          onClick={onPrev}
          aria-label="Previous Project"
        >
          ◀
        </button>
        <button
          className="sp-flank-arrow sp-flank-right"
          onClick={onNext}
          aria-label="Next Project"
        >
          ▶
        </button>

        {/* 4 Corner Crosshairs */}
        <span className="sp-grid-cross sp-cross-tl">+</span>
        <span className="sp-grid-cross sp-cross-tr">+</span>
        <span className="sp-grid-cross sp-cross-bl">+</span>
        <span className="sp-grid-cross sp-cross-br">+</span>

        {/* BASE TEXT STACK (Outside the vertical bar) */}
        <div className="sp-text-stack sp-base-stack" aria-hidden="true">
          <div className="sp-stack-line sp-line-1">
            <span className="sp-solid">PORT</span>
            <span className="sp-outline">FOLIO</span>
          </div>
          <div className="sp-stack-line sp-line-2">
            <span className="sp-outline">PORTFOLIO</span>
          </div>
          <div className="sp-stack-line sp-line-3">
            <span className="sp-outline">PORT</span>
            <span className="sp-solid">FOLIO</span>
          </div>
        </div>

        {/* CENTER VERTICAL ORANGE BAR (Clips and Inverts Text Inside) */}
        <div className="sp-center-bar">
          <div className="sp-text-stack sp-inverted-stack" aria-hidden="true">
            <div className="sp-stack-line sp-line-1">
              <span className="sp-solid">PORT</span>
              <span className="sp-outline">FOLIO</span>
            </div>
            <div className="sp-stack-line sp-line-2">
              <span className="sp-outline">PORTFOLIO</span>
            </div>
            <div className="sp-stack-line sp-line-3">
              <span className="sp-outline">PORT</span>
              <span className="sp-solid">FOLIO</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Meta Line */}
      <div className="sp-hero-meta-bottom">
        <span>JEESHAN PUROHIT</span>
        <span>+</span>
        <span>MULTIMEDIA DESIGNER &amp; ART DIRECTOR</span>
      </div>
    </div>
  );
}
