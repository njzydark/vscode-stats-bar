import { ExtensionContext, StatusBarAlignment, StatusBarItem, window } from "vscode";
import { ConfigurationKeys } from "./types";
import { sysinfoData, SysinfoData, StatsModules } from "./sysinfo";
import { setting } from "./setting";
import { formatBytes, formatTimes } from "./utils";

type Await<T extends () => unknown> = T extends () => PromiseLike<infer U> ? U : ReturnType<T>;

class StatsBar {
  defaultModules: StatsModules[] = ["cpuLoad", "loadavg", "networkSpeed", "memoUsage", "uptime"];
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
      } else if (module === "memoUsage" && setting.cfg.get(ConfigurationKeys.MemoUsageEnabled)) {
        return true;
      } else if (module === "uptime" && setting.cfg.get(ConfigurationKeys.UptimeEnabled)) {
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
    const promises = this.modules.map(async (module) => {
      const res = await sysinfoData[module]();
      return this.formatRes(module, res);
    });
    const res = await Promise.all(promises);
    res.forEach((data, index) => {
      const curStatusItem = this.statusItems[index];
      curStatusItem.text = data || "-";
      curStatusItem.show();
    });
  }

  private formatRes(module: StatsModules, rawRes: unknown) {
    if (module === "cpuLoad") {
      let res = rawRes as Await<SysinfoData["cpuLoad"]>;
      return res ? `${res.toFixed(0)}%` : "-";
    } else if (module === "loadavg") {
      let res = rawRes as Await<SysinfoData["loadavg"]>;
      return res ? `${res.map((item) => item.toFixed(2)).join(", ")}` : "-";
    } else if (module === "memoUsage") {
      let res = rawRes as Await<SysinfoData["memoUsage"]>;
      if (res) {
        const used = formatBytes(res.active, 2);
        const toal = formatBytes(res.total, 2);
        return `M: ${used.data}/${toal.data} ${toal.unit}`;
      } else {
        return "-";
      }
    } else if (module === "networkSpeed") {
      let res = rawRes as Await<SysinfoData["networkSpeed"]>;
      if (res) {
        const up = formatBytes(res.up);
        const down = formatBytes(res.down);
        return `U: ${up.data} ${up.unit}/s - D: ${down.data} ${down.unit}/s`;
      } else {
        return "-";
      }
    } else if (module === "uptime") {
      let res = rawRes as Await<SysinfoData["uptime"]>;
      if (res) {
        const data = formatTimes(res);
        return data.map((item) => `${item.data}${item.unit}`).join(", ");
      } else {
        return "-";
      }
    }
    return "-";
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
