import React, { useState, useEffect, useRef } from 'react';
import { useSound } from '../hooks/useSound';

export function CalendarPopup({ isOpen, selectedDate, onSelectDate, onClose }) {
  const { playClick, playHover } = useSound();
  const popupRef = useRef(null);

  // Parse initial selected date or default to today
  const initialDate = selectedDate ? new Date(selectedDate + 'T00:00:00') : new Date();
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth()); // 0-indexed

  // Today for disabling past dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

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

  // Compute days in current view month
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
  // In JS, Sunday is 0. Convert to Monday = 0: (day + 6) % 7
  const startDayOffset = (firstDayOfMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    playClick?.();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    playClick?.();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const pad = (n) => String(n).padStart(2, '0');

  const handleSelectDay = (day) => {
    playClick?.();
    const formatted = `${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`;
    onSelectDate(formatted);
    onClose();
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
          maxWidth: '380px',
          width: '100%',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.45)',
          color: 'var(--text-primary, #F2ECDF)',
          position: 'relative'
        }}
      >
        {/* Header with Title & Close button */}
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
              // GOOGLE MEET DISCOVERY
            </div>
            <div
              style={{
                fontFamily: 'var(--font-hero, sans-serif)',
                fontSize: '1.15rem',
                fontWeight: 900
              }}
            >
              SELECT MEETING DATE
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
            title="Close Calendar"
          >
            ✕
          </button>
        </div>

        {/* Month Navigation */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.2rem',
            background: 'var(--bg-secondary, #0D1617)',
            padding: '0.5rem 0.8rem',
            borderRadius: '4px',
            border: '1px solid var(--border-card, #2A383B)'
          }}
        >
          <button
            type="button"
            onClick={handlePrevMonth}
            style={{
              background: 'none',
              border: '1px solid var(--border-card, #2A383B)',
              color: 'var(--text-primary, #F2ECDF)',
              borderRadius: '3px',
              padding: '0.2rem 0.6rem',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.8rem'
            }}
          >
            ‹
          </button>

          <span
            style={{
              fontFamily: 'var(--font-mono, monospace)',
              fontWeight: 800,
              fontSize: '0.88rem',
              letterSpacing: '0.5px',
              color: 'var(--text-primary, #F2ECDF)'
            }}
          >
            {monthNames[viewMonth]} {viewYear}
          </span>

          <button
            type="button"
            onClick={handleNextMonth}
            style={{
              background: 'none',
              border: '1px solid var(--border-card, #2A383B)',
              color: 'var(--text-primary, #F2ECDF)',
              borderRadius: '3px',
              padding: '0.2rem 0.6rem',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.8rem'
            }}
          >
            ›
          </button>
        </div>

        {/* Weekdays Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            textAlign: 'center',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '0.72rem',
            fontWeight: 800,
            color: 'var(--text-muted, #7E8C8E)',
            marginBottom: '0.5rem'
          }}
        >
          {weekDays.map((d, i) => (
            <div key={i}>{d}</div>
          ))}
        </div>

        {/* Calendar Days Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '4px',
            marginBottom: '1.2rem'
          }}
        >
          {/* Empty offset days */}
          {Array.from({ length: startDayOffset }).map((_, i) => (
            <div key={`empty-${i}`} style={{ height: '38px' }} />
          ))}

          {/* Actual Month Days - No suggestions, clean selection */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const thisDayDate = new Date(viewYear, viewMonth, dayNum);
            const isPast = thisDayDate < today;
            const dateStr = `${viewYear}-${pad(viewMonth + 1)}-${pad(dayNum)}`;
            const isSelected = selectedDate === dateStr;
            const isToday = thisDayDate.getTime() === today.getTime();

            return (
              <button
                key={`day-${dayNum}`}
                type="button"
                disabled={isPast}
                onClick={() => handleSelectDay(dayNum)}
                onMouseEnter={playHover}
                style={{
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isSelected
                    ? 'var(--red, #FF5A00)'
                    : isToday
                    ? 'rgba(255, 90, 0, 0.12)'
                    : 'var(--bg-secondary, #0D1617)',
                  color: isPast
                    ? 'rgba(126, 140, 142, 0.35)'
                    : isSelected
                    ? '#FFFFFF'
                    : 'var(--text-primary, #F2ECDF)',
                  border: isSelected
                    ? '1px solid var(--red, #FF5A00)'
                    : isToday
                    ? '1px solid var(--red, #FF5A00)'
                    : '1px solid transparent',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '0.85rem',
                  fontWeight: isSelected || isToday ? 800 : 500,
                  cursor: isPast ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {dayNum}
              </button>
            );
          })}
        </div>

        {/* Clean Footer - No suggestions */}
        <div
          style={{
            borderTop: '1px solid var(--border-card, #2A383B)',
            paddingTop: '0.8rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted, #7E8C8E)', fontFamily: 'var(--font-mono, monospace)' }}>
            CHOOSE YOUR PREFERRED DATE
          </span>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-card, #2A383B)',
              color: 'var(--text-secondary, #B0C4C7)',
              padding: '0.3rem 0.7rem',
              borderRadius: '3px',
              fontFamily: 'var(--font-mono, monospace)',
              fontSize: '0.72rem',
              cursor: 'pointer'
            }}
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
}

export default CalendarPopup;
