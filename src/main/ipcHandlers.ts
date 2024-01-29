import { app, ipcMain } from 'electron';
import { addPrinter, getAllPrinters } from '@main/modules/printers/services';
import { NewPrinter, Printer } from '@main/modules/printers/types';
import { connectToPrinters } from '@main/modules/printers/mqttConnect';
import { attachMqttHandlers } from '@main/modules/printers/mqttHandlers';
import { stopAllStreams, startStream } from '@main/modules/printers/streamHandler';

export const registerIpcHandlers = () => {
  ipcMain.handle('db:add-printer', async (_, printer: NewPrinter) => {
    return addPrinter(printer);
  });

  ipcMain.handle('db:get-all-printers', async () => {
    return getAllPrinters();
  });

  ipcMain.handle('mqtt:connect', async (_, printers: Printer[]) => {
    try {
      const clients = await connectToPrinters(printers);
      clients.forEach((client, index) => {
        if (client) {
          attachMqttHandlers(client, printers[index]);
        }
      });
    } catch (error) {
      console.error('Failed to initialize printer connections:', error);
    }
  });

  ipcMain.handle('stream:connect', (_, printers: Printer[]) => {
    const streamPaths = printers.reduce((paths, printer) => {
      const streamPath = startStream(printer);
      return { ...paths, [printer.id]: streamPath };
    }, {});

    return streamPaths;
  });

  ipcMain.handle('app:get-isPackaged', () => app.isPackaged);
  ipcMain.handle('app:get-user-data-path', () => app.getPath('userData'));
};