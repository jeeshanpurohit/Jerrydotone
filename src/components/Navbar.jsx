import React, { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { personalInfo } from "../data/portfolioData";
import { AudioToggle } from "./AudioToggle";
import { useSound } from "../hooks/useSound";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { playHover, playClick, playNav } = useSound();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navLinks = [
    { to: "/", label: "Home", end: true },
    { to: "/projects", label: "Projects" },
    { to: "/services", label: "Services" },
    { to: "/experience", label: "Experience" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className={`navbar${scrolled ? " scrolled" : ""}`}>
      <Link to="/" className="nav-brand" title="Jerrydotone // Jeeshan Purohit" onMouseEnter={playNav}>
        <div className="nav-brand-mark">
          <img src="/assets/logos/Jerrydotone.svg" alt="Jerrydotone" className="nav-brand-logo-img" />
        </div>
        <div className="nav-brand-text">
          <div className="nav-brand-name">JEESHAN PUROHIT<span className="brand-dot">.</span></div>
          <div className="nav-brand-sub">jerrydotone // monolith</div>
        </div>
      </Link>

      <nav className={`nav-links${mobileOpen ? " mobile-open" : ""}`}>
        {navLinks.map(({ to, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
            onMouseEnter={playHover}
            onClick={playClick}
          >
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="nav-actions">
        <button
          type="button"
          className="btn-nav-voice-ai"
          onClick={() => {
            playClick();
            window.dispatchEvent(new CustomEvent("open-voice-assistant", { detail: { autoListen: true } }));
          }}
          onMouseEnter={playHover}
          title="Talk with Jerry (AI Voice Assistant)"
          aria-label="Open AI Voice Assistant"
        >
          <span className="nav-voice-eq">
            <span className="nav-voice-bar vb-1" />
            <span className="nav-voice-bar vb-2" />
            <span className="nav-voice-bar vb-3" />
          </span>
          <span className="nav-voice-label">VOICE AI</span>
        </button>
        <AudioToggle />
        <a
          href={personalInfo.resumePdf}
          download="Jeeshan_Purohit_Resume_ATS.pdf"
          className="btn-nav-resume"
          onMouseEnter={playHover}
          onClick={playClick}
        >
          Resume ↓
        </a>
        <Link
          to="/contact"
          className="btn-nav-contact"
          onMouseEnter={playHover}
          onClick={playClick}
        >
          Get in Touch
        </Link>
        <button
          className="mobile-toggle-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>
    </header>
  );
}
