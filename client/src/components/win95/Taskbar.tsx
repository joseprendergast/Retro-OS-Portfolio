import { useState, useEffect } from 'react';
import { Button, Toolbar, Panel } from 'react95';
import styled from 'styled-components';
import { useWindowManager } from '@/lib/windowManager';
import { useDesktopStore } from '@/lib/desktopStore';
import { Logo } from '@react95/icons';

const TaskbarContainer = styled(Panel)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30px;
  z-index: 9999;
  display: flex;
  align-items: center;
  padding: 2px 4px;
`;

const StartButton = styled(Button)`
  font-weight: bold;
  font-size: 11px;
  height: 22px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const WindowButton = styled(Button)<{ $isActive?: boolean }>`
  height: 22px;
  min-width: 100px;
  max-width: 150px;
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 4px;
  justify-content: flex-start;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const WindowButtonsContainer = styled.div`
  flex: 1;
  display: flex;
  gap: 4px;
  overflow: hidden;
  margin-left: 4px;
`;

const SystemTray = styled(Panel)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 2px 8px;
  height: 22px;
  margin-left: 4px;
`;

const Divider = styled.div`
  width: 2px;
  height: 22px;
  margin: 0 4px;
  background: #808080;
  box-shadow: 1px 0 0 #ffffff;
`;

const ClockText = styled.span`
  font-size: 11px;
  min-width: 60px;
  text-align: center;
`;

const IconSpan = styled.span`
  font-size: 14px;
`;

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
    <TaskbarContainer
      variant="outside"
      data-testid="taskbar"
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
    >
      <StartButton
        active={startMenuOpen}
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          toggleStartMenu();
        }}
        data-testid="button-start"
      >
        <Logo style={{ width: 16, height: 16 }} />
        <span>Start</span>
      </StartButton>

      <Divider />

      <WindowButtonsContainer>
        {windows.map((win) => (
          <WindowButton
            key={win.id}
            active={activeWindowId === win.id && !win.isMinimized}
            onClick={() => handleWindowButtonClick(win.id)}
            data-testid={`taskbar-button-${win.id}`}
          >
            <IconSpan style={{ fontSize: '12px' }}>{win.icon}</IconSpan>
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{win.title}</span>
          </WindowButton>
        ))}
      </WindowButtonsContainer>

      <SystemTray variant="well">
        <IconSpan title="Volume">🔊</IconSpan>
        <IconSpan title="Network">🖧</IconSpan>
        <ClockText data-testid="text-clock">
          {formatTime(time)}
        </ClockText>
      </SystemTray>
    </TaskbarContainer>
  );
}
