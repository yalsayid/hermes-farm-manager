import { app, BrowserWindow, ipcMain, net, protocol } from 'electron';
import { createBrowserWindow, loadURL } from '@main/window';
import { registerIpcHandlers } from '@main/ipcHandlers';
import { getSavedWindow, saveWindow } from '@main/settings';
import { stopAllStreams } from '@main/modules/printers/streamHandler';
import { pathToFileURL } from 'url';
import path from 'path';

const createWindow = () => {
  const savedWindow = getSavedWindow();
  const mainWindow = createBrowserWindow(savedWindow);

  mainWindow.on('close', () => {
    saveWindow(mainWindow.getBounds());
  });

  loadURL(mainWindow);
};

if (require('electron-squirrel-startup')) {
  app.quit();
} else {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: 'app',
      privileges: {
        standard: true,
        secure: true,
        stream: true,
        supportFetchAPI: true,
      }
    }
  ]);

  app.on('ready', async () => {
    createWindow();

    protocol.handle('app', (req) => {
      const { host, pathname } = new URL(req.url);

      if (host === 'bundle') {
        if (pathname.startsWith('/temp')) {
          return net.fetch(pathToFileURL(path.join(app.getPath('temp'), pathname.substring('/temp'.length))).toString());
        } else {
          return net.fetch(pathToFileURL(path.join(__dirname, pathname)).toString());
        }
      }
    });

    registerIpcHandlers();
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('before-quit', async () => {
    stopAllStreams();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
}
