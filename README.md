# vscode-stats-bar

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/njzy.stats-bar)](https://marketplace.visualstudio.com/items?itemName=njzy.stats-bar)
[![Visual Studio Marketplace Last Updated](https://img.shields.io/visual-studio-marketplace/last-updated/njzy.stats-bar)](https://marketplace.visualstudio.com/items?itemName=njzy.stats-bar)
[![Visual Studio Marketplace Rating](https://img.shields.io/visual-studio-marketplace/r/njzy.stats-bar)](https://marketplace.visualstudio.com/items?itemName=njzy.stats-bar)
[![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/njzy.stats-bar)](https://marketplace.visualstudio.com/items?itemName=njzy.stats-bar)

A vscode extension to show system stats in status bar

<img width="1136" alt="Xnip2021-08-28_19-30-23" src="https://user-images.githubusercontent.com/19601720/131216513-6e0d5619-4767-40aa-8c2d-782ee732d987.png">
<img width="1136" alt="Xnip2021-08-28_19-29-25" src="https://user-images.githubusercontent.com/19601720/131216521-92007920-daba-48db-873d-9410177ddf0e.png">

## Features

- Support show cpu load, loadavg, network speed, memory usage and uptime
- Support custom display format, order and priority
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
