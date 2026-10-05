import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

// ── DATA ──────────────────────────────────────────────────────────────────────
export const DATA = {
  name: "JEESHAN PUROHIT",
  nameDisplay: "JEESHAN\nPUROHIT.",
  tagline: "MULTIDISCIPLINARY VISUAL DESIGNER & CREATIVE TECHNOLOGIST",
  role: "Visual Designer, Motion Artist & UI/UX Designer",
  email: "jeeshan233p@gmail.com",
  phone: "+91-9413564618",
  location: "Jaipur / Jodhpur, Rajasthan, India",
  linkedin: "https://linkedin.com/in/jeeshanpurohit",
  github: "https://github.com/jeeshanpurohit",
  behance: "https://behance.net/Jeeshanpurohit",
  instagram: "https://instagram.com/jeeshan.one",
  resumePdf: "/assets/Jeeshan_Purohit_Resume_ATS.pdf",
  cvPdf: "/assets/Jeeshan_Purohit_CV_ATS.pdf",
  spideyImg: "/assets/my_website_spidey.png",
  faceImg: "/assets/my_website_face.png",
  spideyHang: "/assets/spydy_hang.png",
  spideyStand: "/assets/spydy_stand.png",
  about: [
    "I'm a multidisciplinary Visual Designer with a B.Tech. in Computer Science and Engineering from JIET Jodhpur (7 CGPA), passionate about blending creativity and technology.",
    "My work spans graphic design, motion graphics, video editing, photography, videography, and 2D animation, with deep explorations into UI/UX architecture and creative direction.",
    "From spearheading brand identity and content infrastructure at Metronix Entertainment LLP to developing 2D animations and scientific simulations for IIT Roorkee Virtual Labs, and founding the award-winning OCULUS Photography Club, I bring storytelling, bold visuals, and technical curiosity to every project.",
  ],
  stats: [
    { value: "04+", label: "Years Experience" },
    { value: "09+", label: "Organizations" },
    { value: "08+", label: "Honors & Accolades" },
  ],
  skills: [
    { name: "ADOBE PHOTOSHOP", category: "GRAPHIC DESIGN", level: "EXPERT" },
    { name: "ADOBE ILLUSTRATOR", category: "BRANDING & VECTOR", level: "EXPERT" },
    { name: "ADOBE PREMIERE PRO", category: "VIDEO EDITING", level: "EXPERT" },
    { name: "ADOBE AFTER EFFECTS", category: "MOTION & 2D", level: "ADVANCED" },
    { name: "FIGMA", category: "UI/UX DESIGN", level: "ADVANCED" },
    { name: "ADOBE INDESIGN", category: "LAYOUT & PRINT", level: "ADVANCED" },
    { name: "HTML5 & CSS3", category: "WEB DEVELOPMENT", level: "PROFICIENT" },
    { name: "PYTHON", category: "DATA SCIENCE & CODE", level: "PROFICIENT" },
    { name: "BRAND IDENTITY & SYSTEMS", category: "CREATIVE STRATEGY", level: "MASTERY" },
    { name: "2D ANIMATION & SIMULATION", category: "MOTION GRAPHICS", level: "ADVANCED" },
    { name: "WEBFLOW", category: "WEB DESIGN", level: "PROFICIENT" },
    { name: "JIRA & AHA!", category: "PRODUCT & PROJECT MGMT", level: "PROFICIENT" },
  ],
  projects: [
    {
      title: "METRONIX & PLUTUS WORLD BRAND IDENTITY",
      desc: "Spearheaded Metronix Entertainment's complete brand guidelines, visual identity system, and 5-year equity framework for the Plutus World adventure-park chain.",
      tags: ["BRAND IDENTITY", "ILLUSTRATOR", "PHOTOSHOP", "MARKETING"],
      link: "https://behance.net/Jeeshanpurohit",
    },
    {
      title: "IIT ROORKEE CHEMISTRY VIRTUAL LABS",
      desc: "Developed interactive 2D animations and scientific simulations translating complex chemical experiments into accessible e-learning modules. Awarded Certificate of Excellence.",
      tags: ["AFTER EFFECTS", "ILLUSTRATOR", "2D ANIMATION", "E-LEARNING"],
      link: "https://behance.net/Jeeshanpurohit",
    },
    {
      title: "VSUPPORTU HOSPITALITY & LIFESTYLE BRANDING",
      desc: "Led visual direction and produced high-performing social media creatives, motion graphics, and short-form video assets across digital platforms.",
      tags: ["VISUAL DIRECTION", "MOTION GRAPHICS", "VIDEO CONTENT"],
      link: "https://behance.net/Jeeshanpurohit",
    },
    {
      title: "FLAGSHIP MUNS & CONCLAVE IDENTITY SYSTEMS",
      desc: "Visual branding, animated logos, brochures, placards, and 2D opening ceremony visuals for TVSMUN 2024, Solidarieta Conclave 2024 & 2026, and JIETMUN 2023.",
      tags: ["EVENT BRANDING", "LOGO ANIMATION", "AFTER-FILMS", "ILLUSTRATOR"],
      link: "https://behance.net/Jeeshanpurohit",
    },
    {
      title: "E-COMMERCE & NIKE UI/UX CASE STUDY",
      desc: "Created an interactive E-Commerce website UI with HTML, CSS, JavaScript alongside a comprehensive Dark & Light mode Nike concept webpage in Figma.",
      tags: ["FIGMA", "HTML", "CSS", "UI/UX DESIGN"],
      link: "https://github.com/jeeshanpurohit",
    },
    {
      title: "OCULUS JIET PHOTOGRAPHY & AFTER-MOVIES",
      desc: "Founded the official photography club of JIET (awarded Best Club of the Year 2023-2024). Directed after-films, cinematic reels, and campus media coverage.",
      tags: ["PHOTOGRAPHY", "AFTER-FILMS", "LEADERSHIP", "LIGHTROOM"],
      link: "https://behance.net/Jeeshanpurohit",
    },
  ],
  services: [
    {
      title: "BRAND IDENTITY & STRATEGY",
      desc: "End-to-end brand guidelines, corporate identity books, typography systems, and pitch portfolios that define brand language from scratch.",
    },
    {
      title: "MOTION GRAPHICS & 2D ANIMATION",
      desc: "Translating complex narratives and scientific experiments into engaging, pedagogically accurate 2D animations and kinetic motion.",
    },
    {
      title: "COMMERCIAL VIDEO EDITING",
      desc: "High-octane event after-movies, short-form viral reels, dynamic transitions, and broadcast audio synchronization in Premiere Pro.",
    },
    {
      title: "UI/UX & WEB INTERFACES",
      desc: "Figma wireframing, interactive prototyping, dark and light mode UI architecture, and responsive frontend implementation.",
    }
  ],
  marquee: [
    "BRAND IDENTITY",
    "MOTION GRAPHICS",
    "2D ANIMATION",
    "VIDEO EDITING",
    "UI/UX DESIGN",
    "AFTER EFFECTS",
    "FIGMA",
    "ADOBE CREATIVE SUITE",
    "SCIENTIFIC SIMULATION",
    "CREATIVE DIRECTION",
  ],
};

import { isAudioGloballyEnabled } from "./context/AudioContext";
import { AudioToggle } from "./components/AudioToggle";

export { AudioToggle };

// ── SOUND ─────────────────────────────────────────────────────────────────────
let _audioCtx = null;
function getAudioCtx() {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return _audioCtx;
}
export function playHapticTone({ freq = 1100, type = "sine", duration = 0.055, gain = 0.09 } = {}) {
  if (!isAudioGloballyEnabled()) return;
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gainNode.gain.setValueAtTime(gain, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}

// ── NAVBAR ────────────────────────────────────────────────────────────────────
export function Navbar({ theme, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { path: "/about", label: "ABOUT" },
    { path: "/experience", label: "EXPERIENCE" },
    { path: "/skills", label: "SKILLS" },
    { path: "/projects", label: "PROJECTS" },
    { path: "/services", label: "SERVICES" },
  ];

  return (
    <nav className={`sp-nav${scrolled ? " scrolled" : ""}`}>
      <Link to="/" className="sp-nav-logo" onClick={() => setMenuOpen(false)}>
        <img src="/assets/logos/Jerrydotone.svg" alt="Jerrydotone" style={{ height: '32px', display: 'block' }} />
      </Link>

      <ul className={`sp-nav-links${menuOpen ? " open" : ""}`}>
        {links.map(({ path, label }) => (
          <li key={path}>
            <Link
              to={path}
              className={`sp-nav-link${location.pathname === path ? " active" : ""}`}
              onClick={() => setMenuOpen(false)}
              onMouseEnter={() => playHapticTone()}
            >
              {label}
            </Link>
          </li>
        ))}
        {/* Mobile-only contact, voice AI, & audio toggle in menu drawer */}
        <li className="sp-nav-mobile-contact-item">
          <Link
            to="/contact"
            className={`sp-nav-link${location.pathname === "/contact" ? " active" : ""}`}
            onClick={() => setMenuOpen(false)}
            onMouseEnter={() => playHapticTone()}
          >
            CONTACT
          </Link>
        </li>
        <li className="sp-nav-mobile-voice-item">
          <button
            type="button"
            className="sp-nav-mobile-voice-btn"
            onClick={() => {
              setMenuOpen(false);
              window.dispatchEvent(new CustomEvent("open-voice-assistant", { detail: { autoListen: true } }));
            }}
          >
            <span style={{ color: "var(--brand-primary, #FF5A00)", marginRight: "0.6rem" }}>●</span>
            TALK WITH JERRY (VOICE AI)
          </button>
        </li>
        <li className="sp-nav-mobile-audio">
          <AudioToggle />
        </li>
      </ul>

      {/* Nav Right Controls */}
      <div className="sp-nav-right">
        <button
          type="button"
          className="btn-nav-voice-ai"
          onClick={() => {
            window.dispatchEvent(new CustomEvent("open-voice-assistant", { detail: { autoListen: true } }));
          }}
          title="Talk with Jerry (AI Voice Assistant)"
          aria-label="Open AI Voice Assistant"
        >
          <span className="nav-voice-eq">
            <span className="nav-voice-bar vb-1" />
            <span className="nav-voice-bar vb-2" />
            <span className="nav-voice-bar vb-3" />
          </span>
          <span className="nav-voice-label">JERRY AI</span>
        </button>
        <Link
          to="/contact"
          className="sp-nav-contact-btn"
          onClick={() => setMenuOpen(false)}
          onMouseEnter={() => playHapticTone({ freq: 659, type: "sine", duration: 0.05 })}
        >
          <span>CONTACT</span>
          <span style={{ fontSize: '0.8rem' }}>→</span>
        </Link>
        <AudioToggle className="desktop-audio-toggle" />
        <button 
          className="sp-theme-toggle" 
          onClick={toggleTheme}
          onMouseEnter={() => playHapticTone({ freq: 880, type: "triangle", duration: 0.07 })}
          aria-label="Toggle Theme"
          title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
        >
          {theme === "light" ? (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </button>
      </div>

      <button className="sp-nav-burger" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
        <span /><span /><span />
      </button>
    </nav>
  );
}

// ── FOOTER WITH TERMS & PRIVACY ───────────────────────────────────────────────
export function Footer() {
  const [legalModal, setLegalModal] = useState(null); // 'terms' | 'privacy' | null

  return (
    <>
      <footer className="sp-footer">
        <div className="sp-footer-inner">
          <div className="sp-footer-brand">
            <Link to="/" className="sp-footer-logo">
              <img src="/assets/logos/Jerrydotone.svg" alt="Jerrydotone" style={{ height: '40px', display: 'block' }} />
            </Link>
            <p className="sp-footer-tagline">{DATA.tagline}</p>
          </div>
          <div className="sp-footer-links">
            <a href={DATA.linkedin} target="_blank" rel="noopener noreferrer">LINKEDIN</a>
            <a href={DATA.github} target="_blank" rel="noopener noreferrer">GITHUB</a>
            <a href={DATA.behance} target="_blank" rel="noopener noreferrer">BEHANCE</a>
            <a href={`mailto:${DATA.email}`}>EMAIL</a>
            <button 
              type="button"
              onClick={() => setLegalModal('terms')}
            >
              TERMS
            </button>
            <button 
              type="button"
              onClick={() => setLegalModal('privacy')}
            >
              PRIVACY
            </button>
          </div>
        </div>
        <div className="sp-footer-copy">
          © {new Date().getFullYear()} JEESHAN PUROHIT. ALL RIGHTS RESERVED. / INDEPENDENT VISUAL &amp; TECHNOLOGICAL PRACTICE.
        </div>
      </footer>

      {/* Legal Overlay Modal */}
      {legalModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(16, 25, 26, 0.85)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setLegalModal(null)}
        >
          <div 
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-card)',
              borderRadius: '4px',
              maxWidth: '650px',
              width: '100%',
              maxHeight: '85vh',
              overflowY: 'auto',
              padding: '2.5rem',
              color: 'var(--text-primary)',
              position: 'relative',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-card)', paddingBottom: '1rem' }}>
              <h3 style={{ fontFamily: 'var(--font-hero)', fontSize: '1.4rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {legalModal === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
              </h3>
              <button 
                onClick={() => setLegalModal(null)} 
                style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem 0.6rem' }}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {legalModal === 'terms' ? (
              <div style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                <p style={{ marginBottom: '1rem' }}>
                  <strong>1. Intellectual Property:</strong> All original client identities, motion assets, 2D animations, photography, code architecture, and visual deliverables presented on this portfolio are the proprietary work of Jeeshan Purohit and corresponding client rights holders.
                </p>
                <p style={{ marginBottom: '1rem' }}>
                  <strong>2. Authorized Usage:</strong> Materials may be viewed for evaluation, recruitment, and commission inquiries. No assets, marks, or code samples may be reproduced, redistributed, or fed into machine learning datasets without explicit prior written authorization.
                </p>
                <p style={{ marginBottom: '1rem' }}>
                  <strong>3. Engagements &amp; Deliverables:</strong> Professional commercial contracts, milestones, rights transfers, and payment schedules are governed by standalone signed statements of work (SOW).
                </p>
                <p>
                  For licensing or commission inquiries, contact: <a href="mailto:jeeshan233p@gmail.com" style={{ color: 'var(--red)', fontWeight: 700 }}>jeeshan233p@gmail.com</a>.
                </p>
              </div>
            ) : (
              <div style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                <p style={{ marginBottom: '1rem' }}>
                  <strong>1. Data Collection:</strong> This website collects only information voluntarily provided via the contact form or email inquiries (such as your name, email address, and project brief).
                </p>
                <p style={{ marginBottom: '1rem' }}>
                  <strong>2. Cookies &amp; Storage:</strong> Client preferences (such as audio mute toggle and dark/light color scheme) are stored locally in your browser session for seamless navigation. No invasive third-party ad tracking scripts are executed.
                </p>
                <p style={{ marginBottom: '1rem' }}>
                  <strong>3. Confidentiality:</strong> All project inquiries, nondisclosure agreements (NDAs), and business details transmitted through this domain are treated with complete professional discretion.
                </p>
                <p>
                  Questions regarding data handling may be directed to <a href="mailto:jeeshan233p@gmail.com" style={{ color: 'var(--red)', fontWeight: 700 }}>jeeshan233p@gmail.com</a>.
                </p>
              </div>
            )}

            <div style={{ marginTop: '2rem', textAlign: 'right' }}>
              <button 
                onClick={() => setLegalModal(null)} 
                className="sp-btn-dark"
                style={{ padding: '0.5rem 1.4rem', fontSize: '0.8rem', borderRadius: '4px' }}
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── SVG HELPERS ───────────────────────────────────────────────────────────────
export function WebSVG() {
  return (
    <>
      {/* Radial web lines */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <line
            key={angle}
            x1="100" y1="100"
            x2={100 + Math.cos(rad) * 110}
            y2={100 + Math.sin(rad) * 110}
            stroke="#c0c0c0" strokeWidth="0.8" opacity="0.6"
          />
        );
      })}
      {/* Concentric web rings */}
      {[20, 40, 60, 80, 100].map((r) => (
        <circle key={r} cx="100" cy="100" r={r} stroke="#c0c0c0" strokeWidth="0.8" fill="none" opacity="0.5" />
      ))}
    </>
  );
}

export function SkillsWebSVG() {
  return (
    <>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <line
            key={angle}
            x1="250" y1="200"
            x2={250 + Math.cos(rad) * 260}
            y2={200 + Math.sin(rad) * 260}
            stroke="#d0d0d0" strokeWidth="1" opacity="0.5"
          />
        );
      })}
      {[50, 100, 150, 200].map((r) => (
        <circle key={r} cx="250" cy="200" r={r} stroke="#d0d0d0" strokeWidth="1" fill="none" opacity="0.4" />
      ))}
    </>
  );
}
