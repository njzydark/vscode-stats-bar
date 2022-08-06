import * as si from 'systeminformation';
import * as os from 'os';
import { getMacOsMemoryUsageInfo } from './memory';
import { isDarwin, isWin32 } from '../utils';

export function siInit() {
  if (isWin32) {
    si.powerShellStart();
  }
}

export function siRelease() {
  if (isWin32) {
    si.powerShellRelease();
  }
}

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
