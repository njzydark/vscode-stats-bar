# vscode-stats-bar

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/njzy.stats-bar)](https://marketplace.visualstudio.com/items?itemName=njzy.stats-bar)
[![Visual Studio Marketplace Last Updated](https://img.shields.io/visual-studio-marketplace/last-updated/njzy.stats-bar)](https://marketplace.visualstudio.com/items?itemName=njzy.stats-bar)
[![Visual Studio Marketplace Rating](https://img.shields.io/visual-studio-marketplace/r/njzy.stats-bar)](https://marketplace.visualstudio.com/items?itemName=njzy.stats-bar)
[![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/njzy.stats-bar)](https://marketplace.visualstudio.com/items?itemName=njzy.stats-bar)

A vscode extension to show system stats in status bar

<img width="1136" alt="Xnip2021-08-27_10-49-32" src="https://user-images.githubusercontent.com/19601720/131064216-3da71ba3-234e-476f-a1cf-39ebcc8906a8.png">

<img width="1136" alt="Xnip2021-08-27_10-51-33" src="https://user-images.githubusercontent.com/19601720/131064382-4edb297e-fc65-49f3-9238-0adfd403d969.png">

## Features

- Support show cpu load, loadavg, network speed, memory usage and uptime
- Support custom display format
- Support copy ip to clipboard
- Support change loacation and refresh interval

## Extension Settings

You can visit this extension page in vscode to see detail

## Display Format

You can use `$(icon-name)` to show icon, visit this site [https://microsoft.github.io/vscode-codicons/dist/codicon.html](https://microsoft.github.io/vscode-codicons/dist/codicon.html) to find icon name

### Cpu Load

- ${percent}

### Loadavg

- ${1}
- ${5}
- ${15}

### Uptime

- ${days}
- ${hours}
- ${minutes}

### Network Speed

- ${up}
- ${up-unit}
- ${down}
- ${down-unit}

### Memory Usage

- ${used}
- ${total}
- ${percent}
- ${unit}

## Thanks

- [systeminformation](https://systeminformation.io)
