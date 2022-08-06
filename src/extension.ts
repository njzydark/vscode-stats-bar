import { ExtensionContext } from 'vscode';
import { setting } from './setting';
import { statsBar } from './statsBar';
import { command } from './command';

export function activate(context: ExtensionContext) {
  setting.init(context);
  command.init(context);
  statsBar.init(context);
}

export function deactivate() {
  statsBar.cancelUpdate(true);
}
