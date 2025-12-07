import { useEffect, useRef } from 'react';
import { MenuList, MenuListItem, Separator } from 'react95';
import styled from 'styled-components';
import { useDesktopStore, ContextMenuItem } from '@/lib/desktopStore';

const MenuContainer = styled(MenuList)`
  position: fixed;
  z-index: 10000;
  min-width: 120px;
`;

const StyledMenuItem = styled(MenuListItem)<{ $disabled?: boolean }>`
  font-size: 11px;
  padding: 4px 16px;
  cursor: ${props => props.$disabled ? 'default' : 'pointer'};
  color: ${props => props.$disabled ? '#808080' : 'inherit'};
`;

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
    <MenuContainer
      ref={menuRef}
      style={{ left: contextMenu.x, top: contextMenu.y }}
      data-testid="context-menu"
    >
      {contextMenu.items.map((item, index) => (
        item.separator ? (
          <Separator key={index} />
        ) : (
          <StyledMenuItem
            key={index}
            $disabled={item.disabled}
            onClick={() => handleItemClick(item)}
            data-testid={`context-menu-item-${item.label.toLowerCase().replace(/\s/g, '-')}`}
          >
            {item.label}
          </StyledMenuItem>
        )
      ))}
    </MenuContainer>
  );
}
