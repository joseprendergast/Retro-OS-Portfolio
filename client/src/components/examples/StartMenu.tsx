import StartMenu, { MenuItem } from '../win95/StartMenu';
import { useDesktopStore } from '@/lib/desktopStore';
import { useEffect } from 'react';

const menuItems: MenuItem[] = [
  {
    id: 'programs',
    label: 'Programs',
    icon: '📁',
    submenu: [
      {
        id: 'games',
        label: 'Games',
        icon: '🎮',
        submenu: [
          { id: 'solitaire', label: 'Solitaire', icon: '🃏' },
          { id: 'minesweeper', label: 'Minesweeper', icon: '💣' },
        ],
      },
      { id: 'ie', label: 'Internet Explorer', icon: '🌐' },
    ],
  },
  {
    id: 'documents',
    label: 'Documents',
    icon: '📄',
    submenu: [
      { id: 'resume', label: 'Resume.doc', icon: '📝' },
      { id: 'about', label: 'About_Me.txt', icon: '📄' },
    ],
  },
  { id: 'settings', label: 'Settings', icon: '⚙️', submenu: [{ id: 'display', label: 'Display', icon: '🖥️' }] },
  { id: 'find', label: 'Find', icon: '🔍' },
  { id: 'help', label: 'Help', icon: '❓' },
  { id: 'run', label: 'Run...', icon: '▶️', separator: true },
  { id: 'shutdown', label: 'Shut Down...', icon: '🔌', separator: true },
];

export default function StartMenuExample() {
  const { toggleStartMenu, startMenuOpen } = useDesktopStore();

  useEffect(() => {
    if (!startMenuOpen) {
      toggleStartMenu();
    }
  }, []);

  return (
    <div className="relative w-full h-[400px] bg-[#008080]">
      <StartMenu items={menuItems} onItemClick={(item) => console.log('Clicked:', item.label)} />
      <div className="absolute bottom-0 left-0 right-0 h-[30px] bg-[#c0c0c0] win95-raised" />
    </div>
  );
}
