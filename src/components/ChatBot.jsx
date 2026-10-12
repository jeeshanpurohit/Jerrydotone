import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { aiVoice, queryJerryAI } from "../utils/aiVoiceEngine";

// ── CHATBOT COMPONENT ─────────────────────────────────────────────────────────
export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hey! I'm Jerry, Jeeshan's studio assistant. Ask me anything about his projects, arsenal, or how to get in touch.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [pulsing, setPulsing] = useState(true);

  // Voice Model State
  const [voiceEnabled, setVoiceEnabled] = useState(() => {
    try {
      return localStorage.getItem("jerry_voice_enabled") !== "false";
    } catch {
      return true;
    }
  });
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState(null);
  const [interimText, setInterimText] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const [micNotice, setMicNotice] = useState(null);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const messagesRef = useRef(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const voiceEnabledRef = useRef(voiceEnabled);
  useEffect(() => {
    voiceEnabledRef.current = voiceEnabled;
  }, [voiceEnabled]);

  const loadingRef = useRef(loading);
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  const inputRefVal = useRef(input);
  useEffect(() => {
    inputRefVal.current = input;
  }, [input]);

  // Synchronize aiVoice enabled state
  useEffect(() => {
    aiVoice.toggleVoice(voiceEnabled);
    try {
      localStorage.setItem("jerry_voice_enabled", voiceEnabled ? "true" : "false");
    } catch {}
  }, [voiceEnabled]);

  // Auto-scroll chat to latest message / typing indicator
  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading, open]);

  // Auto-focus input on opening
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Core sendMessage function using latest references
  const sendMessage = useCallback(async (overrideText) => {
    const text = (overrideText !== undefined ? overrideText : inputRefVal.current).trim();
    if (!text || loadingRef.current) return;

    // Immediately lock sending state
    loadingRef.current = true;
    setLoading(true);

    aiVoice.stopSpeaking();
    aiVoice.stopListening();
    setSpeakingMsgId(null);
    setMicNotice(null);

    const currentHistory = messagesRef.current;
    const userMsg = { role: "user", content: text };
    const updatedMessages = [...currentHistory, userMsg];
    setMessages(updatedMessages);
    setInput("");

    try {
      const response = await queryJerryAI(text, currentHistory);
      const reply = response?.text || "I'm Jerry, Jeeshan's creative assistant! What would you like to explore next?";
      const assistantMsg = { role: "assistant", content: reply };
      setMessages((prev) => [...prev, assistantMsg]);

      // Handle navigation intent if requested (e.g. "go to projects")
      if (response?.navPath && response.navPath !== location.pathname) {
        setTimeout(() => {
          navigate(response.navPath);
        }, 800);
      }

      // Speak reply if voice is enabled
      if (voiceEnabledRef.current) {
        aiVoice.speak(reply, {
          onStart: () => setSpeakingMsgId(updatedMessages.length),
          onEnd: () => setSpeakingMsgId(null)
        });
      }
    } catch (e) {
      const errMsg = `Oops! Something went wrong: ${e.message}`;
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: errMsg },
      ]);
      if (voiceEnabledRef.current) {
        aiVoice.speak(errMsg);
      }
    } finally {
      loadingRef.current = false;
      setLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [location.pathname, navigate]);

  // Subscribe to AI Voice engine events
  useEffect(() => {
    const unsubscribe = aiVoice.subscribe((event) => {
      if (event.type === "speech_start") {
        setIsSpeaking(true);
      } else if (event.type === "speech_end") {
        setIsSpeaking(false);
        setSpeakingMsgId(null);
      } else if (event.type === "listening_start") {
        setIsListening(true);
        setMicNotice(null);
      } else if (event.type === "listening_end") {
        setIsListening(false);
        setInterimText("");
      } else if (event.type === "speech_result") {
        setInterimText(event.transcript);
        setInput(event.transcript);
        if (event.isFinal && event.transcript.trim()) {
          sendMessage(event.transcript.trim());
        }
      } else if (event.type === "listening_error") {
        setIsListening(false);
        setInterimText("");
        if (event.error) {
          setMicNotice(event.error);
        }
      }
    });

    return () => {
      unsubscribe();
      aiVoice.stopSpeaking();
      aiVoice.stopListening();
    };
  }, [sendMessage]);

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent?.isComposing) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleVoice = () => {
    if (isSpeaking) {
      aiVoice.stopSpeaking();
    }
    setVoiceEnabled((prev) => !prev);
  };

  const toggleListening = () => {
    if (isListening) {
      aiVoice.stopListening();
    } else {
      aiVoice.startListening();
    }
  };

  const toggleSpeakMessage = (text, index) => {
    if (speakingMsgId === index && isSpeaking) {
      aiVoice.stopSpeaking();
      setSpeakingMsgId(null);
    } else {
      setSpeakingMsgId(index);
      aiVoice.speak(text, {
        onStart: () => setSpeakingMsgId(index),
        onEnd: () => setSpeakingMsgId(null)
      });
    }
  };

  const QUICK_PROMPTS = [
    "What does Jeeshan do?",
    "Show me his skills",
    "How can I hire him?",
  ];

  return (
    <>
      {/* FAB Button */}
      <button
        id="chatbot-fab"
        className={`cb-fab${pulsing ? " pulsing" : ""}${open ? " open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label="Open chat with Jerry AI"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="cb-fab-label">Ask Jerry</span>
          </>
        )}
      </button>

      {/* Chat Window */}
      <div className={`cb-window${open ? " visible" : ""}`} id="chatbot-window">
        {/* Header */}
        <div className="cb-header">
          <div className="cb-header-avatar">
            <img src="/assets/logos/Jerrydotone.svg" alt="Jerry" />
          </div>
          <div className="cb-header-info">
            <span className="cb-header-name">Jerry AI</span>
            <span className="cb-header-sub">
              <span className="cb-online-dot" />
              Jeeshan's assistant
            </span>
          </div>

          {/* AI Voice Toggle */}
          <button
            className={`cb-voice-toggle${voiceEnabled ? " active" : ""}${isSpeaking ? " is-speaking" : ""}`}
            onClick={toggleVoice}
            title={voiceEnabled ? "AI Voice Active (Click to Mute)" : "AI Voice Muted (Click to Enable)"}
            aria-label="Toggle AI Voice"
          >
            <div className="cb-voice-bars">
              <span className={`cb-voice-bar b1${isSpeaking ? " active" : ""}`} />
              <span className={`cb-voice-bar b2${isSpeaking ? " active" : ""}`} />
              <span className={`cb-voice-bar b3${isSpeaking ? " active" : ""}`} />
              <span className={`cb-voice-bar b4${isSpeaking ? " active" : ""}`} />
            </div>
            <span>{isSpeaking ? "VOICE" : voiceEnabled ? "ON" : "OFF"}</span>
          </button>

          {/* Switch to Holographic Voice Assistant HUD */}
          <button
            type="button"
            className="cb-voice-hud-trigger"
            onClick={() => {
              setOpen(false);
              window.dispatchEvent(new CustomEvent("open-voice-assistant", { detail: { autoListen: true } }));
            }}
            title="Switch to Holographic AI Voice Mode"
            aria-label="Open Voice HUD"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            </svg>
            <span>VOICE HUD</span>
          </button>

          <button className="cb-close" onClick={() => setOpen(false)} aria-label="Close chat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="cb-messages">
          {messages.map((m, i) => (
            <div key={i} className={`cb-msg cb-msg--${m.role}`}>
              {m.role === "assistant" && (
                <div className="cb-msg-avatar">
                  <img src="/assets/logos/Jerrydotone.svg" alt="" />
                </div>
              )}
              <div className="cb-msg-bubble-wrap">
                <div className="cb-msg-bubble">
                  {m.content.split("\n").map((line, j, arr) => (
                    <span key={j}>{line}{j < arr.length - 1 && <br />}</span>
                  ))}
                </div>
                {m.role === "assistant" && (
                  <button
                    className={`cb-msg-speak-btn${speakingMsgId === i && isSpeaking ? " speaking" : ""}`}
                    onClick={() => toggleSpeakMessage(m.content, i)}
                    title={speakingMsgId === i && isSpeaking ? "Stop voice" : "Listen to Jerry's voice"}
                  >
                    {speakingMsgId === i && isSpeaking ? "⏹ STOP" : "🔊 LISTEN"}
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="cb-msg cb-msg--assistant">
              <div className="cb-msg-avatar">
                <img src="/assets/logos/Jerrydotone.svg" alt="" />
              </div>
              <div className="cb-msg-bubble cb-typing">
                <span /><span /><span />
              </div>
            </div>
          )}

          {/* Quick prompts */}
          {messages.length === 1 && !loading && (
            <div className="cb-quick-prompts">
              {QUICK_PROMPTS.map((q) => (
                <button
                  key={q}
                  className="cb-quick-btn"
                  onClick={() => sendMessage(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Live speech transcription banner */}
        {isListening && (
          <div className="cb-transcribing-banner">
            <span className="cb-transcribing-dot" />
            <span>{interimText ? `"${interimText}"` : "Listening... Speak your query"}</span>
          </div>
        )}

        {/* Input */}
        <div className="cb-input-row">
          <textarea
            ref={inputRef}
            className="cb-input"
            placeholder={isListening ? "Listening to your voice..." : "Ask me anything..."}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
          />

          {/* Microphone Voice Input Button */}
          <button
            className={`cb-mic-btn${isListening ? " listening" : ""}`}
            onClick={toggleListening}
            title={isListening ? "Listening... Click to stop" : "Speak to Jerry (Microphone)"}
            type="button"
            aria-label="Microphone speech input"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </button>

          <button
            className={`cb-send${loading || !input.trim() ? " disabled" : ""}`}
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            aria-label="Send message"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
