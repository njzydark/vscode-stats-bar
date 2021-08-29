import { EventEmitter } from 'events';
import { statsBar } from './statsBar';
import { command } from './command';

class ExtensionEmitter extends EventEmitter {}

export const extensionEmitter = new ExtensionEmitter();

extensionEmitter.on('setting-update', () => {
  statsBar.onSettingUpdate();
  command.changeContext();
});
