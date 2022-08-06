import * as os from 'os';

export const platform = os.platform();
export const isWin32 = platform === 'win32';
export const isDarwin = platform === 'darwin';

export function formatBytes(data: number, fixedNumber = 0, customSize = 0) {
  const KB = 1024;
  const MB = 1024 * 1024;
  const GB = 1024 * 1024 * 1024;

  let formatRes: { data: number; unit: 'KB' | 'MB' | 'GB' | 'CUSTOM' };

  if (customSize > 0) {
    formatRes = formatRes = {
      data: data / customSize,
      unit: 'CUSTOM'
    };
  } else if (data < KB) {
    formatRes = {
      data: 0,
      unit: 'KB'
    };
  } else if (data < MB) {
    formatRes = {
      data: data / KB,
      unit: 'KB'
    };
  } else if (data < GB) {
    formatRes = {
      data: data / MB,
      unit: 'MB'
    };
  } else {
    formatRes = {
      data: data / GB,
      unit: 'GB'
    };
  }

  return { ...formatRes, data: formatRes.data.toFixed(fixedNumber) };
}

export function formatTimes(data: number) {
  const minute = 60;
  const hour = 60 * 60;
  const day = 24 * 60 * 60;

  const formatRes: [number, number, number] = [0, 0, 0];

  const curDays = Math.floor(data / day);
  const curHours = Math.floor((data - curDays * day) / hour);
  const curMinutes = Math.floor((data - curDays * day - curHours * hour) / minute);

  formatRes[0] = curDays;
  formatRes[1] = curHours;
  formatRes[2] = curMinutes;

  return formatRes;
}

export function formatByDict<T extends { [prop: string]: any }>(raw = '', dict: T): string {
  let res = raw;
  raw.match(/\$\{[^{}]*\}/g)?.forEach(item => {
    const key = item.replace(/(\$\{)|(\})/g, '');
    if (key in dict) {
      res = res.replace(item, dict[key]);
    }
  });

  return res.trim();
}
