import ContextMenu from '../win95/ContextMenu';
import { useDesktopStore } from '@/lib/desktopStore';
import { useEffect } from 'react';

export default function ContextMenuExample() {
  const { openContextMenu, contextMenu } = useDesktopStore();

  useEffect(() => {
    if (!contextMenu) {
      openContextMenu(100, 50, [
        { label: 'Open', action: () => console.log('Open clicked') },
        { label: 'Explore', action: () => console.log('Explore clicked') },
        { label: '', action: () => {}, separator: true },
        { label: 'Copy', action: () => console.log('Copy clicked') },
        { label: 'Paste', action: () => console.log('Paste clicked'), disabled: true },
        { label: '', action: () => {}, separator: true },
        { label: 'Properties', action: () => console.log('Properties clicked') },
      ]);
    }
  }, []);

  return (
    <div className="relative w-full h-[200px] bg-[#008080]">
      <ContextMenu />
    </div>
  );
}
