import Taskbar from '../win95/Taskbar';
import { useWindowManager } from '@/lib/windowManager';
import { useEffect } from 'react';

export default function TaskbarExample() {
  const { openWindow } = useWindowManager();

  useEffect(() => {
    openWindow({
      id: 'my-computer',
      title: 'My Computer',
      icon: '🖥️',
      x: 50,
      y: 50,
      width: 400,
      height: 300,
      minWidth: 200,
      minHeight: 150,
      isMinimized: false,
      isMaximized: false,
      component: 'MyComputer',
    });
    openWindow({
      id: 'notepad',
      title: 'Untitled - Notepad',
      icon: '📝',
      x: 100,
      y: 100,
      width: 300,
      height: 200,
      minWidth: 150,
      minHeight: 100,
      isMinimized: true,
      isMaximized: false,
      component: 'Notepad',
    });
  }, []);

  return (
    <div className="relative w-full h-[100px] bg-[#008080]">
      <div className="absolute bottom-0 left-0 right-0">
        <Taskbar />
      </div>
    </div>
  );
}
