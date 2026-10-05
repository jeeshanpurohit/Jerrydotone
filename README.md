# Jeeshan Purohit — Portfolio Website

> **Visual Designer & Creative Technologist**  
> Dynamic portfolio featuring custom 3D web experiences, interactive project showcases, Google Meet scheduling integration, and Jerry AI Voice Assistant powered by Google Gemini Pro.

---

## ✨ Features

- **Jerry AI Voice Assistant**: Real-time voice-enabled AI companion powered by Google Gemini Pro and browser SpeechSynthesis/SpeechRecognition.
- **3D Projects Wheel Carousel**: Interactive 3D carousel for browsing curated graphic design, photography, cinematography, and case study projects with independent scrolling.
- **Interactive Inquiry & Booking Panel**: Clean, streamlined consultation booking flow with custom interactive calendar popover, minimalist clock time selector, and automated Google Meet/Calendar/Sheets registration.
- **Dynamic Filtered Showcase**: Filterable gallery spanning Graphic Design, Branding, Photography, and Video productions.
- **Responsive & Modern Aesthetics**: High-end dark aesthetic with glassmorphism, micro-animations, and fluid responsive design.

---

## 🛠 Tech Stack

- **Core**: React 18, Vite
- **Styling**: Vanilla CSS, Modern Design System
- **Animation**: Framer Motion, CSS 3D Transforms
- **AI Integration**: Google Gemini API (`gemini-pro-latest`, `gemini-3.1-pro-preview`, `gemini-2.5-pro`)
- **Voice Engine**: Web Speech API (`webkitSpeechRecognition` & `speechSynthesis`)
- **Backend Integrations**: Google Workspace Apps Script (Calendar, Sheets, Meet, Gmail)

---

## 🚀 Getting Started

### 1. Clone Repository
```bash
git clone https://github.com/jeeshanpurohit/Jerrydotone.git
cd Jerrydotone
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` and insert your Google Gemini API Key:
```bash
cp .env.example .env
```
In `.env`:
```env
VITE_GEMINI_API_KEY=your_actual_gemini_api_key
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for Production
```bash
npm run build
```

---

## 📄 License
© 2026 Jeeshan Purohit. All rights reserved.
