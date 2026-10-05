import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { personalInfo } from '../data/portfolioData';
import { WebSVG } from '../shared';
import { useAudioContext } from '../context/AudioContext';
import { ContactPanel } from '../components/ContactPanel';
import {
  JEESHAN_PRIMARY_EMAIL,
  WEBHOOK_URL_KEY,
  getWorkspaceQueries,
  exportWorkspaceQueriesCsv
} from '../utils/googleWorkspaceIntegration';

export function ContactPage() {
  const [searchParams] = useSearchParams();
  const initialScope = searchParams.get('scope') || searchParams.get('discipline') || 'Brand Identity & Strategy';

  // Workspace Settings Drawer
  const [showWorkspaceDrawer, setShowWorkspaceDrawer] = useState(false);
  const [customWebhookUrl, setCustomWebhookUrl] = useState(
    () => localStorage.getItem(WEBHOOK_URL_KEY) || ''
  );
  const [webhookSaved, setWebhookSaved] = useState(false);
  const [workspaceQueriesList, setWorkspaceQueriesList] = useState([]);

  const { playClick } = useAudioContext();

  // Load existing workspace queries
  useEffect(() => {
    setWorkspaceQueriesList(getWorkspaceQueries());
  }, [showWorkspaceDrawer]);

  // Export CSV
  const handleExportCsv = () => {
    playClick?.();
    const csvContent = exportWorkspaceQueriesCsv();
    if (!csvContent) {
      alert("No queries registered yet.");
      return;
    }
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Jeeshan_Studio_GoogleSheets_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Save Custom Webhook URL
  const handleSaveWebhook = (e) => {
    e.preventDefault();
    playClick?.();
    localStorage.setItem(WEBHOOK_URL_KEY, customWebhookUrl.trim());
    setWebhookSaved(true);
    setTimeout(() => setWebhookSaved(false), 3000);
  };

  return (
    <div className="sp-page-wrap">
      <section className="sp-section sp-contact">
        {/* Subtle Web Graphic Background */}
        <div className="sp-projects-web-bg" aria-hidden="true" style={{ opacity: 0.08 }}>
          <svg viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <WebSVG />
          </svg>
        </div>

        {/* ── HEADER ────────────────────────────────────────────────────────── */}
        <div className="sp-section-header">
          <span className="sp-eyebrow">
            <span className="sp-eyebrow-flag" />
            DIRECT DISPATCH &amp; GOOGLE WORKSPACE DISCOVERY
          </span>
          <h1 className="sp-section-title">CONTACT &amp; INQUIRIES.</h1>
          <div className="sp-title-underline" />
          <p style={{
            maxWidth: '740px',
            margin: '1.5rem auto 0',
            fontSize: '1.05rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.7
          }}>
            Initiate a directive for enterprise brand guidelines, commercial motion graphics, after-film production, or UI/UX engineering. Queries automatically synchronize with Google Workspace (<strong style={{ color: 'var(--brand-primary)' }}>{JEESHAN_PRIMARY_EMAIL}</strong>) and schedule in Google Calendar with Google Meet.
          </p>

          {/* Quick Target Mail Banner */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            marginTop: '1.8rem',
            background: 'var(--card-bg)',
            border: '1px solid var(--border-card)',
            padding: '0.45rem 1rem',
            borderRadius: '4px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.78rem'
          }}>
            <span style={{ color: 'var(--red)' }}>●</span>
            <span style={{ color: 'var(--text-muted)' }}>PRIMARY WORKSPACE DESTINATION:</span>
            <a
              href={`mailto:${JEESHAN_PRIMARY_EMAIL}`}
              style={{ color: 'var(--brand-primary)', fontWeight: 800, textDecoration: 'none' }}
            >
              {JEESHAN_PRIMARY_EMAIL}
            </a>
          </div>
        </div>

        {/* ── MAIN WORKSPACE & FORM SECTION ─────────────────────────────────── */}
        <div style={{
          maxWidth: '1200px',
          margin: '3rem auto 0',
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 400px) minmax(340px, 1fr)',
          gap: '2.5rem',
          alignItems: 'start',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Left Column: Direct Communication Channels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Email Channel */}
            <div style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border-card)',
              borderLeft: '3px solid var(--red)',
              padding: '1.8rem',
              borderRadius: '4px'
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                fontWeight: 800,
                color: 'var(--red)',
                letterSpacing: '1px',
                marginBottom: '0.3rem'
              }}>
                [WORKSPACE DIRECT MAIL]
              </div>
              <div style={{
                fontFamily: 'var(--font-hero)',
                fontSize: '1.35rem',
                fontWeight: 900,
                color: 'var(--text-primary)',
                marginBottom: '0.4rem',
                wordBreak: 'break-all'
              }}>
                <a
                  href={`mailto:${JEESHAN_PRIMARY_EMAIL}`}
                  style={{ color: 'var(--text-primary)', textDecoration: 'none' }}
                >
                  {JEESHAN_PRIMARY_EMAIL}
                </a>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Direct inbox monitored continuously. Typical response turnaround: within 12–24 hours.
              </p>
              <a
                href={`mailto:${JEESHAN_PRIMARY_EMAIL}`}
                className="sp-btn-red"
                style={{
                  display: 'inline-block',
                  marginTop: '1rem',
                  fontSize: '0.72rem',
                  padding: '0.45rem 0.9rem',
                  textDecoration: 'none'
                }}
              >
                OPEN GMAIL COMPOSE →
              </a>
            </div>

            {/* Telephone & WhatsApp */}
            <div style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border-card)',
              borderLeft: '3px solid var(--brand-primary)',
              padding: '1.8rem',
              borderRadius: '4px'
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                fontWeight: 800,
                color: 'var(--brand-primary)',
                letterSpacing: '1px',
                marginBottom: '0.3rem'
              }}>
                [TELEPHONE &amp; WHATSAPP]
              </div>
              <div style={{
                fontFamily: 'var(--font-hero)',
                fontSize: '1.4rem',
                fontWeight: 900,
                marginBottom: '0.4rem'
              }}>
                <a
                  href={`tel:${personalInfo.phone}`}
                  style={{ color: 'var(--text-primary)', textDecoration: 'none' }}
                >
                  {personalInfo.phone}
                </a>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Direct mobile line and WhatsApp for urgent commercial and conclave media sprints.
              </p>
            </div>

            {/* Studio Location */}
            <div style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border-card)',
              padding: '1.8rem',
              borderRadius: '4px'
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                fontWeight: 800,
                color: 'var(--text-muted)',
                letterSpacing: '1px',
                marginBottom: '0.3rem'
              }}>
                [STUDIO LOCATION]
              </div>
              <div style={{
                fontFamily: 'var(--font-hero)',
                fontSize: '1.15rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginBottom: '0.4rem'
              }}>
                {personalInfo.location}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Available for remote global commissions, brand consultations, and on-site creative direction.
              </p>
            </div>

            {/* External Links */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.75rem'
            }}>
              {[
                { name: 'Behance', url: personalInfo.behance, code: 'BE' },
                { name: 'LinkedIn', url: personalInfo.linkedin, code: 'IN' },
                { name: 'GitHub', url: personalInfo.github, code: 'GH' },
                { name: 'Instagram', url: personalInfo.instagram, code: 'IG' }
              ].map((link, lIdx) => (
                <a
                  key={lIdx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sp-btn-dark"
                  style={{
                    textDecoration: 'none',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    padding: '0.6rem 0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--red)', fontWeight: 800 }}>
                    [{link.code}]
                  </span>
                  <span>{link.name} →</span>
                </a>
              ))}
            </div>

            {/* Toggle Google Workspace Settings Drawer */}
            <button
              onClick={() => {
                playClick?.();
                setShowWorkspaceDrawer((prev) => !prev);
              }}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-card)',
                color: 'var(--text-primary)',
                padding: '0.75rem',
                borderRadius: '4px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer',
                textAlign: 'center',
                letterSpacing: '0.5px'
              }}
            >
              {showWorkspaceDrawer ? '▲ HIDE WORKSPACE TERMINAL' : '▼ GOOGLE WORKSPACE ARCHIVE & SETTINGS'}
            </button>
          </div>

          {/* Right Column: Master Contact Panel */}
          <div>
            <ContactPanel
              initialScope={initialScope}
              eyebrow="COMMISSION BRIEFING PROTOCOL"
              title="TRANSMIT DIRECTIVE & GOOGLE MEET."
              subtitle="Complete the specification below to register in Google Sheets, schedule in Google Calendar with Google Meet, and dispatch to jerrydotone@gmail.com."
            />
          </div>
        </div>

        {/* ── GOOGLE WORKSPACE ARCHIVE & SETTINGS DRAWER ─────────────────────── */}
        {showWorkspaceDrawer && (
          <div style={{
            maxWidth: '1200px',
            margin: '4rem auto 0',
            background: 'var(--card-bg)',
            border: '1px solid var(--border-card)',
            borderTop: '3px solid var(--brand-primary)',
            borderRadius: '4px',
            padding: '2.5rem',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid var(--border-card)',
              paddingBottom: '1.2rem',
              marginBottom: '1.5rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: 'var(--brand-primary)',
                  letterSpacing: '1px'
                }}>
                  [WORKSPACE TERMINAL // GOOGLE SHEETS &amp; WEBHOOK CONSOLE]
                </span>
                <h3 style={{
                  fontFamily: 'var(--font-hero)',
                  fontSize: '1.6rem',
                  fontWeight: 900,
                  color: 'var(--text-primary)',
                  marginTop: '0.2rem'
                }}>
                  REGISTERED INQUIRIES &amp; CLOUD CONFIGURATION.
                </h3>
              </div>

              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <button
                  onClick={handleExportCsv}
                  className="sp-btn-red"
                  style={{ fontSize: '0.72rem', padding: '0.45rem 0.9rem' }}
                >
                  ↓ EXPORT GOOGLE SHEETS CSV ({workspaceQueriesList.length})
                </button>
              </div>
            </div>

            {/* Google Apps Script Webhook Configuration Form */}
            <form onSubmit={handleSaveWebhook} style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-card)',
              padding: '1.4rem',
              borderRadius: '3px',
              marginBottom: '2rem'
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginBottom: '0.4rem'
              }}>
                GOOGLE APPS SCRIPT WEBHOOK URL (FOR AUTOMATIC SHEETS &amp; CALENDAR SYNC):
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.8rem' }}>
                Deploy the pre-written script located in <code style={{ color: 'var(--red)' }}>google-workspace/Code.gs</code> to your Google account (<strong style={{ color: 'var(--brand-primary)' }}>{JEESHAN_PRIMARY_EMAIL}</strong>) and paste the deployed Web App URL here:
              </p>

              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <input
                  type="url"
                  value={customWebhookUrl}
                  onChange={(e) => setCustomWebhookUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                  style={{
                    flex: 1,
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-card)',
                    borderRadius: '2px',
                    padding: '0.6rem 0.8rem',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.8rem',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  className="sp-btn-dark"
                  style={{ fontSize: '0.75rem', padding: '0.6rem 1rem' }}
                >
                  {webhookSaved ? '✓ SAVED' : 'SAVE WEBHOOK'}
                </button>
              </div>
            </form>

            {/* List of Registered Queries */}
            <div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 800,
                color: 'var(--text-muted)',
                marginBottom: '0.8rem'
              }}>
                REGISTERED WORKSPACE QUERIES ({workspaceQueriesList.length}):
              </div>

              {workspaceQueriesList.length === 0 ? (
                <div style={{
                  padding: '2rem',
                  textAlign: 'center',
                  background: 'var(--bg-secondary)',
                  border: '1px dashed var(--border-card)',
                  borderRadius: '3px',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem'
                }}>
                  No inquiries registered in local session yet. Submit an inquiry above to test the integration.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '300px', overflowY: 'auto' }}>
                  {workspaceQueriesList.map((q, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.8rem 1rem',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-card)',
                        borderRadius: '2px',
                        fontSize: '0.82rem'
                      }}
                    >
                      <div>
                        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--red)', fontWeight: 800, marginRight: '0.8rem' }}>
                          [{q.id}]
                        </span>
                        <strong style={{ color: 'var(--text-primary)' }}>{q.clientName}</strong>
                        <span style={{ color: 'var(--text-muted)', margin: '0 0.5rem' }}>•</span>
                        <span style={{ color: 'var(--brand-primary)' }}>{q.projectScope}</span>
                        <span style={{ color: 'var(--text-muted)', margin: '0 0.5rem' }}>•</span>
                        <span style={{ color: 'var(--text-muted)' }}>{q.meetingDate || 'Date TBD'}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          color: 'var(--red)'
                        }}>
                          {q.priorityTier}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default ContactPage;
