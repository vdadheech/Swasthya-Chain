# Swasthya Chain

**Blockchain-anchored, portable health identity for India's migrant workers — privacy-first, offline-capable, and multilingual.**

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=000)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=fff)
![Status](https://img.shields.io/badge/status-prototype-orange)
![License](https://img.shields.io/badge/license-unspecified-lightgrey)

> Build for Good - National Student Hackathon for Social Impact.

---

## Table of Contents

- [The Problem](#the-problem)
- [What It Does](#what-it-does)
- [Walkthrough: Ramesh's Story](#walkthrough-rameshs-story)
- [Tech Stack](#tech-stack)
- [Routes](#routes)
- [Project Structure](#project-structure)
- [How the Prototype Works](#how-the-prototype-works)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## The Problem

India has tens of millions of internal migrant workers who move between states for construction, agriculture, and industrial work. Every time they relocate, their medical history doesn't move with them — paper records get lost, clinics in a new state have no prior context, language barriers slow down care, and informal worksites often have poor or no internet connectivity. Government insurance schemes like **Ayushman Bharat / PM-JAY** are hard to claim against when there's no continuous, verifiable record of treatment.

**Swasthya Chain** ("Health Chain") is a concept prototype for a portable, tamper-evident health ID that a worker can carry across states, clinics, and languages — without depending on a constant internet connection or a centralized cloud database.

## What It Does

| Module | What it shows |
|---|---|
|  **Worker Portal** | A personal health ID card with QR code, full visit history, and on-demand AI insights |
|  **Clinic Portal** | A doctor-facing view to scan a worker's ID, dictate a diagnosis by voice, and commit a new record to the chain |
|  **Emergency / ICE View** | A no-login screen for first responders showing blood group, allergies, chronic conditions, and emergency contact |
|  **Privacy Dashboard** | A privacy score, a full access log (who viewed what, when, and why), and consent controls |
|  **Insurance Claims** | Auto-drafted PM-JAY/Ayushman Bharat–style claims generated from a medical record, with an eligibility check |
|  **Blockchain Explorer** | An interactive, click-through view of the hash chain linking a patient's records together |
|  **SMS Simulator** | A simulated low-bandwidth health summary, deliverable by SMS in 4 languages for feature-phone users |
|  **Multilingual UI** | Full interface translation across English, Hindi, Tamil, and Bengali |
|  **Offline-first sync** | Records created while offline queue locally and sync automatically once connectivity returns |

## Tech Stack

| Layer | Choice |
|---|---|
| UI framework | [React 19](https://react.dev/) |
| Build tool | [Vite 8](https://vite.dev/) |
| Routing | [react-router-dom 7](https://reactrouter.com/) |
| Hashing / encryption | [crypto-js](https://github.com/brix/crypto-js) (AES for QR payloads, SHA-256 for record hashes) |
| QR codes | [qrcode.react](https://github.com/zpao/qrcode.react) |
| Icons | [lucide-react](https://lucide.dev/) |
| Linting | [oxlint](https://oxc.rs/) |
| Persistence | Browser `localStorage` (no backend in this prototype) |

## Routes

| Route | Component | Description |
|---|---|---|
| `/` | `WorkerPortal` | Patient/worker home: health ID, QR code, record history, AI insights |
| `/clinic` | `ClinicPortal` | Clinic/doctor view: scan a worker's ID, voice-dictate a visit, commit a record |
| `/emergency/:id?` | `EmergencyView` | No-login emergency screen for first responders |
| `/privacy` | `PrivacyDashboard` | Privacy score, access log, consent settings |
| `/insurance` | `InsuranceClaims` | Generate and track insurance claims |
| `/blockchain` | `BlockchainVisualizer` | Explore the hash chain for a patient's records |
| `/sms` | `SMSSimulator` | Simulated SMS health summary in 4 languages |

## Project Structure

```
Swasthya-Chain/
├── public/                  # Static assets (favicon, icon sprite)
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── AIInsights.jsx           # Renders AI-generated health insights
│   │   ├── BlockchainVisualizer.jsx # Interactive chain/block explorer
│   │   ├── ClinicPortal.jsx         # Doctor view: scan, dictate, commit record
│   │   ├── EmergencyView.jsx        # ICE / emergency-access screen
│   │   ├── Header.jsx               # Nav, language switcher, sync badge, ICE button
│   │   ├── InsuranceClaims.jsx      # Claim generation & tracking
│   │   ├── PrivacyDashboard.jsx     # Privacy score + access log
│   │   ├── SMSSimulator.jsx         # Simulated SMS summary delivery
│   │   ├── SyncStatus.jsx           # Online/offline + pending-sync indicator
│   │   └── WorkerPortal.jsx         # Patient home / health ID card
│   ├── context/
│   │   └── AppContext.jsx           # Global state, seed data, translations, hashing logic
│   ├── services/
│   │   └── AIService.js             # Rule-based health insight & claim-eligibility engine
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
└── package.json
```

## How the Prototype Works

This is a **frontend-only hackathon prototype** — it's designed to demonstrate the user experience, not to be production infrastructure. A few honest notes on what's simulated:

- **"Blockchain"** here means each medical record is hashed (SHA-256 via `crypto-js`) and references the previous record's hash, forming a verifiable chain — rendered in the Blockchain Explorer. There is no real distributed ledger, network of nodes, or consensus mechanism; it's a single-device hash chain.
- **"AI Insights"** are produced by a deterministic, rule-based engine in `AIService.js` (pattern matching on diagnosis/treatment text — e.g. allergy cross-checks, overdue follow-up detection, drug-interaction flags). The code is intentionally structured so it can be swapped for a real on-device model (e.g. WebLLM, Transformers.js, or Ollama) without changing the calling components.
- **Voice dictation** in the Clinic Portal uses the browser's Web Speech API, with the AI service extracting a diagnosis/treatment/cost from the transcript.
- **QR scanning** is simulated (no camera integration) — it encrypts/decrypts a mock payload to demonstrate the intended flow.
- **Persistence** is `localStorage` only — data lives in one browser and isn't actually synced across devices. The "offline queue → sync" flow is simulated based on `navigator.onLine`.
- The app comes pre-seeded with one demo patient (Ramesh Kumar), his records, an insurance claim, and an access log, so it's explorable immediately with no setup.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- npm (bundled with Node)

### Installation

```bash
git clone https://github.com/vdadheech/Swasthya-Chain.git
cd Swasthya-Chain
npm install
```

### Run in development

```bash
npm run dev
```

Then open the local URL Vite prints in your terminal (typically `http://localhost:5173`).
