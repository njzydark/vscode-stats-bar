import * as si from "systeminformation";
import * as os from "os";
import { StatsModules } from "./types";

export async function getCpuSpeed() {
  try {
    const res = await si.cpuCurrentSpeed();
    return `${res.avg}`;
  } catch (err) {}
}

export async function getCpuLoad() {
  try {
    const res = await si.currentLoad();
    return `${res.currentLoad.toFixed(0)}%`;
  } catch (err) {}
}

export async function getLoad() {
  try {
    const res = os.loadavg();
    return res.map((item) => item.toFixed(2)).join(", ");
  } catch (err) {}
}

export async function getIP() {
  const defaultInterface = await si.networkInterfaceDefault();
  const res = await si.networkInterfaces();
  const cur = res.find((item) => item.iface === defaultInterface);
  return cur?.ip4;
}

export async function getNetworkSpeed() {
  try {
    const defaultInterface = await si.networkInterfaceDefault();
    const res = await si.networkStats(defaultInterface);
    const cur = res[0];
    return `U: ${formatNetowk(cur.tx_sec)} - D: ${formatNetowk(cur.rx_sec)}`;
  } catch (err) {}
}

function formatNetowk(data: number) {
  const KB = 1024;
  const MB = 1024 * 1024;
  const GB = 1024 * 1024 * 1024;
  let res;
  if (data < KB) {
    res = 0 + "KB/s";
  } else if (data < MB) {
    res = (data / KB).toFixed(0) + "KB/s";
  } else if (data < GB) {
    res = (data / MB).toFixed(0) + "MB/s";
  } else {
    res = (data / GB).toFixed(0) + "GB/s";
  }
  return res;
}

export const sysinfoData: { [key in StatsModules]: () => Promise<string | undefined> } = {
  cpuLoad: getCpuLoad,
  loadavg: getLoad,
  networkSpeed: getNetworkSpeed,
};
