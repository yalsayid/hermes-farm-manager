import { BrowserWindow } from 'electron';
import path from 'path';

export const createBrowserWindow = (savedWindow: Electron.Rectangle) => {
  return new BrowserWindow({
    ...savedWindow,
    backgroundColor: 'rgb(243 244 246 / 0.5)',
    minWidth: 500,
    minHeight: 520,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    vibrancy: 'under-window',
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
};

export const loadURL = (mainWindow: BrowserWindow) => {
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL).then();
  } else {
    mainWindow
      .loadFile(
        path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
      )
      .then();
  }
};
