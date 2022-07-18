import { ExtensionContext, window } from 'vscode';
import { SideBarDataProvider } from './sideBarDataProvider';
import { allSideBarStatsModules, SideBarStatsModule, sideBarSysInfoData, SideBarStatsModuleData } from './sysinfo';

type Await<T extends () => unknown> = T extends () => PromiseLike<infer U> ? U : ReturnType<T>;

export class SideBar {
  _context: ExtensionContext | null = null;
  modules = allSideBarStatsModules;

  init(context: ExtensionContext) {
    this._context = context;
    this.modules.forEach(module => {
      window.registerTreeDataProvider(`statsBar_${module}`, new SideBarDataProvider(module, this));
    });
  }

  async getStatsModuleData(moduleName: SideBarStatsModule) {
    const res = await sideBarSysInfoData[moduleName]?.();
    // if (moduleName === 'memory') {
    //   const newRes = res as Await<SideBarStatsModuleData['memory']>;
    //   newRes?.active
    // }
    return res;
  }
}

export const sideBar = new SideBar();
