import React, { useState, useRef, useCallback } from "react";
import { personalInfo } from "../data/portfolioData";

/**
 * CursorMaskReveal
 * Full-screen hero with Spider-Man mask over user photo.
 * Moving cursor over the Spider-Man image locally dissolves the mask
 * exactly where the cursor is — revealing the face underneath.
 *
 * Technique: CSS mask-image with a radial-gradient that tracks cursor.
 * The gradient is "transparent" at cursor center ? creates a hole in the mask.
 */
export function CursorMaskReveal({ children }) {
  const imgContainerRef = useRef(null);
  const [maskStyle, setMaskStyle] = useState({});
  const [isOver, setIsOver] = useState(false);
  const rafRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!imgContainerRef.current) return;
    const rect = imgContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setMaskStyle({
        maskImage: `radial-gradient(circle 160px at ${x}% ${y}%, transparent 0%, transparent 40%, rgba(0,0,0,0.3) 65%, black 100%)`,
        WebkitMaskImage: `radial-gradient(circle 160px at ${x}% ${y}%, transparent 0%, transparent 40%, rgba(0,0,0,0.3) 65%, black 100%)`,
      });
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsOver(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsOver(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    setMaskStyle({});
  }, []);

  return (
    <div className="cmr-wrapper">
      {/* Face layer — always underneath */}
      <div
        ref={imgContainerRef}
        className={`cmr-img-zone${isOver ? " cmr-active" : ""}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Jeeshan photo — base layer */}
        <img
          src={personalInfo.photo}
          alt="Jeeshan Purohit"
          className="cmr-face-img"
          draggable={false}
        />
        {/* Spider-Man mask — top layer, gets the cursor-mask applied */}
        <img
          src="/assets/spydy_stand.png"
          alt="Spider-Man"
          className="cmr-mask-img"
          style={maskStyle}
          draggable={false}
        />
        {/* Subtle hover hint */}
        <div className={`cmr-hint${isOver ? " cmr-hint-hidden" : ""}`}>
          <span className="cmr-hint-dot" />
          move cursor to unmask
        </div>
      </div>
    </div>
  );
}
