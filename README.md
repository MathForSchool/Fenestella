# Fenestella

A web-based operating environment inspired by Windows, designed to be modular and extensible.  
This project serves as a base for emulating or mimicking OS-like features in the browser, with hooks for deeper emulation/virtualization.

## Features

- Desktop UI with draggable windows
- Taskbar, launcher, and notification foundation
- Modular codebase for emulation, virtualization, or web apps

## Getting Started

1. `npm install`
2. `npm start`
3. Open [http://localhost:3000](http://localhost:3000)

## Extend

- Add apps/windows in `src/desktop.js`
- Enhance windowing in `src/windowManager.js`
- Integrate emulation in `src/emulator.js`
