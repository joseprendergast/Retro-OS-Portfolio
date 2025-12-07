import { useState, useRef, useEffect } from 'react';
import { Window, WindowHeader, WindowContent, Button, Toolbar, MenuList, MenuListItem } from 'react95';
import styled from 'styled-components';
import { useWindowManager, WindowState } from '@/lib/windowManager';

interface Win95WindowProps {
  window: WindowState;
  children: React.ReactNode;
  menuItems?: { label: string; items?: { label: string; action?: () => void }[] }[];
  statusText?: string;
}

const StyledWindow = styled(Window)<{ $isMaximized?: boolean }>`
  position: fixed;
  display: flex;
  flex-direction: column;
  ${props => props.$isMaximized && 'border: 0;'}
`;

const TitleBar = styled(WindowHeader)<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 20px;
  padding: 2px 4px;
  user-select: none;
  background: ${props => props.$isActive 
    ? 'linear-gradient(to right, #000080, #1084d0)' 
    : 'linear-gradient(to right, #808080, #c0c0c0)'};
`;

const TitleContent = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  overflow: hidden;
`;

const TitleIcon = styled.span`
  font-size: 14px;
`;

const TitleText = styled.span`
  font-size: 11px;
  color: white;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const WindowControls = styled.div`
  display: flex;
  gap: 2px;
`;

const ControlButton = styled(Button)`
  width: 16px;
  height: 14px;
  min-width: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  line-height: 1;
`;

const MenuBar = styled(Toolbar)`
  height: 20px;
  padding: 0;
  display: flex;
  align-items: center;
`;

const MenuButton = styled.button<{ $isOpen?: boolean }>`
  padding: 2px 8px;
  font-size: 11px;
  border: none;
  background: ${props => props.$isOpen ? '#000080' : 'transparent'};
  color: ${props => props.$isOpen ? 'white' : 'inherit'};
  cursor: pointer;
  
  &:hover {
    background: #000080;
    color: white;
  }
`;

const DropdownMenu = styled(MenuList)`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 50;
  min-width: 120px;
`;

const StyledMenuItem = styled(MenuListItem)`
  font-size: 11px;
  padding: 4px 16px;
`;

const ContentArea = styled(WindowContent)`
  flex: 1;
  overflow: auto;
  background: white;
  padding: 0;
`;

const StatusBar = styled.div`
  height: 20px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  font-size: 11px;
  background: #c0c0c0;
  border-top: 1px solid #808080;
  box-shadow: inset 0 1px 0 #ffffff;
`;

const ResizeHandle = styled.div<{ $position: string }>`
  position: absolute;
  ${props => {
    switch (props.$position) {
      case 'n': return 'top: -4px; left: 8px; right: 8px; height: 8px; cursor: n-resize;';
      case 's': return 'bottom: -4px; left: 8px; right: 8px; height: 8px; cursor: s-resize;';
      case 'w': return 'left: -4px; top: 8px; bottom: 8px; width: 8px; cursor: w-resize;';
      case 'e': return 'right: -4px; top: 8px; bottom: 8px; width: 8px; cursor: e-resize;';
      case 'nw': return 'top: -4px; left: -4px; width: 12px; height: 12px; cursor: nw-resize;';
      case 'ne': return 'top: -4px; right: -4px; width: 12px; height: 12px; cursor: ne-resize;';
      case 'sw': return 'bottom: -4px; left: -4px; width: 12px; height: 12px; cursor: sw-resize;';
      case 'se': return 'bottom: -4px; right: -4px; width: 12px; height: 12px; cursor: se-resize;';
      default: return '';
    }
  }}
`;

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
    <StyledWindow
      ref={windowRef}
      $isMaximized={win.isMaximized}
      style={{ ...windowStyle, zIndex: win.zIndex }}
      onClick={() => focusWindow(win.id)}
      data-testid={`window-${win.id}`}
    >
      {!win.isMaximized && (
        <>
          <ResizeHandle $position="n" onMouseDown={handleResizeMouseDown('n')} />
          <ResizeHandle $position="s" onMouseDown={handleResizeMouseDown('s')} />
          <ResizeHandle $position="w" onMouseDown={handleResizeMouseDown('w')} />
          <ResizeHandle $position="e" onMouseDown={handleResizeMouseDown('e')} />
          <ResizeHandle $position="nw" onMouseDown={handleResizeMouseDown('nw')} />
          <ResizeHandle $position="ne" onMouseDown={handleResizeMouseDown('ne')} />
          <ResizeHandle $position="sw" onMouseDown={handleResizeMouseDown('sw')} />
          <ResizeHandle $position="se" onMouseDown={handleResizeMouseDown('se')} />
        </>
      )}

      <TitleBar
        $isActive={isActive}
        onMouseDown={handleTitleMouseDown}
        onDoubleClick={handleTitleDoubleClick}
      >
        <TitleContent>
          <TitleIcon>{win.icon}</TitleIcon>
          <TitleText>{win.title}</TitleText>
        </TitleContent>
        <WindowControls>
          <ControlButton
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); minimizeWindow(win.id); }}
            data-testid={`button-minimize-${win.id}`}
          >
            _
          </ControlButton>
          <ControlButton
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); win.isMaximized ? restoreWindow(win.id) : maximizeWindow(win.id); }}
            data-testid={`button-maximize-${win.id}`}
          >
            {win.isMaximized ? '❐' : '□'}
          </ControlButton>
          <ControlButton
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); closeWindow(win.id); }}
            data-testid={`button-close-${win.id}`}
          >
            ×
          </ControlButton>
        </WindowControls>
      </TitleBar>

      <MenuBar>
        {menuItems.map((menu) => (
          <div key={menu.label} style={{ position: 'relative' }}>
            <MenuButton
              $isOpen={openMenu === menu.label}
              onClick={() => setOpenMenu(openMenu === menu.label ? null : menu.label)}
              data-testid={`menu-${menu.label.toLowerCase()}`}
            >
              {menu.label}
            </MenuButton>
            {openMenu === menu.label && menu.items && menu.items.length > 0 && (
              <DropdownMenu>
                {menu.items.map((item, i) => (
                  <StyledMenuItem
                    key={i}
                    onClick={() => { item.action?.(); setOpenMenu(null); }}
                    data-testid={`menuitem-${item.label.toLowerCase().replace(/\s/g, '-')}`}
                  >
                    {item.label}
                  </StyledMenuItem>
                ))}
              </DropdownMenu>
            )}
          </div>
        ))}
      </MenuBar>

      <ContentArea>
        {children}
      </ContentArea>

      {statusText !== undefined && (
        <StatusBar>
          {statusText}
        </StatusBar>
      )}
    </StyledWindow>
  );
}
