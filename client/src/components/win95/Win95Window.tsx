import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useWindowManager, WindowState } from '@/lib/windowManager';

interface Win95WindowProps {
  window: WindowState;
  children: React.ReactNode;
  menuItems?: { label: string; items?: { label: string; action?: () => void }[] }[];
  statusText?: string;
}

export default function Win95Window({
  window: win,
  children,
  menuItems = [
    { label: 'File', items: [{ label: 'Close' }] },
    { label: 'Edit', items: [] },
    { label: 'View', items: [] },
    { label: 'Help', items: [] },
  ],
  statusText,
}: Win95WindowProps) {
  const {
    activeWindowId,
    focusWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    updateWindowPosition,
    updateWindowSize,
  } = useWindowManager();

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState('');
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  const isActive = activeWindowId === win.id;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !win.isMaximized) {
        const newX = e.clientX - dragOffset.x;
        const newY = Math.max(0, e.clientY - dragOffset.y);
        updateWindowPosition(win.id, newX, newY);
      }
      if (isResizing && !win.isMaximized) {
        const rect = windowRef.current?.getBoundingClientRect();
        if (!rect) return;

        let newWidth = win.width;
        let newHeight = win.height;
        let newX = win.x;
        let newY = win.y;

        if (resizeDirection.includes('e')) {
          newWidth = e.clientX - win.x;
        }
        if (resizeDirection.includes('w')) {
          newWidth = win.x + win.width - e.clientX;
          newX = e.clientX;
        }
        if (resizeDirection.includes('s')) {
          newHeight = e.clientY - win.y;
        }
        if (resizeDirection.includes('n')) {
          newHeight = win.y + win.height - e.clientY;
          newY = e.clientY;
        }

        if (newWidth >= win.minWidth && newHeight >= win.minHeight) {
          updateWindowSize(win.id, newWidth, newHeight);
          if (resizeDirection.includes('w') || resizeDirection.includes('n')) {
            updateWindowPosition(win.id, newX, newY);
          }
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, resizeDirection, win, updateWindowPosition, updateWindowSize]);

  const handleTitleMouseDown = (e: React.MouseEvent) => {
    if (win.isMaximized) return;
    e.preventDefault();
    focusWindow(win.id);
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - win.x,
      y: e.clientY - win.y,
    });
  };

  const handleResizeMouseDown = (direction: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    focusWindow(win.id);
    setIsResizing(true);
    setResizeDirection(direction);
  };

  const handleTitleDoubleClick = () => {
    if (win.isMaximized) {
      restoreWindow(win.id);
    } else {
      maximizeWindow(win.id);
    }
  };

  if (win.isMinimized) return null;

  const windowStyle = win.isMaximized
    ? { left: 0, top: 0, right: 0, bottom: 30, width: '100%', height: 'calc(100% - 30px)' }
    : { left: win.x, top: win.y, width: win.width, height: win.height };

  return (
    <div
      ref={windowRef}
      className={cn(
        'win95-window fixed flex flex-col',
        win.isMaximized && 'border-0'
      )}
      style={{ ...windowStyle, zIndex: win.zIndex }}
      onClick={() => focusWindow(win.id)}
      data-testid={`window-${win.id}`}
    >
      {/* Resize handles */}
      {!win.isMaximized && (
        <>
          <div className="absolute -top-1 left-2 right-2 h-2 cursor-n-resize" onMouseDown={handleResizeMouseDown('n')} />
          <div className="absolute -bottom-1 left-2 right-2 h-2 cursor-s-resize" onMouseDown={handleResizeMouseDown('s')} />
          <div className="absolute top-2 -left-1 bottom-2 w-2 cursor-w-resize" onMouseDown={handleResizeMouseDown('w')} />
          <div className="absolute top-2 -right-1 bottom-2 w-2 cursor-e-resize" onMouseDown={handleResizeMouseDown('e')} />
          <div className="absolute -top-1 -left-1 w-3 h-3 cursor-nw-resize" onMouseDown={handleResizeMouseDown('nw')} />
          <div className="absolute -top-1 -right-1 w-3 h-3 cursor-ne-resize" onMouseDown={handleResizeMouseDown('ne')} />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 cursor-sw-resize" onMouseDown={handleResizeMouseDown('sw')} />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 cursor-se-resize" onMouseDown={handleResizeMouseDown('se')} />
        </>
      )}

      {/* Title Bar */}
      <div
        className={cn(
          'h-[20px] flex items-center justify-between shrink-0 select-none',
          isActive ? 'win95-title-active' : 'win95-title-inactive'
        )}
        onMouseDown={handleTitleMouseDown}
        onDoubleClick={handleTitleDoubleClick}
      >
        <div className="flex items-center gap-1 overflow-hidden">
          <span className="text-[14px]">{win.icon}</span>
          <span className="truncate text-[11px]">{win.title}</span>
        </div>
        <div className="flex gap-[2px]">
          <button
            className="win95-button w-[16px] h-[14px] min-w-0 p-0 flex items-center justify-center text-[10px] leading-none"
            onClick={(e) => { e.stopPropagation(); minimizeWindow(win.id); }}
            data-testid={`button-minimize-${win.id}`}
          >
            _
          </button>
          <button
            className="win95-button w-[16px] h-[14px] min-w-0 p-0 flex items-center justify-center text-[10px] leading-none"
            onClick={(e) => { e.stopPropagation(); win.isMaximized ? restoreWindow(win.id) : maximizeWindow(win.id); }}
            data-testid={`button-maximize-${win.id}`}
          >
            {win.isMaximized ? '❐' : '□'}
          </button>
          <button
            className="win95-button w-[16px] h-[14px] min-w-0 p-0 flex items-center justify-center text-[10px] leading-none"
            onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }}
            data-testid={`button-close-${win.id}`}
          >
            ×
          </button>
        </div>
      </div>

      {/* Menu Bar */}
      <div className="h-[20px] flex items-center bg-[#c0c0c0] shrink-0 relative">
        {menuItems.map((menu) => (
          <div key={menu.label} className="relative">
            <button
              className={cn(
                'px-2 py-[2px] text-[11px]',
                openMenu === menu.label ? 'bg-[#000080] text-white' : 'hover:bg-[#000080] hover:text-white'
              )}
              onClick={() => setOpenMenu(openMenu === menu.label ? null : menu.label)}
              data-testid={`menu-${menu.label.toLowerCase()}`}
            >
              {menu.label}
            </button>
            {openMenu === menu.label && menu.items && menu.items.length > 0 && (
              <div className="absolute top-full left-0 win95-raised bg-[#c0c0c0] z-50 min-w-[120px]">
                {menu.items.map((item, i) => (
                  <button
                    key={i}
                    className="block w-full text-left px-4 py-1 text-[11px] win95-menu-item"
                    onClick={() => { item.action?.(); setOpenMenu(null); }}
                    data-testid={`menuitem-${item.label.toLowerCase().replace(/\s/g, '-')}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-white">
        {children}
      </div>

      {/* Status Bar */}
      {statusText !== undefined && (
        <div className="h-[20px] win95-sunken flex items-center px-2 text-[11px] shrink-0 bg-[#c0c0c0]">
          {statusText}
        </div>
      )}
    </div>
  );
}
