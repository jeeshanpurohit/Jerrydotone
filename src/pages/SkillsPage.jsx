import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { technicalSkills, certificationsList } from "../data/portfolioData";
import { SkillsWebSVG } from "../shared";
import { useAudioContext } from "../context/AudioContext";

// Master Skill Arsenal with battle-tested real-world portfolio footprint
const masterSkillData = [
  {
    id: "ps",
    name: "Adobe Photoshop",
    category: "Graphic Design & Imaging",
    discipline: "toolkit",
    level: "Expert",
    pct: 95,
    tag: "PS",
    tier: "expert",
    footprint: "Commercial poster architecture, photo manipulation, social media campaign key visuals, and Jerrydotart brand collateral.",
    capabilities: ["Raster Editing", "Compositing", "Color Grading", "Key Art Direction", "Mockup Staging"],
    projectsUsed: ["Plutus Adventure Park", "TVSMUN Branding", "Resonance Fest Posters"]
  },
  {
    id: "ai",
    name: "Adobe Illustrator",
    category: "Vector & Brand Systems",
    discipline: "toolkit",
    level: "Expert",
    pct: 95,
    tag: "AI",
    tier: "expert",
    footprint: "Master vector identity books, icon sets, brand guideline manuals, and scalable scientific lab apparatus graphics.",
    capabilities: ["Vector Geometry", "Logo Architecture", "Typography Systems", "Print Layouts", "SVG Assets"],
    projectsUsed: ["Metronix Brand Guidelines", "IIT Roorkee Apparatus", "Solidarieta Conclave"]
  },
  {
    id: "pr",
    name: "Adobe Premiere Pro",
    category: "Video Editing & Post-Production",
    discipline: "toolkit",
    level: "Expert",
    pct: 92,
    tag: "PR",
    tier: "expert",
    footprint: "High-octane conclave after-movies, rhythmic festival promo reels, audio synchronization, and narrative editing.",
    capabilities: ["Multi-Cam Editing", "Dynamic Cutting", "Audio Mixing", "Color Grading", "Social 9:16 Formats"],
    projectsUsed: ["Resonance After-Film", "Ideaforage Game Promos", "Oculus Event Reels"]
  },
  {
    id: "ae",
    name: "Adobe After Effects",
    category: "Motion Graphics & 2D Animation",
    discipline: "toolkit",
    level: "Advanced",
    pct: 88,
    tag: "AE",
    tier: "advanced",
    footprint: "2D pedagogical chemistry simulations for IIT Roorkee, kinetic logo reveals, event intro animations, and transition craft.",
    capabilities: ["Kinetic Typography", "2D Simulation", "Shape Animation", "Audio Syncing", "Visual Effects"],
    projectsUsed: ["IIT Roorkee Virtual Labs", "JIETMUN Intro Reel", "Logo Reveals"]
  },
  {
    id: "fg",
    name: "Figma",
    category: "UI/UX & Interactive Prototyping",
    discipline: "toolkit",
    level: "Advanced",
    pct: 90,
    tag: "FG",
    tier: "expert",
    footprint: "Design systems, responsive website wireframes, dark/light token architecture, and high-fidelity clickable prototypes.",
    capabilities: ["Component Variants", "Auto-Layout", "Design Tokens", "Wireframing", "Interactive Prototypes"],
    projectsUsed: ["Jerrydotone Portfolio", "UX Case Studies", "Design Token Library"]
  },
  {
    id: "id",
    name: "Adobe InDesign",
    category: "Editorial & Print Layout",
    discipline: "toolkit",
    level: "Advanced",
    pct: 85,
    tag: "ID",
    tier: "advanced",
    footprint: "Editorial conclave brochures, multi-page brand books, delegate manuals, and print-ready publishing assets.",
    capabilities: ["Editorial Grid", "Multi-Page Layouts", "Pre-Press Flight", "Brochure Design", "Typography Hierarchy"],
    projectsUsed: ["Conclave Brochures", "Metronix Brand Book", "Event Placards"]
  },
  {
    id: "wf",
    name: "Webflow",
    category: "Responsive Web Design",
    discipline: "toolkit",
    level: "Proficient",
    pct: 80,
    tag: "WF",
    tier: "proficient",
    footprint: "Responsive visual web development, CMS schema design, micro-interactions, and client-friendly landing pages.",
    capabilities: ["Box Model", "CMS Collections", "CSS Grid Layout", "Custom Interactions", "SEO Best Practices"],
    projectsUsed: ["Client Landing Pages", "Boutique Showcase Sites"]
  },
  {
    id: "web",
    name: "HTML5 & CSS3 / Modern Web",
    category: "Frontend Web Engineering",
    discipline: "toolkit",
    level: "Proficient",
    pct: 85,
    tag: "WEB",
    tier: "advanced",
    footprint: "Architectural web styling, CSS custom properties (tokens), responsive layouts, Web Audio API, and CSS 3D transforms.",
    capabilities: ["Semantic HTML5", "Vanilla CSS3", "Design Tokens", "CSS 3D Transforms", "Web Audio API"],
    projectsUsed: ["Spider-Persona Monolith", "Interactive 3D Fan Carousel", "Synthesized Audio Engine"]
  },
  {
    id: "js",
    name: "JavaScript (ES6+) & React",
    category: "Interactive Web Interfaces",
    discipline: "toolkit",
    level: "Proficient",
    pct: 82,
    tag: "JS",
    tier: "proficient",
    footprint: "State-driven carousel engines, interactive scrubber controls, speech synthesis, and real-time audio contexts.",
    capabilities: ["React Hooks", "DOM Pointer Events", "Web Speech API", "AudioContext Synth", "Component Architecture"],
    projectsUsed: ["ProjectsWheelCarousel", "AI Voice Engine", "Portfolio HUD"]
  },
  {
    id: "py",
    name: "Python 3.x",
    category: "Data Science & Computational Logic",
    discipline: "toolkit",
    level: "Proficient",
    pct: 80,
    tag: "PY",
    tier: "proficient",
    footprint: "Algorithmic data structures, pipeline scripting, dataset analysis during HDLC internship, and B.Tech CSE core curriculum.",
    capabilities: ["Data Structures", "Pandas / NumPy Basics", "Script Automation", "Algorithmic Logic", "Data Cleaning"],
    projectsUsed: ["HDLC Technologies Internship", "B.Tech Engineering Labs"]
  },
  {
    id: "pm",
    name: "Jira, Aha! & Notion",
    category: "Product & Project Management",
    discipline: "toolkit",
    level: "Proficient",
    pct: 85,
    tag: "PM",
    tier: "advanced",
    footprint: "Creative squad task delegation, sprint tracking, production documentation wikis, and client milestone delivery.",
    capabilities: ["Sprint Planning", "Kanban Workflows", "Documentation Wikis", "Backlog Grooming", "Milestone Tracking"],
    projectsUsed: ["Oculus Club Operations", "Metronix Campaign Sprints"]
  },

  // DESIGN & UI/UX DISCIPLINES
  {
    id: "d-brand",
    name: "Brand Identity Architecture",
    category: "Visual Systems",
    discipline: "design",
    level: "Mastery",
    pct: 96,
    tag: "01",
    tier: "mastery",
    footprint: "Holistic design language systems, brand books, guidelines, and market positioning for adventure parks, cafes, and conclaves.",
    capabilities: ["Visual DNA", "Brand Books", "Guideline Formats", "Typography Scales", "Color Harmonies"],
    projectsUsed: ["Plutus World Metronix", "TVSMUN 2024", "Jerrydotart Systems"]
  },
  {
    id: "d-uiux",
    name: "UI/UX Design & Wireframing",
    category: "Product Design",
    discipline: "design",
    level: "Advanced",
    pct: 88,
    tag: "02",
    tier: "advanced",
    footprint: "Low-to-high fidelity wireframing, user journey maps, usability heuristics, and information hierarchy.",
    capabilities: ["Wireframing", "User Flows", "Information Architecture", "Heuristic Evaluation", "Figma Auto-Layout"],
    projectsUsed: ["Jerrydotone Case Studies", "Event Registration Flow"]
  },
  {
    id: "d-visual",
    name: "Visual Design & Typography",
    category: "Graphic Design",
    discipline: "design",
    level: "Mastery",
    pct: 95,
    tag: "03",
    tier: "mastery",
    footprint: "Editorial grid layouts, Swiss-inspired typographic contrast, hierarchy balancing, and architectural negative space.",
    capabilities: ["Grid Systems", "Typographic Scale", "Negative Space", "Color Theory", "Asset Composition"],
    projectsUsed: ["Spider-Persona Monolith", "Corporate Brand Collateral"]
  },
  {
    id: "d-guidelines",
    name: "Design System Guidelines",
    category: "Brand Equity",
    discipline: "design",
    level: "Expert",
    pct: 92,
    tag: "04",
    tier: "expert",
    footprint: "Cross-platform token architectures, component libraries, typography hierarchy, and accessibility contrast standards.",
    capabilities: ["Tokens Architecture", "Component Libraries", "Asset Packaging", "Design Hand-off", "WCAG Contrast"],
    projectsUsed: ["Metronix Design Tokens", "JIET Media Kit"]
  },
  {
    id: "d-proto",
    name: "Interactive Prototyping",
    category: "UI/UX Engineering",
    discipline: "design",
    level: "Advanced",
    pct: 86,
    tag: "05",
    tier: "advanced",
    footprint: "Clickable prototypes simulating micro-interactions, mobile gestures, and modal view transitions.",
    capabilities: ["State Variants", "Smart Animate", "Micro-Interactions", "Mobile Gesture Mappings"],
    projectsUsed: ["Mobile App Prototypes", "Interactive Showcase"]
  },

  // MOTION & VIDEO DISCIPLINES
  {
    id: "m-commercial",
    name: "Commercial Video Editing",
    category: "Video Production",
    discipline: "motion",
    level: "Expert",
    pct: 95,
    tag: "01",
    tier: "expert",
    footprint: "Broadcast-quality pacing, sound-effect layering, color grading, and multi-track audio mastering.",
    capabilities: ["Rhythmic Cutting", "Sound Design", "Audio Layering", "Color Grading", "Social Retainers"],
    projectsUsed: ["Resonance Cultural Fest", "VSupportU Lifestyle Reels"]
  },
  {
    id: "m-sim",
    name: "2D Scientific Simulation",
    category: "Educational E-Learning",
    discipline: "motion",
    level: "Specialist",
    pct: 90,
    tag: "02",
    tier: "expert",
    footprint: "Converting chemical reaction equations and physical apparatus workflows into clear vector animations.",
    capabilities: ["Vector Apparatus Rigging", "Pedagogical Clarity", "Reaction Keyframing", "Virtual Labs Standard"],
    projectsUsed: ["IIT Roorkee Virtual Labs (Excellence Award)"]
  },
  {
    id: "m-afterfilm",
    name: "After-Films & Conclave Media",
    category: "Conclave Media",
    discipline: "motion",
    level: "Expert",
    pct: 94,
    tag: "03",
    tier: "expert",
    footprint: "High-energy festival storytelling, drone shot integration, speaker spotlights, and conclave highlights.",
    capabilities: ["Story Arc Construction", "Beat-Matched Transitions", "Title Sequencing", "High-Resolution Output"],
    projectsUsed: ["Resonance After-Film", "JIETMUN 2023", "Solidarieta Conclave"]
  },
  {
    id: "m-kinetic",
    name: "Kinetic Motion Graphics",
    category: "Visual Effects",
    discipline: "motion",
    level: "Advanced",
    pct: 88,
    tag: "04",
    tier: "advanced",
    footprint: "Dynamic text transitions, logo bumper stings, promotional intros, and broadcast lower-thirds.",
    capabilities: ["Kinetic Typography", "Lower-Thirds", "Logo Stings", "Graphic Transitions"],
    projectsUsed: ["Event Promo Sequences", "Corporate Intro Teasers"]
  },

  // LEADERSHIP & STRATEGY
  {
    id: "l-community",
    name: "Creative Community Leadership",
    category: "Founder & President",
    discipline: "leadership",
    level: "Proven",
    pct: 95,
    tag: "01",
    tier: "mastery",
    footprint: "Founded OCULUS JIET Photography Club; built a 40+ member creative squad that won Best Club of the Year.",
    capabilities: ["Community Building", "Creative Squad Mentorship", "Talent Recruitment", "Event Delegation"],
    projectsUsed: ["OCULUS JIET (Best Club of the Year 2023-2024)"]
  },
  {
    id: "l-event",
    name: "Event Media Direction",
    category: "Conclave Operations",
    discipline: "leadership",
    level: "Expert",
    pct: 92,
    tag: "02",
    tier: "expert",
    footprint: "Headed media squads for college's annual flagship fest (Resonance) and international MUNs with zero missed deadlines.",
    capabilities: ["Live Event Coverage", "Asset Turnaround", "Press Committee Management", "Squad Scheduling"],
    projectsUsed: ["Resonance Cultural Fest Head", "Palladium MUN High Commendation"]
  },
  {
    id: "l-pitching",
    name: "Client Pitching & Marketing Strategy",
    category: "Business Development",
    discipline: "leadership",
    level: "Advanced",
    pct: 88,
    tag: "03",
    tier: "advanced",
    footprint: "Engineered client-acquisition pitch portfolios at Metronix, unlocking hospitalities and cafe client verticals.",
    capabilities: ["Pitch Deck Creation", "Competitive Teardowns", "Value Proposition Design", "Client Presenting"],
    projectsUsed: ["Metronix Cafe & Club Vertical", "Plutus World Equity Pitch"]
  }
];

export default function SkillsPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkillId, setSelectedSkillId] = useState("ae");
  const [tierFilter, setTierFilter] = useState("all");

  const { playHover, playClick, playCardHover } = useAudioContext();

  // Filter skills based on tab, search query, and tier
  const filteredSkills = useMemo(() => {
    return masterSkillData.filter((item) => {
      // Tab filter
      if (activeTab !== "all" && item.discipline !== activeTab) return false;

      // Tier filter
      if (tierFilter !== "all" && item.tier !== tierFilter) return false;

      // Text search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchCategory = item.category.toLowerCase().includes(q);
        const matchTag = item.tag.toLowerCase().includes(q);
        const matchFootprint = item.footprint.toLowerCase().includes(q);
        const matchProjects = item.projectsUsed?.some((p) => p.toLowerCase().includes(q));
        if (!matchName && !matchCategory && !matchTag && !matchFootprint && !matchProjects) {
          return false;
        }
      }

      return true;
    });
  }, [activeTab, tierFilter, searchQuery]);

  // Selected skill for the interactive inspector HUD
  const activeSkill = useMemo(() => {
    const found = masterSkillData.find((s) => s.id === selectedSkillId);
    return found || filteredSkills[0] || masterSkillData[0];
  }, [selectedSkillId, filteredSkills]);

  return (
    <div className="sp-page-wrap">
      <section id="skills" className="sp-section sp-skills">
        {/* Web background decoration */}
        <div className="sp-skills-web-bg" aria-hidden="true">
          <svg viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <SkillsWebSVG />
          </svg>
        </div>

        {/* ── SECTION HEADER ────────────────────────────────────────────────── */}
        <div className="sp-section-header">
          <span className="sp-eyebrow">
            <span className="sp-eyebrow-flag" />
            CREATIVE ARSENAL &amp; MASTERY MATRIX
          </span>
          <h2 className="sp-section-title">TECHNICAL SKILLS.</h2>
          <div className="sp-title-underline" />
          <p style={{
            maxWidth: "740px",
            margin: "1.5rem auto 0",
            fontSize: "1.05rem",
            color: "var(--text-secondary)",
            lineHeight: 1.7
          }}>
            A multidisciplinary synthesis of industry-leading creative software, brand architecture, motion &amp; 2D animation, UI/UX design, and computational engineering. Click any skill to inspect verified portfolio footprint.
          </p>

          {/* ── INTERACTIVE LIVE SEARCH & FILTER CONSOLE ────────────────────── */}
          <div style={{
            maxWidth: "840px",
            margin: "2.5rem auto 0",
            display: "flex",
            flexDirection: "column",
            gap: "1rem"
          }}>
            {/* Search Input Bar */}
            <div style={{
              position: "relative",
              display: "flex",
              alignItems: "center"
            }}>
              <span style={{
                position: "absolute",
                left: "1rem",
                fontFamily: "var(--font-mono)",
                fontSize: "0.85rem",
                color: "var(--red)",
                fontWeight: 800,
                pointerEvents: "none"
              }}>
                [SEARCH]
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by software, discipline, or footprint (e.g. After Effects, Figma, Python, Brand)..."
                style={{
                  width: "100%",
                  padding: "0.85rem 3rem 0.85rem 5.5rem",
                  background: "var(--card-bg)",
                  border: "1px solid var(--border-card)",
                  borderRadius: "4px",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.95rem",
                  outline: "none",
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease"
                }}
                onFocus={(e) => { e.target.style.borderColor = "var(--red)"; }}
                onBlur={(e) => { e.target.style.borderColor = "var(--border-card)"; }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{
                    position: "absolute",
                    right: "1rem",
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    fontSize: "1rem",
                    cursor: "pointer",
                    padding: "0.2rem"
                  }}
                  title="Clear search filter"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Discipline Category Tabs */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "0.5rem",
              flexWrap: "wrap"
            }}>
              {[
                { id: "all", label: `ALL ARSENAL (${masterSkillData.length})` },
                { id: "toolkit", label: "SOFTWARE TOOLKIT" },
                { id: "design", label: "BRAND & UI/UX" },
                { id: "motion", label: "MOTION & 2D" },
                { id: "leadership", label: "LEADERSHIP & STRATEGY" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    playClick();
                    setActiveTab(tab.id);
                  }}
                  onMouseEnter={playHover}
                  style={{
                    background: activeTab === tab.id ? "var(--red)" : "var(--card-bg)",
                    color: activeTab === tab.id ? "#fff" : "var(--text-secondary)",
                    border: `1px solid ${activeTab === tab.id ? "var(--red)" : "var(--border-card)"}`,
                    padding: "0.5rem 1rem",
                    borderRadius: "4px",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    letterSpacing: "1px",
                    cursor: "pointer",
                    transition: "border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease"
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Secondary Tier Filter Filter */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "0.75rem",
              fontSize: "0.75rem",
              fontFamily: "var(--font-mono)",
              color: "var(--text-muted)"
            }}>
              <span>PROFICIENCY TIER:</span>
              {[
                { id: "all", label: "ALL" },
                { id: "mastery", label: "MASTERY (95%+)" },
                { id: "expert", label: "EXPERT (90-94%)" },
                { id: "advanced", label: "ADVANCED (85-89%)" }
              ].map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => {
                    playClick();
                    setTierFilter(tier.id);
                  }}
                  style={{
                    background: tierFilter === tier.id ? "rgba(255, 90, 0, 0.15)" : "transparent",
                    color: tierFilter === tier.id ? "var(--red)" : "var(--text-muted)",
                    border: `1px solid ${tierFilter === tier.id ? "var(--red)" : "transparent"}`,
                    padding: "0.2rem 0.6rem",
                    borderRadius: "2px",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── SPLIT ARSENAL GRID & INTERACTIVE INSPECTOR HUD ──────────────────── */}
        <div style={{
          maxWidth: "1200px",
          margin: "3rem auto 0",
          display: "grid",
          gridTemplateColumns: "minmax(320px, 1fr) minmax(320px, 420px)",
          gap: "2rem",
          alignItems: "start",
          position: "relative",
          zIndex: 1
        }}>
          {/* Left Column: Interactive Skill Matrix Grid */}
          <div>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
              paddingBottom: "0.5rem",
              borderBottom: "1px solid var(--border-card)"
            }}>
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                fontWeight: 800
              }}>
                ARSENAL SPECIFICATIONS [{filteredSkills.length}]
              </span>
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                color: "var(--brand-primary)",
                fontWeight: 700
              }}>
                CLICK ITEM TO INSPECT TRACE →
              </span>
            </div>

            {filteredSkills.length === 0 ? (
              <div style={{
                padding: "3rem 2rem",
                textAlign: "center",
                background: "var(--card-bg)",
                border: "1px dashed var(--border-card)",
                borderRadius: "4px"
              }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.85rem", color: "var(--red)", marginBottom: "0.5rem" }}>
                  // NO DIRECT MATCHES FOUND
                </div>
                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                  No skills matched "{searchQuery}". Try searching for Photoshop, Motion, UI/UX, or Python.
                </p>
                <button
                  onClick={() => { setSearchQuery(""); setActiveTab("all"); setTierFilter("all"); }}
                  className="sp-btn-red"
                  style={{ marginTop: "1rem", fontSize: "0.75rem", padding: "0.4rem 0.9rem" }}
                >
                  RESET ARSENAL FILTERS
                </button>
              </div>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "1rem"
              }}>
                {filteredSkills.map((skill) => {
                  const isSelected = skill.id === activeSkill?.id;
                  return (
                    <div
                      key={skill.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        playClick();
                        setSelectedSkillId(skill.id);
                      }}
                      onMouseEnter={() => playCardHover()}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedSkillId(skill.id); }}
                      style={{
                        background: isSelected ? "var(--bg-secondary)" : "var(--card-bg)",
                        border: `1px solid ${isSelected ? "var(--red)" : "var(--border-card)"}`,
                        borderLeft: isSelected ? "4px solid var(--red)" : "1px solid var(--border-card)",
                        borderRadius: "4px",
                        padding: "1.2rem 1.4rem",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.75rem"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                          <span style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.72rem",
                            fontWeight: 800,
                            letterSpacing: "0.5px",
                            color: isSelected ? "#fff" : "var(--red)",
                            background: isSelected ? "var(--red)" : "rgba(255, 90, 0, 0.08)",
                            border: `1px solid ${isSelected ? "var(--red)" : "rgba(255, 90, 0, 0.2)"}`,
                            padding: "0.2rem 0.45rem",
                            borderRadius: "2px"
                          }}>
                            {skill.tag}
                          </span>
                          <div>
                            <div style={{
                              fontSize: "0.92rem",
                              fontWeight: 800,
                              letterSpacing: "0.3px",
                              color: "var(--text-primary)"
                            }}>
                              {skill.name}
                            </div>
                            <div style={{
                              fontSize: "0.68rem",
                              fontWeight: 600,
                              color: "var(--text-muted)",
                              letterSpacing: "0.5px",
                              textTransform: "uppercase",
                              marginTop: "1px"
                            }}>
                              {skill.category}
                            </div>
                          </div>
                        </div>

                        <span style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          color: isSelected ? "var(--red)" : "var(--text-muted)"
                        }}>
                          {skill.pct}%
                        </span>
                      </div>

                      {/* Animated Proficiency Bar */}
                      <div style={{
                        width: "100%",
                        height: "4px",
                        background: "rgba(16, 25, 26, 0.1)",
                        borderRadius: "2px",
                        overflow: "hidden"
                      }}>
                        <div style={{
                          width: `${skill.pct}%`,
                          height: "100%",
                          background: isSelected ? "var(--red)" : "var(--brand-primary)",
                          borderRadius: "2px",
                          transition: "width 0.4s ease"
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Sticky Active Skill Inspector HUD */}
          <div style={{
            position: "sticky",
            top: "90px",
            background: "var(--card-bg)",
            border: "1px solid var(--border-card)",
            borderTop: "3px solid var(--red)",
            borderRadius: "4px",
            padding: "2rem",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)"
          }}>
            {/* Header */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              borderBottom: "1px solid var(--border-card)",
              paddingBottom: "1.2rem",
              marginBottom: "1.4rem"
            }}>
              <div>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  color: "var(--red)",
                  letterSpacing: "1px",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  marginBottom: "0.3rem"
                }}>
                  <span style={{
                    width: "7px",
                    height: "7px",
                    background: "var(--red)",
                    borderRadius: "1px",
                    display: "inline-block"
                  }} />
                  TRACE INSPECTOR // {activeSkill.tag}
                </div>
                <h3 style={{
                  fontFamily: "var(--font-hero)",
                  fontSize: "1.65rem",
                  fontWeight: 900,
                  color: "var(--text-primary)",
                  lineHeight: 1.2
                }}>
                  {activeSkill.name}
                </h3>
                <div style={{
                  fontSize: "0.85rem",
                  color: "var(--brand-primary)",
                  fontWeight: 700,
                  marginTop: "0.2rem"
                }}>
                  {activeSkill.category}
                </div>
              </div>

              <div style={{
                textAlign: "right",
                fontFamily: "var(--font-mono)"
              }}>
                <div style={{
                  fontSize: "1.6rem",
                  fontWeight: 900,
                  color: "var(--red)",
                  lineHeight: 1
                }}>
                  {activeSkill.pct}%
                </div>
                <div style={{
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  marginTop: "0.2rem"
                }}>
                  {activeSkill.level} TIER
                </div>
              </div>
            </div>

            {/* Battle-Tested Footprint */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "1px",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                marginBottom: "0.6rem"
              }}>
                // BATTLE-TESTED PORTFOLIO FOOTPRINT:
              </div>
              <p style={{
                fontSize: "0.95rem",
                color: "var(--text-secondary)",
                lineHeight: 1.65,
                background: "var(--bg-secondary)",
                padding: "1rem",
                borderLeft: "2px solid var(--red)",
                borderRadius: "2px"
              }}>
                {activeSkill.footprint}
              </p>
            </div>

            {/* Core Capabilities */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                fontWeight: 800,
                letterSpacing: "1px",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                marginBottom: "0.6rem"
              }}>
                CORE CAPABILITIES &amp; METHODS:
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {activeSkill.capabilities.map((cap, cIdx) => (
                  <span
                    key={cIdx}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      background: "rgba(255, 90, 0, 0.08)",
                      border: "1px solid rgba(255, 90, 0, 0.2)",
                      color: "var(--red)",
                      padding: "0.25rem 0.6rem",
                      borderRadius: "2px"
                    }}
                  >
                    ✓ {cap}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Verified Projects */}
            {activeSkill.projectsUsed && (
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  letterSpacing: "1px",
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  marginBottom: "0.6rem"
                }}>
                  DEPLOYED IN SHOWCASE WORK:
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {activeSkill.projectsUsed.map((proj, pIdx) => (
                    <div
                      key={pIdx}
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--text-primary)",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem"
                      }}
                    >
                      <span style={{ color: "var(--red)", fontFamily: "var(--font-mono)", fontSize: "0.7rem" }}>▸</span>
                      <span>{proj}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Link to Showcase */}
            <div style={{
              borderTop: "1px solid var(--border-card)",
              paddingTop: "1.2rem",
              marginTop: "1.5rem"
            }}>
              <Link
                to="/projects"
                className="sp-btn-red"
                style={{
                  display: "block",
                  textAlign: "center",
                  textDecoration: "none",
                  fontSize: "0.75rem",
                  padding: "0.55rem 1rem"
                }}
              >
                EXPLORE PROJECTS USING {activeSkill.tag} →
              </Link>
            </div>
          </div>
        </div>

        {/* ── LANGUAGES PROFICIENCY SECTION ───────────────────────────── */}
        <div style={{ maxWidth: "1200px", margin: "6rem auto 0", position: "relative", zIndex: 1 }}>
          <div className="sp-section-header" style={{ marginBottom: "2rem" }}>
            <span className="sp-eyebrow">
              <span className="sp-eyebrow-flag" />
              COMMUNICATION &amp; GLOBAL REACH
            </span>
            <h3 className="sp-section-title" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}>
              LANGUAGES.
            </h3>
            <div className="sp-title-underline" />
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1.2rem"
          }}>
            {[
              { lang: "Hindi", code: "HI", level: "Native / Proficient", pct: 100, desc: "Fluent written & spoken communication; native dialect mastery." },
              { lang: "Marwari", code: "MW", level: "Native Regional", pct: 100, desc: "Native regional cultural fluency and grassroots communication." },
              { lang: "English", code: "EN", level: "Conversational / Professional", pct: 90, desc: "Professional corporate, investor pitching & academic English." },
              { lang: "French", code: "FR", level: "Beginner", pct: 35, desc: "Elementary linguistic interest & foundational syntax learning." }
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border-card)",
                  borderRadius: "4px",
                  padding: "1.5rem"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.8rem",
                    fontWeight: 800,
                    color: "var(--red)",
                    background: "rgba(255, 90, 0, 0.08)",
                    border: "1px solid rgba(255, 90, 0, 0.2)",
                    padding: "0.2rem 0.5rem",
                    borderRadius: "2px"
                  }}>
                    {item.code}
                  </span>
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                    fontWeight: 700
                  }}>
                    {item.pct}%
                  </span>
                </div>
                <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary)" }}>{item.lang}</div>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--brand-primary)", marginTop: "0.2rem" }}>{item.level}</div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.5rem", lineHeight: 1.5 }}>{item.desc}</div>

                <div style={{
                  width: "100%",
                  height: "3px",
                  background: "rgba(16, 25, 26, 0.1)",
                  borderRadius: "2px",
                  marginTop: "1rem",
                  overflow: "hidden"
                }}>
                  <div style={{
                    width: `${item.pct}%`,
                    height: "100%",
                    background: "var(--red)",
                    borderRadius: "2px"
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── VERIFIED CERTIFICATIONS PREVIEW ─────────────────────────── */}
        <div style={{ maxWidth: "1200px", margin: "6rem auto 0", position: "relative", zIndex: 1 }}>
          <div className="sp-section-header" style={{ marginBottom: "2rem" }}>
            <span className="sp-eyebrow">
              <span className="sp-eyebrow-flag" />
              VERIFIED CREDENTIALS
            </span>
            <h3 className="sp-section-title" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}>
              ACCREDITATIONS &amp; HONORS.
            </h3>
            <div className="sp-title-underline" />
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.2rem"
          }}>
            {certificationsList.slice(0, 4).map((c, idx) => (
              <div
                key={idx}
                style={{
                  background: "var(--card-bg)",
                  border: "1px solid var(--border-card)",
                  borderRadius: "4px",
                  padding: "1.5rem"
                }}
              >
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  color: "var(--red)",
                  textTransform: "uppercase",
                  letterSpacing: "1px"
                }}>
                  [ACCRED-0{idx + 1}] // {c.category}
                </div>
                <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)", margin: "0.4rem 0 0.2rem" }}>
                  {c.title}
                </div>
                <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-secondary)" }}>
                  {c.issuer}
                </div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "0.5rem", lineHeight: 1.5 }}>
                  {c.details}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
