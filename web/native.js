import { App } from '@capacitor/app';
import { registerPlugin } from '@capacitor/core';

const LocalData = registerPlugin('LocalData');
window.MiscareNative = {
  onBack: handler => App.addListener('backButton', handler),
  exit: () => App.exitApp(),
  keepAwake: enabled => LocalData.keepAwake({ enabled }),
  systemBars: (dark, color) => LocalData.systemBars({ dark, color }),
  exportData: text => LocalData.exportData({ text }),
  importData: async () => (await LocalData.importData()).text ?? null
};
