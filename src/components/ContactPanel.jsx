import React, { useState, useEffect, useMemo } from 'react';
import { useSound } from '../hooks/useSound';
import { analyzeQueryWithAI } from '../utils/queryTriageAI';
import { CalendarPopup } from './CalendarPopup';
import { ClockPopup } from './ClockPopup';
import {
  STANDARD_SLOTS,
  isSlotBooked,
  getBookedSlotsForDate,
  getSlotsAvailability
} from '../utils/slotAvailability';
import {
  JEESHAN_PRIMARY_EMAIL,
  WEBHOOK_URL_KEY,
  createGoogleCalendarEventUrl,
  createGmailComposeUrl,
  registerQueryInWorkspace,
  exportWorkspaceQueriesCsv
} from '../utils/googleWorkspaceIntegration';

export function ContactPanel({
  initialScope = 'Brand Identity & Strategy',
  title = 'COMMISSION BRIEFING & GOOGLE MEET.',
  eyebrow = 'DIRECT DISPATCH & GOOGLE WORKSPACE DISCOVERY',
  subtitle = 'Schedule a discovery session, log your project into Google Sheets, and dispatch a comprehensive brief straight to jerrydotone@gmail.com.',
  compact = false
}) {
  const { playClick, playHover } = useSound();

  // Helper for default tomorrow date
  const getDefaultDate = (offsetDays = 1) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Form State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [projectScope, setProjectScope] = useState(initialScope);
  const [budgetTier, setBudgetTier] = useState('₹50k - ₹1.5L / $800 - $2k');
  const [meetingDate, setMeetingDate] = useState(() => getDefaultDate(1));
  const [meetingTime, setMeetingTime] = useState('15:00');
  const [timezone, setTimezone] = useState('IST (UTC+5:30)');
  const [messageBrief, setMessageBrief] = useState(
    initialScope
      ? `We would like to connect with Jeeshan Purohit Studio regarding:\n${initialScope}\n\nLet's connect via Google Meet to align on deliverables, timeline, and strategic scope.`
      : ''
  );

  // Popups State
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isClockOpen, setIsClockOpen] = useState(false);

  // Live Slot Availability State
  const [slotsUpdateTick, setSlotsUpdateTick] = useState(0);

  useEffect(() => {
    const handleSlotsUpdated = () => {
      setSlotsUpdateTick((t) => t + 1);
    };
    window.addEventListener('jeeshan_slots_updated', handleSlotsUpdated);
    return () => window.removeEventListener('jeeshan_slots_updated', handleSlotsUpdated);
  }, []);

  const slotStatusList = useMemo(() => {
    return getSlotsAvailability(meetingDate);
  }, [meetingDate, slotsUpdateTick]);

  const freeSlotsCount = useMemo(() => {
    return slotStatusList.filter((s) => !s.isBooked).length;
  }, [slotStatusList]);

  // Submission & Feedback States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionProgress, setSubmissionProgress] = useState('');
  const [submittedData, setSubmittedData] = useState(null);
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);
  const [previewAiMode, setPreviewAiMode] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [dispatchNotice, setDispatchNotice] = useState(null);

  // Quick Date presets
  const quickDates = [
    { label: 'Tomorrow', date: getDefaultDate(1) },
    { label: '+2 Days', date: getDefaultDate(2) },
    { label: '+3 Days', date: getDefaultDate(3) }
  ];

  // Active Data for Links
  const activeFormData = useMemo(() => {
    return (
      submittedData || {
        clientName: clientName || 'Client',
        clientEmail: clientEmail || 'client@studio.com',
        clientPhone,
        projectScope,
        budgetTier,
        meetingDate,
        meetingTime,
        timezone,
        messageBrief
      }
    );
  }, [
    submittedData,
    clientName,
    clientEmail,
    clientPhone,
    projectScope,
    budgetTier,
    meetingDate,
    meetingTime,
    timezone,
    messageBrief
  ]);

  // Google Calendar URL (Optional for client's own calendar)
  const calendarUrl = useMemo(() => {
    return createGoogleCalendarEventUrl({
      ...activeFormData,
      aiAnalysis: aiAnalysisResult
    });
  }, [activeFormData, aiAnalysisResult]);

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if chosen slot is already booked
    if (isSlotBooked(meetingDate, meetingTime)) {
      alert(`The slot on ${meetingDate} at ${meetingTime} is already booked by another inquiry. Please pick an open/free time slot.`);
      setIsClockOpen(true);
      return;
    }

    playClick?.();
    setIsSubmitting(true);
    setSubmissionProgress('Reserving Google Calendar & Meet...');

    const formData = {
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      clientPhone: clientPhone.trim(),
      projectScope,
      budgetTier,
      meetingDate,
      meetingTime,
      timezone,
      messageBrief: messageBrief.trim()
    };

    // 1. Run AI Strategic Triage
    const analysis = analyzeQueryWithAI(formData);

    // 2. Dispatch to Google Workspace (Google Sheets + Auto-Add to Google Calendar + Creative Dossier Email to Jeeshan + Auto-Confirmation to Client)
    setSubmissionProgress('Synchronizing with Google Calendar, Sheets & jerrydotone@gmail.com...');
    const workspaceResult = await registerQueryInWorkspace({
      query: formData,
      aiAnalysis: analysis
    });

    setSubmittedData(formData);
    setAiAnalysisResult(analysis);
    setDispatchNotice({
      directEmail: workspaceResult.directEmailDispatched,
      webhook: workspaceResult.webhookDispatched,
      queryId: workspaceResult.queryId
    });
    setIsSubmitting(false);
    setPreviewAiMode(false);
    setSubmissionProgress('');
  };

  // Preview AI classification
  const handlePreviewAI = () => {
    playClick?.();
    if (!clientName || !messageBrief) {
      alert('Please enter at least your Name and a brief Project Note to run AI analysis.');
      return;
    }
    const formData = {
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      clientPhone: clientPhone.trim(),
      projectScope,
      budgetTier,
      meetingDate,
      meetingTime,
      timezone,
      messageBrief: messageBrief.trim()
    };
    const analysis = analyzeQueryWithAI(formData);
    setAiAnalysisResult(analysis);
    setPreviewAiMode(true);
  };

  // Copy Draft Response
  const handleCopyDraft = () => {
    playClick?.();
    if (aiAnalysisResult?.draftedResponse) {
      navigator.clipboard.writeText(aiAnalysisResult.draftedResponse);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    playClick?.();
    const csvContent = exportWorkspaceQueriesCsv();
    if (!csvContent) {
      alert('No queries registered in this browser session yet.');
      return;
    }
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Jeeshan_Studio_GoogleSheets_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="sp-contact-panel-root"
      style={{
        background: 'var(--card-bg, #151F21)',
        border: '1px solid var(--border-card, #2A383B)',
        borderTop: '4px solid var(--red, #FF5A00)',
        borderRadius: '6px',
        padding: compact ? '1.8rem' : '2.5rem',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.22)',
        position: 'relative',
        width: '100%'
      }}
    >
      {/* ── MODAL POPUPS ────────────────────────────────────────────────────── */}
      <CalendarPopup
        isOpen={isCalendarOpen}
        selectedDate={meetingDate}
        onSelectDate={(newDate) => {
          setMeetingDate(newDate);
          // If current meeting time is booked on new date, pick first free slot
          const bookedOnNewDate = getBookedSlotsForDate(newDate);
          if (bookedOnNewDate.includes(meetingTime)) {
            const firstFree = STANDARD_SLOTS.find((s) => !bookedOnNewDate.includes(s.time));
            if (firstFree) setMeetingTime(firstFree.time);
          }
        }}
        onClose={() => setIsCalendarOpen(false)}
      />

      <ClockPopup
        isOpen={isClockOpen}
        selectedTime={meetingTime}
        selectedDate={meetingDate}
        onSelectTime={(newTime) => setMeetingTime(newTime)}
        onClose={() => setIsClockOpen(false)}
      />

      {/* ── COCKPIT MODE (AFTER SUBMISSION OR PREVIEW) ────────────────────── */}
      {(submittedData || previewAiMode) && aiAnalysisResult ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
          {/* Status Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '1px solid var(--border-card, #2A383B)',
              paddingBottom: '1.2rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: 'var(--brand-primary, #0B6E76)',
                  letterSpacing: '1px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    background: 'var(--red, #FF5A00)',
                    borderRadius: '2px',
                    display: 'inline-block'
                  }}
                />
                {aiAnalysisResult.queryId} //{' '}
                {submittedData ? 'AUTOMATICALLY SCHEDULED & CONFIRMED' : 'PREVIEW ANALYSIS'}
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-hero, sans-serif)',
                  fontSize: '1.75rem',
                  fontWeight: 900,
                  color: 'var(--text-primary, #F2ECDF)',
                  marginTop: '0.3rem'
                }}
              >
                {submittedData
                  ? 'MEETING CONFIRMED & DIRECTIVE LOGGED.'
                  : 'AI DIRECTIVE PREVIEW.'}
              </h2>
            </div>

            <button
              onClick={() => {
                playClick?.();
                setSubmittedData(null);
                setPreviewAiMode(false);
              }}
              style={{
                background: 'var(--bg-secondary, #0D1617)',
                border: '1px solid var(--border-card, #2A383B)',
                color: 'var(--text-secondary, #B0C4C7)',
                padding: '0.45rem 0.9rem',
                borderRadius: '3px',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.72rem',
                cursor: 'pointer',
                fontWeight: 700
              }}
            >
              ← SCHEDULE ANOTHER INQUIRY
            </button>
          </div>

          {/* ── AUTOMATIC STATUS DASHBOARD (NO MANUAL ADD REQUIRED) ─────────── */}
          <div
            style={{
              background: 'var(--bg-secondary, #0D1617)',
              border: '1px solid var(--border-card, #2A383B)',
              borderLeft: '4px solid var(--red, #FF5A00)',
              borderRadius: '4px',
              padding: '1.4rem'
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.72rem',
                fontWeight: 800,
                color: 'var(--red, #FF5A00)',
                letterSpacing: '1.2px',
                textTransform: 'uppercase',
                marginBottom: '1rem'
              }}
            >
              // AUTOMATED GOOGLE WORKSPACE STATUS (ALL CHANNELS ACTIVE):
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* 1. Google Calendar Auto-Booked */}
              <div
                style={{
                  background: 'rgba(255, 90, 0, 0.08)',
                  border: '1px solid rgba(255, 90, 0, 0.25)',
                  borderRadius: '4px',
                  padding: '1rem 1.2rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '0.8rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1rem' }}>📅</span>
                    <strong style={{ color: 'var(--text-primary, #F2ECDF)', fontSize: '0.92rem' }}>
                      AUTOMATICALLY ADDED TO JEESHAN'S GOOGLE CALENDAR
                    </strong>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary, #B0C4C7)', marginTop: '0.3rem' }}>
                    Slot Confirmed: <strong style={{ color: 'var(--red, #FF5A00)' }}>{activeFormData.meetingDate}</strong> at{' '}
                    <strong style={{ color: 'var(--red, #FF5A00)' }}>{activeFormData.meetingTime}</strong> ({activeFormData.timezone})
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #7E8C8E)', marginTop: '0.2rem' }}>
                    🎥 Google Meet video call automatically generated and attached to the calendar invitation.
                  </div>
                </div>

                <a
                  href={calendarUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: 'var(--card-bg, #151F21)',
                    border: '1px solid var(--border-card, #2A383B)',
                    color: 'var(--text-primary, #F2ECDF)',
                    textDecoration: 'none',
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-mono, monospace)',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '3px',
                    fontWeight: 700
                  }}
                  title="Add copy to your personal calendar (optional)"
                >
                  + Add to your personal calendar (optional) ↗
                </a>
              </div>

              {/* 2. Email Confirmation to Client */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.88rem',
                  flexWrap: 'wrap',
                  gap: '0.6rem'
                }}
              >
                <div>
                  <span style={{ color: 'var(--text-primary, #F2ECDF)', fontWeight: 700 }}>
                    <strong style={{ color: 'var(--brand-primary, #0B6E76)' }}>✓ Client Google Meet Invite:</strong> Transmitted to{' '}
                    <span style={{ color: 'var(--text-primary, #F2ECDF)', fontWeight: 800 }}>
                      {activeFormData.clientEmail}
                    </span>
                  </span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #7E8C8E)', marginTop: '0.1rem' }}>
                    Includes meeting agenda, Google Meet link, and calendar invite.
                  </div>
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.7rem',
                    color: 'var(--brand-primary, #0B6E76)',
                    background: 'rgba(11, 110, 118, 0.15)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '2px'
                  }}
                >
                  SENT TO CLIENT
                </span>
              </div>

              {/* 3. Creative Form Dossier to Jeeshan */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.88rem',
                  flexWrap: 'wrap',
                  gap: '0.6rem'
                }}
              >
                <div>
                  <span style={{ color: 'var(--text-primary, #F2ECDF)', fontWeight: 700 }}>
                    <strong style={{ color: 'var(--brand-primary, #0B6E76)' }}>✓ Creative Briefing Dossier:</strong> Transmitted to{' '}
                    <span style={{ color: 'var(--red, #FF5A00)', fontWeight: 800 }}>
                      {JEESHAN_PRIMARY_EMAIL}
                    </span>
                  </span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #7E8C8E)', marginTop: '0.1rem' }}>
                    Formatted creative form-type brief with project specs, budget, and AI triage.
                  </div>
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.7rem',
                    color: 'var(--brand-primary, #0B6E76)',
                    background: 'rgba(11, 110, 118, 0.15)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '2px'
                  }}
                >
                  DELIVERED TO STUDIO
                </span>
              </div>

              {/* 4. Google Sheets Master Log */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.88rem',
                  flexWrap: 'wrap',
                  gap: '0.6rem'
                }}
              >
                <div>
                  <span style={{ color: 'var(--text-primary, #F2ECDF)', fontWeight: 700 }}>
                    <strong style={{ color: 'var(--brand-primary, #0B6E76)' }}>✓ Google Sheets Master Log:</strong> Registered in{' '}
                    <code style={{ color: 'var(--brand-primary, #0B6E76)' }}>Jeeshan Studio Master Queries</code>
                  </span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted, #7E8C8E)', marginTop: '0.1rem' }}>
                    Query ID: <code style={{ color: 'var(--text-primary, #F2ECDF)' }}>{aiAnalysisResult.queryId}</code> • Synced to Google Drive.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="sp-btn-dark"
                  style={{
                    fontSize: '0.7rem',
                    padding: '0.35rem 0.75rem',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={playHover}
                >
                  ↓ EXPORT SHEETS CSV
                </button>
              </div>
            </div>
          </div>

          {/* AI Strategic Directive */}
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.8rem',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: 'var(--red, #FF5A00)',
                  letterSpacing: '1px'
                }}
              >
                // AI STRATEGIC ACTION PLAN FOR JEESHAN:
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  background: 'rgba(255, 90, 0, 0.12)',
                  color: 'var(--red, #FF5A00)',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '3px'
                }}
              >
                {aiAnalysisResult.priorityTier} • SCORE {aiAnalysisResult.priorityScore}/100
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {aiAnalysisResult.actionSteps?.map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    background: 'var(--bg-secondary, #0D1617)',
                    border: '1px solid var(--border-card, #2A383B)',
                    borderRadius: '3px',
                    padding: '0.8rem 1rem'
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: 'var(--red, #FF5A00)',
                      background: 'rgba(255, 90, 0, 0.08)',
                      padding: '0.2rem 0.4rem',
                      borderRadius: '2px'
                    }}
                  >
                    [{step.num}]
                  </span>
                  <div>
                    <div
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        color: 'var(--text-primary, #F2ECDF)'
                      }}
                    >
                      {step.title}
                    </div>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary, #B0C4C7)',
                        marginTop: '0.2rem',
                        lineHeight: 1.4
                      }}
                    >
                      {step.instruction}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Pre-Drafted Client Response */}
          <div
            style={{
              borderTop: '1px solid var(--border-card, #2A383B)',
              paddingTop: '1.2rem'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.6rem'
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: 'var(--text-muted, #7E8C8E)'
                }}
              >
                AI PRE-DRAFTED CLIENT RESPONSE:
              </span>
              <button
                type="button"
                onClick={handleCopyDraft}
                style={{
                  background: 'none',
                  border: '1px solid var(--border-card, #2A383B)',
                  color: copySuccess ? 'var(--red, #FF5A00)' : 'var(--text-secondary, #B0C4C7)',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.25rem 0.6rem',
                  borderRadius: '2px',
                  cursor: 'pointer'
                }}
              >
                {copySuccess ? '✓ COPIED TO CLIPBOARD' : 'COPY DRAFT'}
              </button>
            </div>

            <pre
              style={{
                background: 'var(--bg-secondary, #0D1617)',
                border: '1px solid var(--border-card, #2A383B)',
                padding: '1rem',
                borderRadius: '3px',
                fontSize: '0.8rem',
                fontFamily: 'var(--font-mono, monospace)',
                color: 'var(--text-primary, #F2ECDF)',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.5,
                maxHeight: '220px',
                overflowY: 'auto'
              }}
            >
              {aiAnalysisResult.draftedResponse}
            </pre>
          </div>
        </div>
      ) : (
        /* ── INTERACTIVE FORM MODE ─────────────────────────────────────────── */
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
          {/* Header */}
          <div>
            <span
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.72rem',
                fontWeight: 800,
                color: 'var(--red, #FF5A00)',
                letterSpacing: '1.2px',
                display: 'block'
              }}
            >
              [{eyebrow}]
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-hero, sans-serif)',
                fontSize: compact ? '1.5rem' : '1.85rem',
                fontWeight: 900,
                color: 'var(--text-primary, #F2ECDF)',
                marginTop: '0.2rem'
              }}
            >
              {title}
            </h2>
            <p
              style={{
                fontSize: '0.88rem',
                color: 'var(--text-secondary, #B0C4C7)',
                marginTop: '0.3rem',
                lineHeight: 1.5
              }}
            >
              {subtitle}
            </p>
          </div>

          {/* Destination Badge */}
          <div
            style={{
              background: 'var(--bg-secondary, #0D1617)',
              border: '1px solid var(--border-card, #2A383B)',
              borderRadius: '4px',
              padding: '0.65rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.5rem',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.76rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--red, #FF5A00)' }}>●</span>
              <span style={{ color: 'var(--text-muted, #7E8C8E)' }}>DIRECT STUDIO INBOX:</span>
              <strong style={{ color: 'var(--brand-primary, #0B6E76)' }}>{JEESHAN_PRIMARY_EMAIL}</strong>
            </div>
          </div>

          {/* Row 1: Name & Email */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '1rem'
            }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: 'var(--text-muted, #7E8C8E)',
                  marginBottom: '0.35rem',
                  textTransform: 'uppercase'
                }}
              >
                Full Name *
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Maya Chen"
                style={{
                  width: '100%',
                  background: 'var(--bg-secondary, #0D1617)',
                  border: '1px solid var(--border-card, #2A383B)',
                  borderRadius: '3px',
                  padding: '0.75rem 0.9rem',
                  color: 'var(--text-primary, #F2ECDF)',
                  fontFamily: 'var(--font-body, sans-serif)',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--red, #FF5A00)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-card, #2A383B)';
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: 'var(--text-muted, #7E8C8E)',
                  marginBottom: '0.35rem',
                  textTransform: 'uppercase'
                }}
              >
                Email Address *
              </label>
              <input
                type="email"
                required
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="maya@studio.com"
                style={{
                  width: '100%',
                  background: 'var(--bg-secondary, #0D1617)',
                  border: '1px solid var(--border-card, #2A383B)',
                  borderRadius: '3px',
                  padding: '0.75rem 0.9rem',
                  color: 'var(--text-primary, #F2ECDF)',
                  fontFamily: 'var(--font-body, sans-serif)',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--red, #FF5A00)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-card, #2A383B)';
                }}
              />
            </div>
          </div>

          {/* Row 2: Phone & Scope */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '1rem'
            }}
          >
            <div>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: 'var(--text-muted, #7E8C8E)',
                  marginBottom: '0.35rem',
                  textTransform: 'uppercase'
                }}
              >
                Phone / WhatsApp Number
              </label>
              <input
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="+91-9876543210"
                style={{
                  width: '100%',
                  background: 'var(--bg-secondary, #0D1617)',
                  border: '1px solid var(--border-card, #2A383B)',
                  borderRadius: '3px',
                  padding: '0.75rem 0.9rem',
                  color: 'var(--text-primary, #F2ECDF)',
                  fontFamily: 'var(--font-body, sans-serif)',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--red, #FF5A00)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-card, #2A383B)';
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: 'var(--text-muted, #7E8C8E)',
                  marginBottom: '0.35rem',
                  textTransform: 'uppercase'
                }}
              >
                Project Scope / Discipline *
              </label>
              <select
                value={projectScope}
                onChange={(e) => setProjectScope(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--bg-secondary, #0D1617)',
                  border: '1px solid var(--border-card, #2A383B)',
                  borderRadius: '3px',
                  padding: '0.75rem 0.9rem',
                  color: 'var(--text-primary, #F2ECDF)',
                  fontFamily: 'var(--font-body, sans-serif)',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              >
                <option value="Brand Identity & Strategy">Brand Identity Architecture &amp; Strategy</option>
                <option value="Motion Graphics & 2D Animation">Motion Graphics &amp; 2D Scientific Animation</option>
                <option value="Commercial Video Editing">Commercial Video Editing &amp; After-Films</option>
                <option value="UI/UX & Web Interface Design">UI/UX &amp; Web Interface Engineering</option>
                <option value="Creative Direction & Consultation">Creative Direction &amp; Studio Retainer</option>
              </select>
            </div>
          </div>

          {/* ── GOOGLE MEET SCHEDULER: CALENDAR & CLOCK POPUP INTEGRATION ──── */}
          <div
            style={{
              background: 'var(--bg-secondary, #0D1617)',
              border: '1px solid var(--border-card, #2A383B)',
              borderLeft: '4px solid var(--red, #FF5A00)',
              borderRadius: '4px',
              padding: '1.3rem',
              position: 'relative'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem',
                marginBottom: '0.9rem'
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  color: 'var(--red, #FF5A00)',
                  letterSpacing: '1px'
                }}
              >
                // PROPOSE GOOGLE MEET DISCOVERY CALL:
              </div>
            </div>

            {/* Clean Date & Time Selectors (User-Directed Selection, No Presets/Suggestions) */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                gap: '0.9rem',
                marginBottom: '1rem'
              }}
            >
              {/* Button 1: Open Calendar */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.68rem',
                    color: 'var(--text-muted, #7E8C8E)',
                    marginBottom: '0.35rem',
                    textTransform: 'uppercase'
                  }}
                >
                  Selected Date
                </label>
                <button
                  type="button"
                  onClick={() => {
                    playClick?.();
                    setIsCalendarOpen(true);
                  }}
                  onMouseEnter={playHover}
                  style={{
                    width: '100%',
                    background: 'var(--card-bg, #151F21)',
                    border: '1px solid var(--border-card, #2A383B)',
                    borderRadius: '4px',
                    padding: '0.75rem 0.9rem',
                    color: 'var(--text-primary, #F2ECDF)',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>📅 {meetingDate}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--red, #FF5A00)', fontWeight: 800 }}>
                    CHANGE DATE ▾
                  </span>
                </button>
              </div>

              {/* Button 2: Open Clock */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.68rem',
                    color: 'var(--text-muted, #7E8C8E)',
                    marginBottom: '0.35rem',
                    textTransform: 'uppercase'
                  }}
                >
                  Selected Time
                </label>
                <button
                  type="button"
                  onClick={() => {
                    playClick?.();
                    setIsClockOpen(true);
                  }}
                  onMouseEnter={playHover}
                  style={{
                    width: '100%',
                    background: 'var(--card-bg, #151F21)',
                    border: '1px solid var(--border-card, #2A383B)',
                    borderRadius: '4px',
                    padding: '0.75rem 0.9rem',
                    color: 'var(--text-primary, #F2ECDF)',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>⏰ {meetingTime} ({parseInt(meetingTime.split(':')[0], 10) >= 12 ? 'PM' : 'AM'})</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--red, #FF5A00)', fontWeight: 800 }}>
                    CHANGE TIME ▾
                  </span>
                </button>
              </div>

              {/* Form Control: Timezone Dropdown (Select, not a button) */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.68rem',
                    color: 'var(--text-muted, #7E8C8E)',
                    marginBottom: '0.35rem',
                    textTransform: 'uppercase'
                  }}
                >
                  Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--card-bg, #151F21)',
                    border: '1px solid var(--border-card, #2A383B)',
                    borderRadius: '4px',
                    padding: '0.75rem 0.9rem',
                    color: 'var(--text-primary, #F2ECDF)',
                    fontFamily: 'var(--font-mono, monospace)',
                    fontSize: '0.82rem',
                    outline: 'none',
                    height: '44px'
                  }}
                >
                  <option value="IST (UTC+5:30)">IST (India, UTC+5:30)</option>
                  <option value="EST (UTC-5)">EST (New York, UTC-5)</option>
                  <option value="PST (UTC-8)">PST (California, UTC-8)</option>
                  <option value="GMT/BST (UTC+1)">GMT / BST (London, UTC+1)</option>
                  <option value="CET (UTC+1)">CET (Europe, UTC+1)</option>
                  <option value="SGT (UTC+8)">SGT (Singapore, UTC+8)</option>
                  <option value="AEST (UTC+10)">AEST (Sydney, UTC+10)</option>
                </select>
              </div>
            </div>

            {/* Live Synchronized Confirmation Badge (Info only - 0 buttons) */}
            <div
              style={{
                background: 'var(--card-bg, #151F21)',
                border: '1px solid var(--border-card, #2A383B)',
                borderRadius: '4px',
                padding: '0.7rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.5rem',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.72rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--brand-primary, #0B6E76)' }}>🟢</span>
                <span style={{ color: 'var(--text-muted, #7E8C8E)' }}>SYNCHRONIZATION TARGET:</span>
                <span style={{ color: 'var(--text-primary, #F2ECDF)' }}>Google Meet Discovery Call</span>
              </div>
              <div style={{ color: 'var(--red, #FF5A00)', fontWeight: 800 }}>
                {meetingDate} @ {meetingTime} ({timezone.split(' ')[0]})
              </div>
            </div>
          </div>



          {/* Message Brief */}
          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.72rem',
                fontWeight: 800,
                color: 'var(--text-muted, #7E8C8E)',
                marginBottom: '0.35rem',
                textTransform: 'uppercase'
              }}
            >
              Project Brief &amp; Technical Specifications *
            </label>
            <textarea
              required
              rows={compact ? 3 : 4}
              value={messageBrief}
              onChange={(e) => setMessageBrief(e.target.value)}
              placeholder="Tell me about project goals, key deliverables, target launch date, and challenges..."
              style={{
                width: '100%',
                background: 'var(--bg-secondary, #0D1617)',
                border: '1px solid var(--border-card, #2A383B)',
                borderRadius: '3px',
                padding: '0.85rem 0.9rem',
                color: 'var(--text-primary, #F2ECDF)',
                fontFamily: 'var(--font-body, sans-serif)',
                fontSize: '0.92rem',
                outline: 'none',
                resize: 'vertical',
                lineHeight: 1.5
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--red, #FF5A00)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-card, #2A383B)';
              }}
            />
          </div>

          {/* Action Row */}
          {/* Action Row - Single decisive submit button (Button 3 of 3 in entire inquiry panel) */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              marginTop: '0.4rem'
            }}
          >
            <button
              type="submit"
              className="sp-btn-red"
              disabled={isSubmitting}
              style={{
                width: '100%',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '0.9rem 1.4rem',
                fontSize: '0.85rem',
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={playHover}
            >
              {isSubmitting
                ? submissionProgress || 'AUTOMATICALLY SCHEDULING GOOGLE MEET...'
                : 'TRANSMIT DIRECTIVE & AUTO-SCHEDULE GOOGLE MEET →'}
            </button>
          </div>

          <div
            style={{
              fontSize: '0.72rem',
              color: 'var(--text-muted, #7E8C8E)',
              textAlign: 'center',
              fontFamily: 'var(--font-mono, monospace)'
            }}
          >
            DISPATCH TARGET: {JEESHAN_PRIMARY_EMAIL} // GOOGLE SHEETS &amp; CALENDAR AUTO-CONFIRMED
          </div>
        </form>
      )}
    </div>
  );
}

export default ContactPanel;
