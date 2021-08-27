import { ExtensionContext, commands, window, env, ConfigurationTarget } from "vscode";
import { Commands, ConfigurationKeys } from "./types";
import { setting } from "./setting";
import { getIP } from "./sysinfo";

class Command {
  init(context: ExtensionContext) {
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
        setting.cfg?.update(ConfigurationKeys.AllEnabled, true, ConfigurationTarget.Workspace);
      },
      this
    );

    commands.registerCommand(
      Commands.DisableAll,
      () => {
        setting.cfg?.update(ConfigurationKeys.AllEnabled, false, ConfigurationTarget.Workspace);
      },
      this
    );

    commands.registerCommand(
      Commands.EnableCpuLoad,
      () => {
        setting.cfg?.update(ConfigurationKeys.CpuLoadEnabled, true, ConfigurationTarget.Workspace);
      },
      this
    );

    commands.registerCommand(
      Commands.DisableCpuLoad,
      () => {
        setting.cfg?.update(ConfigurationKeys.CpuLoadEnabled, false, ConfigurationTarget.Workspace);
      },
      this
    );

    commands.registerCommand(
      Commands.EnableLoadavg,
      () => {
        setting.cfg?.update(ConfigurationKeys.LoadavgEnabled, true, ConfigurationTarget.Workspace);
      },
      this
    );

    commands.registerCommand(
      Commands.DisableLoadavg,
      () => {
        setting.cfg?.update(ConfigurationKeys.LoadavgEnabled, false, ConfigurationTarget.Workspace);
      },
      this
    );

    commands.registerCommand(
      Commands.EnableNetworkSpeed,
      () => {
        setting.cfg?.update(ConfigurationKeys.NetworkSpeedEnabled, true, ConfigurationTarget.Workspace);
      },
      this
    );

    commands.registerCommand(
      Commands.DisableNetworkSpeed,
      () => {
        setting.cfg?.update(ConfigurationKeys.NetworkSpeedEnabled, false, ConfigurationTarget.Workspace);
      },
      this
    );

    commands.registerCommand(
      Commands.EnableMemoUsage,
      () => {
        setting.cfg?.update(ConfigurationKeys.MemoUsageEnabled, true, ConfigurationTarget.Workspace);
      },
      this
    );

    commands.registerCommand(
      Commands.DisableMemoUsage,
      () => {
        setting.cfg?.update(ConfigurationKeys.MemoUsageEnabled, false, ConfigurationTarget.Workspace);
      },
      this
    );

    commands.registerCommand(
      Commands.EnableUptime,
      () => {
        setting.cfg?.update(ConfigurationKeys.UptimeEnabled, true, ConfigurationTarget.Workspace);
      },
      this
    );

    commands.registerCommand(
      Commands.DisableUptime,
      () => {
        setting.cfg?.update(ConfigurationKeys.UptimeEnabled, false, ConfigurationTarget.Workspace);
      },
      this
    );
  }
}

export const command = new Command();
