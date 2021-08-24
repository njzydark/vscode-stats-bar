import * as si from "systeminformation";
import * as os from "os";

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

export async function getNetwork() {
  try {
    const defaultInterface = await si.networkInterfaceDefault();
    const res = await si.networkStats(defaultInterface);
    const cur = res[0];
    return `${formatNetowk(cur.tx_sec)}-${formatNetowk(cur.rx_sec)}`;
  } catch (err) {}
}

function formatNetowk(data: number) {
  let res;
  if (data <= 1024) {
    res = 0 + "KB/s";
  } else if (data <= 1024 * 1024) {
    res = (data / 1024).toFixed(0) + "KB/s";
  } else if (data <= 1024 * 1024 * 1024) {
    res = (data / 1024 / 1024).toFixed(0) + "MB/s";
  } else {
    res = (data / 1024 / 1024 / 1024).toFixed(0) + "GB/s";
  }
  return res;
}
