import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useDesktopStore } from '@/lib/desktopStore';

interface DesktopIconProps {
  id: string;
  label: string;
  icon: string;
  isShortcut?: boolean;
  onDoubleClick: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}

export default function DesktopIcon({
  id,
  label,
  icon,
  isShortcut = false,
  onDoubleClick,
  onContextMenu,
}: DesktopIconProps) {
  const { selectedIconId, setSelectedIcon, closeStartMenu, closeContextMenu } = useDesktopStore();
  const isSelected = selectedIconId === id;
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeStartMenu();
    closeContextMenu();

    if (clickTimeout) {
      clearTimeout(clickTimeout);
      setClickTimeout(null);
      onDoubleClick();
    } else {
      setSelectedIcon(id);
      const timeout = setTimeout(() => {
        setClickTimeout(null);
      }, 300);
      setClickTimeout(timeout);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedIcon(id);
    onContextMenu?.(e);
  };

  return (
    <div
      className="flex flex-col items-center w-[70px] cursor-pointer select-none"
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      data-testid={`icon-${id}`}
    >
      <div className={cn(
        'relative w-[48px] h-[48px] flex items-center justify-center',
        isSelected && 'bg-[#000080]/50'
      )}>
        <span className="text-[32px]" style={{ imageRendering: 'pixelated' }}>
          {icon}
        </span>
        {isShortcut && (
          <div className="absolute bottom-0 left-0 text-[12px]">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 11 L1 4 L4 4 L4 1 L11 1 L11 8 L8 8 L8 11 Z" fill="white" stroke="black" strokeWidth="1"/>
              <path d="M3 6 L6 3 L9 6 L7 6 L7 9 L5 9 L5 6 Z" fill="black"/>
            </svg>
          </div>
        )}
      </div>
      <span
        className={cn(
          'text-center text-[11px] leading-tight mt-1 px-1 max-w-full break-words',
          isSelected
            ? 'bg-[#000080] text-white'
            : 'text-white icon-shadow'
        )}
      >
        {label}
      </span>
    </div>
  );
}
