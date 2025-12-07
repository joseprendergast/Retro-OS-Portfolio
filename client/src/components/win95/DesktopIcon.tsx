import { useState } from 'react';
import styled from 'styled-components';
import { useDesktopStore } from '@/lib/desktopStore';

interface DesktopIconProps {
  id: string;
  label: string;
  icon: string;
  isShortcut?: boolean;
  onDoubleClick: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
}

const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 70px;
  cursor: pointer;
  user-select: none;
`;

const IconImage = styled.div<{ $isSelected?: boolean }>`
  position: relative;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$isSelected ? 'rgba(0, 0, 128, 0.5)' : 'transparent'};
`;

const IconEmoji = styled.span`
  font-size: 32px;
  image-rendering: pixelated;
`;

const ShortcutArrow = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
`;

const IconLabel = styled.span<{ $isSelected?: boolean }>`
  text-align: center;
  font-size: 11px;
  line-height: 1.2;
  margin-top: 4px;
  padding: 0 4px;
  max-width: 100%;
  word-wrap: break-word;
  background: ${props => props.$isSelected ? '#000080' : 'transparent'};
  color: ${props => props.$isSelected ? 'white' : 'white'};
  text-shadow: ${props => props.$isSelected ? 'none' : '1px 1px 1px rgba(0,0,0,0.8)'};
`;

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
    <IconContainer
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      data-testid={`icon-${id}`}
    >
      <IconImage $isSelected={isSelected}>
        <IconEmoji>{icon}</IconEmoji>
        {isShortcut && (
          <ShortcutArrow>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 11 L1 4 L4 4 L4 1 L11 1 L11 8 L8 8 L8 11 Z" fill="white" stroke="black" strokeWidth="1"/>
              <path d="M3 6 L6 3 L9 6 L7 6 L7 9 L5 9 L5 6 Z" fill="black"/>
            </svg>
          </ShortcutArrow>
        )}
      </IconImage>
      <IconLabel $isSelected={isSelected}>
        {label}
      </IconLabel>
    </IconContainer>
  );
}
