# Satori Mobile — System Design

> **Ground Truth Document.** Read this before writing any code.
> AI agents and new developers must follow the patterns described here. When in doubt, match existing code rather than inventing new patterns.

---

## Tech Stack

| Layer             | Library                              | Version  |
| ----------------- | ------------------------------------ | -------- |
| UI Framework      | React Native                         | 0.81.5   |
| App Platform      | Expo                                 | ~54.0.31 |
| UI Library        | React                                | 19.1.0   |
| Language          | TypeScript                           | ~5.9.2   |
| Routing           | Expo Router                          | ~6.0.21  |
| Client State      | Zustand                              | ^5.0.10  |
| Server State      | TanStack Query                       | ^5.90.18 |
| HTTP Client       | Axios                                | ^1.13.2  |
| Styling           | NativeWind                           | ^4.2.1   |
| Animations        | React Native Reanimated              | ~4.1.0   |
| Secure Storage    | expo-secure-store                    | ^15.0.8  |
| Image             | expo-image                           | ~3.0.11  |
| Icons             | lucide-react-native                  | ^0.562.0 |
| Fonts             | @expo-google-fonts/nunito, open-sans | ^0.4.2   |
| Gestures          | react-native-gesture-handler         | ~2.28.0  |
| Worklets          | react-native-worklets                | ^0.5.1   |
| Audio             | expo-audio                           | ~1.1.1   |
| Text-to-Speech    | expo-speech                          | ~14.0.8  |
| Speech-to-Text    | expo-speech-recognition              | ^3.1.1   |
| File System       | expo-file-system                     | ~19.0.21 |
| Image Picker      | expo-image-picker                    | ~17.0.10 |
| Gradient          | expo-linear-gradient                 | ^15.0.8  |
| Motion            | @legendapp/motion                    | ^2.5.3   |
| Markdown          | react-native-markdown-display        | ^7.0.2   |
| SVG               | react-native-svg                     | ^15.12.1 |
| Class Variants    | tailwind-variants                    | ^0.1.20  |

---

## Topic Files

| Topic                                                                   | File                                               |
| ----------------------------------------------------------------------- | -------------------------------------------------- |
| Architecture Pattern, Directory Structure, Feature Structure, Data Flow | [architecture-doc.md](architecture-doc.md)         |
| Routing and Navigation                                                  | [routing-doc.md](routing-doc.md)                   |
| State Management                                                        | [state-management-doc.md](state-management-doc.md) |
| API and Authentication Flow                                             | [api-doc.md](api-doc.md)                           |
| UI and Styling System                                                   | [ui-styling-doc.md](ui-styling-doc.md)             |
| Performance Strategy                                                    | [performance-doc.md](performance-doc.md)           |
| File Naming Conventions and Anti-Patterns                               | [conventions-doc.md](conventions-doc.md)           |
| Appendix: Code Patterns                                                 | [patterns-doc.md](patterns-doc.md)                 |
