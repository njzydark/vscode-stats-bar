import { ExtensionContext, commands, window, env, ConfigurationTarget } from 'vscode';
import { Commands, ConfigurationKeys } from './types';
import { setting } from './setting';
import { getIP } from './sysinfo';

class Command {
  init(context: ExtensionContext) {
    this.registerCommand();
    this.changeContext();
  }

  changeContext() {
    const modules = setting.curModules;
    setting.allModules.forEach(moduleName => {
      commands.executeCommand('setContext', `statsBar.${moduleName}`, modules.includes(moduleName));
    });
  }

  registerCommand() {
    commands.registerCommand(
      Commands.CopyIp,
      async () => {
        try {
          const ip = await getIP();
          if (ip) {
            env.clipboard.writeText(ip);
            window.showInformationMessage(`The IP ${ip} was copied successfully`);
          } else {
            window.showInformationMessage(`Not found IP`);
          }
        } catch (err) {
          window.showErrorMessage(`IP get error: ${err.message}`);
        }
      },
      this
    );

    commands.registerCommand(
      Commands.EnableAll,
      () => {
        setting.cfg?.update(ConfigurationKeys.AllEnabled, true, ConfigurationTarget.Global);
      },
      this
    );

    commands.registerCommand(
      Commands.DisableAll,
      () => {
        setting.cfg?.update(ConfigurationKeys.AllEnabled, false, ConfigurationTarget.Global);
      },
      this
    );

    commands.registerCommand(
      Commands.EnableCpuLoad,
      () => {
        setting.enableModule('cpuLoad');
      },
      this
    );

    commands.registerCommand(
      Commands.DisableCpuLoad,
      () => {
        setting.disableModule('cpuLoad');
      },
      this
    );

    commands.registerCommand(
      Commands.EnableLoadavg,
      () => {
        setting.enableModule('loadavg');
      },
      this
    );

    commands.registerCommand(
      Commands.DisableLoadavg,
      () => {
        setting.disableModule('loadavg');
      },
      this
    );

    commands.registerCommand(
      Commands.EnableNetworkSpeed,
      () => {
        setting.enableModule('networkSpeed');
      },
      this
    );

    commands.registerCommand(
      Commands.DisableNetworkSpeed,
      () => {
        setting.disableModule('networkSpeed');
      },
      this
    );

    commands.registerCommand(
      Commands.EnableMemoUsage,
      () => {
        setting.enableModule('memoUsage');
      },
      this
    );

    commands.registerCommand(
      Commands.DisableMemoUsage,
      () => {
        setting.disableModule('memoUsage');
      },
      this
    );

    commands.registerCommand(
      Commands.EnableUptime,
      () => {
        setting.enableModule('uptime');
      },
      this
    );

    commands.registerCommand(
      Commands.DisableUptime,
      () => {
        setting.disableModule('uptime');
      },
      this
    );
  }
}

export const command = new Command();
