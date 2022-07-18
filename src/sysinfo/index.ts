import * as si from 'systeminformation';
import * as os from 'os';
import { getMacOsMemoryUsageInfo } from './memory';

export const isDarwin = os.platform() === 'darwin';

export async function getCpuSpeed() {
  try {
    const res = await si.cpuCurrentSpeed();
    return res.avg;
  } catch (err) {}
}

export async function getCpuLoad() {
  try {
    const res = await si.currentLoad();
    return res.currentLoad;
  } catch (err) {}
}

export async function getLoadavg() {
  try {
    const res = os.loadavg();
    return res;
  } catch (err) {}
}

export async function getIP() {
  const defaultInterface = await si.networkInterfaceDefault();
  const res = await si.networkInterfaces();
  const cur = res.find(item => item.iface === defaultInterface);
  return cur?.ip4;
}

export async function getNetworkSpeed() {
  try {
    const defaultInterface = await si.networkInterfaceDefault();
    const res = await si.networkStats(defaultInterface);
    const cur = res[0];
    return {
      up: cur.tx_sec,
      down: cur.rx_sec
    };
  } catch (err) {}
}

export async function getUpTime() {
  try {
    return os.uptime();
  } catch (err) {}
}

export async function getMemoryUsage() {
  try {
    if (isDarwin) {
      const res = await getMacOsMemoryUsageInfo();
      return {
        total: res.total,
        used: res.used,
        active: res.active,
        pressurePercent: res.pressurePercent,
        usagePercent: res.usagePercent
      };
    } else {
      const res = await si.mem();
      return {
        total: res.total,
        used: res.used,
        active: res.active
      };
    }
  } catch (err) {}
}

export const sysinfoData = {
  cpuLoad: getCpuLoad,
  loadavg: getLoadavg,
  networkSpeed: getNetworkSpeed,
  memoUsage: getMemoryUsage,
  uptime: getUpTime
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const AllSysModules = Object.keys(sysinfoData) as StatsModule[];

export type SysinfoData = typeof sysinfoData;

export type StatsModule = keyof typeof sysinfoData;

// eslint-disable-next-line @typescript-eslint/naming-convention
export const StatsModuleNameMap: { [key in StatsModule]: string } = {
  cpuLoad: 'CpuLoad',
  loadavg: 'Loadavg',
  networkSpeed: 'NetworkSpeed',
  memoUsage: 'MemoryUsage',
  uptime: 'Uptime'
};

export async function getSystemInfo() {
  try {
    const res = await si.osInfo();
    return {
      platform: res.platform,
      distro: res.distro,
      release: res.release,
      kernel: res.kernel,
      arch: res.arch,
      hostname: res.hostname
    };
  } catch (err) {}
}

export async function getMemoryInfo() {
  return getMemoryUsage();
}

export async function getNetworkInfo() {
  try {
    const [ip, speedInfo] = await Promise.all([getIP(), getNetworkSpeed()]);
    return {
      ip,
      up: speedInfo?.up,
      down: speedInfo?.down
    };
  } catch (err) {}
}

export async function getCpuInfo() {
  try {
    const [baseInfo, speedInfo, loadInfo] = await Promise.all([si.cpu(), si.cpuCurrentSpeed(), si.currentLoad()]);
    return {
      manufacturer: baseInfo.manufacturer,
      brand: baseInfo.brand,
      speed: baseInfo.speed,
      cores: baseInfo.cores,
      virtualization: baseInfo.virtualization,
      currentSpeed: speedInfo.avg,
      currentLoad: loadInfo.currentLoad,
      uptime: os.uptime()
    };
  } catch (err) {}
}

export async function getGpuInfo() {
  try {
    const res = await si.graphics();
    return res.controllers;
  } catch (err) {}
}

export const sideBarSysInfoData = {
  system: getSystemInfo,
  memory: getMemoryInfo,
  network: getNetworkInfo,
  cpu: getCpuInfo,
  gpu: getGpuInfo
};

export type SideBarStatsModuleData = typeof sideBarSysInfoData;

export type SideBarStatsModule = keyof typeof sideBarSysInfoData;

export const allSideBarStatsModules = Object.keys(sideBarSysInfoData) as SideBarStatsModule[];
