import * as os from 'os';
import { execSync } from 'child_process';

type FormatedVmStat = {
  total: number;
  pageSize: number;
  pagesActive: number;
  pagesInactive: number;
  pagesWiredDown: number;
  pagesSpeculative: number;
  pagesOccupiedByCompressor: number;
  fileBackedPages: number;
  pagesPurgeable: number;
  [prop: string]: number;
};

/**
 * Get formated data from `vm_stat` command
 * @description man vm_stat
 */
function getFormatedVmStat(): FormatedVmStat {
  const rawVmStat = execSync('vm_stat').toString();

  const data: FormatedVmStat = {
    total: os.totalmem(),
    pageSize: 4096,
    pagesActive: 0,
    pagesInactive: 0,
    pagesWiredDown: 0,
    pagesSpeculative: 0,
    pagesOccupiedByCompressor: 0,
    fileBackedPages: 0,
    pagesPurgeable: 0
  };

  rawVmStat.split('\n').forEach((line, index) => {
    if (index === 0) {
      /**
       * Mach Virtual Memory Statistics: (page size of 16384 bytes)
       */

      const pageSize = /page\ssize\sof\s(\d*)\sbytes/i.exec(line)?.[1];
      if (pageSize) {
        data.pageSize = parseInt(pageSize);
      }
    } else {
      /**
       * Pages free:                               20567.
       * Pages active:                            353728.
       * Pages inactive:                          352540.
       * Pages speculative:                         1366.
       * Pages throttled:                              0.
       * Pages wired down:                        125484.
       * Pages purgeable:                          13220.
       */

      const [rawKey, rawValue] = line.split(':');
      if (rawKey && rawValue) {
        const key = rawKey
          .trim()
          .toLowerCase()
          .replace(/"/g, '')
          .replace(/(_|-)/g, ' ')
          .split(' ')
          .map((word, index) => `${index === 0 ? word[0] : word.charAt(0).toUpperCase()}${word.slice(1)}`)
          .join('');
        const value = rawValue.trim().replace(/\./g, '');
        data[key] = parseInt(value);
      }
    }
  });

  // const pagePageableInternalCountRaw = execSync('sysctl vm.page_pageable_internal_count').toString();
  // const pagePageableInternalCount = pagePageableInternalCountRaw.split(':')[1]?.trim();
  // if (pagePageableInternalCount) {
  //   data.pagePageableInternalCount = parseInt(pagePageableInternalCount);
  // }

  // const pagePpageableExternalCountRaw = execSync('sysctl vm.page_pageable_external_count').toString();
  // const pagePpageableExternalCount = pagePpageableExternalCountRaw.split(':')[1]?.trim();
  // if (pagePpageableExternalCount) {
  //   data.pagePpageableExternalCount = parseInt(pagePpageableExternalCount);
  // }

  return data;
}

type MacOsMemoryUsageInfo = {
  total: number;
  used: number;
  free: number;
  active: number;
  inactive: number;
  wired: number;
  compressed: number;
  app: number;
  cache: number;
  vmStat: FormatedVmStat;
  pressurePercent: number;
  usagePercent: number;
};

export function getMacOsMemoryUsageInfo() {
  return new Promise<MacOsMemoryUsageInfo>((resolve, reject) => {
    process.nextTick(() => {
      try {
        const vmStat = getFormatedVmStat();

        const active = vmStat.pagesActive * vmStat.pageSize;
        const inactive = vmStat.pagesInactive * vmStat.pageSize;
        const speculative = vmStat.pagesSpeculative * vmStat.pageSize;
        const wired = vmStat.pagesWiredDown * vmStat.pageSize;
        const compressed = vmStat.pagesOccupiedByCompressor * vmStat.pageSize;
        const fileBacked = vmStat.fileBackedPages * vmStat.pageSize;
        const purgeable = vmStat.pagesPurgeable * vmStat.pageSize;

        // https://github.com/exelban/stats/blob/master/Modules/RAM/readers.swift#L56 fileBacked=external
        const used = active + inactive + speculative + wired + compressed - purgeable - fileBacked;
        const free = vmStat.total - used;

        const app = used - wired - compressed;
        const cache = purgeable + fileBacked;

        const pressurePercent = (wired + compressed) / vmStat.total;
        const usagePercent = used / vmStat.total;

        resolve({
          total: vmStat.total,
          used,
          free,
          active,
          inactive,
          wired,
          compressed,
          app,
          cache,
          vmStat,
          pressurePercent,
          usagePercent
        });
      } catch (err) {
        reject(err);
      }
    });
  });
}
