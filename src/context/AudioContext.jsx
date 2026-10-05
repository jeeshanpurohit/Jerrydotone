import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

// Global audio state & context singleton
let _globalAudioCtx = null;
let _isAudioGloballyEnabled = false;

export function isAudioGloballyEnabled() {
  return _isAudioGloballyEnabled;
}

function getAudioContextInstance() {
  if (!_globalAudioCtx && typeof window !== "undefined") {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      _globalAudioCtx = new AudioContextClass();
    }
  }
  if (_globalAudioCtx && _globalAudioCtx.state === "suspended") {
    _globalAudioCtx.resume().catch(() => {});
  }
  return _globalAudioCtx;
}

const AudioCtx = createContext({
  audioEnabled: false,
  toggleAudio: () => {},
  setAudioEnabled: () => {},
  playHover: () => {},
  playClick: () => {},
  playNav: () => {},
  playToggleSound: () => {},
  playCardHover: () => {}
});

export function AudioProvider({ children }) {
  const [audioEnabled, setAudioEnabledState] = useState(() => {
    try {
      return localStorage.getItem("portfolio_audio_enabled") === "true";
    } catch {
      return false;
    }
  });

  const ambientNodesRef = useRef(null);

  // Synchronize global flag
  useEffect(() => {
    _isAudioGloballyEnabled = audioEnabled;
    try {
      localStorage.setItem("portfolio_audio_enabled", audioEnabled ? "true" : "false");
    } catch {}
  }, [audioEnabled]);

  // Master ambient soundscape controller
  useEffect(() => {
    if (!audioEnabled) {
      // Fade out and stop ambient nodes if running
      if (ambientNodesRef.current) {
        const { masterGain, stopAll } = ambientNodesRef.current;
        const ctx = getAudioContextInstance();
        if (ctx && masterGain) {
          const now = ctx.currentTime;
          masterGain.gain.cancelScheduledValues(now);
          masterGain.gain.setValueAtTime(masterGain.gain.value, now);
          masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
          setTimeout(() => {
            stopAll();
            ambientNodesRef.current = null;
          }, 450);
        } else {
          stopAll();
          ambientNodesRef.current = null;
        }
      }
      return;
    }

    // Start subtle ambient soundscape
    try {
      const ctx = getAudioContextInstance();
      if (!ctx) return;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.022, ctx.currentTime + 1.2);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(320, ctx.currentTime);
      filter.Q.setValueAtTime(2.0, ctx.currentTime);

      // Low harmonic drone (F2, C3, G3 - gentle cinematic ambient tone)
      const freqs = [87.31, 130.81, 196.00];
      const oscs = freqs.map((freq, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = idx === 0 ? "triangle" : "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        // Slight detune for warm chorusing
        osc.detune.setValueAtTime((idx - 1) * 4.5, ctx.currentTime);
        oscGain.gain.setValueAtTime(0.35 / (idx + 1), ctx.currentTime);

        osc.connect(oscGain);
        oscGain.connect(filter);
        osc.start();
        return osc;
      });

      filter.connect(masterGain);
      masterGain.connect(ctx.destination);

      const stopAll = () => {
        oscs.forEach(osc => {
          try { osc.stop(); osc.disconnect(); } catch {}
        });
        try { filter.disconnect(); } catch {}
        try { masterGain.disconnect(); } catch {}
      };

      ambientNodesRef.current = { masterGain, stopAll };
    } catch (e) {
      console.warn("Ambient audio initialization note:", e);
    }

    return () => {
      if (ambientNodesRef.current) {
        ambientNodesRef.current.stopAll();
        ambientNodesRef.current = null;
      }
    };
  }, [audioEnabled]);

  // Tone generator utility
  const playTone = useCallback(({ freq = 880, type = "sine", duration = 0.06, gain = 0.08, detune = 0 } = {}) => {
    if (!_isAudioGloballyEnabled) return;
    try {
      const ctx = getAudioContextInstance();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      const now = ctx.currentTime;
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      if (detune) osc.detune.setValueAtTime(detune, now);

      gainNode.gain.setValueAtTime(gain, now);
      gainNode.gain.exponentialRampToValueAtTime(0.0008, now + duration);

      osc.start(now);
      osc.stop(now + duration);
    } catch {}
  }, []);

  const playHover = useCallback(() => {
    if (!audioEnabled) return;
    playTone({ freq: 1080, type: "sine", duration: 0.045, gain: 0.05 });
  }, [audioEnabled, playTone]);

  const playCardHover = useCallback(() => {
    if (!audioEnabled) return;
    playTone({ freq: 720, type: "sine", duration: 0.06, gain: 0.04, detune: 10 });
  }, [audioEnabled, playTone]);

  const playClick = useCallback(() => {
    if (!audioEnabled) return;
    playTone({ freq: 560, type: "sine", duration: 0.06, gain: 0.09 });
    setTimeout(() => {
      playTone({ freq: 880, type: "sine", duration: 0.04, gain: 0.05 });
    }, 35);
  }, [audioEnabled, playTone]);

  const playNav = useCallback(() => {
    if (!audioEnabled) return;
    playTone({ freq: 840, type: "triangle", duration: 0.065, gain: 0.06 });
  }, [audioEnabled, playTone]);

  const playToggleSound = useCallback((enabling) => {
    try {
      const ctx = getAudioContextInstance();
      if (!ctx) return;
      const now = ctx.currentTime;

      if (enabling) {
        // Ascending power-up chord
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.connect(g);
          g.connect(ctx.destination);
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + i * 0.05);
          g.gain.setValueAtTime(0.08, now + i * 0.05);
          g.gain.exponentialRampToValueAtTime(0.0008, now + i * 0.05 + 0.15);
          osc.start(now + i * 0.05);
          osc.stop(now + i * 0.05 + 0.15);
        });
      } else {
        // Descending power-down
        [659.25, 440.0, 329.63].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.connect(g);
          g.connect(ctx.destination);
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + i * 0.06);
          g.gain.setValueAtTime(0.07, now + i * 0.06);
          g.gain.exponentialRampToValueAtTime(0.0008, now + i * 0.06 + 0.14);
          osc.start(now + i * 0.06);
          osc.stop(now + i * 0.06 + 0.14);
        });
      }
    } catch {}
  }, []);

  const toggleAudio = useCallback(() => {
    setAudioEnabledState(prev => {
      const next = !prev;
      playToggleSound(next);
      return next;
    });
  }, [playToggleSound]);

  const setAudioEnabled = useCallback((val) => {
    setAudioEnabledState(prev => {
      if (prev !== val) {
        playToggleSound(val);
      }
      return val;
    });
  }, [playToggleSound]);

  return (
    <AudioCtx.Provider
      value={{
        audioEnabled,
        toggleAudio,
        setAudioEnabled,
        playHover,
        playClick,
        playNav,
        playCardHover,
        playToggleSound
      }}
    >
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudioContext() {
  return useContext(AudioCtx);
}

