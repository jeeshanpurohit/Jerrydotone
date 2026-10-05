import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { experienceList, educationList, certificationsList, personalInfo } from '../data/portfolioData';
import { WebSVG } from '../shared';
import { useAudioContext } from '../context/AudioContext';

// Verified impact metrics & architectural KPI data enriched per directive
const experienceMetrics = {
  metronix: {
    kpis: [
      { label: 'BRAND ENGAGEMENT', value: '+140%', sub: 'Digital & Footfall Reach' },
      { label: 'HUBS LAUNCHED', value: '3 LOCATIONS', sub: 'Rohtak, Murthal, Panipat' },
      { label: 'STRATEGY HORIZON', value: '5-YEAR PLAN', sub: 'Brand Equity Framework' }
    ],
    dossierRef: 'MET-2026-HQ',
    statusBadge: 'CURRENT ENGAGEMENT',
    domain: 'Enterprise Brand Leadership & Strategy',
    tools: ['Adobe Illustrator', 'Photoshop', 'InDesign', 'Brand Guidelines', 'Pitch Decks']
  },
  vsupportu: {
    kpis: [
      { label: 'CLIENT CAMPAIGNS', value: '25+ DELIVERED', sub: 'Hospitality & Lifestyle' },
      { label: 'ENGAGEMENT LIFT', value: '2.4X SURGE', sub: 'Social Media Motion' },
      { label: 'DELIVERY TIMELINE', value: '100% SPRINT', sub: 'Multi-platform Output' }
    ],
    dossierRef: 'VSU-2025-OPS',
    statusBadge: 'COMPLETED ARCHIVE',
    domain: 'Commercial Visuals & Digital Retainers',
    tools: ['Photoshop', 'After Effects', 'Premiere Pro', 'Visual Systems', 'Short-form Video']
  },
  coozmoo: {
    kpis: [
      { label: 'AD CREATIVES', value: '60+ ASSETS', sub: 'Meta & Multi-Channel Ads' },
      { label: 'CROSS-SUITE SYNC', value: 'ADOBE CC', sub: 'PS, AI, PR, AE, ID' },
      { label: 'CAMPAIGN REACH', value: 'GLOBAL TIER', sub: 'Promotional Collateral' }
    ],
    dossierRef: 'CMZ-2025-CREATIVE',
    statusBadge: 'COMPLETED ARCHIVE',
    domain: 'Multi-Channel Advertising & Video Production',
    tools: ['Photoshop', 'Illustrator', 'InDesign', 'Premiere Pro', 'After Effects', 'Meta Ads']
  },
  'iit-roorkee': {
    kpis: [
      { label: 'STUDENT REACH', value: '10,000+ USERS', sub: 'Across Indian Universities' },
      { label: 'ACCREDITATION', value: 'EXCELLENCE 2025', sub: 'Certificate of Excellence' },
      { label: 'SIMULATIONS', value: 'CHEMISTRY LABS', sub: 'Pedagogical Mechanism Models' }
    ],
    dossierRef: 'IITR-VLABS-2024',
    statusBadge: 'ACADEMIC FELLOWSHIP',
    domain: '2D Scientific Simulation & Educational E-Learning',
    tools: ['Adobe After Effects', 'Illustrator', 'Vector Rigging', 'Educational Design']
  },
  ideaforage: {
    kpis: [
      { label: 'GAME PROMO REELS', value: 'DYNAMIC CUTS', sub: 'Stylized Motion & Rhythm' },
      { label: 'CORPORATE REEL', value: 'FLAGSHIP INTRO', sub: 'Core Product Narrative' },
      { label: 'AUDIO PRECISION', value: 'BEAT-SYNCED', sub: 'Full Post-Production' }
    ],
    dossierRef: 'IDF-2024-VIDEO',
    statusBadge: 'COMPLETED ARCHIVE',
    domain: 'Commercial Cinema & Gaming Post-Production',
    tools: ['Adobe Premiere Pro', 'After Effects', 'Sound Design', 'Rhythmic Storytelling']
  },
  tcc: {
    kpis: [
      { label: 'CLIENT VERTICALS', value: 'FASHION & SPORTS', sub: 'High-Retention Campaigns' },
      { label: 'ASSET FORM FACTOR', value: 'SOCIAL REELS', sub: '9:16 Kinetic Architecture' },
      { label: 'IDENTITY REVEALS', value: 'ANIMATED LOGOS', sub: 'Vector Motion Craft' }
    ],
    dossierRef: 'TCC-2023-AGENCY',
    statusBadge: 'COMPLETED ARCHIVE',
    domain: 'Boutique Lifestyle Marketing & Motion',
    tools: ['Premiere Pro', 'After Effects', 'Logo Animation', 'Creative Ads']
  },
  hdlc: {
    kpis: [
      { label: 'ENGINEERING STACK', value: 'PYTHON 3.X', sub: 'Algorithmic Pipelines' },
      { label: 'DATA STRUCTURES', value: 'ANALYTICS PIPELINE', sub: 'Automated Processing' },
      { label: 'SYSTEMS MASTERY', value: 'B.TECH CSE CORE', sub: 'Engineering Discipline' }
    ],
    dossierRef: 'HDLC-2023-TECH',
    statusBadge: 'COMPLETED ARCHIVE',
    domain: 'Computational Engineering & Data Analysis',
    tools: ['Python', 'Data Science', 'Algorithmic Modeling', 'Data Pipelines']
  },
  'oculus-club': {
    kpis: [
      { label: 'CAMPUS HONOR', value: 'BEST CLUB 23-24', sub: 'Awarded by JIET Institution' },
      { label: 'EVENTS COVERED', value: '33+ MAJOR CONCLAVES', sub: 'Photo, Video & After-Films' },
      { label: 'COMMUNITY LED', value: 'PREMIER SQUAD', sub: 'Founder & President' }
    ],
    dossierRef: 'OCULUS-FOUNDER-DIR',
    statusBadge: 'FOUNDER & PRESIDENT',
    domain: 'Creative Community Leadership & Media Direction',
    tools: ['Media Direction', 'Photography', 'Videography', 'After-Films', 'Leadership']
  },
  'muns-and-events': {
    kpis: [
      { label: 'CONCLAVES DIRECTED', value: '05+ EDITIONS', sub: 'TVSMUN, Solidarieta, JIETMUN' },
      { label: 'PRESS ACCOLADE', value: 'HIGH COMMENDATION', sub: 'Palladium MUN 1st Ed.' },
      { label: 'MEDIA ECOSYSTEM', value: 'FULL SUITE', sub: 'Branding, Video & Print' }
    ],
    dossierRef: 'MUNS-2021-PRESENT',
    statusBadge: 'ONGOING CONCLAVES',
    domain: 'Conclave Media Direction & Identity Systems',
    tools: ['Event Identity', 'Brochures', 'Reels', 'After-Films', '2D Kinetic Intros']
  }
};

export function ExperiencePage() {
  const [filter, setFilter] = useState('all');
  const [activeExpId, setActiveExpId] = useState(experienceList[0]?.id || 'metronix');
  const { playClick, playCardHover } = useAudioContext();

  const filteredExperience = useMemo(() => {
    return experienceList.filter((item) => {
      if (filter === 'all') return true;
      if (filter === 'brand') return item.category === 'brand' || item.category === 'design';
      if (filter === 'motion') return item.category === 'motion' || item.category === 'tech';
      if (filter === 'leadership') return item.category === 'leadership';
      return true;
    });
  }, [filter]);

  // Ensure activeExpId remains valid when filtering
  const currentExp = useMemo(() => {
    const found = filteredExperience.find((item) => item.id === activeExpId);
    return found || filteredExperience[0] || experienceList[0];
  }, [filteredExperience, activeExpId]);

  const activeMetrics = experienceMetrics[currentExp?.id] || {
    kpis: [
      { label: 'PRODUCTION CYCLE', value: 'HIGH IMPACT', sub: 'Enterprise Execution' },
      { label: 'VERIFIED MILESTONE', value: 'DOCUMENTED', sub: 'Portfolio Proof' },
      { label: 'QUALITY STANDARD', value: 'SWISS LEVEL', sub: 'Architectural Rigor' }
    ],
    dossierRef: `EXP-${currentExp?.id?.toUpperCase()}`,
    statusBadge: 'VERIFIED RECORD',
    domain: 'Visual Design & Technology',
    tools: currentExp?.tags || []
  };

  const handleSelectRole = (roleId) => {
    playClick?.();
    setActiveExpId(roleId);
  };

  const handlePrevRole = () => {
    const idx = filteredExperience.findIndex((item) => item.id === currentExp?.id);
    if (idx > 0) {
      handleSelectRole(filteredExperience[idx - 1].id);
    } else {
      handleSelectRole(filteredExperience[filteredExperience.length - 1].id);
    }
  };

  const handleNextRole = () => {
    const idx = filteredExperience.findIndex((item) => item.id === currentExp?.id);
    if (idx >= 0 && idx < filteredExperience.length - 1) {
      handleSelectRole(filteredExperience[idx + 1].id);
    } else {
      handleSelectRole(filteredExperience[0].id);
    }
  };

  return (
    <div className="sp-page-wrap">
      <section className="sp-section sp-experience">
        {/* Subtle Web Graphic Background */}
        <div className="sp-projects-web-bg" aria-hidden="true" style={{ opacity: 0.08 }}>
          <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <WebSVG />
          </svg>
        </div>

        {/* ── HEADER & CAREER HUD ──────────────────────────────────────────────── */}
        <div className="sp-section-header">
          <span className="sp-eyebrow">
            <span className="sp-eyebrow-flag" />
            DIRECTIVE TIMELINE // 2021 — PRESENT
          </span>
          <h1 className="sp-section-title">EXPERIENCE.</h1>
          <div className="sp-title-underline" />
          <p style={{
            maxWidth: '720px',
            margin: '1.5rem auto 0',
            fontSize: '1.05rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.7
          }}>
            From spearheading brand infrastructure and creative direction at Metronix Entertainment LLP to building scientific simulations for IIT Roorkee and founding award-winning campus communities.
          </p>

          {/* Quick PDF Downloads */}
          <div style={{
            marginTop: '2rem',
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
          }}>
            <a
              href={personalInfo.resumePdf}
              download="Jeeshan_Purohit_Resume_ATS.pdf"
              className="sp-btn-red"
              style={{ textDecoration: 'none' }}
              title="Download ATS optimized resume"
            >
              <span>↓</span> DOWNLOAD ATS RESUME (PDF)
            </a>
            <a
              href={personalInfo.cvPdf}
              download="Jeeshan_Purohit_CV_ATS.pdf"
              className="sp-btn-dark"
              style={{ textDecoration: 'none' }}
              title="Download comprehensive curriculum vitae"
            >
              <span>↓</span> DOWNLOAD FULL CV (PDF)
            </a>
          </div>

          {/* ── TOP CAREER METRICS HUD BAR ────────────────────────────────────── */}
          <div style={{
            maxWidth: '960px',
            margin: '3rem auto 0',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            padding: '1.2rem',
            background: 'var(--card-bg)',
            border: '1px solid var(--border-card)',
            borderRadius: '4px'
          }}>
            {[
              { num: '04+ YEARS', label: 'PRODUCTION MASTERY', sub: 'Brand, Motion & 2D Engineering' },
              { num: '09+ TEAMS', label: 'ORGANIZATIONS SERVED', sub: 'Corporate, Agency & Labs' },
              { num: '08+ HONORS', label: 'AWARDS & RECOGNITIONS', sub: 'IIT Roorkee, Best Club, MUNs' },
              { num: '10K+ REACH', label: 'PEDAGOGICAL IMPACT', sub: 'Scientific Virtual Simulation' }
            ].map((stat, sIdx) => (
              <div key={sIdx} style={{
                textAlign: 'left',
                padding: '0.8rem 1rem',
                borderLeft: '2px solid var(--red)'
              }}>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  color: 'var(--brand-primary)',
                  letterSpacing: '0.5px'
                }}>
                  {stat.num}
                </div>
                <div style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '1px',
                  color: 'var(--text-primary)',
                  marginTop: '0.2rem',
                  textTransform: 'uppercase'
                }}>
                  {stat.label}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  marginTop: '0.15rem'
                }}>
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Filter Pills */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.6rem',
            marginTop: '2.5rem',
            flexWrap: 'wrap'
          }}>
            {[
              { id: 'all', label: `ALL DIRECTIVES (${experienceList.length})` },
              { id: 'brand', label: 'BRAND & MARKETING (4)' },
              { id: 'motion', label: 'MOTION & SIMULATION (3)' },
              { id: 'leadership', label: 'LEADERSHIP & LABS (2)' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  playClick?.();
                  setFilter(tab.id);
                }}
                style={{
                  background: filter === tab.id ? 'var(--red)' : 'var(--card-bg)',
                  color: filter === tab.id ? '#fff' : 'var(--text-secondary)',
                  border: `1px solid ${filter === tab.id ? 'var(--red)' : 'var(--border-card)'}`,
                  padding: '0.55rem 1.1rem',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── INTERACTIVE SPLIT DOSSIER INSPECTOR & TIMELINE ────────────────── */}
        <div style={{
          maxWidth: '1200px',
          margin: '3rem auto 0',
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 440px) minmax(340px, 1fr)',
          gap: '2rem',
          alignItems: 'start',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Left Column: Interactive Timeline Navigation Stream */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0 0.5rem 0.5rem',
              borderBottom: '1px solid var(--border-card)'
            }}>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '1px',
                color: 'var(--text-muted)'
              }}>
                TIMELINE INDEX ({filteredExperience.length})
              </span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'var(--brand-primary)',
                fontWeight: 700
              }}>
                SELECT TO INSPECT ↓
              </span>
            </div>

            {filteredExperience.map((exp, idx) => {
              const isSelected = exp.id === currentExp?.id;
              return (
                <div
                  key={exp.id || idx}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSelectRole(exp.id)}
                  onMouseEnter={() => playCardHover?.()}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectRole(exp.id); }}
                  style={{
                    background: isSelected ? 'var(--bg-secondary)' : 'var(--card-bg)',
                    border: `1px solid ${isSelected ? 'var(--red)' : 'var(--border-card)'}`,
                    borderLeft: isSelected ? '4px solid var(--red)' : '1px solid var(--border-card)',
                    borderRadius: '4px',
                    padding: '1.4rem 1.6rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      letterSpacing: '0.5px',
                      color: isSelected ? 'var(--red)' : 'var(--text-muted)'
                    }}>
                      {exp.period}
                    </span>
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      color: isSelected ? '#fff' : 'var(--brand-primary)',
                      background: isSelected ? 'var(--red)' : 'rgba(255, 90, 0, 0.1)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '2px'
                    }}>
                      {exp.type}
                    </span>
                  </div>

                  <h3 style={{
                    fontFamily: 'var(--font-hero)',
                    fontSize: '1.15rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    letterSpacing: '0.5px',
                    lineHeight: 1.25,
                    marginBottom: '0.3rem'
                  }}>
                    {exp.role}
                  </h3>

                  <div style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: 'var(--brand-primary)',
                    marginBottom: '0.6rem'
                  }}>
                    {exp.company}
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)'
                  }}>
                    <span>{exp.location}</span>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      color: isSelected ? 'var(--red)' : 'var(--text-muted)',
                      fontWeight: isSelected ? 800 : 500
                    }}>
                      {isSelected ? '[ ACTIVE DOSSIER ]' : 'VIEW SPECS →'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Sticky Active Dossier Inspector Console */}
          <div style={{
            position: 'sticky',
            top: '90px',
            background: 'var(--card-bg)',
            border: '1px solid var(--border-card)',
            borderTop: '3px solid var(--red)',
            borderRadius: '4px',
            padding: '2.4rem',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)'
          }}>
            {/* Dossier Header & Badge */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '1rem',
              borderBottom: '1px solid var(--border-card)',
              paddingBottom: '1.2rem',
              marginBottom: '1.5rem'
            }}>
              <div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '1px',
                  color: 'var(--red)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.4rem'
                }}>
                  <span style={{
                    width: '7px',
                    height: '7px',
                    background: 'var(--red)',
                    borderRadius: '1px',
                    display: 'inline-block'
                  }} />
                  {activeMetrics.dossierRef} // {activeMetrics.statusBadge}
                </div>
                <h2 style={{
                  fontFamily: 'var(--font-hero)',
                  fontSize: '1.8rem',
                  fontWeight: 900,
                  color: 'var(--text-primary)',
                  letterSpacing: '0.5px',
                  lineHeight: 1.15
                }}>
                  {currentExp.role}
                </h2>
                <div style={{
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: 'var(--brand-primary)',
                  marginTop: '0.3rem'
                }}>
                  {currentExp.company}
                </div>
              </div>

              {/* Stepper Controls */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={handlePrevRole}
                  aria-label="Previous role"
                  title="Inspect Previous Directive"
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-card)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    padding: '0.4rem 0.8rem',
                    borderRadius: '2px',
                    cursor: 'pointer'
                  }}
                >
                  ‹ PREV
                </button>
                <button
                  onClick={handleNextRole}
                  aria-label="Next role"
                  title="Inspect Next Directive"
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-card)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    padding: '0.4rem 0.8rem',
                    borderRadius: '2px',
                    cursor: 'pointer'
                  }}
                >
                  NEXT ›
                </button>
              </div>
            </div>

            {/* Directive Overview Summary */}
            <p style={{
              fontSize: '1.02rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.75,
              marginBottom: '1.8rem'
            }}>
              {currentExp.description}
            </p>

            {/* Verified Impact KPIs Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '0.85rem',
              marginBottom: '2rem',
              padding: '1.2rem',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-card)',
              borderRadius: '3px'
            }}>
              {activeMetrics.kpis.map((kpi, kIdx) => (
                <div key={kIdx} style={{ borderLeft: '2px solid var(--red)', paddingLeft: '0.75rem' }}>
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.15rem',
                    fontWeight: 900,
                    color: 'var(--brand-primary)'
                  }}>
                    {kpi.value}
                  </div>
                  <div style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    letterSpacing: '1px',
                    color: 'var(--text-primary)',
                    marginTop: '0.2rem',
                    textTransform: 'uppercase'
                  }}>
                    {kpi.label}
                  </div>
                  <div style={{
                    fontSize: '0.72rem',
                    color: 'var(--text-muted)',
                    marginTop: '0.1rem'
                  }}>
                    {kpi.sub}
                  </div>
                </div>
              ))}
            </div>

            {/* Key Deliverables & Verified Initiatives */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                color: 'var(--red)',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>//</span> VERIFIED INITIATIVES &amp; DELIVERABLES:
              </div>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem'
              }}>
                {currentExp.highlights.map((hl, hIdx) => (
                  <li key={hIdx} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.8rem',
                    fontSize: '0.95rem',
                    color: 'var(--text-primary)',
                    lineHeight: 1.6
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--red)',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      marginTop: '3px',
                      background: 'rgba(255, 90, 0, 0.1)',
                      padding: '0.15rem 0.4rem',
                      borderRadius: '2px',
                      whiteSpace: 'nowrap'
                    }}>
                      [EXEC-0{hIdx + 1}]
                    </span>
                    <span>{hl}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tools & Deployed Software Stack */}
            <div style={{
              borderTop: '1px solid var(--border-card)',
              paddingTop: '1.4rem'
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '1px',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                marginBottom: '0.8rem'
              }}>
                DEPLOYED SOFTWARE &amp; DISCIPLINE STACK:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {activeMetrics.tools.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      letterSpacing: '0.5px',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-card)',
                      color: 'var(--text-secondary)',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '2px'
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Project Showcase CTA */}
            <div style={{
              marginTop: '2rem',
              paddingTop: '1.2rem',
              borderTop: '1px solid var(--border-card)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <span style={{
                fontSize: '0.82rem',
                color: 'var(--text-muted)'
              }}>
                Explore real assets engineered during this tenure
              </span>
              <Link
                to="/projects"
                className="sp-btn-red"
                style={{
                  fontSize: '0.72rem',
                  padding: '0.45rem 1rem',
                  textDecoration: 'none'
                }}
              >
                VIEW WORK IN SHOWCASE →
              </Link>
            </div>
          </div>
        </div>

        {/* ── EDUCATION SECTION ────────────────────────────────────────── */}
        <div style={{ maxWidth: '1200px', margin: '6rem auto 0', position: 'relative', zIndex: 1 }}>
          <div className="sp-section-header" style={{ marginBottom: '2.5rem' }}>
            <span className="sp-eyebrow">
              <span className="sp-eyebrow-flag" />
              ACADEMIC FOUNDATION &amp; COMPUTATION
            </span>
            <h2 className="sp-section-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              EDUCATION.
            </h2>
            <div className="sp-title-underline" />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}>
            {educationList.map((edu, idx) => (
              <div
                key={idx}
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-card)',
                  borderRadius: '4px',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.8rem',
                  transition: 'border-color 0.2s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--red)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-card)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    letterSpacing: '1px',
                    color: 'var(--red)',
                    background: 'rgba(255, 90, 0, 0.1)',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '2px'
                  }}>
                    {edu.period}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)'
                  }}>
                    Score: {edu.grade}
                  </span>
                </div>

                <h3 style={{
                  fontFamily: 'var(--font-hero)',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  lineHeight: 1.3
                }}>
                  {edu.degree}
                </h3>

                <div style={{
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  color: 'var(--brand-primary)'
                }}>
                  {edu.institution}
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {edu.location}
                </div>

                {edu.description && (
                  <p style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    marginTop: '0.3rem'
                  }}>
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── CERTIFICATIONS & ACCOLADES SECTION ───────────────────────── */}
        <div style={{ maxWidth: '1200px', margin: '6rem auto 0', position: 'relative', zIndex: 1 }}>
          <div className="sp-section-header" style={{ marginBottom: '2.5rem' }}>
            <span className="sp-eyebrow">
              <span className="sp-eyebrow-flag" />
              VERIFIED CREDENTIALS
            </span>
            <h2 className="sp-section-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              HONORS &amp; CERTIFICATIONS.
            </h2>
            <div className="sp-title-underline" />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.3rem'
          }}>
            {certificationsList.map((cert, idx) => (
              <div
                key={cert.id || idx}
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-card)',
                  borderRadius: '4px',
                  padding: '1.6rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.6rem',
                  transition: 'border-color 0.2s ease, background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--red)';
                  e.currentTarget.style.background = 'var(--bg-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-card)';
                  e.currentTarget.style.background = 'var(--card-bg)';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    color: 'var(--red)',
                    background: 'rgba(255, 90, 0, 0.1)',
                    padding: '0.2rem 0.55rem',
                    borderRadius: '2px'
                  }}>
                    {cert.category || 'Credential'}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: 'var(--text-muted)'
                  }}>
                    [REF-0{idx + 1}]
                  </span>
                </div>

                <h4 style={{
                  fontFamily: 'var(--font-hero)',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  lineHeight: 1.3
                }}>
                  {cert.title}
                </h4>

                <div style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--text-secondary)'
                }}>
                  Issued by: {cert.issuer}
                </div>

                <p style={{
                  fontSize: '0.86rem',
                  color: 'var(--text-muted)',
                  lineHeight: 1.55
                }}>
                  {cert.details}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Closing Architectural Manifesto */}
        <div style={{
          maxWidth: '1200px',
          margin: '6rem auto 2rem',
          padding: '2.5rem',
          borderRadius: '4px',
          borderLeft: '4px solid var(--red)',
          background: 'var(--card-bg)',
          border: '1px solid var(--border-card)'
        }}>
          <p style={{
            fontFamily: 'var(--font-hero)',
            fontSize: '1.25rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            lineHeight: 1.6
          }}>
            "Great design tells a compelling story, but disciplined execution delivers lasting value. From enterprise brand guidelines to scientific simulations, I build creative infrastructure engineered to endure."
          </p>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            color: 'var(--brand-primary)',
            fontWeight: 700,
            marginTop: '0.8rem'
          }}>
            JEESHAN PUROHIT // MULTIDISCIPLINARY VISUAL DESIGNER &amp; CREATIVE TECHNOLOGIST
          </div>
        </div>
      </section>
    </div>
  );
}

export default ExperiencePage;
