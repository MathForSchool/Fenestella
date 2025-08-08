import { createWindow, focusWindow, restoreWindow } from './windowManager.js';
import { settingsApp } from './settingsApp.js';

const APPS = [
  {
    id: 'settings',
    title: 'Settings',
    icon: '../assets/settings.png',
    launch: () => settingsApp(),
  },
  {
    id: 'edge',
    title: 'Microsoft Edge',
    icon: '../assets/edge.png',
    launch: () => blankApp('Microsoft Edge'),
  },
  {
    id: 'store',
    title: 'Microsoft Store',
    icon: '../assets/store.png',
    launch: () => blankApp('Microsoft Store'),
  },
  {
    id: 'explorer',
    title: 'File Explorer',
    icon: '../assets/explorer.png',
    launch: () => blankApp('File Explorer'),
  },
  {
    id: 'office',
    title: 'Office',
    icon: '../assets/office.png',
    launch: () => blankApp('Office'),
  },
  {
    id: 'vs',
    title: 'Visual Studio',
    icon: '../assets/vs.png',
    launch: () => blankApp('Visual Studio'),
  },
  {
    id: 'paint',
    title: 'Paint',
    icon: '../assets/paint.png',
    launch: () => blankApp('Paint'),
  },
  {
    id: 'calculator',
    title: 'Calculator',
    icon: '../assets/calculator.png',
    launch: () => blankApp('Calculator'),
  },
];

const openWindows = {};
const minimizedWindows = {};

export function createDesktop() {
  const desktop = document.getElementById('desktop');
  const startBtn = document.getElementById('start-btn');
  const startMenu = document.getElementById('start-menu');
  const taskbarApps = document.getElementById('taskbar-apps');

  // Start Menu
  function renderStartMenu() {
    startMenu.innerHTML = `
      <div class="apps-grid">
        ${APPS.map(app => `
          <div class="app-icon" data-app="${app.id}">
            <img src="${app.icon}" alt="${app.title}">
            <span class="app-label">${app.title}</span>
          </div>
        `).join('')}
      </div>
    `;
    startMenu.style.display = "block";
    document.querySelectorAll('.app-icon').forEach(elem => {
      elem.onclick = () => {
        openApp(elem.dataset.app);
        startMenu.style.display = "none";
      };
    });
  }

  function hideStartMenu() { startMenu.style.display = "none"; }

  startBtn.onclick = (e) => {
    e.stopPropagation();
    if (startMenu.style.display === "block") {
      hideStartMenu();
    } else {
      renderStartMenu();
    }
  };
  document.addEventListener('click', (e) => {
    if (startMenu.style.display === "block" && !startMenu.contains(e.target) && !startBtn.contains(e.target)) {
      hideStartMenu();
    }
  });

  // App launching
  function openApp(appId) {
    if (openWindows[appId]) {
      restoreWindow(openWindows[appId]);
      focusWindow(openWindows[appId]);
      return;
    }
    const app = APPS.find(a => a.id === appId);
    if (!app) return;
    const win = app.launch();
    openWindows[appId] = win;
    win.dataset.appId = appId;
    renderTaskbar();
    win.onclose = () => {
      delete openWindows[appId];
      renderTaskbar();
    };
    win.onminimize = () => {
      minimizedWindows[appId] = true;
      renderTaskbar();
    };
    win.onrestore = () => {
      minimizedWindows[appId] = false;
      renderTaskbar();
    };
  }

  // Taskbar
  function renderTaskbar() {
    taskbarApps.innerHTML = '';
    Object.keys(openWindows).forEach(appId => {
      const app = APPS.find(a => a.id === appId);
      const isActive = !minimizedWindows[appId];
      const btn = document.createElement('div');
      btn.className = 'taskbar-app' + (isActive ? ' active' : '');
      btn.title = app.title;
      btn.innerHTML = `<img src="${app.icon}" alt="${app.title}">`;
      btn.onclick = () => {
        if (minimizedWindows[appId]) {
          restoreWindow(openWindows[appId]);
        } else {
          focusWindow(openWindows[appId]);
        }
      };
      taskbarApps.appendChild(btn);
    });
  }
}

// Blank app template (for all apps except settings)
function blankApp(title) {
  return createWindow({
    title,
    icon: getAppIcon(title),
    content: `<div style="color:#888;font-size:1.2em;text-align:center;padding:40px 0;">This window is blank.</div>`,
    width: 420,
    height: 300,
  });
}

// Helper to get the right icon for each app
function getAppIcon(title) {
  const app = {
    'Settings': '../assets/settings.png',
    'Microsoft Edge': '../assets/edge.png',
    'Microsoft Store': '../assets/store.png',
    'File Explorer': '../assets/explorer.png',
    'Office': '../assets/office.png',
    'Visual Studio': '../assets/vs.png',
    'Paint': '../assets/paint.png',
    'Calculator': '../assets/calculator.png',
  };
  return app[title] || '../assets/settings.png';
}