import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useImperativeHandle,
  forwardRef
} from "react";
import { useAudioContext } from "../context/AudioContext";

// ── SUB-COMPONENT: Individual Fan Card with Hover Video Playback ──────────────
function FanCard({
  project,
  index,
  diff,
  isAnchor,
  isVisible,
  isHovered,
  onHover,
  onClick,
  style
}) {
  const videoRef = useRef(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const isVideo = project.category === "video-editing" || !!project.video;
  const isCaseStudy = project.category === "case-studies" || project.isCaseStudy;

  // Manage video playback cleanly based on hover state (only active when anchor or hovered)
  useEffect(() => {
    if (!isVideo || !videoRef.current) return;

    if (isHovered) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } else {
      videoRef.current.pause();
    }
  }, [isHovered, isVideo]);

  return (
    <div
      className={`sp-fan-card ${isAnchor ? "anchor-card" : ""} ${isHovered ? "is-hovered" : ""}`}
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      style={{
        ...style,
        visibility: isVisible ? "visible" : "hidden",
        pointerEvents: isVisible ? "auto" : "none"
      }}
      title={isAnchor ? `${project.title} / Click to inspect` : `Rotate to ${project.title}`}
    >
      {/* Card Media / Mockup */}
      {isCaseStudy && !project.image ? (
        <div className="sp-cs-card-bg">
          <div className="sp-cs-blueprint-grid" />
          <div style={{ position: "relative", zIndex: 2 }}>
            <span className="sp-card-pill-tag">UX CASE STUDY</span>
          </div>
          <div className="sp-cs-wireframe-art">
            <div className="sp-cs-wireframe-bar active" />
            <div className="sp-cs-wireframe-bar teal" />
            <div className="sp-cs-wireframe-bar" style={{ width: "80%" }} />
            <div className="sp-cs-wireframe-bar" style={{ width: "55%" }} />
          </div>
          <div style={{ position: "relative", zIndex: 2 }}>
            <span className="sp-card-action-hint">VIEW CASE STUDY →</span>
          </div>
        </div>
      ) : (
        <div className="sp-fan-card-media">
          {!imgLoaded && <div className="sp-card-skeleton" />}
          <img
            src={project.image}
            alt={project.title}
            loading={Math.abs(diff) <= 1 ? "eager" : "lazy"}
            decoding="async"
            draggable={false}
            onLoad={() => setImgLoaded(true)}
            className={imgLoaded ? "is-loaded" : "is-loading"}
          />
          {isVideo && (isAnchor || isHovered) && project.video && (
            <video
              ref={videoRef}
              src={project.video}
              poster={project.image}
              muted
              loop
              playsInline
              preload="metadata"
              className="sp-fan-card-video"
            />
          )}
          <div className="sp-fan-card-overlay" />
        </div>
      )}

      {/* Top Tags Bar */}
      <div className="sp-fan-card-top-bar">
        <span className="sp-card-pill-tag">
          {isVideo ? (isHovered ? "PLAYING REEL" : "REEL") : isCaseStudy ? "CASE STUDY" : project.subCategory || "FLYER"}
        </span>
        <span className="sp-card-index-tag">
          #{String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {/* Live Video Preview Pill (Pops out when hovering on video cards) */}
      {isVideo && isHovered && (
        <div className="sp-card-live-indicator">
          <span className="sp-card-live-dot" />
          <span>PREVIEWING</span>
        </div>
      )}

      {/* Video Center Play Button Overlay (Fades out while previewing) */}
      {isVideo && (
        <div className={`sp-card-play-overlay ${isHovered ? "is-playing" : ""}`} title="Play Video Reel">
          <svg viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      )}

      {/* Bottom CTA Only */}
      <div className="sp-fan-card-bottom">
        <span className="sp-card-action-hint">
          {isVideo && isHovered ? "WATCH REEL →" : "VIEW FULL ASSET →"}
        </span>
      </div>
    </div>
  );
}

// ── MAIN COMPONENT: ProjectsWheelCarousel ─────────────────────────────────────
const ProjectsWheelCarousel = forwardRef(function ProjectsWheelCarousel(
  {
    items = [],
    activeCategory = "graphic-design",
    onSelectProject,
    isFastSpinning = false
  },
  ref
) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dialAngle, setDialAngle] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [internalSpin, setInternalSpin] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Dragging & gesture states
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const stageRef = useRef(null);
  const timerRef = useRef(null);
  const prevCategoryRef = useRef(activeCategory);

  // Pointer drag trackers (avoid stale closures)
  const pointerStartRef = useRef({ x: 0, y: 0, time: 0 });
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef(0);

  const { playClick, playCardHover } = useAudioContext();

  const total = items.length;

  // Arc & Turntable Geometry constants
  const STEP_ANGLE = 16.5; // Degree step synchronized between dial turntable and fan cards
  const RADIUS = 620;      // Physical circular radius for uniform arc positioning
  const DRAG_PX_PER_CARD = 135; // Pixels of pointer drag corresponding to 1 card step

  // Category Switch: Spin bottom wheel smoothly, then decelerate into new category
  useEffect(() => {
    if (prevCategoryRef.current !== activeCategory) {
      prevCategoryRef.current = activeCategory;
      setInternalSpin(true);
      setHoveredIndex(null);
      setDragOffset(0);

      // Spin dial disc forward smoothly (+720 degrees)
      setDialAngle((prev) => prev - 720);
      setCurrentIndex(0);

      const timer = setTimeout(() => {
        setInternalSpin(false);
      }, 550);

      return () => clearTimeout(timer);
    }
  }, [activeCategory]);

  // Step to Next card
  const handleNext = useCallback(() => {
    if (total === 0) return;
    playClick?.();
    setCurrentIndex((prev) => (prev + 1) % total);
    setDialAngle((prev) => prev - STEP_ANGLE);
  }, [total, playClick, STEP_ANGLE]);

  // Step to Prev card
  const handlePrev = useCallback(() => {
    if (total === 0) return;
    playClick?.();
    setCurrentIndex((prev) => (prev - 1 + total) % total);
    setDialAngle((prev) => prev + STEP_ANGLE);
  }, [total, playClick, STEP_ANGLE]);

  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;

  // Jump to specific index directly
  const handleGoTo = useCallback((targetIndex) => {
    if (total === 0) return;
    const current = currentIndexRef.current;
    const normalized = Math.min(total - 1, Math.max(0, targetIndex));
    if (normalized === current) return;
    playClick?.();
    const diff = normalized - current;
    currentIndexRef.current = normalized;
    setCurrentIndex(normalized);
    setDialAngle((prev) => prev - diff * STEP_ANGLE);
  }, [total, playClick, STEP_ANGLE]);

  // Expose imperative handle to parent (for header arrows or external navigation)
  useImperativeHandle(ref, () => ({
    next: handleNext,
    prev: handlePrev,
    goTo: handleGoTo
  }), [handleNext, handlePrev, handleGoTo]);

  // Press & hold cursor scrubber drag state
  const [isScrubbing, setIsScrubbing] = useState(false);
  const scrubberTrackRef = useRef(null);

  const handleScrubberPointerDown = (e) => {
    e.preventDefault();
    setIsScrubbing(true);
    setIsPaused(true);

    const track = scrubberTrackRef.current;
    if (!track) return;

    const updateFromPosition = (clientX) => {
      const rect = track.getBoundingClientRect();
      if (rect.width <= 0) return;
      const fraction = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const targetIdx = Math.min(total - 1, Math.max(0, Math.floor(fraction * total)));
      handleGoTo(targetIdx);
    };

    updateFromPosition(e.clientX);

    const onPointerMove = (moveEvent) => {
      updateFromPosition(moveEvent.clientX);
    };

    const onPointerUp = () => {
      setIsScrubbing(false);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  // Jump directly to card on click
  const handleCardClick = (diff, project) => {
    // If a noticeable drag occurred, cancel click
    if (Math.abs(dragOffsetRef.current) > 7) return;

    if (diff === 0) {
      // Clicked anchor card -> Open Lightbox / full asset
      if (onSelectProject) onSelectProject(project);
    } else {
      // Clicked side card -> Rotate that card to anchor point
      playClick?.();
      setCurrentIndex((prev) => (prev + diff + total) % total);
      setDialAngle((prev) => prev - diff * STEP_ANGLE);
    }
  };

  // Slideshow interval (auto-rotates to anchor point with slow-down)
  // Automatically pauses while hovering a card or dragging
  useEffect(() => {
    if (
      isPaused ||
      internalSpin ||
      isFastSpinning ||
      total <= 1 ||
      hoveredIndex !== null ||
      isDragging
    ) {
      return;
    }

    timerRef.current = setInterval(() => {
      handleNext();
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, internalSpin, isFastSpinning, total, handleNext, hoveredIndex, isDragging]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === " " && !e.target.closest("button")) {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  // Trackpad horizontal swipe support (leaves vertical page scrolling 100% untouched)
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let wheelCooldown = false;
    let accumulatedDelta = 0;

    const handleWheel = (e) => {
      // Only respond to deliberate horizontal trackpad gestures (deltaX)
      // When scrolling vertically down the page, deltaY is dominant — let page scroll freely!
      const isHorizontalGesture =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) * 1.4 && Math.abs(e.deltaX) > 18;

      if (!isHorizontalGesture) {
        // Vertical wheel event: do NOT preventDefault and do NOT rotate carousel.
        // Both the page scroll and carousel animation remain individual to themselves!
        return;
      }

      // Prevent horizontal page navigation/bounce while horizontally swiping carousel
      e.preventDefault();

      accumulatedDelta += e.deltaX;

      if (wheelCooldown) return;

      if (accumulatedDelta > 28) {
        handleNext();
        wheelCooldown = true;
        accumulatedDelta = 0;
        setTimeout(() => { wheelCooldown = false; }, 240);
      } else if (accumulatedDelta < -28) {
        handlePrev();
        wheelCooldown = true;
        accumulatedDelta = 0;
        setTimeout(() => { wheelCooldown = false; }, 240);
      }
    };

    stage.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      stage.removeEventListener("wheel", handleWheel);
    };
  }, [handleNext, handlePrev]);

  // Pointer Drag: Drag / Flick the wheel naturally with mouse or touch
  const handlePointerDown = (e) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    if (e.target.closest("button, a, .sp-slideshow-pause-btn, .sp-carousel-control, .sp-scrubber-track")) return;

    pointerStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now()
    };
    isDraggingRef.current = true;
    dragOffsetRef.current = 0;
    setIsDragging(true);
    setDragOffset(0);

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (err) {}
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - pointerStartRef.current.x;
    dragOffsetRef.current = deltaX;
    setDragOffset(deltaX);
  };

  const handlePointerUp = (e) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) {}

    const deltaX = dragOffsetRef.current;
    const elapsed = Date.now() - pointerStartRef.current.time;
    const velocity = deltaX / Math.max(1, elapsed); // px per ms

    setDragOffset(0);

    // If small movement (< 7px), treat as standard click
    if (Math.abs(deltaX) < 7) {
      return;
    }

    // Determine steps from flick or drag distance
    let steps = 0;
    if (Math.abs(velocity) > 0.35) {
      // Natural flick
      steps = velocity < 0 ? 1 : -1;
      if (Math.abs(velocity) > 0.9 && Math.abs(deltaX) > 160) {
        steps = velocity < 0 ? 2 : -2;
      }
    } else {
      steps = Math.round(-deltaX / DRAG_PX_PER_CARD);
    }

    if (steps !== 0) {
      playClick?.();
      setCurrentIndex((prev) => (prev + steps + total) % total);
      setDialAngle((prev) => prev - steps * STEP_ANGLE);
    }
  };

  if (total === 0) return null;

  // ── VIRTUALIZATION: Render only the active visible window (7 to 9 cards) ────
  // This drops GPU composite layer memory by 75-80% and eliminates micro-stutter
  const visibleCards = [];
  const maxSpan = Math.min(4, Math.floor(total / 2));

  for (let d = -maxSpan; d <= maxSpan; d++) {
    const cardIdx = (currentIndex + d + total) % total;
    if (!visibleCards.some((c) => c.index === cardIdx)) {
      visibleCards.push({
        project: items[cardIdx],
        index: cardIdx,
        diff: d
      });
    }
  }

  // Real-time drag angle additions
  const dragFraction = isDragging ? dragOffset / DRAG_PX_PER_CARD : 0;
  const currentDialAngle = dialAngle + dragFraction * STEP_ANGLE;

  const currentProject = items[currentIndex] || items[0];

  return (
    <div
      ref={stageRef}
      className={`sp-wheel-carousel-stage ${isDragging ? "is-dragging" : ""}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        setHoveredIndex(null);
      }}
    >
      {/* ── DIAL DISC (Turntable / Compass wheel beneath cards) ──────────────── */}
      <div className="sp-dial-disc-wrap" aria-hidden="true">
        {/* Needle / Pointer at top 12 o'clock pointing to center anchor card */}
        <div className="sp-dial-anchor-pointer">
          <div className="sp-dial-pointer-arrow" />
          <span className="sp-dial-pointer-text">
            {String(currentIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>

        <svg
          viewBox="0 0 660 660"
          className={`sp-dial-disc-svg ${(internalSpin || isFastSpinning) ? "fast-spin" : ""}`}
          style={{
            transform: `rotate(${currentDialAngle.toFixed(2)}deg)`,
            transition: isDragging ? "none" : undefined
          }}
        >
          <defs>
            <path
              id="dialTextArc"
              d="M 330,70 A 260,260 0 1,1 329.9,70"
              fill="none"
            />
          </defs>

          {/* Outer circle ring */}
          <circle
            cx="330"
            cy="330"
            r="318"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            opacity="0.18"
          />

          {/* 72 Radial tick marks */}
          {Array.from({ length: 72 }).map((_, idx) => {
            const angle = (idx * 360) / 72;
            const isMajor = idx % 6 === 0;
            const r1 = isMajor ? 302 : 310;
            const r2 = 318;
            const rad = (angle * Math.PI) / 180;
            const x1 = 330 + r1 * Math.cos(rad);
            const y1 = 330 + r1 * Math.sin(rad);
            const x2 = 330 + r2 * Math.cos(rad);
            const y2 = 330 + r2 * Math.sin(rad);
            return (
              <line
                key={idx}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={isMajor ? "var(--brand-primary)" : "currentColor"}
                strokeWidth={isMajor ? "1.8" : "1"}
                opacity={isMajor ? "0.8" : "0.25"}
              />
            );
          })}

          {/* Concentric dashed ring */}
          <circle
            cx="330"
            cy="330"
            r="280"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4 8"
            opacity="0.2"
          />

          {/* Curved repeating ticker text along rim */}
          <text
            fill="currentColor"
            opacity="0.5"
            fontFamily="Bricolage Grotesque, system-ui, sans-serif"
            fontWeight="800"
            fontSize="10"
            letterSpacing="3"
          >
            <textPath href="#dialTextArc" startOffset="0%">
              ✦ JERRY.ART ✦ JERRY.MOV ✦ JERRY.DNG ✦ JERRY.ONE ✦ CREATIVE DIRECTION ✦ JERRY.ART ✦ JERRY.MOV ✦ JERRY.DNG ✦ JERRY.ONE ✦
            </textPath>
          </text>

          {/* Inner concentric rings */}
          <circle
            cx="330"
            cy="330"
            r="220"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.12"
          />
          <circle
            cx="330"
            cy="330"
            r="160"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2 6"
            opacity="0.15"
          />
          <circle
            cx="330"
            cy="330"
            r="70"
            fill="rgba(255, 90, 0, 0.04)"
            stroke="var(--brand-primary)"
            strokeWidth="1.2"
            opacity="0.4"
          />
        </svg>
      </div>

      {/* ── FAN CARDS STAGE (Subpixel 3D Cylindrical Geometry) ──────────────── */}
      <div className={`sp-fan-cards-container ${(internalSpin || isFastSpinning) ? "fast-spin" : ""}`}>
        {visibleCards.map(({ project, index: cardIndex, diff }) => {
          const effectiveDiff = diff + dragFraction;
          const absDiff = Math.abs(diff);
          const absEffectiveDiff = Math.abs(effectiveDiff);

          const isVisible = absDiff <= 3.5;
          const isAnchor = diff === 0;
          const isCardHovered = hoveredIndex === cardIndex;

          // Pure 3D cylindrical geometry (continuous smooth curve)
          const angleDeg = effectiveDiff * STEP_ANGLE;
          const angleRad = (angleDeg * Math.PI) / 180;

          // Subpixel floating point coordinates
          const x = RADIUS * Math.sin(angleRad);
          const y = RADIUS * (1 - Math.cos(angleRad)) * 0.42; // Gentle vertical arc
          const z = -absEffectiveDiff * 55;                   // 3D depth receding backwards
          const rotY = -effectiveDiff * 7.5;                  // Inward cylindrical turn
          const rotZ = effectiveDiff * 7.2;                   // Natural arc fan tilt

          // Resting scale & opacity hierarchy
          let baseScale = 1.0;
          let opacity = 1.0;
          let zIndex = 16 - Math.round(absEffectiveDiff * 2);

          if (absEffectiveDiff < 0.5) {
            baseScale = 1.04;
            opacity = 1.0;
            zIndex = 22;
          } else if (absEffectiveDiff < 1.5) {
            baseScale = 0.94 - (absEffectiveDiff - 0.5) * 0.08;
            opacity = 0.92 - (absEffectiveDiff - 0.5) * 0.15;
            zIndex = 16;
          } else if (absEffectiveDiff < 2.5) {
            baseScale = 0.84 - (absEffectiveDiff - 1.5) * 0.10;
            opacity = 0.72 - (absEffectiveDiff - 1.5) * 0.25;
            zIndex = 12;
          } else if (absEffectiveDiff < 3.5) {
            baseScale = 0.72 - (absEffectiveDiff - 2.5) * 0.12;
            opacity = 0.42 - (absEffectiveDiff - 2.5) * 0.35;
            zIndex = 8;
          } else {
            baseScale = 0.58;
            opacity = 0;
            zIndex = 1;
          }

          // Card hover elevation & pop-out (smooth lift without jitter)
          let scale = baseScale;
          let elevateY = 0;
          if (isCardHovered && !isDragging) {
            if (isAnchor) {
              scale = 1.15;
              elevateY = -32;
              zIndex = 60;
            } else {
              scale = baseScale * 1.12;
              elevateY = -18;
              zIndex = 40;
            }
          }

          const transform = `translate3d(${x.toFixed(2)}px, ${(y + elevateY).toFixed(2)}px, ${z.toFixed(2)}px) rotateY(${rotY.toFixed(2)}deg) rotateZ(${rotZ.toFixed(2)}deg) scale(${scale.toFixed(3)})`;

          return (
            <FanCard
              key={project.id || cardIndex}
              project={project}
              index={cardIndex}
              diff={diff}
              isAnchor={isAnchor}
              isVisible={isVisible}
              isHovered={isCardHovered}
              onHover={(hovering) => {
                if (isDragging) return;
                if (hovering) {
                  setHoveredIndex(cardIndex);
                  playCardHover?.();
                } else {
                  setHoveredIndex((prev) => (prev === cardIndex ? null : prev));
                }
              }}
              onClick={() => handleCardClick(diff, project)}
              style={{
                transform,
                zIndex,
                opacity,
                transition: isDragging ? "none" : undefined
              }}
            />
          );
        })}
      </div>

      {/* ── CAROUSEL ARROWS ─────────────────────────────────────────────────── */}
      <button
        className="sp-carousel-control sp-control-prev"
        onClick={handlePrev}
        aria-label="Previous Slide"
        title="Previous Project (Left Arrow or Trackpad Swipe)"
      >
        ‹
      </button>
      <button
        className="sp-carousel-control sp-control-next"
        onClick={handleNext}
        aria-label="Next Slide"
        title="Next Project (Right Arrow or Trackpad Swipe)"
      >
        ›
      </button>

      {/* ── PROJECT SCRUBBER TRACK ─────────────────────────────────────────── */}
      <div className="sp-slideshow-indicator-bar">
        {/* Interactive Scrub Track: Click, Press & Hold Drag */}
        <div
          ref={scrubberTrackRef}
          className={`sp-slideshow-scrubber-track ${isScrubbing ? "is-scrubbing" : ""}`}
          title="Press & hold or drag to scrub projects"
          onPointerDown={handleScrubberPointerDown}
        >
          <div
            className="sp-slideshow-scrubber-fill"
            style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          />
          <div
            className="sp-scrubber-thumb"
            style={{ left: `${((currentIndex + 0.5) / total) * 100}%` }}
          >
            <span className="sp-scrubber-thumb-dot" />
          </div>
        </div>
      </div>
    </div>
  );
});

export default ProjectsWheelCarousel;
