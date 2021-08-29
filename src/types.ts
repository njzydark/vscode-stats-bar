/* eslint-disable @typescript-eslint/naming-convention */
export enum Commands {
  'CopyIp' = 'StatsBar.CopyIp',
  'EnableAll' = 'StatsBar.EnableAll',
  'DisableAll' = 'StatsBar.DisableAll',
  'EnableCpuLoad' = 'StatsBar.EnableCpuLoad',
  'DisableCpuLoad' = 'StatsBar.DisableCpuLoad',
  'EnableNetworkSpeed' = 'StatsBar.EnableNetworkSpeed',
  'DisableNetworkSpeed' = 'StatsBar.DisableNetworkSpeed',
  'EnableLoadavg' = 'StatsBar.EnableLoadavg',
  'DisableLoadavg' = 'StatsBar.DisableLoadavg',
  'EnableMemoUsage' = 'StatsBar.EnableMemoUsage',
  'DisableMemoUsage' = 'StatsBar.DisableMemoUsage',
  'EnableUptime' = 'StatsBar.EnableUptime',
  'DisableUptime' = 'StatsBar.DisableUptime'
}

export enum ConfigurationKeys {
  RefreshInterval = 'refreshInterval',
  Location = 'location',
  Priority = 'priority',
  Modules = 'modules',
  AllEnabled = 'enabled',
  CpuLoadFormat = 'cpuLoad.format',
  LoadavgFormat = 'loadavg.format',
  NetworkSpeedFormat = 'networkSpeed.format',
  MemoUsageFormat = 'memoUsage.format',
  UptimeFormat = 'uptime.format'
}
