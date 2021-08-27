import { ExtensionContext, StatusBarAlignment, StatusBarItem, window } from "vscode";
import { StatsModules, ConfigurationKeys } from "./types";
import { sysinfoData } from "./sysinfo";
import { setting } from "./setting";

class StatsBar {
  defaultModules: StatsModules[] = ["cpuLoad", "loadavg", "networkSpeed"];
  modules: StatsModules[] = [];
  statusItems: StatusBarItem[] = [];
  timer: NodeJS.Timeout | null = null;
  _context: ExtensionContext | null = null;

  init(context: ExtensionContext) {
    this._context = context;
    this.start();
  }

  private start() {
    if (!this._context) {
      return;
    }
    if (this.statusItems.length > 0) {
      this.statusItems.forEach((statusItem) => {
        statusItem.dispose();
      });
    }
    if (!setting?.cfg?.get(ConfigurationKeys.AllEnabled)) {
      return;
    }
    const location = (setting?.cfg?.get(ConfigurationKeys.Location) || "Left") as StatusBarAlignment;
    this.modules = this.getModules();
    this.statusItems = this.modules.map(() => window.createStatusBarItem(StatusBarAlignment[location]));
    this._context.subscriptions.push(...this.statusItems);
    this.update();
  }

  private getModules() {
    return this.defaultModules.filter((module) => {
      if (!setting.cfg) {
        return true;
      } else if (module === "cpuLoad" && setting.cfg.get(ConfigurationKeys.CpuLoadEnabled)) {
        return true;
      } else if (module === "loadavg" && setting.cfg.get(ConfigurationKeys.LoadavgEnabled)) {
        return true;
      } else if (module === "networkSpeed" && setting.cfg.get(ConfigurationKeys.NetworkSpeedEnabled)) {
        return true;
      } else {
        return false;
      }
    });
  }

  private async update() {
    this.getSysInfo();
    this.timer = setInterval(() => {
      this.getSysInfo();
    }, setting?.cfg?.get(ConfigurationKeys.RefreshInterval) || setting.default.refreshInterval);
  }

  private async getSysInfo() {
    const promises = this.modules.map((module) => sysinfoData[module]?.());
    const res = await Promise.all(promises);
    res.forEach((data, index) => {
      const curStatusItem = this.statusItems[index];
      curStatusItem.text = data || "-";
      curStatusItem.show();
    });
  }

  onSettingUpdate() {
    this.cancelUpdate();
    this.start();
  }

  cancelUpdate() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}

export const statsBar = new StatsBar();
