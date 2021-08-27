import { ConfigurationChangeEvent, ExtensionContext, workspace, WorkspaceConfiguration } from "vscode";
import { extensionEmitter } from "./eventEmitter";

const configPrefix = "statsBar";

class Setting {
  cfg: WorkspaceConfiguration | null = null;
  default = {
    refreshInterval: 1800,
  };

  init(context: ExtensionContext) {
    this.cfg = workspace.getConfiguration(configPrefix);
    context.subscriptions.push(workspace.onDidChangeConfiguration(this.onChange, setting));
  }

  private onChange(e: ConfigurationChangeEvent) {
    if (!e.affectsConfiguration(configPrefix)) {
      return;
    }

    this.cfg = workspace.getConfiguration(configPrefix);

    extensionEmitter.emit("setting-update");
  }
}

export const setting = new Setting();
