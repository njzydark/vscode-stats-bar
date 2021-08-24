// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { getCpuSpeed, getCpuLoad, getLoad, getNetwork } from "./sysinfo";

let cpuStatusBarItem: vscode.StatusBarItem;
let cpuLoadStatusBarItem: vscode.StatusBarItem;
let loadStatusBarItem: vscode.StatusBarItem;
let networkStatusBarItem: vscode.StatusBarItem;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const commandId = "statbar.helloWorld";

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "statbar" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(commandId, () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    vscode.window.showInformationMessage("Hello World from StatBar!");
  });

  context.subscriptions.push(disposable);

  cpuStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
  context.subscriptions.push(cpuStatusBarItem);

  cpuLoadStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
  context.subscriptions.push(cpuLoadStatusBarItem);

  loadStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
  context.subscriptions.push(loadStatusBarItem);

  networkStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
  context.subscriptions.push(networkStatusBarItem);

  updateSysInfo();
}

// this method is called when your extension is deactivated
export function deactivate() {}

function updateSysInfo() {
  const cb = async () => {
    const res = await Promise.all([getCpuSpeed(), getCpuLoad(), getLoad(), getNetwork()]);
    updateStatusBarItem(res);
  };
  setInterval(cb, 1800);
  cb();
}

function updateStatusBarItem(res: (string | undefined)[]): void {
  [cpuStatusBarItem, cpuLoadStatusBarItem, loadStatusBarItem, networkStatusBarItem].forEach((statusBar, index) => {
    statusBar.text = res[index] || "-";
    statusBar.show();
  });
}
