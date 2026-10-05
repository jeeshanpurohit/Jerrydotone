import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { DATA, WebSVG } from "../shared";
import { brandIdentities, experienceList } from "../data/portfolioData";
import { ContactPanel } from "../components/ContactPanel";

import { isAudioGloballyEnabled } from "../context/AudioContext";

// Haptic hover tone (Web Audio, no extra deps)
let _hpCtx = null;
function hapticHover({ freq = 1100, type = "sine", duration = 0.055, gain = 0.08 } = {}) {
  if (!isAudioGloballyEnabled()) return;
  try {
    if (!_hpCtx) _hpCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = _hpCtx.createOscillator();
    const g = _hpCtx.createGain();
    osc.connect(g); g.connect(_hpCtx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, _hpCtx.currentTime);
    g.gain.setValueAtTime(gain, _hpCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, _hpCtx.currentTime + duration);
    osc.start(_hpCtx.currentTime);
    osc.stop(_hpCtx.currentTime + duration);
  } catch (e) {}
}



function MarqueeBar() {
  const items = [...DATA.marquee, ...DATA.marquee];
  return (
    <div className="sp-marquee-wrap">
      <div className="sp-marquee-track">
        {items.map((t, i) => (
          <span key={i} className="sp-marquee-item">
            <span className="sp-marquee-dot">◆</span> {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── BRAND IDENTITIES SECTION ──────────────────────────────────────────────────
const brands = [
  {
    key: "photography",
    name: "Jerrydotdng",
    handle: "@jerrydotdng",
    ig: "https://www.instagram.com/jerrydotdng/",
    logo: brandIdentities.photography.logo,
    discipline: "Photography & Photo Editing",
    tagline: "Eyes & Visuals",
    desc: "Visual documentation, street narratives, architectural geometry, and conclave moments captured in high-fidelity RAW DNG format.",
    color: "#A8123D",
    accent: "rgba(168, 18, 61, 0.12)",
  },
  {
    key: "video",
    name: "Jerrydotmov",
    handle: "@jerrydotmov",
    ig: "https://www.instagram.com/jerrydotmov/",
    logo: brandIdentities.video.logo,
    discipline: "Videography & Video Editing",
    tagline: "Motion Graphics & Animations",
    desc: "High-octane commercial after-movies, festival promo reels, audio synchronization, and 60fps kinetic motion graphics.",
    color: "#0B6E76",
    accent: "rgba(11, 110, 118, 0.12)",
  },
  {
    key: "graphicDesign",
    name: "Jerrydotart",
    handle: "@jerrydotart",
    ig: "https://www.instagram.com/jerrydotart/",
    logo: brandIdentities.graphicDesign.logo,
    discipline: "Art & Graphic Design",
    tagline: "Brand, Visual & Communication Design",
    desc: "Typography systems, brand equity frameworks, vector identity books, and comprehensive visual collateral production.",
    color: "#FF5A00",
    accent: "rgba(255, 90, 0, 0.12)",
  },
  {
    key: "main",
    name: "Jerrydotone",
    handle: "@jerrydotone",
    ig: "https://www.instagram.com/jerrydotone/",
    logo: brandIdentities.main.logo,
    discipline: "UX Case Studies & Personal Brand",
    tagline: "Marketing, Content & Personal Website",
    desc: "Brand building, marketing strategies, UX case studies, original content, and the personal portfolio monolith.",
    color: "#123C69",
    accent: "rgba(18, 60, 105, 0.12)",
  },
];

function BrandIdentitySection() {
  return (
    <section className="sp-brands-section">
      <div className="sp-brands-header">
        <span className="sp-eyebrow">
          <span className="sp-eyebrow-flag" />
          CREATIVE IDENTITIES
        </span>
        <h2 className="sp-section-title">BRANDS.</h2>
        <div className="sp-title-underline" />
        <p className="sp-brands-sub">
          Four distinct disciplines, one creative monolith / each channel a focused expression of craft.
        </p>
      </div>

      <div className="sp-brands-grid">
        {brands.map((brand) => (
          <a
            key={brand.key}
            href={brand.ig}
            target="_blank"
            rel="noopener noreferrer"
            className="sp-brand-card"
            style={{ "--brand-color": brand.color, "--brand-accent": brand.accent }}
            onMouseEnter={() => hapticHover({ freq: 900 + Math.random() * 300 })}
          >
            {/* Logo */}
            <div className="sp-brand-logo-wrap">
              <img
                src={brand.logo}
                alt={`${brand.name} logo`}
                className="sp-brand-logo"
              />
            </div>

            {/* Content */}
            <div className="sp-brand-content">
              <div className="sp-brand-name">{brand.name}</div>
              <div className="sp-brand-discipline">{brand.discipline}</div>
              <div className="sp-brand-tagline">{brand.tagline}</div>
              <p className="sp-brand-desc">{brand.desc}</p>
            </div>

            {/* Instagram CTA */}
            <div className="sp-brand-footer">
              <span className="sp-brand-ig-handle">{brand.handle}</span>
              <span className="sp-brand-ig-arrow">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7,7 17,7 17,17" />
                </svg>
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function ExperiencePreviewSection() {
  return (
    <section className="sp-section sp-experience-preview" style={{ background: "var(--bg-secondary)" }}>
      <div className="sp-section-header">
        <span className="sp-eyebrow">
          <span className="sp-eyebrow-flag" />
          CAREER &amp; EXPERTISE
        </span>
        <h2 className="sp-section-title">EXPERIENCE &amp; SKILLS.</h2>
        <div className="sp-title-underline" />
        <p style={{
          maxWidth: "680px",
          margin: "1.5rem auto 0",
          fontSize: "1.05rem",
          color: "var(--text-secondary)",
          lineHeight: 1.7
        }}>
          Bridging brand identity, commercial motion, scientific simulations, and computer science engineering across 9+ organizations.
        </p>
      </div>

      {/* Asymmetrical Editorial Experience List */}
      <div style={{
        maxWidth: "1050px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "1.2rem"
      }}>
        {experienceList.slice(0, 3).map((exp, idx) => (
          <div
            key={idx}
            className="sp-exp-preview-card"
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--red)";
              e.currentTarget.style.background = "var(--bg-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-card)";
              e.currentTarget.style.background = "var(--card-bg)";
            }}
          >
            <div>
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.78rem",
                fontWeight: 700,
                color: "var(--red)",
                display: "block",
                letterSpacing: "1.5px",
                textTransform: "uppercase"
              }}>
                {exp.period}
              </span>
              <span style={{
                fontSize: "0.7rem",
                fontWeight: 800,
                letterSpacing: "0.5px",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                marginTop: "0.2rem",
                display: "block"
              }}>
                {exp.type}
              </span>
            </div>

            <div>
              <h3 style={{
                fontFamily: "var(--font-hero)",
                fontSize: "1.2rem",
                fontWeight: 800,
                color: "var(--text-primary)",
                lineHeight: 1.3
              }}>
                {exp.role}
              </h3>
              <div style={{ fontSize: "0.88rem", color: "var(--red)", fontWeight: 700, margin: "0.2rem 0 0.4rem" }}>
                {exp.company}
              </div>
              <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", lineHeight: 1.55, margin: 0 }}>
                {exp.description}
              </p>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", justifyContent: "flex-end", maxWidth: "200px" }}>
              {exp.tags?.slice(0, 3).map((t, tIdx) => (
                <span key={tIdx} style={{
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  background: "rgba(16, 25, 26, 0.05)",
                  border: "1px solid var(--border-card)",
                  padding: "0.2rem 0.45rem",
                  borderRadius: "2px"
                }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "3rem", display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
        <Link to="/experience" className="sp-btn-red" style={{ textDecoration: "none" }}>
          EXPLORE ALL 9 ROLES →
        </Link>
        <Link to="/skills" className="sp-btn-dark" style={{ textDecoration: "none" }}>
          VIEW FULL ARSENAL →
        </Link>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="sp-section sp-contact" style={{ position: 'relative', zIndex: 1, padding: '5rem 1.5rem' }}>
      <div className="sp-contact-web-bg" aria-hidden="true" style={{ opacity: 0.07 }}>
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <WebSVG />
        </svg>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 2 }}>
        <ContactPanel
          eyebrow="COMMISSION DISPATCH & GOOGLE MEET DISCOVERY"
          title="CONTACT & INITIATE DIRECTIVE."
          subtitle="Schedule a discovery call with auto Google Meet, register in Google Sheets, and transmit project requirements directly to jerrydotone@gmail.com."
        />
      </div>
    </section>
  );
}

export default function HomePage() {
  const [cursor, setCursor] = useState({ x: -9999, y: -9999, relX: -9999, relY: -9999 });
  const [hovered, setHovered] = useState(false);

  const rafRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const onMove = (e) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        let relX = -9999;
        let relY = -9999;
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          relX = e.clientX - rect.left;
          relY = e.clientY - rect.top;
        }
        setCursor({ x: e.clientX, y: e.clientY, relX, relY });
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const maskValue = hovered
    ? `radial-gradient(
        circle 280px at ${cursor.relX}px ${cursor.relY}px,
        transparent 0%,
        transparent 35%,
        rgba(0,0,0,0.6) 70%,
        black 100%
      )`
    : "none";

  return (
    <>
      <section id="hero" className="sp-hero" style={{ position: "relative" }}>
        <div className="sp-web sp-web-tl" aria-hidden="true">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <WebSVG />
          </svg>
        </div>
        <div className="sp-web sp-web-br" aria-hidden="true">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <WebSVG />
          </svg>
        </div>

        <div className="sp-hero-content">
          <p className="sp-hero-tagline">{DATA.tagline}</p>
          <h1 className="sp-hero-name">
            JEESHAN<br />
            <span>PUROHIT.</span>
          </h1>
          <div className="sp-hero-btns">
            <Link to="/projects" className="sp-btn-red" onMouseEnter={() => hapticHover()}>
              EXPLORE PROJECTS
            </Link>
            <a
              className="sp-btn-dark"
              href={DATA.resumePdf}
              download="Jeeshan_Purohit_Resume_ATS.pdf"
              onMouseEnter={() => hapticHover({ freq: 700, type: "triangle" })}
            >
              <span className="sp-btn-dl-icon">↓</span> RESUME.PDF
            </a>
          </div>
        </div>

        <div
          ref={containerRef}
          className="sp-hero-img-wrap"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => { setHovered(false); setCursor({ x: -9999, y: -9999, relX: -9999, relY: -9999 }); }}
          onTouchStart={(e) => {
            if (e.touches && e.touches[0] && containerRef.current) {
              const touch = e.touches[0];
              const rect = containerRef.current.getBoundingClientRect();
              setHovered(true);
              setCursor({ x: touch.clientX, y: touch.clientY, relX: touch.clientX - rect.left, relY: touch.clientY - rect.top });
            }
          }}
          onTouchMove={(e) => {
            if (e.touches && e.touches[0] && containerRef.current) {
              const touch = e.touches[0];
              const rect = containerRef.current.getBoundingClientRect();
              setCursor({ x: touch.clientX, y: touch.clientY, relX: touch.clientX - rect.left, relY: touch.clientY - rect.top });
            }
          }}
          onTouchEnd={() => {
            setHovered(false);
          }}
        >
          <img
            src={DATA.faceImg}
            alt="Jeeshan Purohit"
            className="sp-hero-face"
            draggable={false}
          />
          <div
            className="sp-hero-mask-layer"
            style={{
              WebkitMaskImage: maskValue,
              maskImage: maskValue,
            }}
          >
            <img
              src={DATA.spideyImg}
              alt="Spider-Man Mask"
              className="sp-hero-spidey"
              draggable={false}
            />
          </div>

          {hovered && (
            <div
              className="sp-hero-reticle"
              style={{ left: cursor.x, top: cursor.y }}
            >
              <span className="sp-reticle-ring" />
              <span className="sp-reticle-ch sp-reticle-ch-h" />
              <span className="sp-reticle-ch sp-reticle-ch-v" />
              <span className="sp-reticle-label">UNMASK</span>
            </div>
          )}
        </div>
      </section>
      
      <MarqueeBar />
      <BrandIdentitySection />
      <ExperiencePreviewSection />
      <ContactSection />
    </>
  );
}
