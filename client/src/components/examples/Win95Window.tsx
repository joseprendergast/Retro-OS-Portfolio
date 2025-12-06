import Win95Window from '../win95/Win95Window';
import { useWindowManager } from '@/lib/windowManager';
import { useEffect } from 'react';

export default function Win95WindowExample() {
  const { windows, openWindow } = useWindowManager();

  useEffect(() => {
    if (windows.length === 0) {
      openWindow({
        id: 'example-window',
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
    }
  }, []);

  const exampleWindow = windows.find(w => w.id === 'example-window');

  if (!exampleWindow) return <div className="p-4 text-white">Loading window...</div>;

  return (
    <div className="relative w-full h-[400px] bg-[#008080]">
      <Win95Window window={exampleWindow} statusText="3 objects">
        <div className="p-4">
          <p>This is the window content area.</p>
          <p>You can drag the title bar to move and resize borders.</p>
        </div>
      </Win95Window>
    </div>
  );
}
