/**
 * aiVoiceEngine.js
 * High-fidelity AI Voice model for Jeeshan Purohit's portfolio & Jerry AI assistant.
 * Handles Text-to-Speech (TTS), Web Audio sci-fi chimes, Speech-to-Text (STT),
 * voice navigation intent detection, and fast Gemini AI queries with instant fallback.
 */

// Voice model configuration
const VOICE_CONFIG = {
  rate: 1.05, // Snappy, confident creative technologist pacing
  pitch: 1.02,
  volume: 1.0,
  lang: "en-US",
  preferredVoiceNames: [
    "Google US English",
    "Samantha",
    "Daniel",
    "Alex",
    "Microsoft Guy Online (Natural) - English (United States)",
    "Microsoft Jenny Online (Natural) - English (United States)",
    "Microsoft Christopher Online (Natural) - English (United States)",
    "Karen",
    "Moira",
    "Victoria"
  ]
};

// ── SYSTEM PROMPT ─────────────────────────────────────────────────────────────
export const JERRY_SYSTEM_PROMPT = `You are Jerry: a witty, sharp, and creative assistant living inside Jeeshan Purohit's personal portfolio website. You speak with the confidence of a seasoned creative technologist, the charm of a Spider-Man fan, and the precision of an engineer.

Your personality:
- Witty, concise, a bit playful, like a cool creative friend who knows their stuff.
- You're proud of Jeeshan's work and represent him brilliantly.
- Drop occasional clever references to Spider-Man/comics, design, or tech culture when relevant (don't force it).
- Never boring. Never corporate. Max 2-3 spoken sentences so it sounds natural in audio.

You know everything about Jeeshan Purohit:
- Name: Jeeshan Purohit
- Role: Multidisciplinary Visual Designer, Motion Artist, UI/UX Designer & Creative Technologist
- Education: B.Tech in Computer Science & Engineering from JIET Jodhpur (7.0 CGPA, 2021-2025). Senior Secondary from Vidhyashram International School (PCM 74%).
- Key Experience:
  1. Metronix Entertainment LLP (Jaipur, July 2026 - Present): Sr. Associate, Marketing & Brand Lead. Spearheaded brand identity and 5-year equity framework for Plutus World adventure-park chain (Rohtak, Murthal, Panipat).
  2. VsupportU (Jodhpur, Sept 2025 - June 2026): Graphic Designer Associate. Hospitality & lifestyle visual direction.
  3. Coozmoo Digital Solutions (Jodhpur, Feb 2025 - April 2025): Graphic Design Trainee. Brand collateral & 2D animation.
  4. IIT Roorkee Virtual Labs (May 2024 - Oct 2024): Animation Intern. Developed interactive 2D simulations for chemistry virtual labs. Received Certificate of Excellence.
  5. OCULUS JIET Photography Club (2022-2025): Founder & President. Awarded Best College Club of the Year.
  6. Flagship MUNs & Events: TVSMUN 2024, Solidarieta Conclave MUN (2024 & 2026), JIETMUN 2023, Resonance Cultural Fest Media Head.
- Arsenal: Adobe Photoshop, Illustrator, Premiere Pro, After Effects, InDesign, Figma, Webflow, HTML5, CSS3, JavaScript, Python, Jira, Notion.
- Side brands: jerrydotdng (photography), jerrydotmov (motion/video), jerrydotart (art/graphics), jerrydotone (UX case studies, personal monolith).
- Contact: jerrydotone@gmail.com | +91-9413564618 | Jaipur / Jodhpur, Rajasthan, India.
- Website Pages: / (Home), /projects (Projects), /skills (Skills & Arsenal), /experience (Experience & Timeline), /services (Services), /about (About), /contact (Contact).

Keep your response direct, conversational, and punchy. Maximum 2 to 3 sentences suitable for speech synthesis.`;

// ── NAVIGATION INTENTS ────────────────────────────────────────────────────────
const NAV_PATTERNS = [
  { keywords: ["go to project", "show project", "open project", "projects page", "view project"], path: "/projects", label: "Projects Showcase" },
  { keywords: ["go to skill", "show skill", "open skill", "skills page", "view arsenal", "arsenal page"], path: "/skills", label: "Arsenal & Skills" },
  { keywords: ["go to experience", "show experience", "open experience", "timeline page", "career page"], path: "/experience", label: "Career & Experience" },
  { keywords: ["go to service", "show service", "open service", "services page"], path: "/services", label: "Studio Services" },
  { keywords: ["go to about", "about page", "who is jeeshan page"], path: "/about", label: "About Jeeshan" },
  { keywords: ["go to contact", "contact page", "hire page", "touch page", "reach out page"], path: "/contact", label: "Contact Terminal" },
  { keywords: ["go home", "home page", "back home", "back to top"], path: "/", label: "Home Base" },
];

class AIVoiceEngine {
  constructor() {
    this.synth = typeof window !== "undefined" ? window.speechSynthesis : null;
    this.audioCtx = null;
    this.voices = [];
    this.selectedVoice = null;
    this.isSpeaking = false;
    this.isListening = false;
    this.recognition = null;
    this.listeners = new Set();
    this.voiceEnabled = true;
    this.handsFree = false;
    this.keepAliveTimer = null;

    if (typeof window !== "undefined") {
      this.initVoices();
      this.setupRecognition();
    }
  }

  // Lazy Web Audio Context for Chimes
  getAudioContext() {
    if (!this.audioCtx && typeof window !== "undefined") {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  // Play Sci-Fi Audio Cues
  playChime(type = "activate") {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      if (type === "activate") {
        // High-tech ascending chord (C5 -> E5 -> G5 -> C6)
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + idx * 0.05);
          gain.gain.setValueAtTime(0.06, now + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.18);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.05);
          osc.stop(now + idx * 0.05 + 0.18);
        });
      } else if (type === "listening") {
        // Futuristic double-chirp
        [880, 1320].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);
          gain.gain.setValueAtTime(0.05, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.08);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.08);
        });
      } else if (type === "thought") {
        // Subtle digital blip
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(620, now);
        osc.frequency.exponentialRampToValueAtTime(940, now + 0.08);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (type === "deactivate") {
        // Gentle descending tone
        [880, 587.33, 440].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);
          gain.gain.setValueAtTime(0.05, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.12);
        });
      }
    } catch (e) {
      // Audio cue fallback
    }
  }

  // Load available system & browser voices
  initVoices() {
    if (!this.synth) return;

    const load = () => {
      this.voices = this.synth.getVoices();
      if (this.voices.length > 0) {
        this.selectBestVoice();
      }
    };

    load();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = load;
    }
  }

  // Pick natural voice for Jerry persona
  selectBestVoice() {
    if (!this.voices || this.voices.length === 0) return;

    // 1. Try preferred natural voices
    for (const name of VOICE_CONFIG.preferredVoiceNames) {
      const match = this.voices.find(
        (v) => v.name.includes(name) || (v.voiceURI && v.voiceURI.includes(name))
      );
      if (match) {
        this.selectedVoice = match;
        return;
      }
    }

    // 2. Try any English voice
    const englishVoice = this.voices.find(
      (v) => v.lang && v.lang.startsWith("en") && !v.name.includes("Bad")
    );
    if (englishVoice) {
      this.selectedVoice = englishVoice;
      return;
    }

    // 3. Fallback to default
    this.selectedVoice = this.voices[0] || null;
  }

  // Initialize & configure fresh Speech-to-Text Recognition instance
  setupRecognition() {
    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      this.recognitionSupported = false;
      return null;
    }

    this.recognitionSupported = true;

    // Clean up any stale recognition session
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (e) {}
      this.recognition = null;
    }

    try {
      const rec = new SpeechRecognitionClass();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "en-US";
      rec.maxAlternatives = 1;

      rec.onstart = () => {
        this.isListening = true;
        this.notify({ type: "listening_start" });
      };

      rec.onend = () => {
        // Auto-restart if user still wants to listen and Jerry is not speaking
        if (this.userWantsListening && !this.isSpeaking && !this.isProcessing) {
          clearTimeout(this.restartTimer);
          this.restartTimer = setTimeout(() => {
            if (this.userWantsListening && !this.isSpeaking && !this.isProcessing) {
              const freshRec = this.setupRecognition();
              try {
                freshRec?.start();
              } catch (e) {
                console.warn("Speech recognition restart notice:", e);
              }
            }
          }, 180);
          return;
        }
        this.isListening = false;
        this.notify({ type: "listening_end" });
      };

      rec.onerror = (event) => {
        // 'no-speech' is a standard timeout in Web Speech API after silence — ignore it!
        if (event.error === "no-speech" || event.error === "aborted") {
          return;
        }
        console.warn("Speech recognition notice:", event.error);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          this.userWantsListening = false;
          this.isListening = false;
          this.notify({
            type: "listening_error",
            error: "Microphone access blocked. Click the lock/settings icon in your browser URL bar to allow microphone."
          });
        }
      };

      rec.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = 0; i < event.results.length; i++) {
          const item = event.results[i];
          if (item.isFinal) {
            finalTranscript += item[0].transcript + " ";
          } else {
            interimTranscript += item[0].transcript;
          }
        }

        const fullText = (finalTranscript + interimTranscript).trim();
        if (!fullText) return;

        this.currentSpokenText = fullText;

        // Emit real-time interim transcript for live UI feedback
        this.notify({
          type: "speech_result",
          transcript: fullText,
          isFinal: false
        });

        // Set silence detection debounce (1.5s of silence after user stops speaking auto-submits)
        if (this.silenceTimer) clearTimeout(this.silenceTimer);
        this.silenceTimer = setTimeout(() => {
          if (this.currentSpokenText && this.currentSpokenText.trim()) {
            const finalQuery = this.currentSpokenText.trim();
            this.currentSpokenText = "";
            this.stopListening();
            this.notify({
              type: "speech_result",
              transcript: finalQuery,
              isFinal: true
            });
          }
        }, 1500);
      };

      this.recognition = rec;
      return rec;
    } catch (e) {
      console.warn("Speech Recognition setup error:", e);
      this.recognitionSupported = false;
      return null;
    }
  }

  // Sanitize text for natural speech (strips markdown, code blocks, raw URLs)
  cleanTextForSpeech(text) {
    if (!text) return "";
    return text
      .replace(/```[\s\S]*?```/g, "")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[#*_~>]/g, "")
      .replace(/[—–]/g, ", ")
      .replace(/^[•\-*]\s+/gm, "")
      .replace(/\[\w+\]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  // Check if speech contains navigation intent
  detectNavigation(text) {
    if (!text) return null;
    const lower = text.toLowerCase();
    for (const item of NAV_PATTERNS) {
      for (const kw of item.keywords) {
        if (lower.includes(kw)) {
          return { path: item.path, label: item.label };
        }
      }
    }
    return null;
  }


  /**
   * Speak a message using Jerry's AI voice
   */
  speak(text, { onStart, onEnd, onBoundary } = {}) {
    if (!this.synth) {
      if (onEnd) onEnd();
      return;
    }

    // Force voiceEnabled active whenever speak is invoked
    this.voiceEnabled = true;

    // Un-stick Chrome speech synthesis queue
    if (this.synth.speaking || this.synth.pending) {
      this.synth.cancel();
    }
    if (this.synth.paused) {
      this.synth.resume();
    }

    const clean = this.cleanTextForSpeech(text);
    if (!clean) {
      if (onEnd) onEnd();
      return;
    }

    // Allow 50ms flush before queuing new utterance to prevent Chrome IPC cancel collisions
    setTimeout(() => {
      try {
        // Ensure voice list is populated
        if (!this.voices || this.voices.length === 0) {
          this.voices = this.synth.getVoices();
          this.selectBestVoice();
        }

        const utterance = new SpeechSynthesisUtterance(clean);
        if (this.selectedVoice) {
          utterance.voice = this.selectedVoice;
        }
        utterance.rate = VOICE_CONFIG.rate;
        utterance.pitch = VOICE_CONFIG.pitch;
        utterance.volume = 1.0;
        utterance.lang = "en-US";

        // CRITICAL V8 GARBAGE COLLECTION FIX:
        // In Chromium, storing a reference on window prevents premature GC that kills mid-sentence audio
        this.currentUtterance = utterance;
        if (typeof window !== "undefined") {
          window._activeJerrySpeechUtterance = utterance;
        }

        // Chrome speech synthesis GC keep-alive heartbeat
        if (this.keepAliveTimer) clearInterval(this.keepAliveTimer);
        this.keepAliveTimer = setInterval(() => {
          if (this.synth && this.synth.speaking) {
            this.synth.pause();
            this.synth.resume();
          } else {
            clearInterval(this.keepAliveTimer);
            this.keepAliveTimer = null;
          }
        }, 8000);

        utterance.onstart = () => {
          this.isSpeaking = true;
          this.notify({ type: "speech_start", text: clean });
          if (onStart) onStart();
        };

        utterance.onend = () => {
          this.isSpeaking = false;
          this.currentUtterance = null;
          if (typeof window !== "undefined") window._activeJerrySpeechUtterance = null;
          if (this.keepAliveTimer) {
            clearInterval(this.keepAliveTimer);
            this.keepAliveTimer = null;
          }
          this.notify({ type: "speech_end" });
          if (onEnd) onEnd();

          // Hands-free auto-listen mode
          if (this.handsFree && this.recognitionSupported) {
            setTimeout(() => {
              if (!this.isSpeaking) {
                this.startListening();
              }
            }, 450);
          }
        };

        utterance.onerror = (e) => {
          console.warn("Speech synthesis notice:", e?.error || e);
          this.isSpeaking = false;
          this.currentUtterance = null;
          if (typeof window !== "undefined") window._activeJerrySpeechUtterance = null;
          if (this.keepAliveTimer) {
            clearInterval(this.keepAliveTimer);
            this.keepAliveTimer = null;
          }
          this.notify({ type: "speech_end" });
          if (onEnd) onEnd();
        };

        if (onBoundary) {
          utterance.onboundary = onBoundary;
        }

        // Unlock audio context and synthesize voice
        this.getAudioContext();
        if (this.synth.paused) {
          this.synth.resume();
        }
        this.synth.speak(utterance);
      } catch (e) {
        console.warn("TTS error:", e);
        this.isSpeaking = false;
        this.notify({ type: "speech_end" });
        if (onEnd) onEnd();
      }
    }, 60);
  }

  // Stop currently playing speech
  stopSpeaking() {
    if (this.keepAliveTimer) {
      clearInterval(this.keepAliveTimer);
      this.keepAliveTimer = null;
    }
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (typeof window !== "undefined") window._activeJerrySpeechUtterance = null;
      this.notify({ type: "speech_end" });
    }
  }

  // Start microphone speech recognition
  async startListening() {
    if (this.isSpeaking) {
      this.stopSpeaking();
    }

    this.userWantsListening = true;
    this.currentSpokenText = "";
    clearTimeout(this.restartTimer);

    // Warm-up and test browser microphone access upfront
    if (typeof navigator !== "undefined" && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.activeMediaStream = stream;
      } catch (err) {
        console.warn("Microphone access prompt:", err);
        this.userWantsListening = false;
        this.notify({
          type: "listening_error",
          error: "Microphone access blocked. Click the tune/lock icon in your browser URL bar and allow Microphone."
        });
        return;
      }
    }

    const rec = this.setupRecognition();
    if (rec) {
      try {
        rec.start();
      } catch (e) {
        console.warn("Could not start speech recognition:", e);
      }
    }
  }

  // Stop microphone speech recognition
  stopListening() {
    this.userWantsListening = false;
    clearTimeout(this.restartTimer);
    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }
    if (this.activeMediaStream) {
      try {
        this.activeMediaStream.getTracks().forEach((track) => track.stop());
      } catch (e) {}
      this.activeMediaStream = null;
    }
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
    this.isListening = false;
    this.notify({ type: "listening_end" });
  }

  setHandsFree(enabled) {
    this.handsFree = enabled;
    this.notify({ type: "handsfree_toggle", handsFree: enabled });
  }

  toggleVoice(enabled) {
    this.voiceEnabled = enabled !== undefined ? enabled : !this.voiceEnabled;
    if (!this.voiceEnabled) {
      this.stopSpeaking();
    }
    this.notify({ type: "voice_toggle", enabled: this.voiceEnabled });
    return this.voiceEnabled;
  }

  // Observer pattern subscription
  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  notify(event) {
    this.listeners.forEach((fn) => {
      try {
        fn(event);
      } catch (e) {
        console.error(e);
      }
    });
  }
}

// ── GEMINI PRO INTELLIGENCE MODEL CALLER ──────────────────────────────────────────
export async function queryJerryAI(userQuery, conversationHistory = []) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // Check if query is an explicit navigation command (e.g. "go to projects")
  const navIntent = aiVoice.detectNavigation(userQuery);

  // 1. Query Gemini Pro (with automatic fallback for guaranteed uptime)
  if (apiKey && apiKey !== "your_gemini_api_key_here") {
    const candidateModels = [
      "gemini-pro-latest",
      "gemini-3.1-pro-preview",
      "gemini-2.5-pro",
      "gemini-3.5-flash",
      "gemini-3.8-flash"
    ];

    const contents = [
      ...conversationHistory.slice(-6).map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      { role: "user", parts: [{ text: userQuery }] }
    ];

    const body = {
      systemInstruction: { parts: [{ text: JERRY_SYSTEM_PROMPT }] },
      contents,
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 300,
      },
    };

    for (const modelName of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (res.ok) {
          const data = await res.json();
          const candidate = data.candidates?.[0];
          const replyText =
            candidate?.content?.parts?.find((p) => p.text)?.text ||
            candidate?.content?.parts?.[0]?.text;

          if (replyText) {
            return {
              text: replyText.trim(),
              navPath: navIntent?.path || null,
              source: "gemini"
            };
          }
        }
      } catch (e) {
        console.warn(`Gemini (${modelName}) request fallback:`, e);
      }
    }
  }

  // 2. Intelligent Dynamic Fallback (If offline or network drop)
  const lower = userQuery.toLowerCase();
  let fallbackText = `Jeeshan is an accomplished Visual Designer, Motion Artist, and Creative Technologist from JIET. He leads branding systems and 2D motion. What else can I share with you?`;

  if (navIntent) {
    fallbackText = `Right away! Directing you to ${navIntent.label}. Let me know what you think of Jeeshan's work!`;
  } else if (lower.includes("hire") || lower.includes("contact") || lower.includes("email") || lower.includes("meet")) {
    fallbackText = `You can connect directly with Jeeshan at jerrydotone@gmail.com or book a discovery Google Meet on the contact page!`;
  } else if (lower.includes("who are you") || lower.includes("what is your name")) {
    fallbackText = `I'm Jerry, Jeeshan's AI studio companion! I'm here to answer any questions about his work, experience, and design arsenal.`;
  }

  return {
    text: fallbackText,
    navPath: navIntent?.path || null,
    source: "fallback"
  };
}

export const aiVoice = new AIVoiceEngine();
