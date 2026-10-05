import React, { useState, useEffect, useRef } from 'react';
import { personalInfo } from '../data/portfolioData';

export function RotationalDeck3D({ cards = [], onCardChange }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const stageRef = useRef(null);
  const total = cards.length;

  // Parallax coordinates
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const startX = useRef(0);
  const isDragging = useRef(false);

  const goTo = (index) => {
    let nextIdx = index;
    if (index < 0) nextIdx = total - 1;
    if (index >= total) nextIdx = 0;
    setCurrentIndex(nextIdx);
    if (onCardChange) onCardChange(nextIdx);
  };

  const handlePrev = () => goTo(currentIndex - 1);
  const handleNext = () => goTo(currentIndex + 1);

  const handleMouseMove = (e) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);

    setTilt({
      y: deltaX * 12,
      x: -deltaY * 10
    });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, total]);

  return (
    <div className="rotational-deck-section">
      {/* Clean Minimal Mode Selector */}
      <div className="deck-tabs-minimal">
        {cards.map((card, idx) => (
          <button
            key={card.id || idx}
            className={`deck-tab-btn ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => goTo(idx)}
          >
            <span>{card.subtitle}</span>
          </button>
        ))}
      </div>

      {/* 3D Viewport Stage */}
      <div
        className="rotational-stage-viewport"
        ref={stageRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          setTilt({ x: 0, y: 0 });
        }}
        onMouseMove={handleMouseMove}
        onTouchStart={(e) => {
          startX.current = e.touches[0].clientX;
          isDragging.current = true;
        }}
        onTouchEnd={(e) => {
          if (!isDragging.current) return;
          isDragging.current = false;
          const endX = e.changedTouches[0].clientX;
          const diff = endX - startX.current;
          if (Math.abs(diff) > 40) {
            if (diff > 0) handlePrev();
            else handleNext();
          }
        }}
      >
        <button className="deck-arrow-btn deck-arrow-prev" onClick={handlePrev} aria-label="Previous">
          ‹
        </button>
        <button className="deck-arrow-btn deck-arrow-next" onClick={handleNext} aria-label="Next">
          ›
        </button>

        <div className="rotational-stage">
          {cards.map((card, idx) => {
            let positionClass = 'is-hidden';
            if (idx === currentIndex) positionClass = 'is-active';
            else if (idx === (currentIndex - 1 + total) % total) positionClass = 'is-prev';
            else if (idx === (currentIndex + 1) % total) positionClass = 'is-next';

            const isCurrent = idx === currentIndex;
            const cardTransform = isCurrent && isHovering
              ? { transform: `translate3d(0, 0, 0) rotateX(${tilt.x.toFixed(1)}deg) rotateY(${tilt.y.toFixed(1)}deg)` }
              : undefined;

            return (
              <div
                key={card.id || idx}
                className={`rotational-card ${card.theme || 'card-theme-orange'} ${positionClass}`}
                style={cardTransform}
                onClick={() => {
                  if (positionClass === 'is-prev') handlePrev();
                  if (positionClass === 'is-next') handleNext();
                }}
              >
                {/* Header with Brand Logo */}
                <div className="deck-header-badge">
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%' }}>
                    <div>
                      <div className="deck-user-title">{card.user}</div>
                      <div className="deck-user-sub">{card.subtitle}</div>
                    </div>
                    {card.logo && (
                      <div className="deck-card-brand-chip" title={card.brandName}>
                        <img src={card.logo} alt={card.brandName || "Brand"} className="deck-card-brand-svg" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Central Avatar */}
                <div className="deck-avatar-cutout">
                  <div className="deck-avatar-ring">
                    <img src={card.avatarImg || personalInfo.photo} alt="Jeeshan" className="deck-avatar-photo" />
                  </div>
                </div>

                {/* Breakout Objects with Morph Transitions (from Reference.MOV) */}
                {card.previewObj && (
                  <div
                    className="rotational-widget obj-card-preview"
                    style={{
                      transform: `translateZ(75px) translate3d(${isHovering ? tilt.y * 0.7 : 0}px, ${isHovering ? -tilt.x * 0.7 : 0}px, 0)`
                    }}
                  >
                    <span className="preview-header">{card.previewObj.label}</span>
                    <span className="preview-title">{card.previewObj.title}</span>
                    <span className="preview-badge">{card.previewObj.badge}</span>
                  </div>
                )}

                {card.bookmarkObj && (
                  <div
                    className="rotational-widget obj-pill-bookmark"
                    style={{
                      transform: `translateZ(85px) translate3d(${isHovering ? tilt.y * 0.8 : 0}px, ${isHovering ? -tilt.x * 0.8 : 0}px, 0)`
                    }}
                  >
                    <span className="obj-pill-icon">{card.bookmarkObj.icon}</span>
                    <span>{card.bookmarkObj.text}</span>
                  </div>
                )}

                {card.statObj && (
                  <div
                    className="rotational-widget obj-capsule-stat"
                    style={{
                      transform: `translateZ(65px) translate3d(${isHovering ? tilt.y * 0.6 : 0}px, ${isHovering ? -tilt.x * 0.6 : 0}px, 0)`
                    }}
                  >
                    <span className="stat-num">{card.statObj.num}</span>
                    <span>{card.statObj.label}</span>
                  </div>
                )}

                {/* Footer Capsule */}
                <div className="deck-card-capsule">
                  <span>{card.footerText}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Clean Dots Track */}
      <div className="deck-dots-track">
        {cards.map((_, idx) => (
          <button
            key={idx}
            className={`deck-dot-pill ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => goTo(idx)}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
