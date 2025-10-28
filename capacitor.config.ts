import type { CapacitorConfig } from '@capacitor/cli';

const ENV = process.env.NODE_ENV;

const server = ENV == "production" ? undefined : {
  url: "http://acer.mobile-devurl-greenmind.khoav4.com/", 
  // url: "http://mobile-devurl-greenmind.khoav4.com/",  // PC URL 
  cleartext: true 
}

const config: CapacitorConfig = {
  appId: 'com.vodang.greenmind',
  appName: 'GreenMind',
  webDir: 'dist',
  server
};

console.log('Capacitor server config:', process.env);

export default config;
