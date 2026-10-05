import React, { useState, useRef } from 'react';
import { personalInfo } from '../data/portfolioData';

export function MaskReveal() {
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const frameRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Calculate rotation (-15 to 15 degrees)
    const tiltX = (y / (rect.height / 2)) * -15;
    const tiltY = (x / (rect.width / 2)) * 15;
    
    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div className="spider-unmask-container">
      <div
        ref={frameRef}
        className={`spider-unmask-frame ${isHovered ? 'revealed' : ''}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        // Fallback for touch
        onClick={() => setIsHovered(!isHovered)}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.02 : 1})`,
        }}
        title="Hover to unmask the engineer"
      >
        <div className="spider-unmask-inner">
          {/* Layer 1: Jeeshan's Face Underneath */}
          <img
            src={personalInfo.photo}
            alt="Jeeshan Purohit"
            className="layer-face-underneath"
          />

          {/* Layer 2: Spider-Man Mask on Top */}
          <img
            src={personalInfo.maskImage}
            alt="Spider-Man Mask"
            className="layer-mask-top"
          />
        </div>
      </div>

      <div className="spider-unmask-hint">
        <span>{isHovered ? 'MASK LIFTED' : 'HOVER TO UNMASK THE ENGINEER'}</span>
      </div>
    </div>
  );
}
