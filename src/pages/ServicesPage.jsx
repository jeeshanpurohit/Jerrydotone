import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { servicesList } from "../data/portfolioData";
import { WebSVG } from "../shared";
import { useAudioContext } from "../context/AudioContext";

// Detailed 4-stage architectural execution pipeline per discipline
const servicePipelines = {
  "01": {
    domain: "Brand Identity Architecture & Strategy",
    stages: [
      {
        num: "01",
        title: "DISCOVERY & EQUITY AUDIT",
        description: "Competitor landscape teardown, audience demographic analysis, and creative positioning manifesto.",
        deliverable: "Strategic Brand Brief & Moodboard Matrix"
      },
      {
        num: "02",
        title: "VECTOR SYSTEM & TYPOGRAPHY",
        description: "Geometric logo construction, typography pairing hierarchies, and tailored color harmony tokens.",
        deliverable: "Vector Mark Exploration & Type Tokens"
      },
      {
        num: "03",
        title: "COLLATERAL & TOUCHPOINTS",
        description: "Application across corporate stationery, social media guidelines, pitch decks, and large-format print.",
        deliverable: "Comprehensive Behance-Level Brand Book"
      },
      {
        num: "04",
        title: "MASTER PACKAGING & DEPLOYMENT",
        description: "Clean vector exports across print CMYK and digital RGB with full licensing hand-off.",
        deliverable: "Master Asset Package (AI, SVG, PDF, EPS)"
      }
    ]
  },
  "02": {
    domain: "Motion Graphics & 2D Animation",
    stages: [
      {
        num: "01",
        title: "CONCEPT & SCRIPT PEDAGOGY",
        description: "Breaking down complex mechanisms or scientific experiments into key narrative steps.",
        deliverable: "Animatic Script & Storyboard Grid"
      },
      {
        num: "02",
        title: "VECTOR RIGGING & ASSET ART",
        description: "Crafting scalable vector assets, apparatus schemas, and character components in Illustrator.",
        deliverable: "Scalable Vector Rig Assets (AI / SVG)"
      },
      {
        num: "03",
        title: "AFTER EFFECTS MOTION CRAFT",
        description: "60fps kinetic motion choreography, easing curve optimization, and sound synchronization.",
        deliverable: "Motion Pre-Render & Kinetic Typography"
      },
      {
        num: "04",
        title: "MASTER EXPORTS & DELIVERY",
        description: "High-bitrate MP4 renders, transparent ProRes 4444 passes, or lightweight Lottie JSON for web.",
        deliverable: "4K Master Video & Web Lottie Deliverables"
      }
    ]
  },
  "03": {
    domain: "Commercial Video Editing & Post-Production",
    stages: [
      {
        num: "01",
        title: "FOOTAGE LOGGING & SELECTS",
        description: "Ingesting multi-camera RAW footage, audio alignment, and curating golden narrative moments.",
        deliverable: "Rough Assembly Cut & Rhythm Selection"
      },
      {
        num: "02",
        title: "RHYTHMIC NARRATIVE CUT",
        description: "Beat-synced dynamic editing in Premiere Pro with high-tension pacing and seamless transitions.",
        deliverable: "Fine Cut with Storyboard Flow"
      },
      {
        num: "03",
        title: "SOUND DESIGN & COLOR GRADE",
        description: "Foley sound-effect layering, cinematic LUT grading, audio normalization, and vocal clarity.",
        deliverable: "Polished Color Master & 5.1/Stereo Audio"
      },
      {
        num: "04",
        title: "MULTI-FORMAT DISTRIBUTION",
        description: "Platform-specific exports: 16:9 4K YouTube masters, 9:16 vertical Instagram Reels, and social cuts.",
        deliverable: "Full Resolution Reels & Master Conclave Film"
      }
    ]
  },
  "04": {
    domain: "UI/UX & Web Interface Engineering",
    stages: [
      {
        num: "01",
        title: "USER FLOWS & ARCHITECTURE",
        description: "Information architecture maps, wireframing user journeys, and establishing usability goals.",
        deliverable: "Wireframe Blueprints & Interaction Map"
      },
      {
        num: "02",
        title: "DESIGN TOKENS & FIGMA UI",
        description: "Tailored color palettes, typographic hierarchies, auto-layout components, and dark/light modes.",
        deliverable: "Figma Component Library & Design System"
      },
      {
        num: "03",
        title: "INTERACTIVE PROTOTYPING",
        description: "High-fidelity micro-interactions, state transitions, and responsive mobile mockups.",
        deliverable: "Clickable User Experience Prototype"
      },
      {
        num: "04",
        title: "FRONTEND HANDOFF & CODE",
        description: "Production-ready CSS tokens, semantic HTML5/JS structure, Web Audio API, and 3D canvas integration.",
        deliverable: "Clean Responsive Code & Component Guidelines"
      }
    ]
  }
};

// Interactive Scope Deliverables Checklist for Client Customization
const scopeDeliverablesList = [
  { id: "brand-book", category: "Brand", title: "Master Vector Brand Book & Style Guide", duration: "1.5 WEEKS", badge: "AI / PDF" },
  { id: "vector-identity", category: "Brand", title: "Vector Identity Architecture & Logo Variations", duration: "1 WEEK", badge: "SVG / EPS" },
  { id: "marketing-deck", category: "Brand", title: "Client Acquisition Pitch Deck / Brand Presentation", duration: "1 WEEK", badge: "FIGMA / PDF" },
  { id: "scientific-sim", category: "Motion", title: "2D Scientific Simulation / Educational Explainer", duration: "2 WEEKS", badge: "AE / MP4" },
  { id: "kinetic-logo", category: "Motion", title: "Kinetic Logo Reveal & Motion Graphics Bumper", duration: "4 DAYS", badge: "60FPS PRORES" },
  { id: "conclave-film", category: "Video", title: "4K Flagship Event / Conclave After-Movie (3-5 min)", duration: "2 WEEKS", badge: "PREMIERE / 4K" },
  { id: "reels-pack", category: "Video", title: "High-Retention Social Reels Retainer Pack (5-8 Reels)", duration: "1.5 WEEKS", badge: "9:16 VERTICAL" },
  { id: "figma-system", category: "UI/UX", title: "Figma Design System with Dark/Light Tokens", duration: "2 WEEKS", badge: "FIGMA AUTO-LAYOUT" },
  { id: "responsive-web", category: "UI/UX", title: "Responsive Frontend Web Application Architecture", duration: "2.5 WEEKS", badge: "REACT / CSS" }
];

export default function ServicesPage() {
  const [activeServiceIdx, setActiveServiceIdx] = useState(0);
  const [selectedScopeIds, setSelectedScopeIds] = useState(["brand-book", "figma-system"]);
  const [activePipelineStage, setActivePipelineStage] = useState(0);

  const navigate = useNavigate();
  const { playClick, playCardHover, playHover } = useAudioContext();

  const currentService = servicesList[activeServiceIdx] || servicesList[0];
  const currentPipeline = servicePipelines[currentService.number] || servicePipelines["01"];

  // Toggle scope item selection
  const handleToggleScope = (id) => {
    playClick?.();
    setSelectedScopeIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Calculate estimated sprint duration
  const estimatedSprint = useMemo(() => {
    const count = selectedScopeIds.length;
    if (count === 0) return "SELECT DISCIPLINES";
    if (count <= 2) return "1–2 WEEKS SPRINT";
    if (count <= 4) return "2–3 WEEKS SPRINT";
    return "3–5 WEEKS COMPREHENSIVE BUILD";
  }, [selectedScopeIds]);

  // Navigate to contact with pre-filled scope intent
  const handleCommissionScope = () => {
    playClick?.();
    const selectedTitles = scopeDeliverablesList
      .filter((item) => selectedScopeIds.includes(item.id))
      .map((item) => item.title)
      .join(", ");

    navigate(`/contact?scope=${encodeURIComponent(selectedTitles)}`);
  };

  return (
    <div className="sp-page-wrap">
      <section id="services" className="sp-section sp-services">
        {/* Web decor top-left */}
        <div className="sp-services-web-bg" aria-hidden="true">
          <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <WebSVG />
          </svg>
        </div>

        {/* ── SECTION HEADER ────────────────────────────────────────────────── */}
        <div className="sp-section-header">
          <span className="sp-eyebrow">
            <span className="sp-eyebrow-flag" />
            STUDIO DISCIPLINES &amp; COMMISSION BLUEPRINTS
          </span>
          <h2 className="sp-section-title">SERVICES.</h2>
          <div className="sp-title-underline" />
          <p style={{
            maxWidth: "740px",
            margin: "1.5rem auto 0",
            fontSize: "1.05rem",
            color: "var(--text-secondary)",
            lineHeight: 1.7
          }}>
            Creative and engineering offerings tailored for forward-thinking brands, corporate institutions, and digital creators. Built with disciplined Swiss architectural precision.
          </p>

          {/* Service Selector Tabs */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.6rem",
            marginTop: "2.5rem",
            flexWrap: "wrap"
          }}>
            {servicesList.map((svc, sIdx) => {
              const isActive = activeServiceIdx === sIdx;
              return (
                <button
                  key={sIdx}
                  onClick={() => {
                    playClick?.();
                    setActiveServiceIdx(sIdx);
                    setActivePipelineStage(0);
                  }}
                  onMouseEnter={() => playHover?.()}
                  style={{
                    background: isActive ? "var(--red)" : "var(--card-bg)",
                    color: isActive ? "#fff" : "var(--text-secondary)",
                    border: `1px solid ${isActive ? "var(--red)" : "var(--border-card)"}`,
                    padding: "0.55rem 1.15rem",
                    borderRadius: "4px",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: "1px",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  //{svc.number} {svc.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── ACTIVE SERVICE ARCHITECTURAL BLUEPRINT ─────────────────────────── */}
        <div style={{
          maxWidth: "1200px",
          margin: "3rem auto 0",
          background: "var(--card-bg)",
          border: "1px solid var(--border-card)",
          borderTop: "3px solid var(--red)",
          borderRadius: "4px",
          padding: "2.5rem",
          position: "relative",
          zIndex: 1,
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)"
        }}>
          {/* Header of Active Service */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "1.5rem",
            borderBottom: "1px solid var(--border-card)",
            paddingBottom: "1.8rem",
            marginBottom: "2rem"
          }}>
            <div>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                fontWeight: 800,
                color: "var(--red)",
                letterSpacing: "1px",
                marginBottom: "0.3rem"
              }}>
                [DISCIPLINE SPECIFICATION // #{currentService.number}]
              </div>
              <h3 style={{
                fontFamily: "var(--font-hero)",
                fontSize: "2rem",
                fontWeight: 900,
                color: "var(--text-primary)",
                lineHeight: 1.15
              }}>
                {currentService.title}
              </h3>
              <p style={{
                fontSize: "0.95rem",
                color: "var(--brand-primary)",
                fontWeight: 700,
                marginTop: "0.3rem"
              }}>
                {currentService.tagline}
              </p>
            </div>

            <button
              onClick={() => navigate(`/contact?discipline=${encodeURIComponent(currentService.title)}`)}
              className="sp-btn-red"
              style={{
                fontSize: "0.75rem",
                padding: "0.6rem 1.2rem",
                cursor: "pointer"
              }}
            >
              COMMISSION THIS DISCIPLINE →
            </button>
          </div>

          {/* Discipline Description & Deliverable Manifest */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
            marginBottom: "2.5rem"
          }}>
            <div>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                fontWeight: 800,
                letterSpacing: "1px",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                marginBottom: "0.6rem"
              }}>
                // OVERVIEW &amp; PHILOSOPHY:
              </div>
              <p style={{
                fontSize: "1rem",
                color: "var(--text-secondary)",
                lineHeight: 1.7
              }}>
                {currentService.description}
              </p>

              <div style={{
                marginTop: "1.5rem",
                padding: "1rem",
                background: "var(--bg-secondary)",
                borderLeft: "2px solid var(--red)",
                borderRadius: "2px"
              }}>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  color: "var(--red)",
                  textTransform: "uppercase",
                  letterSpacing: "1px"
                }}>
                  MASTER DELIVERABLES PACKAGE:
                </div>
                <div style={{
                  fontSize: "0.88rem",
                  color: "var(--text-primary)",
                  fontWeight: 600,
                  marginTop: "0.3rem"
                }}>
                  {currentService.deliverables}
                </div>
              </div>
            </div>

            <div>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                fontWeight: 800,
                letterSpacing: "1px",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                marginBottom: "0.6rem"
              }}>
                // PRODUCTION CHECKLIST:
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {currentService.points.map((pt, pIdx) => (
                  <div
                    key={pIdx}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.75rem",
                      fontSize: "0.95rem",
                      color: "var(--text-primary)",
                      lineHeight: 1.55,
                      padding: "0.6rem 0.8rem",
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border-card)",
                      borderRadius: "2px"
                    }}
                  >
                    <span style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      color: "var(--red)"
                    }}>
                      [0{pIdx + 1}]
                    </span>
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── 4-STAGE ARCHITECTURAL EXECUTION PIPELINE ─────────────────────── */}
          <div style={{
            borderTop: "1px solid var(--border-card)",
            paddingTop: "2rem"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.2rem",
              flexWrap: "wrap",
              gap: "0.5rem"
            }}>
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.78rem",
                fontWeight: 800,
                letterSpacing: "1px",
                color: "var(--red)",
                textTransform: "uppercase"
              }}>
                // 4-STAGE ARCHITECTURAL EXECUTION PIPELINE:
              </span>
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                color: "var(--text-muted)"
              }}>
                DISCIPLINED SWISS WORKFLOW
              </span>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "1rem"
            }}>
              {currentPipeline.stages.map((stage, sIdx) => {
                const isSelected = activePipelineStage === sIdx;
                return (
                  <div
                    key={sIdx}
                    onClick={() => {
                      playClick?.();
                      setActivePipelineStage(sIdx);
                    }}
                    onMouseEnter={() => playCardHover?.()}
                    style={{
                      background: isSelected ? "var(--bg-secondary)" : "var(--card-bg)",
                      border: `1px solid ${isSelected ? "var(--red)" : "var(--border-card)"}`,
                      borderTop: isSelected ? "3px solid var(--red)" : "1px solid var(--border-card)",
                      borderRadius: "3px",
                      padding: "1.3rem",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.75rem",
                        fontWeight: 900,
                        color: isSelected ? "var(--red)" : "var(--text-muted)"
                      }}>
                        PHASE {stage.num}
                      </span>
                      {isSelected && (
                        <span style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.65rem",
                          fontWeight: 800,
                          color: "var(--red)"
                        }}>
                          ACTIVE
                        </span>
                      )}
                    </div>

                    <h4 style={{
                      fontFamily: "var(--font-hero)",
                      fontSize: "1rem",
                      fontWeight: 800,
                      color: "var(--text-primary)",
                      lineHeight: 1.25
                    }}>
                      {stage.title}
                    </h4>

                    <p style={{
                      fontSize: "0.82rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.5
                    }}>
                      {stage.description}
                    </p>

                    <div style={{
                      marginTop: "auto",
                      paddingTop: "0.5rem",
                      borderTop: "1px dashed var(--border-card)",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.68rem",
                      color: "var(--brand-primary)",
                      fontWeight: 700
                    }}>
                      ↳ {stage.deliverable}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── INTERACTIVE SCOPE CALCULATOR & COMMISSION BUILDER ───────────────── */}
        <div style={{
          maxWidth: "1200px",
          margin: "5rem auto 0",
          background: "var(--card-bg)",
          border: "1px solid var(--border-card)",
          borderRadius: "4px",
          padding: "2.5rem",
          position: "relative",
          zIndex: 1
        }}>
          <div style={{
            borderBottom: "1px solid var(--border-card)",
            paddingBottom: "1.5rem",
            marginBottom: "2rem"
          }}>
            <span style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              fontWeight: 800,
              letterSpacing: "1px",
              color: "var(--red)",
              textTransform: "uppercase"
            }}>
              [CUSTOM SCOPE CALCULATOR]
            </span>
            <h3 style={{
              fontFamily: "var(--font-hero)",
              fontSize: "1.85rem",
              fontWeight: 900,
              color: "var(--text-primary)",
              marginTop: "0.3rem"
            }}>
              CONFIGURE YOUR COMMISSION MANIFEST.
            </h3>
            <p style={{
              fontSize: "0.95rem",
              color: "var(--text-secondary)",
              marginTop: "0.3rem"
            }}>
              Select the deliverables you require to generate an estimated production timeline and pass your requirements directly to Jeeshan.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "minmax(300px, 1fr) minmax(300px, 380px)",
            gap: "2.5rem",
            alignItems: "start"
          }}>
            {/* Checklist of Available Deliverables */}
            <div>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                fontWeight: 800,
                color: "var(--text-muted)",
                letterSpacing: "1px",
                marginBottom: "1rem"
              }}>
                SELECT SCOPE ITEMS ({selectedScopeIds.length} SELECTED):
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {scopeDeliverablesList.map((item) => {
                  const isChecked = selectedScopeIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      role="checkbox"
                      aria-checked={isChecked}
                      tabIndex={0}
                      onClick={() => handleToggleScope(item.id)}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleToggleScope(item.id); }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0.9rem 1.2rem",
                        background: isChecked ? "var(--bg-secondary)" : "var(--card-bg)",
                        border: `1px solid ${isChecked ? "var(--red)" : "var(--border-card)"}`,
                        borderLeft: isChecked ? "3px solid var(--red)" : "1px solid var(--border-card)",
                        borderRadius: "3px",
                        cursor: "pointer",
                        transition: "all 0.15s ease"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                        <div style={{
                          width: "16px",
                          height: "16px",
                          border: `2px solid ${isChecked ? "var(--red)" : "var(--border-card)"}`,
                          background: isChecked ? "var(--red)" : "transparent",
                          borderRadius: "2px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontSize: "0.65rem",
                          fontWeight: 900
                        }}>
                          {isChecked ? "✓" : ""}
                        </div>

                        <div>
                          <div style={{
                            fontSize: "0.92rem",
                            fontWeight: 700,
                            color: "var(--text-primary)"
                          }}>
                            {item.title}
                          </div>
                          <div style={{
                            fontSize: "0.68rem",
                            fontFamily: "var(--font-mono)",
                            color: "var(--text-muted)",
                            marginTop: "2px"
                          }}>
                            FORMAT: {item.badge}
                          </div>
                        </div>
                      </div>

                      <span style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.7rem",
                        fontWeight: 800,
                        color: isChecked ? "var(--red)" : "var(--text-muted)",
                        background: isChecked ? "rgba(255, 90, 0, 0.1)" : "transparent",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "2px"
                      }}>
                        ~{item.duration}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Commission Manifest Summary Box */}
            <div style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-card)",
              borderTop: "3px solid var(--red)",
              borderRadius: "4px",
              padding: "2rem"
            }}>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                fontWeight: 800,
                color: "var(--red)",
                letterSpacing: "1px",
                marginBottom: "0.5rem"
              }}>
                [LIVE COMMISSION MANIFEST]
              </div>
              <h4 style={{
                fontFamily: "var(--font-hero)",
                fontSize: "1.35rem",
                fontWeight: 900,
                color: "var(--text-primary)",
                lineHeight: 1.2
              }}>
                PROJECT SPRINT ESTIMATE
              </h4>

              <div style={{
                margin: "1.2rem 0",
                padding: "1rem",
                background: "var(--card-bg)",
                border: "1px solid var(--border-card)",
                borderRadius: "3px"
              }}>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  color: "var(--text-muted)",
                  textTransform: "uppercase"
                }}>
                  ESTIMATED TIMELINE HORIZON:
                </div>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "1.3rem",
                  fontWeight: 900,
                  color: "var(--brand-primary)",
                  marginTop: "0.2rem"
                }}>
                  {estimatedSprint}
                </div>
                <div style={{
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  marginTop: "0.3rem"
                }}>
                  Sprint pacing includes milestone reviews and revision rounds.
                </div>
              </div>

              {/* Selected Items Manifest */}
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  color: "var(--text-muted)",
                  letterSpacing: "0.5px",
                  marginBottom: "0.5rem"
                }}>
                  CONFIGURED DELIVERABLES ({selectedScopeIds.length}):
                </div>
                {selectedScopeIds.length === 0 ? (
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                    No items selected yet. Choose items from the left.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    {scopeDeliverablesList
                      .filter((item) => selectedScopeIds.includes(item.id))
                      .map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            fontSize: "0.8rem",
                            color: "var(--text-primary)",
                            display: "flex",
                            alignItems: "center",
                            gap: "0.4rem"
                          }}
                        >
                          <span style={{ color: "var(--red)", fontFamily: "var(--font-mono)", fontSize: "0.7rem" }}>▸</span>
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {item.title}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* CTA to Commission with Scope */}
              <button
                disabled={selectedScopeIds.length === 0}
                onClick={handleCommissionScope}
                className="sp-btn-red"
                style={{
                  width: "100%",
                  textAlign: "center",
                  fontSize: "0.8rem",
                  padding: "0.75rem 1rem",
                  cursor: selectedScopeIds.length === 0 ? "not-allowed" : "pointer",
                  opacity: selectedScopeIds.length === 0 ? 0.5 : 1
                }}
              >
                INITIATE COMMISSION WITH THIS SCOPE →
              </button>

              <div style={{
                textAlign: "center",
                marginTop: "0.8rem",
                fontSize: "0.72rem",
                color: "var(--text-muted)"
              }}>
                Direct contract agreement // Non-disclosure protected
              </div>
            </div>
          </div>
        </div>

        {/* ── BOTTOM COMMISSION BANNER ────────────────────────────────────────── */}
        <div style={{
          maxWidth: "1200px",
          margin: "5rem auto 2rem",
          padding: "2.5rem",
          borderRadius: "4px",
          borderLeft: "4px solid var(--red)",
          background: "var(--card-bg)",
          border: "1px solid var(--border-card)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.5rem"
        }}>
          <div>
            <div style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.72rem",
              fontWeight: 800,
              color: "var(--red)",
              letterSpacing: "1px"
            }}>
              [RAPID DISPATCH &amp; DIRECT CONSULTATION]
            </div>
            <h4 style={{
              fontFamily: "var(--font-hero)",
              fontSize: "1.5rem",
              fontWeight: 900,
              color: "var(--text-primary)",
              marginTop: "0.3rem"
            }}>
              HAVE A BESPOKE DIRECTIVE IN MIND?
            </h4>
            <p style={{
              fontSize: "0.92rem",
              color: "var(--text-secondary)",
              marginTop: "0.2rem"
            }}>
              From urgent event media production to enterprise brand architecture, direct consultations are open.
            </p>
          </div>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link to="/contact" className="sp-btn-red" style={{ textDecoration: "none", fontSize: "0.78rem" }}>
              INITIATE DIRECT DIALOGUE →
            </Link>
            <a
              href="mailto:jerrydotone@gmail.com"
              className="sp-btn-dark"
              style={{ textDecoration: "none", fontSize: "0.78rem" }}
            >
              EMAIL JEESHAN DIRECTLY
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
