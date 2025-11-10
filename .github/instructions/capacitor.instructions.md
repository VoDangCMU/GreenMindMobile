---
applyTo: '**'
---
Capacitor Runtime Summary

Capacitor is a cross-platform runtime that lets web apps access native device features through a JavaScript bridge.
It runs a React/Vue/Svelte app inside a native WebView and exposes plugins that interact with iOS and Android APIs.

Core concepts:

WebView hosts the app’s DOM.

Native plugins provide access to OS features.

Plugins can be official (@capacitor/...) or community (@capacitor-community/...).

You can generate your own plugin with npx @capacitor/cli plugin:generate.

Detect platform with Capacitor.isNativePlatform() or Capacitor.getPlatform().

Official Core Plugins
Category	Plugin	Purpose
App	@capacitor/app	App lifecycle, back button, deep links
Dialog	@capacitor/dialog	Alert, confirm, prompt
Action Sheet	@capacitor/action-sheet	Native selection menu
Toast	@capacitor/toast	Native toast message
Haptics	@capacitor/haptics	Vibration and tactile feedback
Status Bar	@capacitor/status-bar	Show or hide status bar
Splash Screen	@capacitor/splash-screen	App launch splash
Browser	@capacitor/browser	Open in-app browser
Clipboard	@capacitor/clipboard	Copy and paste text
Preferences	@capacitor/preferences	Key-value storage
Filesystem	@capacitor/filesystem	Read/write local files
Device	@capacitor/device	Device info (model, OS, UUID)
Network	@capacitor/network	Network state
Geolocation	@capacitor/geolocation	GPS location
Camera	@capacitor/camera	Take or pick photo/video
Motion	@capacitor/motion	Accelerometer, gyroscope
Screen Reader	@capacitor/screen-reader	Accessibility voice output
Community Plugins
Plugin	Purpose
@capacitor-community/sqlite	Native SQLite database
@capacitor-community/barcode-scanner	Scan QR/barcode
@capacitor-community/bluetooth-le	Bluetooth Low Energy
@capacitor-community/speech-recognition	Speech-to-text
@capacitor-community/native-audio	Low-latency audio
@capacitor-community/contacts	Access phone contacts
@capacitor-community/firebase-analytics	Firebase analytics
UI-Related Plugins
Plugin	Purpose
@capacitor/date-picker	Native date/time picker
@capacitor/modal	Native modal or bottom sheet
@capacitor/local-notifications	Local notifications
@capacitor/push-notifications	Push notifications (FCM/APNs)
@capacitor/navigation-bar	Control Android navigation bar
Example Usage
import { Dialog } from '@capacitor/dialog';
await Dialog.alert({ title: 'Hi', message: 'Capacitor works.' });

import { Camera } from '@capacitor/camera';
const photo = await Camera.getPhoto({ resultType: 'uri' });

import { Preferences } from '@capacitor/preferences';
await Preferences.set({ key: 'theme', value: 'dark' });

Developer Notes

Works only in WebView (not React Native).

Uses DOM + native bridge.

Compatible with React, Vue, Svelte, etc.

Hybrid UI approach: use web libraries (Tailwind, Shadcn, Vaul) and call native plugins for device features.

Combine native and web fallbacks depending on platform.

Suggested Stack for Mobile-First Capacitor Apps

UI: TailwindCSS or Ionic React
Bottom sheet: Vaul (web) + @capacitor/modal (native)
Picker: @capacitor/date-picker
Toast/Dialog: @capacitor/toast, @capacitor/dialog
Storage: @capacitor/preferences or SQLite