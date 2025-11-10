import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { App } from '@capacitor/app';
import { Network } from '@capacitor/network';
import { Geolocation } from '@capacitor/geolocation';
import { Clipboard } from '@capacitor/clipboard';
import { Haptics } from '@capacitor/haptics';
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';

const isNative = Capacitor.isNativePlatform();

/**
 * Cầu nối gom tất cả plugin native và tự mock nếu đang chạy web
 */
export const NativeBridge = {
  // 🧠 DEVICE
  async getDevice() {
    if (!isNative) {
      return {
        model: 'Browser Device',
        platform: 'web',
        operatingSystem: navigator.platform,
        osVersion: navigator.userAgent,
        language: navigator.language,
        battery: { batteryLevel: 1, isCharging: true },
        identifier: 'WEB-FAKE-ID',
      };
    }

    const info = await Device.getInfo();
    const { identifier } = await Device.getId();
    const { value: lang } = await Device.getLanguageCode();
    const battery = await Device.getBatteryInfo();
    return { ...info, identifier, language: lang, battery };
  },

  // 📱 APP
  async getAppInfo() {
    if (!isNative) {
      return {
        name: document.title || 'WebApp',
        version: '1.0.0-web',
        build: 0,
        id: window.location.hostname,
      };
    }
    return await App.getInfo();
  },

  // 🌐 NETWORK
  async getNetworkStatus() {
    if (!isNative) {
      return {
        connected: navigator.onLine,
        connectionType: navigator.onLine ? 'wifi' : 'none',
      };
    }
    return await Network.getStatus();
  },

  // 📍 LOCATION
  async getCurrentPosition() {
    if (!isNative) {
  return new Promise((resolve, _reject) => {
        if (!navigator.geolocation) {
          resolve({ coords: { latitude: 0, longitude: 0 }, mock: true });
        } else {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve(pos),
            () =>
              resolve({
                coords: { latitude: 0, longitude: 0 },
                mock: true,
              })
          );
        }
      });
    }
    return Geolocation.getCurrentPosition();
  },

  // 📋 CLIPBOARD
  async copy(text: string) {
    if (!isNative && navigator.clipboard) {
      return navigator.clipboard.writeText(text);
    }
    return Clipboard.write({ string: text });
  },
  async paste() {
    if (!isNative && navigator.clipboard) {
      return navigator.clipboard.readText();
    }
    const { value } = await Clipboard.read();
    return value;
  },

  // 💥 HAPTICS
  async vibrate(type: 'light' | 'medium' | 'heavy' = 'medium') {
    if (!isNative) {
      if (navigator.vibrate) navigator.vibrate(50);
      return;
    }
    return Haptics.impact({ style: type.toUpperCase() as any });
  },

  // 📤 SHARE
  async share(options: { title?: string; text?: string; url?: string }) {
    if (!isNative) {
      if (navigator.share) return navigator.share(options);
      console.log('Web mock share:', options);
      alert(`Share:\n${options.title ?? ''}\n${options.text ?? options.url ?? ''}`);
      return;
    }
    return Share.share(options);
  },

  // 📂 FILESYSTEM
  async saveTextFile(filename: string, content: string) {
    if (!isNative) {
      const blob = new Blob([content], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
      return;
    }
    return Filesystem.writeFile({
      path: filename,
      data: content,
      directory: Directory.Documents,
    });
  },

  async readTextFile(filename: string) {
    if (!isNative) return Promise.resolve('Mock web content');
    const res = await Filesystem.readFile({
      path: filename,
      directory: Directory.Documents,
    });
    return res.data;
  },
};
