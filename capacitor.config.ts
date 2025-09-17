import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vodang.greenmind',
  appName: 'GreenMind',
  webDir: 'dist',
  server: {
    url: 'https://mobile-devurl-greenmind.khoav4.com/', 
    // url: 'http://10.0.2.2:5173', // ONLY FOR ANDROID EMULATOR TESTING
    cleartext: true
  }
};

export default config;
