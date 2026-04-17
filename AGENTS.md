# AGENTS.md - cv-creator-app

## Commands
- `npm start` - Start Expo dev server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run as web app
- `npm run lint` - Run ESLint (expo lint)

## Architecture
- Framework: Expo SDK 54 with expo-router (file-based routing)
- Entry point: `expo-router/entry` - routes defined in `app/` directory
- TypeScript: strict mode enabled, path alias `@/*` maps to root
- New Architecture enabled (`newArchEnabled: true` in app.json)

## Key Files
- `app/_layout.tsx` - Root layout
- `app/(tabs)/` - Tab-based navigation routes
- `app/modal.tsx` - Modal route

## Testing
No test framework configured in package.json. Do not assume jest/vitest is available.