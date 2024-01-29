import type { Rectangle } from 'electron';
import Store from 'electron-store';

const defaultWindow: Rectangle = {
  x: undefined,
  y: undefined,
  width: 800,
  height: 600,
};

const storage = new Store();

const getSavedWindow = (): Rectangle | undefined => {
  try {
    const saved = storage.get('window');
    if (saved) {
      return saved as Rectangle;
    }
  } catch (error) {
    console.error('Failed to get saved window:', error);
  }

  return defaultWindow;
};

const saveWindow = (rect: Rectangle): void => {
  try {
    storage.set('window', rect);
  } catch (error) {
    console.error('Failed to save window:', error);
  }
};

export { getSavedWindow, saveWindow };
