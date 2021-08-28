import { ExtensionContext, StatusBarAlignment, StatusBarItem, window } from 'vscode';
import { ConfigurationKeys } from './types';
import { sysinfoData, SysinfoData, StatsModules } from './sysinfo';
import { setting } from './setting';
import { formatBytes, formatTimes, formatByDict } from './utils';

type Await<T extends () => unknown> = T extends () => PromiseLike<infer U> ? U : ReturnType<T>;

class StatsBar {
  defaultModules: StatsModules[] = ['cpuLoad', 'loadavg', 'networkSpeed', 'memoUsage', 'uptime'];
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
      this.statusItems.forEach(statusItem => {
        statusItem.dispose();
      });
    }
    if (!setting?.cfg?.get(ConfigurationKeys.AllEnabled)) {
      return;
    }
    const location = (setting?.cfg?.get(ConfigurationKeys.Location) || 'Left') as StatusBarAlignment;
    this.modules = this.getModules();
    this.statusItems = this.modules.map(() => window.createStatusBarItem(StatusBarAlignment[location]));
    this._context.subscriptions.push(...this.statusItems);
    this.update();
  }

  private getModules() {
    return this.defaultModules.filter(module => {
      if (!setting.cfg) {
        return true;
      } else if (module === 'cpuLoad' && setting.cfg.get(ConfigurationKeys.CpuLoadEnabled)) {
        return true;
      } else if (module === 'loadavg' && setting.cfg.get(ConfigurationKeys.LoadavgEnabled)) {
        return true;
      } else if (module === 'networkSpeed' && setting.cfg.get(ConfigurationKeys.NetworkSpeedEnabled)) {
        return true;
      } else if (module === 'memoUsage' && setting.cfg.get(ConfigurationKeys.MemoUsageEnabled)) {
        return true;
      } else if (module === 'uptime' && setting.cfg.get(ConfigurationKeys.UptimeEnabled)) {
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
    const promises = this.modules.map(async module => {
      const res = await sysinfoData[module]();
      return this.formatRes(module, res) || '-';
    });
    const res = await Promise.all(promises);
    res.forEach((data, index) => {
      const curStatusItem = this.statusItems[index];
      curStatusItem.text = data || '-';
      curStatusItem.show();
    });
  }

  private formatRes(module: StatsModules, rawRes: unknown) {
    if (module === 'cpuLoad') {
      const res = rawRes as Await<SysinfoData['cpuLoad']>;
      if (res) {
        const dict = {
          percent: res.toFixed(0)
        };
        return formatByDict(setting.cfg?.get(ConfigurationKeys.CpuLoadFormat), dict);
      }
    } else if (module === 'loadavg') {
      const res = rawRes as Await<SysinfoData['loadavg']>;
      if (res) {
        const dict = {
          '1': res[0]?.toFixed(2) || 0,
          '5': res[1]?.toFixed(2) || 0,
          '15': res[2]?.toFixed(2) || 0
        };
        return formatByDict(setting.cfg?.get(ConfigurationKeys.LoadavgFormat), dict);
      }
    } else if (module === 'memoUsage') {
      const res = rawRes as Await<SysinfoData['memoUsage']>;
      if (res) {
        const customSize = 1024 * 1024 * 1024;
        const used = formatBytes(res.active, 2, customSize);
        const total = formatBytes(res.total, 2, customSize);
        const percent = ((Number(used.data) / Number(total.data)) * 100).toFixed(0);

        const dict = {
          used: used.data,
          total: total.data,
          unit: 'GB',
          percent
        };

        return formatByDict(setting.cfg?.get(ConfigurationKeys.MemoUsageFormat), dict);
      }
    } else if (module === 'networkSpeed') {
      const res = rawRes as Await<SysinfoData['networkSpeed']>;
      if (res) {
        const up = formatBytes(res.up);
        const down = formatBytes(res.down);

        const dict = {
          up: up.data,
          'up-unit': up.unit + '/s',
          down: down.data,
          'down-unit': down.unit + '/s'
        };

        return formatByDict(setting.cfg?.get(ConfigurationKeys.NetworkSpeedFormat), dict);
      }
    } else if (module === 'uptime') {
      const res = rawRes as Await<SysinfoData['uptime']>;
      if (res) {
        const data = formatTimes(res);

        const dict = {
          days: data[0],
          hours: data[1],
          minutes: data[2]
        };

        return formatByDict(setting.cfg?.get(ConfigurationKeys.UptimeFormat), dict);
      }
    } else {
      return '';
    }
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
