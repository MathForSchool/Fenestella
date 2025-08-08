import { createDesktop } from './desktop.js';
import { updateClock } from './windowManager.js';

window.addEventListener('DOMContentLoaded', () => {
  createDesktop();

  setInterval(updateClock, 1000);
  updateClock();
});