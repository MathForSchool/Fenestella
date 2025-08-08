import { createWindow, focusWindow } from './windowManager.js';

const SETTINGS = [
  { id: 'system', label: 'System', icon: '💻' },
  { id: 'personalization', label: 'Personalization', icon: '🎨' },
  { id: 'network', label: 'Network & Internet', icon: '🌐' },
  { id: 'privacy', label: 'Privacy', icon: '🔒' },
  { id: 'about', label: 'About', icon: 'ℹ️' },
];

const CONTENT = {
  system: `
    <h2>System</h2>
    <p>Battery: <b>100%</b><br>
    Storage: <b>256 GB free</b><br>
    Device: Fenestella Virtual Machine</p>
  `,
  personalization: `
    <h2>Personalization</h2>
    <p>Background: <b>Windows 11 Wallpaper</b></p>
    <p>Accent Color: <span style="display:inline-block;width:16px;height:16px;background:#7bc2e8;border-radius:4px;"></span></p>
  `,
  network: `
    <h2>Network & Internet</h2>
    <p>Status: <b>Connected</b></p>
    <p>IP Address: <b>192.168.1.11</b></p>
  `,
  privacy: `
    <h2>Privacy</h2>
    <p>Tracking Prevention: <b>Enabled</b></p>
    <p>Diagnostics: <b>Basic</b></p>
  `,
  about: `
    <h2>About Fenestella</h2>
    <p>This is a web-based Windows 11-like desktop UI demo.<br>
    <b>Version:</b> 1.0<br>
    <b>Author:</b> BubblerBrayden34</p>
  `
};

export function settingsApp() {
  let current = 'system';
  let win = createWindow({
    title: 'Settings',
    icon: '../assets/settings.png',
    width: 600,
    height: 380,
    content: render(current),
  });

  function render(selected) {
    return `
      <div class="settings-container">
        <div class="settings-sidebar">
          ${SETTINGS.map(s => `
            <div class="settings-item${s.id === selected ? ' active' : ''}" data-cat="${s.id}">
              <span>${s.icon}</span> ${s.label}
            </div>
          `).join('')}
        </div>
        <div class="settings-main">${CONTENT[selected]}</div>
      </div>
    `;
  }

  function rerender() {
    win.querySelector('.window-content').innerHTML = render(current);
    win.querySelectorAll('.settings-item').forEach(elem => {
      elem.onclick = () => {
        current = elem.dataset.cat;
        rerender();
      };
    });
  }

  setTimeout(rerender, 5);
  return win;
}