# Satori Nihongo (Satori Mobile)

Satori Mobile is the React Native (Expo) client for **Satori Nihongo**, a Japanese learning support application. It follows a client-server architecture with file-based routing via Expo Router.

## Key Features

- **AI Self-Study & Practice** — self-paced practice sessions and results (`src/features/practice-with-ai`, `src/features/assignment`)
- **AI Conversation Practice** — chatbot-driven conversation practice with feedback and rewards (`src/features/speaking`, `src/features/chatbot`)
- **AI Pronunciation Trainer** — speech recording and recognition for pronunciation feedback (`src/features/speaking` hooks, built on `expo-audio` / `expo-speech-recognition`)

## Tech Stack

- **Framework**: Expo `~54`, React Native `0.81`, React `19`, TypeScript
- **Routing**: Expo Router (file-based, typed routes) under `src/app`
- **Client state**: Zustand
- **Server state**: TanStack Query
- **HTTP**: Axios (single instance with auth-refresh interceptors)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Animation**: React Native Reanimated + `@legendapp/motion`
- **Voice/AI**: `expo-audio`, `expo-speech`, `expo-speech-recognition`

## Project Structure

```
src/
  app/            # Expo Router routes (file-based, thin route "shells")
    (auth)/        # Unauthenticated stack: welcome, login, password reset
    (tabs)/        # Main authenticated bottom-tab navigator
  features/       # Feature modules (api/components/hooks/screens/utils per feature)
  stores/         # Zustand stores (auth, app, conversation, assignment, error overlay)
  lib/            # Axios instance, TanStack Query client
  components/ui/  # Shared UI primitives
  hooks/          # Cross-cutting hooks
docs/guidelines/  # Engineering guidelines (architecture, routing, state, API, etc.)
```

## Getting Started

### Prerequisites

- Node.js and npm
- Expo CLI (invoked via `npx`, no global install required)
- For native builds: Xcode (iOS) and/or Android Studio (Android)

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and set your API URL:

```bash
cp .env.example .env
```

```
EXPO_PUBLIC_API_URL=https://api.example.vn
```

### Running the App

```bash
npm start        # Start the Expo dev server
npm run android  # Run on Android
npm run ios      # Run on iOS
npm run web      # Run in the browser
```

## Available Scripts

| Script | Description |
|---|---|
| `npm start` | Start the Expo dev server |
| `npm run android` | Build and run on an Android device/emulator |
| `npm run ios` | Build and run on an iOS device/simulator |
| `npm run web` | Run the app in a browser |
| `npm run lint` | Lint the project (`expo lint`) |

## Documentation

Detailed engineering guidelines live in [`docs/guidelines/`](docs/guidelines/) and are the source of truth for architecture and coding conventions:

- [`system_design-doc.md`](docs/guidelines/system_design-doc.md) — Tech stack overview and index of the topics below
- [`architecture-doc.md`](docs/guidelines/architecture-doc.md) — Architecture pattern, directory structure, and data flow
- [`routing-doc.md`](docs/guidelines/routing-doc.md) — Route tree, tab bar config, auth guard, route file conventions
- [`state-management-doc.md`](docs/guidelines/state-management-doc.md) — Zustand stores and TanStack Query setup
- [`api-doc.md`](docs/guidelines/api-doc.md) — Axios instance, interceptors, and authentication flow
- [`ui-styling-doc.md`](docs/guidelines/ui-styling-doc.md) — Styling system, color tokens, typography, dark mode
- [`performance-doc.md`](docs/guidelines/performance-doc.md) — React Compiler, New Architecture, Reanimated v4
- [`conventions-doc.md`](docs/guidelines/conventions-doc.md) — File naming conventions and anti-patterns
- [`patterns-doc.md`](docs/guidelines/patterns-doc.md) — Reusable code patterns (API functions, mutation hooks, etc.)

## Testing

No automated test suite is set up in this project yet.
