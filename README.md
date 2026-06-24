# GramSeva Rajasthan

**Transparent Governance. Connected Villages. Empowered Citizens.**

A multi-lingual, voice-first digital governance platform for rural Gram Panchayats in Rajasthan, India. Built to bridge the digital divide for low-literacy citizens by making government services accessible in English, Hindi, and Marwari.

---

## Features

### For Citizens
- **Voice Assistant (Bhashini AI)** — Speak in Marwari, Hindi, or English to file complaints, apply for certificates, or check scheme eligibility without typing
- **Grievance Portal** — Lodge, track, and photo-document complaints (water, roads, electricity, sanitation)
- **Certificate Applications** — Apply for caste, income, and birth certificates with document upload
- **Scheme Eligibility Checker** — AI-powered matching against 10+ state welfare programs (PM Awas, Ujjwala, MNREGA, etc.)
- **Transparency Ledger** — View how Panchayat funds (15th Finance Commission) are allocated and spent
- **Read Aloud Mode** — Full page text-to-speech for low-literacy users

### For Officials (Gram Sachiv)
- **Grievance Desk** — Live incoming complaint feed with real-time NEW badge; approve or reject with notes
- **Certificate Approval Panel** — Review uploaded documents, approve/reject applications
- **MNREGA Attendance** — Geo-tagged selfie-based worker attendance to prevent fraud
- **GramSabha AI (SabhaSaar)** — Paste rough meeting notes; Gemini AI produces a formatted official resolution

### For Admins
- **Analytics Dashboard** — Village KPIs, grievance resolution rates, scheme coverage
- **Geo-Tag Asset Map** — Interactive map for pinning infrastructure (borewells, roads, solar pumps)
- **Sync Queue** — Offline-first submission queue that syncs when connectivity is restored

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Tailwind CSS v4 |
| Animations | Framer Motion (Motion) |
| Icons | Lucide React |
| Backend | Node.js, Express, TypeScript (`tsx`) |
| Dev Server | Vite 6 |
| AI | Google Gemini (`gemini-2.5-flash`) |
| Speech | Web Speech API (recognition + synthesis) |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites
- Node.js 18+
- A [Google Gemini API key](https://aistudio.google.com/)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

### Development

```bash
npm run dev
```

App runs on **http://localhost:5000**

### Production Build

```bash
npm run build
npm start
```

---

## Project Structure

```
├── server.ts                  # Express server + Vite middleware + AI API routes
├── src/
│   ├── App.tsx                # Root — global state, auth, routing
│   ├── types.ts               # Shared TypeScript interfaces
│   ├── translations.ts        # English / Hindi / Marwari strings
│   ├── data/
│   │   └── rajasthanData.ts   # Districts, schemes, village data
│   └── components/
│       ├── LandingPage.tsx    # Public home page
│       ├── Login.tsx          # 3-step registration + OTP wizard
│       ├── Header.tsx         # Nav, language switcher, theme toggle
│       ├── CitizenDashboard.tsx
│       ├── OfficialDashboard.tsx
│       ├── AdminDashboard.tsx
│       ├── AnalyticsDashboard.tsx
│       ├── Grievances.tsx
│       ├── Certificates.tsx
│       ├── Schemes.tsx
│       ├── Transparency.tsx
│       ├── GeoTagging.tsx
│       ├── GramSabha.tsx
│       ├── VoiceAssistant.tsx
│       ├── WhatsAppBot.tsx
│       ├── ReadAloud.tsx
│       └── SearchableCombobox.tsx
```

---

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| Citizen | `demo@gramseva.in` | `Demo@1234` |
| Official (Sachiv) | `sachiv@gramseva.in` | `Sachiv@1234` |
| Admin | `admin@gramseva.in` | `Admin@1234` |

Demo accounts skip OTP verification automatically.

---

## Languages

The platform supports three languages switchable at any time:

- **English** — default
- **हिन्दी** (Hindi)
- **मारवाड़ी** (Marwari) — regional Rajasthani dialect

---

## AI Features

All AI features have local fallbacks so the app remains functional in low-connectivity environments.

| Feature | Model | Endpoint |
|---|---|---|
| Dialect classification | Gemini | `POST /api/classify-dialect` |
| Meeting summarization (SabhaSaar) | Gemini | `POST /api/summarize-sabha` |
| Scheme eligibility matching | Gemini | `POST /api/match-schemes` |

---
