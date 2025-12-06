import { create } from 'zustand';

export interface WindowState {
  id: string;
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  component: string;
  props?: Record<string, unknown>;
}

interface WindowManagerState {
  windows: WindowState[];
  activeWindowId: string | null;
  nextZIndex: number;
  openWindow: (window: Omit<WindowState, 'zIndex'>) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, width: number, height: number) => void;
}

export const useWindowManager = create<WindowManagerState>((set, get) => ({
  windows: [],
  activeWindowId: null,
  nextZIndex: 100,

  openWindow: (windowData) => {
    const { windows, nextZIndex } = get();
    const existingWindow = windows.find(w => w.id === windowData.id);
    
    if (existingWindow) {
      get().focusWindow(windowData.id);
      if (existingWindow.isMinimized) {
        get().restoreWindow(windowData.id);
      }
      return;
    }

    const offset = windows.length * 20;
    const newWindow: WindowState = {
      ...windowData,
      x: windowData.x + offset,
      y: windowData.y + offset,
      zIndex: nextZIndex,
    };

    set({
      windows: [...windows, newWindow],
      activeWindowId: newWindow.id,
      nextZIndex: nextZIndex + 1,
    });
  },

  closeWindow: (id) => {
    set((state) => ({
      windows: state.windows.filter(w => w.id !== id),
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    }));
  },

  minimizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map(w =>
        w.id === id ? { ...w, isMinimized: true } : w
      ),
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    }));
  },

  maximizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map(w =>
        w.id === id ? { ...w, isMaximized: true } : w
      ),
    }));
  },

  restoreWindow: (id) => {
    const { nextZIndex } = get();
    set((state) => ({
      windows: state.windows.map(w =>
        w.id === id ? { ...w, isMinimized: false, isMaximized: false, zIndex: nextZIndex } : w
      ),
      activeWindowId: id,
      nextZIndex: nextZIndex + 1,
    }));
  },

  focusWindow: (id) => {
    const { nextZIndex } = get();
    set((state) => ({
      windows: state.windows.map(w =>
        w.id === id ? { ...w, zIndex: nextZIndex } : w
      ),
      activeWindowId: id,
      nextZIndex: nextZIndex + 1,
    }));
  },

  updateWindowPosition: (id, x, y) => {
    set((state) => ({
      windows: state.windows.map(w =>
        w.id === id ? { ...w, x, y } : w
      ),
    }));
  },

  updateWindowSize: (id, width, height) => {
    set((state) => ({
      windows: state.windows.map(w =>
        w.id === id ? { ...w, width: Math.max(w.minWidth, width), height: Math.max(w.minHeight, height) } : w
      ),
    }));
  },
}));
