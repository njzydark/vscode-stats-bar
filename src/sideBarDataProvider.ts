import * as vscode from 'vscode';
import { SideBar } from './sideBar';
import { SideBarStatsModule } from './sysinfo';

export class SideBarDataProvider implements vscode.TreeDataProvider<StatsItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<StatsItem | undefined | void> = new vscode.EventEmitter<
    StatsItem | undefined | void
  >();
  readonly onDidChangeTreeData: vscode.Event<StatsItem | undefined | void> = this._onDidChangeTreeData.event;

  constructor(private moduleName: SideBarStatsModule, private sideBar: SideBar) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: StatsItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: StatsItem): Thenable<StatsItem[]> {
    if (element) {
      return Promise.resolve([]);
    } else {
      setTimeout(() => {
        console.log(this.moduleName);
        this.refresh();
      }, 1000);
      return Promise.resolve(this.getSysModuleStats(this.moduleName));
    }
  }

  /**
   * Given the path to package.json, read all its dependencies and devDependencies.
   */
  private async getSysModuleStats(moduleName: SideBarStatsModule): Promise<StatsItem[]> {
    const data = await this.sideBar.getStatsModuleData(moduleName);
    if (Array.isArray(data)) {
      return [];
    } else {
      return Object.keys(data || {}).map(key => {
        const value = data?.[key as keyof typeof data] || '-';
        return new StatsItem(`${key}: `, String(value));
      });
    }
  }
}

export class StatsItem extends vscode.TreeItem {
  constructor(public readonly label: string, public readonly description: string) {
    super(label);

    this.tooltip = this.description;
  }
}
