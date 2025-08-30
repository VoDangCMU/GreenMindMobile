# Green Mind

> **Green Mind** is a modern, cross-platform app for sustainable living, personal growth, and eco-friendly behavior tracking. Built with React, Tailwind CSS, Bun, and Capacitor, it provides personalized recommendations, impact analytics, and a vibrant community experience.

---

## Features
- Personality quiz and insights
- Personalized sustainability advice
- Behavior tracking (eating, commuting, shopping)
- Goal setting and progress tracking
- Impact dashboard (environment, health, finance)
- Community feed and chat
- Android/iOS support via Capacitor
- Beautiful UI with Tailwind CSS

---

## Requirements
- [Node.js](https://nodejs.org/en)
- [Bun](https://bun.com/)
- [JDK 21 (required for Android)](https://www.oracle.com/java/technologies/javase/jdk21-archive-downloads.html)

**Android Development:**
- Set environment variables:
  - `JAVA_HOME`: Path to JDK directory (e.g. `/home/jdk/21`)
  - `ANDROID_HOME`: Path to Android SDK ([docs](https://developer.android.com/tools/variables))

---

## Getting Started

Install dependencies:
```bash
bun install
```

Start the web development server:
```bash
bun dev --host
```

Build and run the Android app (emulator or device):
```bash
bun cap run android
```

---

## Project Structure
```
src/           # React app source code
public/        # Static assets
android/       # Android project (Capacitor)
ios/           # iOS project (Capacitor)
export-design/ # Design assets and references
```

---

## Contributing
We welcome contributions! Please fork the repo, create a feature branch, and submit a pull request. For major changes, open an issue first to discuss your ideas.

---

## License
MIT
