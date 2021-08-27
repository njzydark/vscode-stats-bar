import { ExtensionContext, commands, window, env } from "vscode";
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
          }else{
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
        setting.cfg?.update(ConfigurationKeys.AllEnabled, true, true);
      },
      this
    );

    commands.registerCommand(
      Commands.DisableAll,
      () => {
        setting.cfg?.update(ConfigurationKeys.AllEnabled, false, true);
      },
      this
    );

    commands.registerCommand(
      Commands.EnableCpuLoad,
      () => {
        setting.cfg?.update(ConfigurationKeys.CpuLoadEnabled, true, true);
      },
      this
    );

    commands.registerCommand(
      Commands.DisableCpuLoad,
      () => {
        setting.cfg?.update(ConfigurationKeys.CpuLoadEnabled, false, true);
      },
      this
    );

    commands.registerCommand(
      Commands.EnableLoadavg,
      () => {
        setting.cfg?.update(ConfigurationKeys.LoadavgEnabled, true, true);
      },
      this
    );

    commands.registerCommand(
      Commands.DisableLoadavg,
      () => {
        setting.cfg?.update(ConfigurationKeys.LoadavgEnabled, false, true);
      },
      this
    );

    commands.registerCommand(
      Commands.EnableNetworkSpeed,
      () => {
        setting.cfg?.update(ConfigurationKeys.NetworkSpeedEnabled, true, true);
      },
      this
    );

    commands.registerCommand(
      Commands.DisableNetworkSpeed,
      () => {
        setting.cfg?.update(ConfigurationKeys.NetworkSpeedEnabled, false, true);
      },
      this
    );
  }
}

export const command = new Command();
