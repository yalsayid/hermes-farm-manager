import { api } from '@main/preload';

declare global {
  interface Window {
    api: typeof api;
  }
}
