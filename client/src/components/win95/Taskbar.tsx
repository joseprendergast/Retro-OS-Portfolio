import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useWindowManager } from '@/lib/windowManager';
import { useDesktopStore } from '@/lib/desktopStore';
import Win95Button from './Win95Button';

export default function Taskbar() {
  const { windows, activeWindowId, focusWindow, minimizeWindow, restoreWindow } = useWindowManager();
  const { startMenuOpen, toggleStartMenu } = useDesktopStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const handleWindowButtonClick = (windowId: string) => {
    const win = windows.find(w => w.id === windowId);
    if (!win) return;

    if (win.isMinimized) {
      restoreWindow(windowId);
    } else if (activeWindowId === windowId) {
      minimizeWindow(windowId);
    } else {
      focusWindow(windowId);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 h-[30px] bg-[#c0c0c0] win95-raised flex items-center px-1 z-[9999]"
      data-testid="taskbar"
    >
      {/* Start Button */}
      <Win95Button
        pressed={startMenuOpen}
        onClick={toggleStartMenu}
        className="flex items-center gap-1 font-bold h-[22px]"
        data-testid="button-start"
      >
        <span className="text-[14px]">🪟</span>
        <span>Start</span>
      </Win95Button>

      {/* Divider */}
      <div className="w-[2px] h-[22px] mx-1 bg-[#808080] shadow-[1px_0_0_#ffffff]" />

      {/* Window Buttons */}
      <div className="flex-1 flex gap-1 overflow-hidden">
        {windows.map((win) => (
          <button
            key={win.id}
            onClick={() => handleWindowButtonClick(win.id)}
            className={cn(
              'win95-button h-[22px] min-w-[100px] max-w-[150px] px-2 flex items-center gap-1 truncate text-left',
              activeWindowId === win.id && !win.isMinimized && 'win95-button-pressed'
            )}
            data-testid={`taskbar-button-${win.id}`}
          >
            <span className="text-[12px]">{win.icon}</span>
            <span className="truncate text-[11px]">{win.title}</span>
          </button>
        ))}
      </div>

      {/* System Tray */}
      <div className="win95-sunken flex items-center gap-2 px-2 h-[22px] ml-1">
        <span className="text-[14px]" title="Volume">🔊</span>
        <span className="text-[14px]" title="Network">🖧</span>
        <span className="text-[11px] min-w-[60px] text-center" data-testid="text-clock">
          {formatTime(time)}
        </span>
      </div>
    </div>
  );
}
