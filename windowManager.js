let z = 20;
let windows = [];
let focusedWindow = null;

export function createWindow({ title, icon, content, width = 400, height = 250, x, y }) {
  const win = document.createElement('div');
  win.className = 'window focused';
  win.style.width = width + 'px';
  win.style.height = height + 'px';
  win.style.left = (x !== undefined ? x : 120 + Math.random() * 120) + 'px';
  win.style.top = (y !== undefined ? y : 90 + Math.random() * 80) + 'px';
  win.style.zIndex = z++;

  win.innerHTML = `
    <div class="window-header">
      <img src="${icon}" class="window-header-icon" alt="">
      <span class="window-header-title">${title}</span>
      <div class="window-header-buttons">
        <button class="window-btn minimize" title="Minimize">—</button>
        <button class="window-btn fullscreen" title="Maximize">☐</button>
        <button class="window-btn close" title="Close">×</button>
      </div>
    </div>
    <div class="window-content">${content}</div>
  `;

  document.getElementById('desktop').appendChild(win);
  windows.push(win);
  focusWindow(win);

  // Dragging
  let dragging = false, offsetX = 0, offsetY = 0;
  const header = win.querySelector('.window-header');
  header.onmousedown = (e) => {
    if (e.target.classList.contains('window-btn')) return;
    dragging = true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    focusWindow(win);
    document.body.style.userSelect = 'none';
  };
  document.onmousemove = (e) => {
    if (dragging && !win.classList.contains('fullscreen')) {
      win.style.left = Math.max(0, e.clientX - offsetX) + 'px';
      win.style.top = Math.max(0, e.clientY - offsetY) + 'px';
    }
  };
  document.onmouseup = () => {
    dragging = false;
    document.body.style.userSelect = '';
  };

  // Buttons
  const btnClose = win.querySelector('.window-btn.close');
  const btnMin = win.querySelector('.window-btn.minimize');
  const btnFS = win.querySelector('.window-btn.fullscreen');
  btnClose.onclick = () => {
    win.remove();
    if (win.onclose) win.onclose();
    windows = windows.filter(w => w !== win);
  };
  btnMin.onclick = () => {
    win.classList.add('minimized');
    if (win.onminimize) win.onminimize();
  };
  btnFS.onclick = () => {
    if (win.classList.contains('fullscreen')) {
      win.classList.remove('fullscreen');
    } else {
      win.classList.add('fullscreen');
      win.style.left = '0px';
      win.style.top = '0px';
    }
  };

  // Focus
  win.onclick = () => focusWindow(win);

  // Restore/minimize API
  win.onminimize = null;
  win.onrestore = null;
  win.onclose = null;
  win.restore = () => {
    win.classList.remove('minimized');
    focusWindow(win);
    if (win.onrestore) win.onrestore();
  };

  return win;
}

export function restoreWindow(win) {
  if (win) win.restore();
}
export function focusWindow(win) {
  windows.forEach(w => w.classList.remove('focused'));
  win.classList.add('focused');
  win.style.zIndex = z++;
  focusedWindow = win;
}

export function updateClock() {
  const clock = document.getElementById('clock');
  if (clock) {
    const d = new Date();
    clock.textContent = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}