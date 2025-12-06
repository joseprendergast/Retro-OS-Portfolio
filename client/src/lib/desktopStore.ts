import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type WallpaperType = 'clouds' | 'geometric' | 'brick' | 'circuit' | 'solid';

interface DesktopState {
  wallpaper: WallpaperType;
  selectedIconId: string | null;
  startMenuOpen: boolean;
  contextMenu: { x: number; y: number; items: ContextMenuItem[] } | null;
  setWallpaper: (wallpaper: WallpaperType) => void;
  setSelectedIcon: (id: string | null) => void;
  toggleStartMenu: () => void;
  closeStartMenu: () => void;
  openContextMenu: (x: number, y: number, items: ContextMenuItem[]) => void;
  closeContextMenu: () => void;
}

export interface ContextMenuItem {
  label: string;
  action: () => void;
  disabled?: boolean;
  separator?: boolean;
}

export const useDesktopStore = create<DesktopState>()(
  persist(
    (set) => ({
      wallpaper: 'clouds',
      selectedIconId: null,
      startMenuOpen: false,
      contextMenu: null,

      setWallpaper: (wallpaper) => set({ wallpaper }),
      setSelectedIcon: (id) => set({ selectedIconId: id }),
      toggleStartMenu: () => set((state) => ({ startMenuOpen: !state.startMenuOpen })),
      closeStartMenu: () => set({ startMenuOpen: false }),
      openContextMenu: (x, y, items) => set({ contextMenu: { x, y, items } }),
      closeContextMenu: () => set({ contextMenu: null }),
    }),
    {
      name: 'retro-os-desktop',
      partialize: (state) => ({ wallpaper: state.wallpaper }),
    }
  )
);
