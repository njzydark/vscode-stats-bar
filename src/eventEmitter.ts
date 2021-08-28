import { EventEmitter } from 'events';
import { statsBar } from './statsBar';

class ExtensionEmitter extends EventEmitter {}

export const extensionEmitter = new ExtensionEmitter();

extensionEmitter.on('setting-update', () => {
  statsBar.onSettingUpdate();
});
