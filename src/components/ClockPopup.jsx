import React, { useState, useEffect, useRef } from 'react';
import { useSound } from '../hooks/useSound';
import { isSlotBooked } from '../utils/slotAvailability';

export function ClockPopup({ isOpen, selectedTime, selectedDate, onSelectTime, onClose }) {
  const { playClick, playHover } = useSound();
  const popupRef = useRef(null);

  // Parse time into 12-hour components
  const parseTime = (timeStr) => {
    if (!timeStr) return { hour: 3, minute: '00', period: 'PM' };
    const [hStr, mStr] = timeStr.split(':');
    let h = parseInt(hStr || '15', 10);
    const m = mStr || '00';
    const period = h >= 12 ? 'PM' : 'AM';
    if (h > 12) h -= 12;
    if (h === 0) h = 12;
    return { hour: h, minute: m, period };
  };

  const initial = parseTime(selectedTime);
  const [hour, setHour] = useState(initial.hour);
  const [minute, setMinute] = useState(initial.minute);
  const [period, setPeriod] = useState(initial.period);

  // Update when selectedTime changes externally
  useEffect(() => {
    const parsed = parseTime(selectedTime);
    setHour(parsed.hour);
    setMinute(parsed.minute);
    setPeriod(parsed.period);
  }, [selectedTime]);

  // Close on Escape or click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Convert 12h + period to 24h format (HH:mm)
  const format24h = (h, m, p) => {
    let h24 = h;
    if (p === 'PM' && h !== 12) h24 += 12;
    if (p === 'AM' && h === 12) h24 = 0;
    const hPad = String(h24).padStart(2, '0');
    return `${hPad}:${m}`;
  };

  const handleHourClick = (hVal) => {
    playClick?.();
    setHour(hVal);
    const new24 = format24h(hVal, minute, period);
    onSelectTime(new24);
  };

  const handleMinuteClick = (mVal) => {
    playClick?.();
    setMinute(mVal);
    const new24 = format24h(hour, mVal, period);
    onSelectTime(new24);
  };

  const handlePeriodToggle = (pVal) => {
    playClick?.();
    setPeriod(pVal);
    const new24 = format24h(hour, minute, pVal);
    onSelectTime(new24);
  };

  const current24 = format24h(hour, minute, period);
  const isCurrentBooked = isSlotBooked(selectedDate, current24);

  // Clock Hand angle: 360 / 12 = 30 deg per hour
  const handAngle = (hour % 12) * 30;

  // 12 hour tick positions (0 deg is 12 o'clock, 30 is 1 o'clock, etc.)
  // NO numbers are rendered - ticks and notches only
  const hourTicks = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const radius = 76; // px radius for tick markers

  // Handle clicking anywhere on the circular dial
  const handleDialClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    // Calculate angle in degrees clockwise from 12 o'clock
    const rad = Math.atan2(dy, dx);
    let deg = (rad * 180) / Math.PI + 90;
    if (deg < 0) deg += 360;

    let clickedHour = Math.round(deg / 30) % 12;
    if (clickedHour === 0) clickedHour = 12;
    handleHourClick(clickedHour);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(5px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div
        ref={popupRef}
        style={{
          background: 'var(--card-bg, #151F21)',
          border: '1px solid var(--border-card, #2A383B)',
          borderTop: '3px solid var(--red, #FF5A00)',
          borderRadius: '8px',
          padding: '1.6rem',
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45)',
          color: 'var(--text-primary, #F2ECDF)',
          position: 'relative'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            borderBottom: '1px solid var(--border-card, #2A383B)',
            paddingBottom: '0.8rem'
          }}
        >
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.68rem',
                color: 'var(--red, #FF5A00)',
                letterSpacing: '1px',
                fontWeight: 800
              }}
            >
              // GOOGLE MEET DISCOVERY TIME
            </div>
            <div
              style={{
                fontFamily: 'var(--font-hero, sans-serif)',
                fontSize: '1.15rem',
                fontWeight: 900
              }}
            >
              SELECT MEETING TIME
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted, #7E8C8E)',
              fontSize: '1.2rem',
              cursor: 'pointer',
              padding: '0.3rem 0.5rem',
              lineHeight: 1
            }}
            title="Close Clock"
          >
            ✕
          </button>
        </div>

        {/* Digital Time & AM/PM Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-secondary, #0D1617)',
            padding: '0.8rem 1.2rem',
            borderRadius: '6px',
            border: '1px solid var(--border-card, #2A383B)',
            marginBottom: '1.4rem'
          }}
        >
          <div>
            <span
              style={{
                fontFamily: 'var(--font-hero, sans-serif)',
                fontSize: '2rem',
                fontWeight: 900,
                color: isCurrentBooked ? '#FF5252' : 'var(--red, #FF5A00)',
                letterSpacing: '1px'
              }}
            >
              {String(hour).padStart(2, '0')}:{minute}
            </span>
            <span
              style={{
                marginLeft: '0.5rem',
                fontSize: '1rem',
                fontFamily: 'var(--font-mono, monospace)',
                color: 'var(--text-secondary, #B0C4C7)',
                fontWeight: 800
              }}
            >
              {period}
            </span>
          </div>

          {/* AM / PM Toggles */}
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            {['AM', 'PM'].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handlePeriodToggle(p)}
                style={{
                  background: period === p ? 'var(--red, #FF5A00)' : 'var(--card-bg, #151F21)',
                  color: period === p ? '#FFFFFF' : 'var(--text-secondary, #B0C4C7)',
                  border: '1px solid var(--border-card, #2A383B)',
                  borderRadius: '3px',
                  padding: '0.35rem 0.7rem',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* ── NUMBERLESS LUXURY CLOCK DIAL ─────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '1.4rem'
          }}
        >
          <div
            onClick={handleDialClick}
            style={{
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #10191A 55%, #070D0E 100%)',
              border: '2px solid var(--border-card, #2A383B)',
              boxShadow: 'inset 0 0 25px rgba(0, 0, 0, 0.7), 0 6px 20px rgba(0, 0, 0, 0.3)',
              position: 'relative',
              cursor: 'crosshair',
              userSelect: 'none'
            }}
          >
            {/* Inner Ring Guideline */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                border: '1px dashed rgba(42, 56, 59, 0.45)',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none'
              }}
            />

            {/* Center Pivot Point */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: 'var(--red, #FF5A00)',
                transform: 'translate(-50%, -50%)',
                zIndex: 6,
                boxShadow: '0 0 10px rgba(255, 90, 0, 0.9)'
              }}
            />

            {/* Glowing Clock Hand */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '3px',
                height: '62px',
                background: 'var(--red, #FF5A00)',
                transformOrigin: '50% 100%',
                transform: `translate(-50%, -100%) rotate(${handAngle}deg)`,
                transition: 'transform 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 5,
                borderRadius: '2px',
                pointerEvents: 'none'
              }}
            >
              {/* Hand Pip Tip */}
              <div
                style={{
                  position: 'absolute',
                  top: '-4px',
                  left: '50%',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  border: '2px solid var(--red, #FF5A00)',
                  transform: 'translateX(-50%)',
                  boxShadow: '0 0 8px rgba(255, 90, 0, 0.9)'
                }}
              />
            </div>

            {/* 12 Radial Hour Notches / Ticks (NO NUMBERS) */}
            {hourTicks.map((hVal, idx) => {
              const angleDeg = idx * 30; // 0 for 12, 30 for 1, etc.
              const angleRad = (angleDeg - 90) * (Math.PI / 180);
              const x = Math.round(100 + radius * Math.cos(angleRad));
              const y = Math.round(100 + radius * Math.sin(angleRad));
              const isSelected = (hour % 12) === (hVal % 12);
              const isCardinal = idx % 3 === 0; // 12, 3, 6, 9

              return (
                <div
                  key={`tick-${hVal}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleHourClick(hVal);
                  }}
                  onMouseEnter={playHover}
                  style={{
                    position: 'absolute',
                    left: `${x}px`,
                    top: `${y}px`,
                    transform: 'translate(-50%, -50%)',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 7
                  }}
                  title={`Hour ${hVal}`}
                >
                  <div
                    style={{
                      width: isSelected ? '8px' : isCardinal ? '6px' : '4px',
                      height: isSelected ? '8px' : isCardinal ? '6px' : '4px',
                      borderRadius: '50%',
                      background: isSelected
                        ? 'var(--red, #FF5A00)'
                        : isCardinal
                        ? '#F2ECDF'
                        : 'var(--text-muted, #7E8C8E)',
                      boxShadow: isSelected ? '0 0 10px #FF5A00' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Minute Selector */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '1.4rem'
          }}
        >
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted, #7E8C8E)', fontFamily: 'var(--font-mono, monospace)', fontWeight: 800 }}>
            MINUTES:
          </span>
          {['00', '15', '30', '45'].map((mVal) => (
            <button
              key={mVal}
              type="button"
              onClick={() => handleMinuteClick(mVal)}
              style={{
                background: minute === mVal ? 'var(--red, #FF5A00)' : 'var(--bg-secondary, #0D1617)',
                color: minute === mVal ? '#FFFFFF' : 'var(--text-secondary, #B0C4C7)',
                border: '1px solid var(--border-card, #2A383B)',
                borderRadius: '3px',
                padding: '0.3rem 0.75rem',
                fontFamily: 'var(--font-mono, monospace)',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              :{mVal}
            </button>
          ))}
        </div>

        {/* Confirm Selection Button - No suggestions */}
        <button
          type="button"
          onClick={() => {
            playClick?.();
            onSelectTime(current24);
            onClose();
          }}
          className="sp-btn-red"
          style={{
            width: '100%',
            textAlign: 'center',
            justifyContent: 'center',
            padding: '0.75rem',
            fontSize: '0.82rem',
            cursor: 'pointer'
          }}
        >
          CONFIRM TIME ({String(hour).padStart(2, '0')}:{minute} {period}) →
        </button>
      </div>
    </div>
  );
}

export default ClockPopup;
