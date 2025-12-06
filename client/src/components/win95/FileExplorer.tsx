import { useState } from 'react';
import { cn } from '@/lib/utils';
import Win95Button from './Win95Button';

export interface FileItem {
  id: string;
  name: string;
  icon: string;
  type: 'folder' | 'file' | 'shortcut';
  action?: () => void;
  children?: FileItem[];
}

interface FileExplorerProps {
  path: string;
  items: FileItem[];
  onNavigate: (path: string, items: FileItem[]) => void;
  onFileOpen: (file: FileItem) => void;
  onBack?: () => void;
  canGoBack?: boolean;
}

export default function FileExplorer({
  path,
  items,
  onNavigate,
  onFileOpen,
  onBack,
  canGoBack = false,
}: FileExplorerProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleDoubleClick = (item: FileItem) => {
    if (item.type === 'folder' && item.children) {
      onNavigate(`${path}\\${item.name}`, item.children);
    } else {
      onFileOpen(item);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-1 bg-[#c0c0c0] border-b border-[#808080]">
        <Win95Button
          small
          onClick={onBack}
          disabled={!canGoBack}
          className={cn(!canGoBack && 'opacity-50')}
          data-testid="button-explorer-back"
        >
          ←
        </Win95Button>
        <Win95Button small disabled className="opacity-50" data-testid="button-explorer-forward">→</Win95Button>
        <div className="win95-sunken flex-1 bg-white px-2 py-[2px] text-[11px] ml-2" data-testid="text-path">
          {path}
        </div>
      </div>

      {/* File Grid */}
      <div className="flex-1 bg-white p-2 overflow-auto">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                'flex flex-col items-center p-2 cursor-pointer select-none',
                selectedItem === item.id && 'bg-[#000080]/20'
              )}
              onClick={() => setSelectedItem(item.id)}
              onDoubleClick={() => handleDoubleClick(item)}
              data-testid={`file-item-${item.id}`}
            >
              <div className={cn(
                'w-[48px] h-[48px] flex items-center justify-center text-[32px]',
                selectedItem === item.id && 'bg-[#000080]/30'
              )}>
                {item.icon}
              </div>
              <span className={cn(
                'text-[11px] text-center mt-1 max-w-[70px] break-words',
                selectedItem === item.id && 'bg-[#000080] text-white px-1'
              )}>
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
