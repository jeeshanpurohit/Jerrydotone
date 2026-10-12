import React, { useState, useEffect, useMemo, useRef } from "react";
import { allPortfolioProjects, projectStats } from "../data/projectsData";
import { caseStudiesList } from "../data/caseStudiesData";
import PortfolioHeaderEffect from "../components/PortfolioHeaderEffect";
import CategoryLogosNav from "../components/CategoryLogosNav";
import ProjectsWheelCarousel from "../components/ProjectsWheelCarousel";
import { WebSVG } from "../shared";
import "../styles/wheelcarousel.css";

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("graphic-design");
  const [isFastSpinning, setIsFastSpinning] = useState(false);
  const [activeMedia, setActiveMedia] = useState(null); // Lightbox modal state
  const [isMaximized, setIsMaximized] = useState(false);

  const carouselRef = useRef(null);

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveMedia(null);
        setIsMaximized(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Category change with fast spin animation trigger
  const handleCategorySelect = (newCatId) => {
    if (newCatId === activeCategory) return;
    setIsFastSpinning(true);
    setActiveCategory(newCatId);

    setTimeout(() => {
      setIsFastSpinning(false);
    }, 600);
  };

  // Wheel items based on active category (ensure loop has >= 8 items for a rich continuous 3D fan arc)
  const wheelProjects = useMemo(() => {
    let list = [];
    if (activeCategory === "case-studies") {
      list = caseStudiesList;
    } else {
      list = allPortfolioProjects.filter((p) => p.category === activeCategory);
    }

    if (list.length === 0) return [];

    // If fewer than 8 items, repeat so fan arc is rich and continuous without gaps
    if (list.length < 8) {
      let repeated = [...list];
      let loopNum = 1;
      while (repeated.length < 8) {
        repeated = [...repeated, ...list.map((p) => ({ ...p, id: `${p.id}-loop${loopNum}` }))];
        loopNum++;
      }
      return repeated;
    }

    return list;
  }, [activeCategory]);

  // Category items count for badge
  const categoryCounts = useMemo(() => {
    return {
      "graphic-design": projectStats.graphicDesign,
      "video-editing": projectStats.videoEditing,
      "photography": projectStats.photography,
      "case-studies": caseStudiesList.length
    };
  }, []);

  return (
    <div className="sp-page-wrap">
      <section id="projects" className="sp-section sp-projects" style={{ paddingTop: "1rem" }}>
        {/* ── 1. PORTFOLIO HEADING WORD EFFECT (From Reference Video) ────────── */}
        <PortfolioHeaderEffect
          onPrev={() => carouselRef.current?.prev()}
          onNext={() => carouselRef.current?.next()}
        />

        {/* ── 2. LOGO-ONLY CATEGORY NAVIGATION DOCK ─────────────────────────── */}
        <CategoryLogosNav
          activeCategory={activeCategory}
          onSelectCategory={handleCategorySelect}
          categoryCounts={categoryCounts}
        />

        {/* ── 3. 9:16 VERTICAL FAN WHEEL CAROUSEL & ROTATING DIAL DISC ──────── */}
        <ProjectsWheelCarousel
          ref={carouselRef}
          items={wheelProjects}
          activeCategory={activeCategory}
          isFastSpinning={isFastSpinning}
          onSelectProject={(project) => {
            const isVideo = project.category === "video-editing" || !!project.video;
            setActiveMedia({
              type: isVideo ? "video" : "image",
              title: project.title,
              client: project.client,
              url: isVideo ? project.video : project.image,
              poster: isVideo ? project.image : null,
              tags: project.tags,
              overview: project.overview,
              metrics: project.metrics,
              isCaseStudy: project.isCaseStudy
            });
          }}
        />

        {/* Web Graphic Decor in background */}
        <div className="sp-projects-web-bg" aria-hidden="true" style={{ opacity: 0.06 }}>
          <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <WebSVG />
          </svg>
        </div>
      </section>

      {/* ── LIGHTBOX / MEDIA VIEWER MODAL ─────────────────────────────────── */}
      {activeMedia && (
        <div
          onClick={() => setActiveMedia(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(8, 12, 13, 0.88)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2vw"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border-card)",
              borderRadius: "6px",
              maxWidth: isMaximized ? "96vw" : (activeMedia.type === "video" ? "920px" : "720px"),
              width: "100%",
              maxHeight: isMaximized ? "96vh" : "90vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.6)",
              position: "relative",
              transition: "max-width 0.25s ease, max-height 0.25s ease"
            }}
          >
            {/* Modal Header */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.9rem 1.4rem",
              borderBottom: "1px solid var(--border-card)"
            }}>
              <div>
                <span style={{
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  letterSpacing: "1px",
                  color: "var(--brand-primary)",
                  textTransform: "uppercase"
                }}>
                  {activeMedia.client}
                </span>
                <h3 style={{
                  fontFamily: "var(--font-hero)",
                  fontSize: "1.15rem",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  margin: 0
                }}>
                  {activeMedia.title}
                </h3>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setIsMaximized((v) => !v)}
                  title={isMaximized ? "Restore default window" : "Expand full screen"}
                  style={{
                    background: "rgba(0, 0, 0, 0.08)",
                    border: "1px solid var(--border-card)",
                    padding: "0.35rem 0.7rem",
                    borderRadius: "3px",
                    cursor: "pointer",
                    color: "var(--text-primary)",
                    fontSize: "0.72rem",
                    fontFamily: "var(--font-mono)",
                    fontWeight: 700
                  }}
                >
                  {isMaximized ? "RESTORE 🗗" : "EXPAND ⛶"}
                </button>
                <button
                  onClick={() => {
                    setActiveMedia(null);
                    setIsMaximized(false);
                  }}
                  style={{
                    background: "rgba(0, 0, 0, 0.08)",
                    border: "1px solid var(--border-card)",
                    width: "32px",
                    height: "32px",
                    borderRadius: "3px",
                    cursor: "pointer",
                    color: "var(--text-primary)",
                    fontSize: "0.95rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background 0.2s"
                  }}
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Media Body */}
            <div style={{
              background: "#000",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              maxHeight: isMaximized ? "80vh" : "66vh",
              overflow: "hidden",
              position: "relative"
            }}>
              {activeMedia.type === "video" ? (
                <video
                  src={activeMedia.url}
                  poster={activeMedia.poster}
                  controls
                  autoPlay
                  playsInline
                  style={{
                    width: "100%",
                    maxHeight: isMaximized ? "80vh" : "66vh",
                    objectFit: "contain"
                  }}
                />
              ) : (
                <img
                  src={activeMedia.url}
                  alt={activeMedia.title}
                  style={{
                    maxWidth: "100%",
                    maxHeight: isMaximized ? "80vh" : "66vh",
                    objectFit: "contain",
                    cursor: isMaximized ? "default" : "zoom-in"
                  }}
                  onClick={() => !isMaximized && setIsMaximized(true)}
                  title={isMaximized ? undefined : "Click to expand image full screen"}
                />
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: "0.9rem 1.4rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.8rem",
              borderTop: "1px solid var(--border-card)"
            }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                {activeMedia.overview && (
                  <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", maxWidth: "450px" }}>
                    {activeMedia.overview}
                  </p>
                )}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  {activeMedia.tags?.map((t, idx) => (
                    <span
                      key={idx}
                      style={{
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        background: "rgba(255, 90, 0, 0.1)",
                        color: "var(--brand-primary)",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "4px"
                      }}
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {activeMedia.url && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    onClick={() => setIsMaximized((v) => !v)}
                    className="sp-btn-dark"
                    style={{
                      fontSize: "0.72rem",
                      padding: "0.5rem 0.9rem",
                      cursor: "pointer"
                    }}
                  >
                    {isMaximized ? "RESTORE VIEW" : "FULLSCREEN VIEW ⛶"}
                  </button>
                  <a
                    href={activeMedia.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sp-btn-red"
                    style={{
                      fontSize: "0.72rem",
                      padding: "0.5rem 1.1rem",
                      textDecoration: "none"
                    }}
                  >
                    VIEW FULL ASSET ↗
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
