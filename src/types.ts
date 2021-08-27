/* eslint-disable @typescript-eslint/naming-convention */
export type StatsModules = "cpuLoad" | "loadavg" | "networkSpeed";

export enum Commands {
  "CopyIp" = "StatsBar.CopyIp",
  "EnableAll" = "StatsBar.EnableAll",
  "DisableAll" = "StatsBar.DisableAll",
  "EnableCpuLoad" = "StatsBar.EnableCpuLoad",
  "EnableNetworkSpeed" = "StatsBar.EnableNetworkSpeed",
  "EnableLoadavg" = "StatsBar.EnableLoadavg",
  "DisableCpuLoad" = "StatsBar.DisableCpuLoad",
  "DisableNetworkSpeed" = "StatsBar.DisableNetworkSpeed",
  "DisableLoadavg" = "StatsBar.DisableLoadavg",
}

export enum ConfigurationKeys {
  AllEnabled = "enabled",
  CpuLoadEnabled = "cpuLoad.enabled",
  LoadavgEnabled = "loadavg.enabled",
  NetworkSpeedEnabled = "networkSpeed.enabled",
  RefreshInterval = "refreshInterval",
  Location = "location",
}
