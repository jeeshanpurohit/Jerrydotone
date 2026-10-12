import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { aiVoice, queryJerryAI } from "../utils/aiVoiceEngine";

export default function AIVoiceAssistant({ onOpenTextChat }) {
  const navigate = useNavigate();
  const location = useLocation();

  // HUD & Voice States
  const [hudOpen, setHudOpen] = useState(false);
  const [mode, setMode] = useState("voice"); // "voice" | "minimized"
  const [voiceStatus, setVoiceStatus] = useState("idle"); // "idle" | "listening" | "thinking" | "speaking"
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [inputText, setInputText] = useState("");
  const [navNotification, setNavNotification] = useState(null);
  const [micError, setMicError] = useState(null);
  const [handsFree, setHandsFree] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [history, setHistory] = useState([]);

  const isProcessingRef = useRef(false);
  const historyRef = useRef(history);
  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  const voiceMutedRef = useRef(voiceMuted);
  useEffect(() => {
    voiceMutedRef.current = voiceMuted;
  }, [voiceMuted]);

  // Global trigger listener (e.g. from Navbar or Hero buttons)
  useEffect(() => {
    const handleOpenTrigger = (e) => {
      setHudOpen(true);
      setMicError(null);
      aiVoice.playChime("activate");
      if (e?.detail?.autoListen) {
        setTimeout(async () => {
          await aiVoice.startListening();
        }, 400);
      }
    };

    window.addEventListener("open-voice-assistant", handleOpenTrigger);
    return () => window.removeEventListener("open-voice-assistant", handleOpenTrigger);
  }, []);

  // Process User Voice or Prompt Input
  const handleVoiceSubmit = useCallback(async (spokenQuery) => {
    if (!spokenQuery || isProcessingRef.current) return;
    isProcessingRef.current = true;
    setVoiceStatus("thinking");
    aiVoice.playChime("thought");
    aiVoice.stopListening();

    const currentHistory = historyRef.current;
    const userMessage = { role: "user", content: spokenQuery };
    const updatedHistory = [...currentHistory, userMessage];
    setHistory(updatedHistory);

    try {
      const response = await queryJerryAI(spokenQuery, updatedHistory);
      setAiResponse(response.text);

      const assistantMessage = { role: "assistant", content: response.text };
      setHistory([...updatedHistory, assistantMessage]);

      // Check if navigation action was triggered
      if (response.navPath && response.navPath !== location.pathname) {
        setNavNotification(`⚡ DIRECTIVE: Navigating to ${response.navPath}`);
        setTimeout(() => {
          navigate(response.navPath);
          setTimeout(() => setNavNotification(null), 3000);
        }, 900);
      }

      // Speak response out loud
      if (!voiceMutedRef.current) {
        aiVoice.speak(response.text);
      } else {
        setVoiceStatus("idle");
      }
    } catch (err) {
      const fallback = "My communication antenna caught a glitch, but Jeeshan is ready for action! What else can I guide you with?";
      setAiResponse(fallback);
      if (!voiceMutedRef.current) aiVoice.speak(fallback);
      setVoiceStatus("idle");
    } finally {
      isProcessingRef.current = false;
    }
  }, [location.pathname, navigate]);

  // Synchronize with aiVoiceEngine subscriptions
  useEffect(() => {
    const unsubscribe = aiVoice.subscribe((event) => {
      if (event.type === "speech_start") {
        setVoiceStatus("speaking");
      } else if (event.type === "speech_end") {
        setVoiceStatus("idle");
      } else if (event.type === "listening_start") {
        setVoiceStatus("listening");
        setMicError(null);
      } else if (event.type === "listening_end") {
        if (!isProcessingRef.current) {
          setVoiceStatus("idle");
        }
      } else if (event.type === "speech_result") {
        setTranscript(event.transcript);
        if (event.isFinal && event.transcript.trim()) {
          handleVoiceSubmit(event.transcript.trim());
        }
      } else if (event.type === "listening_error" || event.type === "mic_permission_denied") {
        setVoiceStatus("idle");
        if (event.error) {
          setMicError(event.error);
        }
      }
    });

    return () => {
      unsubscribe();
      aiVoice.stopSpeaking();
      aiVoice.stopListening();
    };
  }, [handleVoiceSubmit]);

  // Handle direct text submission
  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim() || voiceStatus === "thinking") return;
    const query = inputText.trim();
    setInputText("");
    setTranscript(query);
    handleVoiceSubmit(query);
  };

  // Toggle Microphone / Listening
  const handleOrbClick = async () => {
    if (voiceStatus === "speaking") {
      aiVoice.stopSpeaking();
      setVoiceStatus("idle");
      return;
    }

    if (voiceStatus === "listening") {
      aiVoice.stopListening();
      if (transcript && transcript.trim()) {
        handleVoiceSubmit(transcript.trim());
      } else {
        setVoiceStatus("idle");
      }
    } else {
      setTranscript("");
      setVoiceStatus("listening");
      await aiVoice.startListening();
    }
  };

  // Toggle Hands-Free
  const toggleHandsFree = () => {
    const nextVal = !handsFree;
    setHandsFree(nextVal);
    aiVoice.setHandsFree(nextVal);
    if (nextVal && voiceStatus === "idle") {
      aiVoice.startListening();
    }
  };

  // Toggle Mute
  const toggleMute = () => {
    const nextMuted = !voiceMuted;
    setVoiceMuted(nextMuted);
    aiVoice.toggleVoice(!nextMuted);
  };

  // Open HUD
  const openAssistant = () => {
    setHudOpen(true);
    setTranscript("");
    aiVoice.playChime("activate");
    setTimeout(async () => {
      await aiVoice.startListening();
    }, 400);
  };

  // Close HUD
  const closeAssistant = () => {
    aiVoice.stopSpeaking();
    aiVoice.stopListening();
    aiVoice.playChime("deactivate");
    setHudOpen(false);
    setVoiceStatus("idle");
  };

  return (
    <>
      {/* ── DOCKED FLOATING ASSISTANT TRIGGER (BOTTOM RIGHT) ── */}
      <div className="va-dock-container" id="ai-voice-assistant-dock">
        {/* Main Voice Assistant Trigger Button */}
        <button
          type="button"
          className={`va-dock-btn va-dock-voice${hudOpen ? " active" : ""}${voiceStatus === "speaking" ? " speaking" : ""}${voiceStatus === "listening" ? " listening" : ""}`}
          onClick={hudOpen ? closeAssistant : openAssistant}
          title="Talk with Jerry AI Voice Assistant"
          aria-label="Open AI Voice Assistant"
        >
          <div className="va-dock-icon-wrap">
            {voiceStatus === "listening" ? (
              <span className="va-dock-pulse-circle" />
            ) : (
              <div className="va-dock-eq">
                <span className={`va-dock-bar b1${voiceStatus === "speaking" ? " play" : ""}`} />
                <span className={`va-dock-bar b2${voiceStatus === "speaking" ? " play" : ""}`} />
                <span className={`va-dock-bar b3${voiceStatus === "speaking" ? " play" : ""}`} />
                <span className={`va-dock-bar b4${voiceStatus === "speaking" ? " play" : ""}`} />
              </div>
            )}
            <svg className="va-dock-mic-svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </div>
          <div className="va-dock-label-group">
            <span className="va-dock-tag">JERRY AI</span>
            <span className="va-dock-status">
              {voiceStatus === "listening" ? "LISTENING..." : voiceStatus === "speaking" ? "SPEAKING..." : "VOICE ASSISTANT"}
            </span>
          </div>
        </button>

        {/* Text Chat Toggle Shortcut */}
        {onOpenTextChat && (
          <button
            type="button"
            className="va-dock-chat-shortcut"
            onClick={onOpenTextChat}
            title="Open Text Chat Mode"
            aria-label="Open Text Chat Mode"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        )}
      </div>

      {/* ── FULLSCREEN / FLOATING HOLOGRAPHIC VOICE HUD MODAL ── */}
      <div className={`va-hud-backdrop${hudOpen ? " open" : ""}`} onClick={closeAssistant}>
        <div
          className={`va-hud-panel${hudOpen ? " open" : ""}`}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Jerry AI Voice Assistant Interface"
        >
          {/* Cybernetic Spider Grid Background Pattern */}
          <div className="va-hud-grid-overlay" aria-hidden="true" />

          {/* HUD Header Bar */}
          <div className="va-hud-header">
            <div className="va-hud-brand">
              <div className="va-hud-brand-mark">
                <img src="/assets/logos/Jerrydotone.svg" alt="Jerry" />
              </div>
              <div className="va-hud-brand-meta">
                <div className="va-hud-title">
                  JERRY // VOICE INTELLIGENCE
                  <span className={`va-live-dot${voiceStatus !== "idle" ? " active" : ""}`} />
                </div>
                <div className="va-hud-sub">Stark-Spidey Neural Studio Assistant</div>
              </div>
            </div>

            <div className="va-hud-actions">
              {/* Hands-free toggle */}
              <button
                type="button"
                className={`va-hud-pill-btn${handsFree ? " active" : ""}`}
                onClick={toggleHandsFree}
                title="Continuous Hands-Free Conversation"
              >
                <span className="va-pill-indicator" />
                HANDS-FREE: {handsFree ? "ON" : "OFF"}
              </button>

              {/* Voice Mute Toggle */}
              <button
                type="button"
                className={`va-hud-pill-btn${!voiceMuted ? " active" : ""}`}
                onClick={toggleMute}
                title="Voice Synthesis Audio Output"
              >
                {voiceMuted ? "MUTED" : "VOICE ON"}
              </button>

              {/* Switch to Chat Modal */}
              {onOpenTextChat && (
                <button
                  type="button"
                  className="va-hud-pill-btn"
                  onClick={() => {
                    closeAssistant();
                    onOpenTextChat();
                  }}
                  title="Switch to Text Mode"
                >
                  TEXT CHAT ↗
                </button>
              )}

              {/* Close Button */}
              <button
                type="button"
                className="va-hud-close-btn"
                onClick={closeAssistant}
                aria-label="Close Assistant"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Navigation Action Directive Banner */}
          {navNotification && (
            <div className="va-directive-banner">
              <span className="va-directive-pulse" />
              <span>{navNotification}</span>
            </div>
          )}

          {/* Microphone Permission Alert Banner */}
          {micError && (
            <div className="va-mic-error-banner">
              ⚠️ {micError}
            </div>
          )}

          {/* Central Holographic Audio Reactive Sphere / Orb */}
          <div className="va-orb-section">
            <div className={`va-orb-container status-${voiceStatus}`}>
              {/* Concentric Energy Wave Rings */}
              <div className="va-orb-ring ring-1" />
              <div className="va-orb-ring ring-2" />
              <div className="va-orb-ring ring-3" />

              {/* Main Interactive Tactile Orb */}
              <button
                type="button"
                className="va-orb-core"
                onClick={handleOrbClick}
                aria-label={voiceStatus === "listening" ? "Stop listening" : "Tap to speak to Jerry"}
              >
                {/* Real-time Equalizer Waveform in Core */}
                <div className="va-orb-inner-wave">
                  <span className="va-orb-wave-bar" />
                  <span className="va-orb-wave-bar" />
                  <span className="va-orb-wave-bar" />
                  <span className="va-orb-wave-bar" />
                  <span className="va-orb-wave-bar" />
                </div>

                <div className="va-orb-icon-overlay">
                  {voiceStatus === "listening" ? (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="6" y="6" width="12" height="12" rx="2" />
                    </svg>
                  ) : voiceStatus === "speaking" ? (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                  ) : (
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                      <line x1="12" y1="19" x2="12" y2="23" />
                      <line x1="8" y1="23" x2="16" y2="23" />
                    </svg>
                  )}
                </div>
              </button>
            </div>

            {/* Orb Status Readout */}
            <div className="va-orb-caption">
              {voiceStatus === "listening" && <span className="va-status-text glow-red">● LISTENING TO YOUR VOICE... (SPEAK FREELY)</span>}
              {voiceStatus === "thinking" && <span className="va-status-text glow-cyan">◌ NEURAL SYNTHESIS (GEMINI PRO)...</span>}
              {voiceStatus === "speaking" && <span className="va-status-text glow-orange">▶ JERRY SPEAKING (TAP ORB TO STOP)</span>}
              {voiceStatus === "idle" && <span className="va-status-text">TAP ORB TO SPEAK // OR ASK ANY QUESTION BELOW</span>}
            </div>
          </div>

          {/* Dialogue Transcript & Spoken Captions */}
          <div className="va-dialogue-box">
            {transcript && (
              <div className="va-transcript-user">
                <span className="va-label">YOU:</span>
                <span className="va-text">"{transcript}"</span>
              </div>
            )}
            {aiResponse ? (
              <div className="va-transcript-ai">
                <span className="va-label">JERRY:</span>
                <p className="va-text">{aiResponse}</p>
              </div>
            ) : (
              <div className="va-transcript-ai">
                <span className="va-label">JERRY:</span>
                <p className="va-text" style={{ opacity: 0.75 }}>
                  {voiceStatus === "listening"
                    ? "Listening closely... Go ahead and ask your question!"
                    : "Ask me any question aloud or type it below. I'm ready to answer anything about Jeeshan, design, or engineering."}
                </p>
              </div>
            )}
          </div>

          {/* Interactive Text Input Bar (Ask Any Question) */}
          <form onSubmit={handleTextSubmit} className="va-text-input-bar">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Jerry any question about Jeeshan's work, experience, or skills..."
              className="va-input-field"
              disabled={voiceStatus === "thinking"}
            />
            <button
              type="submit"
              className="va-send-btn"
              disabled={!inputText.trim() || voiceStatus === "thinking"}
            >
              ASK JERRY →
            </button>
          </form>

          {/* HUD Footer Status */}
          <div className="va-hud-footer">
            <span className="va-footer-tech">POWERED BY GEMINI PRO // NEURAL CONVERSATIONAL TTS</span>
            <span className="va-footer-hint">Continuous Voice &amp; Chat Enabled</span>
          </div>
        </div>
      </div>
    </>
  );
}
