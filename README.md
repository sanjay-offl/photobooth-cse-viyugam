# VIBESNAP — VIYUGAM 2K26 Multi-Event Photo Booth

> **CSE Department · PPG Institute of Technology**

A complete, production-ready retro digital selfie booth supporting **5 events**, a **playable chess arena**, **QR code downloads**, and **Firebase cloud storage**.

---

## 🎪 Events Supported

| Event | Route | Theme |
|-------|-------|-------|
| 💻 **VIBE CODING** | `/booth?event=vibe-coding` | Black & retro yellow, starbursts, cameras |
| ⚡ **PROMPT WAR** | `/booth?event=prompt-war` | Comic book, lightning bolts, speech bubbles |
| 🔍 **OUTPUT HUNT** | `/booth?event=output-hunt` | Terminal green, pixel art, binary code |
| 🎬 **MOVIE MANIA** | `/booth?event=movie-mania` | Cinema gold, film strips, clapperboard |
| ♟️ **CHESS ARENA** | `/chess` | Dark/light gold theme + playable chess |

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy env template (already created)
# Fill in Firebase credentials to enable QR sharing
# .env.local is ready — just add your Firebase values

# Start development server
npm run dev
# → http://localhost:3000

# Production build
npm run build && npm start
```

---

## ⚙️ Environment Setup (`.env.local`)

| Variable | Purpose | Required for QR |
|----------|---------|----------------|
| `NEXT_PUBLIC_BASE_URL` | Your public domain | ✅ |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase project | For QR cloud sharing |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth | For QR cloud sharing |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project | For QR cloud sharing |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Image storage | For QR cloud sharing |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase | For QR cloud sharing |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase | For QR cloud sharing |
| `ADMIN_SECRET` | Admin panel password | ✅ Change before deploy |
| `RETENTION_HOURS` | Photo expiry (default 24h) | Optional |

> **Without Firebase:** The app fully works for camera + capture + frame + local download. Only cross-device QR sharing requires Firebase.

---

## 📱 User Journey (All 5 Events)

```
Home → Select Event → Camera → Countdown → Capture
     → Frame Applied (Canvas) → Preview → Consent
     → Save to Firebase → QR Code Generated
     → Scan QR on phone → Download Framed Photo
```

---

## 🏗️ Architecture

```
app/
├── page.tsx                 ← Event selection screen
├── booth/page.tsx           ← Shared camera + review (event-aware)
├── chess/page.tsx           ← Chess Arena with dark/light themes
├── photo/[id]/page.tsx      ← QR scan → download page
├── admin/page.tsx           ← Protected event config
└── api/
    ├── photos/route.ts      ← Upload + save (with rate limiting)
    ├── photos/[id]/route.ts ← Retrieve + delete
    └── settings/route.ts    ← Event config API

components/
├── CameraView.tsx           ← Camera with countdown, switching, fallback
├── CaptureButton.tsx        ← Animated pulsing capture button
├── CountdownOverlay.tsx     ← 3-2-1 countdown animation
├── PhotoReview.tsx          ← Frame preview + QR workflow
├── QRCodePanel.tsx          ← QR display + download actions
├── RetroDecorations.tsx     ← SVG starbursts, cameras, smileys
└── LoadingState.tsx         ← Animated loading indicator

lib/
├── events.ts                ← All 5 event configs (centralized)
├── canvas-frame.ts          ← 5 distinct frame renderers
├── camera.ts                ← MediaDevices API utilities
├── qr-code.ts               ← QR generation
├── storage.ts               ← Firebase Storage + Firestore
├── photo-service.ts         ← Save/get/delete abstraction
└── validation.ts            ← Zod schemas
```

---

## 🖼️ Frame Designs

Each frame is **1080 × 1350 px** (4:5 ratio, Instagram-ready):

| Frame | Unique Elements |
|-------|----------------|
| VIBE CODING | Starbursts, camera icons, film strips, smiley faces, pixel grids |
| PROMPT WAR | Comic burst, lightning bolts, speech bubbles, cursor icons |
| OUTPUT HUNT | Terminal grid, pixel stars, binary digits, magnifying glass |
| MOVIE MANIA | Marquee lights, film strips, clapperboard, popcorn |
| CHESS ARENA | Chess king illustrations, chessboard pattern, knight silhouettes |

---

## ♟️ Chess Arena Features

- **Playable chess** using `chess.js` (legal moves enforced)
- **Dark / Light theme** with gold accent (persisted to localStorage)
- Click a piece → see legal move dots → click destination
- **Pawn promotion** modal (Q/R/B/N selection)
- **Undo** last move
- **Move history** panel (SAN notation)
- Rules tab with VIYUGAM 2K26 regulations
- About tab with event info
- **Chess selfie frame** via `/booth?event=chess-arena`

---

## 🔒 Security

- Rate limiting: 20 uploads/IP/hour
- Max file size: 10 MB enforced server-side
- Zod validation on all API inputs
- Admin routes protected by `ADMIN_SECRET` bearer token
- Unguessable UUID photo IDs
- 24-hour auto-expiry with Firestore TTL
- Camera only activates after browser permission

---

## 🔥 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a project → Enable **Firestore** and **Storage**
3. Set Storage rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /photos/{photoId} {
      allow read: if true;
      allow write: if false; // Only server-side writes
    }
  }
}
```
4. Copy config values into `.env.local`
5. Deploy Cloud Functions for scheduled cleanup (optional)

---

## 📱 Admin Panel

Navigate to `/admin` → Enter your `ADMIN_SECRET` password to:
- Change event title, institution name, dates
- Update primary/secondary colors
- Adjust retention hours and max photo size
- View Firebase connection status

---

## 🎨 Branding

All frames include:
- **VIYUGAM 2K26** — event name
- **CSE Department · PPG Institute of Technology** — institution

Configurable via `lib/events.ts` → `INSTITUTION` and `EVENT_YEAR` constants.
