import React from "react";
import { useAudioContext } from "../context/AudioContext";

export function AudioToggle({ compact = false, showLabel = true, className = "" }) {
  const { audioEnabled, toggleAudio, playHover } = useAudioContext();

  return (
    <button
      type="button"
      className={`sp-audio-toggle ${audioEnabled ? "active" : "muted"} ${compact ? "compact" : ""} ${className}`.trim()}
      onClick={toggleAudio}
      onMouseEnter={playHover}
      title={audioEnabled ? "Mute sound & ambient music" : "Enable sound effects & ambient audio"}
      aria-label={audioEnabled ? "Mute audio" : "Enable audio"}
      aria-pressed={audioEnabled}
    >
      <div className="sp-audio-icon-wrap" aria-hidden="true">
        {audioEnabled ? (
          /* Animated Equalizer Waves */
          <div className="sp-equalizer-bars">
            <span className="sp-eq-bar bar-1" />
            <span className="sp-eq-bar bar-2" />
            <span className="sp-eq-bar bar-3" />
            <span className="sp-eq-bar bar-4" />
          </div>
        ) : (
          /* Sleek Muted Speaker SVG */
          <svg className="sp-audio-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        )}
      </div>

      {showLabel && (
        <span className="sp-audio-text">
          <span className="sp-audio-indicator" />
          <span className="sp-audio-label">AUDIO:</span>
          <span className="sp-audio-state">{audioEnabled ? "ON" : "OFF"}</span>
        </span>
      )}
    </button>
  );
}

