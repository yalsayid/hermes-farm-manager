import { contextBridge, ipcRenderer, MessagePortMain } from 'electron';
import { NewPrinter, Printer } from '@/main/modules/printers/types';

const printers = {
  add: async (printer: NewPrinter) =>
    ipcRenderer.invoke('db:add-printer', printer),

  getAll: async () => ipcRenderer.invoke('db:get-all-printers'),

  connect: async (printers: Printer[]) =>
    ipcRenderer.invoke('mqtt:connect', printers),

  onPrinterConnectionStatus: (
    callback: (value: { printer: Printer; status: string }) => void,
  ) => {
    ipcRenderer.on('printer-connection-status', (_event, value) =>
      callback(value),
    );
  },

  removePrinterConnectionStatusListener: (
    callback: (value: { printer: Printer; status: string }) => void,
  ) => {
    ipcRenderer.removeListener('printer-connection-status', (_event, value) =>
      callback(value),
    );
  },

  startPrinterStreams: async (printers: Printer[]): Promise<{ [key: number]: string }> => {
    return ipcRenderer.invoke('stream:connect', printers);
  },
};

export const api = {
  printers,
  isPackaged: () => ipcRenderer.invoke('app:get-isPackaged'),
  getUserDataPath: () => ipcRenderer.invoke('app:get-user-data-path'),
};

contextBridge.exposeInMainWorld('api', api);