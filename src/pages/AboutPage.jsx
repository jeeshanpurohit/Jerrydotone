import React from "react";
import { Link } from "react-router-dom";
import { DATA } from "../shared";
import { educationList, certificationsList } from "../data/portfolioData";

export default function AboutPage() {
  return (
    <div className="sp-page-wrap">
      <section id="about" className="sp-section sp-about">
        <div className="sp-section-header">
          <span className="sp-eyebrow">
            <span className="sp-eyebrow-flag" />
            BEHIND THE CREATIVE
          </span>
          <h2 className="sp-section-title">JEESHAN<br />PUROHIT.</h2>
          <div className="sp-title-underline" />
          <p style={{
            maxWidth: "680px",
            margin: "1.5rem auto 0",
            fontSize: "1.05rem",
            color: "var(--text-secondary)",
            lineHeight: 1.7
          }}>
            Multidisciplinary Visual Designer with a B.Tech. in Computer Science &amp; Engineering, blending bold creative vision with computational precision.
          </p>
        </div>

        <div className="sp-about-grid">
          <div className="sp-about-bio">
            {DATA.about.map((p, i) => (
              <p key={i} className="sp-about-para">{p}</p>
            ))}

            <div style={{ marginTop: "1rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link to="/experience" className="sp-btn-red" style={{ textDecoration: "none" }}>
                VIEW CAREER TIMELINE &rarr;
              </Link>
              <Link to="/skills" className="sp-btn-dark" style={{ textDecoration: "none" }}>
                EXPLORE ARSENAL &rarr;
              </Link>
            </div>
          </div>

          <div className="sp-about-stats">
            {DATA.stats.map((s, i) => (
              <div key={i} className="sp-stat-card">
                <span className="sp-stat-value">{s.value}</span>
                <span className="sp-stat-label">{s.label}</span>
              </div>
            ))}

            {/* Quick Education Card */}
            <div style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border-card)",
              borderRadius: "4px",
              padding: "1.5rem",
              marginTop: "0.5rem"
            }}>
              <div style={{ fontSize: "0.7rem", fontWeight: 800, color: "var(--red)", textTransform: "uppercase", letterSpacing: "1px" }}>
                EDUCATION
              </div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", marginTop: "0.3rem" }}>
                B.Tech in Computer Science &amp; Engineering
              </div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-secondary)", marginTop: "0.2rem" }}>
                JIET Jodhpur &bull; 7.0 CGPA (2021 - 2025)
              </div>
            </div>
          </div>
        </div>

        {/* Career & Leadership Milestones (Asymmetrical Editorial Layout) */}
        <div style={{ maxWidth: "1100px", margin: "5rem auto 0" }}>
          <div className="sp-section-header" style={{ marginBottom: "2.5rem" }}>
            <span className="sp-eyebrow">
              <span className="sp-eyebrow-flag" />
              KEY MILESTONES
            </span>
            <h3 className="sp-section-title" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)" }}>
              LANDMARK ROLES.
            </h3>
            <div className="sp-title-underline" />
          </div>

          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.2rem"
          }}>
            {[
              {
                period: "2026 - PRESENT",
                role: "Marketing & Brand Lead",
                org: "Metronix Entertainment LLP (Jaipur)",
                desc: "Spearheaded complete brand identity and content infrastructure from scratch (brand guidelines, visual system, Behance-level brand book). Built the comprehensive 5-year equity framework for the Plutus World adventure-park chain.",
                tag: "BRAND ARCHITECTURE"
              },
              {
                period: "2024",
                role: "Website Developer & Animation Specialist",
                org: "IIT Roorkee Virtual Labs",
                desc: "Engineered interactive 2D simulations and educational animations in After Effects and Illustrator for chemistry experiments. Awarded Certificate of Excellence for pedagogical accuracy and motion craft.",
                tag: "SCIENTIFIC SIMULATION"
              },
              {
                period: "2022 - 2025",
                role: "Founder & President",
                org: "OCULUS Photography & Media Club",
                desc: "Founded and expanded the official creative media community across JIET. Directed commercial after-films, campus festival reels, and visual branding. Awarded Best College Club of the Year (2023-2024).",
                tag: "COMMUNITY LEADERSHIP"
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="sp-milestone-card"
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--red)";
                  e.currentTarget.style.background = "var(--bg-secondary)";
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
                    letterSpacing: "1.5px",
                    color: "var(--red)",
                    textTransform: "uppercase",
                    display: "block"
                  }}>
                    {item.period}
                  </span>
                  <span style={{
                    fontSize: "0.7rem",
                    fontWeight: 800,
                    letterSpacing: "0.5px",
                    color: "var(--text-muted)",
                    textTransform: "uppercase",
                    marginTop: "0.3rem",
                    display: "block"
                  }}>
                    {item.tag}
                  </span>
                </div>

                <div>
                  <h4 style={{
                    fontFamily: "var(--font-hero)",
                    fontSize: "1.35rem",
                    fontWeight: 800,
                    color: "var(--text-primary)",
                    lineHeight: 1.2
                  }}>
                    {item.role}
                  </h4>
                  <div style={{
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: "var(--red)",
                    margin: "0.3rem 0 0.8rem"
                  }}>
                    {item.org}
                  </div>
                  <p style={{
                    fontSize: "0.92rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.65,
                    margin: 0
                  }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
