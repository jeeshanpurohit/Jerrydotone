import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { personalInfo, coreMetrics } from "../data/portfolioData";
import { useSound } from "../hooks/useSound";

export function ScrollSpideyHero() {
  const containerRef = useRef(null);
  const visualRef = useRef(null);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [manualReveal, setManualReveal] = useState(null); // optional override via toggle
  const { playHover, playClick } = useSound();
  const rafRef = useRef(null);

  // Track window scroll to calculate unmask progression (0 to 1)
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = containerRef.current ? containerRef.current.offsetHeight : window.innerHeight;
      // Fade out mask over the first 400px of scroll
      const progress = Math.min(Math.max(scrollY / Math.min(heroHeight * 0.65, 400), 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Cursor tracking for spotlight hole and 3D card tilt
  const handleMouseMove = useCallback((e) => {
    if (!visualRef.current) return;
    const rect = visualRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

    // 3D Tilt computation (-8 to 8 deg)
    const tiltX = -((y - 50) / 50) * 8;
    const tiltY = ((x - 50) / 50) * 8;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setCursorPos({ x, y });
      setTilt({ x: tiltX, y: tiltY });
    });
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    playHover();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCursorPos({ x: 50, y: 50 });
    setTilt({ x: 0, y: 0 });
  };

  // Mask reveal math:
  // If manualReveal is set, use it; otherwise scrollProgress drives unmasking.
  const effectiveScrollReveal = manualReveal !== null ? manualReveal : scrollProgress;
  // Spidey opacity fades from 1 -> 0 as user scrolls down
  const spideyOpacity = Math.max(0, 1 - effectiveScrollReveal * 1.15);

  // Radial lens: Cut a transparent circle in the Spidey mask where the mouse is
  const maskStyle = isHovered && effectiveScrollReveal < 0.8
    ? {
        maskImage: `radial-gradient(circle 140px at ${cursorPos.x}% ${cursorPos.y}%, transparent 0%, transparent 40%, rgba(0,0,0,0.8) 75%, black 100%)`,
        WebkitMaskImage: `radial-gradient(circle 140px at ${cursorPos.x}% ${cursorPos.y}%, transparent 0%, transparent 40%, rgba(0,0,0,0.8) 75%, black 100%)`,
        opacity: spideyOpacity,
        transition: "opacity 0.15s ease-out, transform 0.2s ease-out",
      }
    : {
        maskImage: "none",
        WebkitMaskImage: "none",
        opacity: spideyOpacity,
        transition: "opacity 0.25s ease-out, transform 0.2s ease-out",
      };

  const isFullyUnmasked = effectiveScrollReveal > 0.65;

  return (
    <section className="scroll-hero-section" ref={containerRef}>
      {/* Background ambient lighting */}
      <div className="hero-ambient-glow" />
      <div className="hero-web-grid-overlay" />

      <div className="scroll-hero-container">
        {/* Left Column: Text Narrative & Quick Actions */}
        <div className="scroll-hero-narrative">
          <div className="hero-status-pill">
            <span className="hero-status-pulse" />
            <span className="hero-status-code">
              {isFullyUnmasked
                ? "IDENTITY: UNMASKED // LEAD DESIGN TECHNOLOGIST"
                : "SUIT ACTIVE // SCROLL OR HOVER TO UNMASK"}
            </span>
          </div>

          <p className="hero-eyebrow">// YOUR FRIENDLY NEIGHBOURHOOD ENGINEER</p>

          <h1 className="hero-glitch-name">
            JEESHAN<br />
            <span className="hero-accent-word">PUROHIT</span>
            <span className="hero-period">.</span>
          </h1>

          <div className="hero-role-title">
            <span className="hero-role-badge">STAFF TECHNOLOGIST</span>
            <span className="hero-role-sep">//</span>
            <span>UI ARCHITECT &amp; MOTION LEAD</span>
          </div>

          <p className="hero-manifesto-sub">
            {personalInfo.bioHeadline}
          </p>

          {/* Quick CTAs */}
          <div className="hero-cta-cluster">
            <Link
              to="/projects"
              className="btn-hero-primary"
              onMouseEnter={playHover}
              onClick={playClick}
            >
              Explore Projects Matrix →
            </Link>
            <Link
              to="/contact"
              className="btn-hero-ghost"
              onMouseEnter={playHover}
              onClick={playClick}
            >
              Transmit Brief
            </Link>
            <a
              href={personalInfo.resumePdf}
              download="Jeeshan_Purohit_Resume_ATS.pdf"
              className="btn-hero-minimal"
              onMouseEnter={playHover}
              onClick={playClick}
            >
              ↓ Resume (PDF)
            </a>
          </div>

          {/* Key Metrics Quick Bar */}
          <div className="hero-metrics-strip">
            {coreMetrics.map((m, i) => (
              <div key={i} className="hero-metric-cell">
                <span className="hero-metric-number">{m.value}</span>
                <span className="hero-metric-caption">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Interactive Face & Spidey Dual-Layer Visual */}
        <div className="scroll-hero-visual-col">
          <div
            className="spidey-dual-viewport"
            ref={visualRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
              transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            }}
          >
            {/* Tech HUD Frame details */}
            <div className="hud-corner hud-top-left" />
            <div className="hud-corner hud-top-right" />
            <div className="hud-corner hud-bottom-left" />
            <div className="hud-corner hud-bottom-right" />

            <div className="hud-header-bar">
              <span className="hud-label">
                {isFullyUnmasked ? "STATUS: HUMAN ARCHITECT" : "STATUS: SPIDER PERSONA ACTIVE"}
              </span>
              <span className="hud-coords">26.2389° N, 73.0243° E</span>
            </div>

            {/* Visual Canvas containing both registered images */}
            <div className="spidey-image-stage">
              {/* Layer 1: Jeeshan's Face (Base Layer, always underneath) */}
              <img
                src={personalInfo.faceHeroImage}
                alt="Jeeshan Purohit - Face"
                className="spidey-img-face"
                draggable={false}
              />

              {/* Layer 2: Spider-Man Suit Mask (Top Layer, unmasked by scroll & cursor) */}
              <img
                src={personalInfo.spideyHeroImage}
                alt="Spider-Man Mask Persona"
                className="spidey-img-mask"
                style={maskStyle}
                draggable={false}
              />

              {/* Crosshair cursor indicator when hovering */}
              {isHovered && effectiveScrollReveal < 0.8 && (
                <div
                  className="spidey-lens-reticle"
                  style={{
                    left: `${cursorPos.x}%`,
                    top: `${cursorPos.y}%`,
                  }}
                >
                  <span className="reticle-ring" />
                  <span className="reticle-text">LENS UNMASK</span>
                </div>
              )}
            </div>

            {/* Bottom HUD metadata */}
            <div className="hud-footer-bar">
              <div className="hud-footer-left">
                <span className="hud-bullet" />
                <span className="hud-unmask-pct">
                  UNMASK: {Math.round(effectiveScrollReveal * 100)}%
                </span>
              </div>
              <div className="hud-footer-right">
                <button
                  type="button"
                  className="hud-toggle-btn"
                  onClick={() => {
                    playClick();
                    setManualReveal(manualReveal === null || manualReveal < 0.5 ? 1 : 0);
                  }}
                >
                  {isFullyUnmasked ? "Re-mask Suit" : "Unmask Face"}
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Hint & Scroll prompt */}
          <div className="hero-scroll-cue-wrap">
            <div className="hero-scroll-cue">
              <span className="scroll-cue-mouse">
                <span className="scroll-cue-wheel" />
              </span>
              <span className="scroll-cue-text">
                {isFullyUnmasked
                  ? "Scroll down for full biographical dossier & expertise"
                  : "Scroll down to unmask the engineer & reveal dossier"}
              </span>
              <span className="scroll-cue-arrow">↓</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
