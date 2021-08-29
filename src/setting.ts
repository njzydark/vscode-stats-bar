import {
  ConfigurationChangeEvent,
  ConfigurationTarget,
  ExtensionContext,
  workspace,
  WorkspaceConfiguration
} from 'vscode';
import { extensionEmitter } from './eventEmitter';
import { StatsModule, AllSysModules } from './sysinfo';
import { ConfigurationKeys } from './types';

const configPrefix = 'statsBar';

class Setting {
  cfg: WorkspaceConfiguration | null = null;
  allModules = AllSysModules;
  default = {
    modules: ['cpuLoad', 'networkSpeed', 'memoUsage'] as StatsModule[],
    refreshInterval: 1800
  };

  init(context: ExtensionContext) {
    this.cfg = workspace.getConfiguration(configPrefix);
    context.subscriptions.push(workspace.onDidChangeConfiguration(this.onChange, setting));
  }

  private onChange(e: ConfigurationChangeEvent) {
    if (!e.affectsConfiguration(configPrefix)) {
      return;
    }

    this.cfg = workspace.getConfiguration(configPrefix);

    extensionEmitter.emit('setting-update');
  }

  get curModules() {
    const modules = this.cfg?.get(ConfigurationKeys.Modules) || [];
    return [...new Set(modules as StatsModule[])];
  }

  enableModule(moduleName: StatsModule) {
    const curModules = this.curModules;
    curModules.push(moduleName);
    this.cfg?.update(ConfigurationKeys.Modules, [...curModules], ConfigurationTarget.Global);
  }

  disableModule(moduleName: StatsModule) {
    const curModules = this.curModules.filter(item => item !== moduleName);
    this.cfg?.update(ConfigurationKeys.Modules, [...curModules], ConfigurationTarget.Global);
  }
}

export const setting = new Setting();
