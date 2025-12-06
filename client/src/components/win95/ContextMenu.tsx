import { useEffect, useRef } from 'react';
import { useDesktopStore, ContextMenuItem } from '@/lib/desktopStore';

export default function ContextMenu() {
  const { contextMenu, closeContextMenu } = useDesktopStore();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeContextMenu();
      }
    };

    if (contextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [contextMenu, closeContextMenu]);

  if (!contextMenu) return null;

  const handleItemClick = (item: ContextMenuItem) => {
    if (!item.disabled) {
      item.action();
      closeContextMenu();
    }
  };

  return (
    <div
      ref={menuRef}
      className="fixed win95-raised bg-[#c0c0c0] min-w-[120px] z-[10000]"
      style={{ left: contextMenu.x, top: contextMenu.y }}
      data-testid="context-menu"
    >
      {contextMenu.items.map((item, index) => (
        <div key={index}>
          {item.separator && <div className="h-[1px] bg-[#808080] mx-1 my-1 shadow-[0_1px_0_#ffffff]" />}
          {!item.separator && (
            <button
              className={`block w-full text-left px-4 py-1 text-[11px] ${
                item.disabled
                  ? 'text-[#808080]'
                  : 'win95-menu-item'
              }`}
              onClick={() => handleItemClick(item)}
              disabled={item.disabled}
              data-testid={`context-menu-item-${item.label.toLowerCase().replace(/\s/g, '-')}`}
            >
              {item.label}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
