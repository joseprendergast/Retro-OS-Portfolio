import { useEffect } from 'react';
import { useWindowManager } from '@/lib/windowManager';
import { useDesktopStore, WallpaperType } from '@/lib/desktopStore';
import DesktopIcon from './DesktopIcon';
import Taskbar from './Taskbar';
import StartMenu, { MenuItem } from './StartMenu';
import ContextMenu from './ContextMenu';
import Win95Window from './Win95Window';
import FileExplorer, { FileItem } from './FileExplorer';
import Notepad from './Notepad';
import Minesweeper from './Minesweeper';
import Solitaire from './Solitaire';
import InternetExplorer from './InternetExplorer';
import ImageViewer from './ImageViewer';
import DisplaySettings from './DisplaySettings';
import NewsletterDialog from './NewsletterDialog';
import { useState } from 'react';

import cloudsWallpaper from '@assets/generated_images/windows_95_clouds_wallpaper.png';
import crtImage from '@assets/generated_images/90s_crt_computer_setup.png';
import floppyImage from '@assets/generated_images/colorful_floppy_disks_stack.png';
import cdromImage from '@assets/generated_images/cd-rom_collection_scattered.png';
import modemImage from '@assets/generated_images/dial-up_modem_device.png';
import pixelArtImage from '@assets/generated_images/retro_pixel_art_scene.png';

const DESKTOP_ICONS = [
  { id: 'my-computer', label: 'My Computer', icon: '🖥️', component: 'MyComputer' },
  { id: 'internet-explorer', label: 'Internet Explorer', icon: '🌐', component: 'InternetExplorer' },
  { id: 'recycle-bin', label: 'Recycle Bin', icon: '🗑️', component: 'RecycleBin' },
  { id: 'photos', label: 'Photos', icon: '🖼️', component: 'Photos' },
  { id: 'games', label: 'Games', icon: '🎮', component: 'Games' },
  { id: 'network', label: 'Network', icon: '🌍', component: 'Network' },
  { id: 'youtube', label: 'YouTube', icon: '📺', isShortcut: true, url: 'https://youtube.com' },
  { id: 'linkedin', label: 'LinkedIn', icon: '💼', isShortcut: true, url: 'https://linkedin.com' },
  { id: 'newsletter', label: 'Newsletter', icon: '✉️', isShortcut: true, component: 'Newsletter' },
  { id: 'twitter', label: 'Twitter', icon: '🐦', isShortcut: true, url: 'https://twitter.com' },
];

const MY_COMPUTER_FILES: FileItem[] = [
  {
    id: 'my-documents',
    name: 'My Documents',
    icon: '📁',
    type: 'folder',
    children: [
      { id: 'resume', name: 'Resume.doc', icon: '📄', type: 'file' },
      { id: 'about-me', name: 'About_Me.txt', icon: '📝', type: 'file' },
      {
        id: 'projects',
        name: 'Projects',
        icon: '📁',
        type: 'folder',
        children: [
          { id: 'project-1', name: 'Project_1', icon: '📁', type: 'folder', children: [{ id: 'desc-1', name: 'Description.txt', icon: '📝', type: 'file' }] },
          { id: 'project-2', name: 'Project_2', icon: '📁', type: 'folder', children: [{ id: 'desc-2', name: 'Description.txt', icon: '📝', type: 'file' }] },
          { id: 'project-3', name: 'Project_3', icon: '📁', type: 'folder', children: [{ id: 'desc-3', name: 'Description.txt', icon: '📝', type: 'file' }] },
        ],
      },
    ],
  },
  { id: 'my-pictures', name: 'My Pictures', icon: '🖼️', type: 'folder', children: [] },
  { id: 'my-music', name: 'My Music', icon: '🎵', type: 'folder', children: [] },
];

const PHOTOS_FILES: FileItem[] = [
  { id: 'crt', name: 'CRT_Computer.png', icon: '🖼️', type: 'file' },
  { id: 'floppy', name: 'Floppy_Disks.png', icon: '🖼️', type: 'file' },
  { id: 'cdrom', name: 'CD_Collection.png', icon: '🖼️', type: 'file' },
  { id: 'modem', name: 'Dial_Up_Modem.png', icon: '🖼️', type: 'file' },
  { id: 'pixel', name: 'Pixel_Art.png', icon: '🖼️', type: 'file' },
];

const RECYCLE_BIN_FILES: FileItem[] = [
  { id: 'old-resume', name: 'old_resume_draft.doc', icon: '📄', type: 'file' },
  { id: 'cringe', name: 'cringe_photo.bmp', icon: '🖼️', type: 'file' },
  { id: 'test', name: 'test_file.txt', icon: '📝', type: 'file' },
];

const GAMES_FILES: FileItem[] = [
  { id: 'solitaire', name: 'Solitaire', icon: '🃏', type: 'file' },
  { id: 'minesweeper', name: 'Minesweeper', icon: '💣', type: 'file' },
];

const NETWORK_FILES: FileItem[] = [
  { id: 'youtube-url', name: 'YouTube.url', icon: '📺', type: 'shortcut' },
  { id: 'linkedin-url', name: 'LinkedIn.url', icon: '💼', type: 'shortcut' },
  { id: 'twitter-url', name: 'Twitter.url', icon: '🐦', type: 'shortcut' },
  { id: 'newsletter-url', name: 'Newsletter.url', icon: '✉️', type: 'shortcut' },
];

const FILE_CONTENTS: Record<string, string> = {
  'resume': `JOHN DOE
Senior Software Developer
=====================================

SUMMARY
Experienced developer with 10+ years in web and software development.
Passionate about creating unique user experiences and clean code.

SKILLS
- Frontend: React, TypeScript, CSS, HTML
- Backend: Node.js, Python, SQL
- Tools: Git, Docker, AWS

EXPERIENCE
Senior Developer - Tech Company (2020-Present)
- Led development of key features
- Mentored junior developers
- Improved performance by 40%

Developer - Startup Inc (2015-2020)
- Built full-stack applications
- Implemented CI/CD pipelines

EDUCATION
BS Computer Science - University (2015)`,

  'about-me': `About Me
========

Hi! I'm a software developer who loves creating 
nostalgic and unique web experiences.

This Windows 95 themed portfolio is a tribute to 
the computing era that inspired me to start coding.

When I'm not programming, you can find me:
- Playing retro video games
- Collecting vintage tech
- Learning new technologies

Feel free to explore this desktop and discover
all the easter eggs hidden throughout!

Thanks for visiting!`,

  'desc-1': `Project 1: E-Commerce Platform
==============================

A full-stack e-commerce solution built with React and Node.js.

Features:
- User authentication
- Shopping cart
- Payment integration
- Admin dashboard

Technologies: React, Node.js, PostgreSQL, Stripe`,

  'desc-2': `Project 2: Task Management App
==============================

A collaborative task management tool for teams.

Features:
- Real-time updates
- Drag-and-drop interface
- Team collaboration
- Progress tracking

Technologies: React, Socket.io, MongoDB`,

  'desc-3': `Project 3: Weather Dashboard
==============================

A beautiful weather application with forecasts.

Features:
- Current conditions
- 7-day forecast
- Location search
- Weather alerts

Technologies: React, OpenWeather API, Charts.js`,
};

const IMAGE_SOURCES: Record<string, string> = {
  'crt': crtImage,
  'floppy': floppyImage,
  'cdrom': cdromImage,
  'modem': modemImage,
  'pixel': pixelArtImage,
};

export default function Desktop() {
  const { windows, openWindow, closeWindow } = useWindowManager();
  const {
    wallpaper,
    setSelectedIcon,
    closeStartMenu,
    openContextMenu,
    closeContextMenu,
  } = useDesktopStore();

  const [showNewsletter, setShowNewsletter] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState<Map<string, { path: string; items: FileItem[] }[]>>(new Map());

  const getWallpaperStyle = (wp: WallpaperType): React.CSSProperties => {
    switch (wp) {
      case 'clouds':
        return { backgroundImage: `url(${cloudsWallpaper})`, backgroundSize: 'cover', backgroundPosition: 'center' };
      case 'geometric':
        return { background: 'repeating-linear-gradient(45deg, #008080, #008080 10px, #006666 10px, #006666 20px)' };
      case 'brick':
        return { background: 'repeating-linear-gradient(0deg, #8B4513 0px, #8B4513 20px, #654321 20px, #654321 22px), repeating-linear-gradient(90deg, #A0522D 0px, #A0522D 40px, #8B4513 40px, #8B4513 80px)' };
      case 'circuit':
        return { background: 'linear-gradient(90deg, #001144 0%, #002266 50%, #001144 100%)' };
      case 'solid':
      default:
        return { backgroundColor: '#008080' };
    }
  };

  const startMenuItems: MenuItem[] = [
    {
      id: 'programs',
      label: 'Programs',
      icon: '📁',
      submenu: [
        {
          id: 'games-menu',
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
        { id: 'resume-doc', label: 'Resume.doc', icon: '📄' },
        { id: 'about-txt', label: 'About_Me.txt', icon: '📝' },
        {
          id: 'projects-menu',
          label: 'Projects',
          icon: '📁',
          submenu: [
            { id: 'project-1-menu', label: 'Project_1', icon: '📁' },
            { id: 'project-2-menu', label: 'Project_2', icon: '📁' },
            { id: 'project-3-menu', label: 'Project_3', icon: '📁' },
          ],
        },
      ],
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      submenu: [{ id: 'display', label: 'Display', icon: '🖥️' }],
    },
    { id: 'find', label: 'Find', icon: '🔍' },
    { id: 'help', label: 'Help', icon: '❓' },
    { id: 'run', label: 'Run...', icon: '▶️', separator: true },
    { id: 'shutdown', label: 'Shut Down...', icon: '🔌', separator: true },
  ];

  const handleStartMenuClick = (item: MenuItem) => {
    switch (item.id) {
      case 'solitaire':
        openGameWindow('solitaire', 'Solitaire', '🃏');
        break;
      case 'minesweeper':
        openGameWindow('minesweeper', 'Minesweeper', '💣');
        break;
      case 'ie':
        openIEWindow();
        break;
      case 'resume-doc':
      case 'about-txt':
        openNotepadWindow(item.id === 'resume-doc' ? 'resume' : 'about-me', item.label);
        break;
      case 'display':
        openDisplaySettings();
        break;
      case 'project-1-menu':
      case 'project-2-menu':
      case 'project-3-menu':
        const projNum = item.id.replace('project-', '').replace('-menu', '');
        openNotepadWindow(`desc-${projNum}`, `Project ${projNum} - Description.txt`);
        break;
      case 'shutdown':
        alert('Thanks for visiting! Come back soon!');
        break;
    }
  };

  const openExplorerWindow = (id: string, title: string, icon: string, files: FileItem[], path: string) => {
    openWindow({
      id,
      title,
      icon,
      x: 100,
      y: 50,
      width: 500,
      height: 400,
      minWidth: 300,
      minHeight: 200,
      isMinimized: false,
      isMaximized: false,
      component: 'FileExplorer',
      props: { files, path },
    });
  };

  const openNotepadWindow = (fileId: string, title: string) => {
    openWindow({
      id: `notepad-${fileId}`,
      title: `${title} - Notepad`,
      icon: '📝',
      x: 150,
      y: 80,
      width: 450,
      height: 350,
      minWidth: 250,
      minHeight: 150,
      isMinimized: false,
      isMaximized: false,
      component: 'Notepad',
      props: { content: FILE_CONTENTS[fileId] || '', title },
    });
  };

  const openImageWindow = (imageId: string, title: string) => {
    openWindow({
      id: `image-${imageId}`,
      title: `${title} - Image Viewer`,
      icon: '🖼️',
      x: 120,
      y: 60,
      width: 500,
      height: 400,
      minWidth: 250,
      minHeight: 200,
      isMinimized: false,
      isMaximized: false,
      component: 'ImageViewer',
      props: { src: IMAGE_SOURCES[imageId], title },
    });
  };

  const openGameWindow = (game: 'solitaire' | 'minesweeper', title: string, icon: string) => {
    openWindow({
      id: game,
      title,
      icon,
      x: 80,
      y: 40,
      width: game === 'solitaire' ? 700 : 400,
      height: game === 'solitaire' ? 550 : 450,
      minWidth: 300,
      minHeight: 300,
      isMinimized: false,
      isMaximized: false,
      component: game === 'solitaire' ? 'Solitaire' : 'Minesweeper',
    });
  };

  const openIEWindow = () => {
    openWindow({
      id: 'internet-explorer',
      title: 'Internet Explorer',
      icon: '🌐',
      x: 60,
      y: 30,
      width: 600,
      height: 450,
      minWidth: 400,
      minHeight: 300,
      isMinimized: false,
      isMaximized: false,
      component: 'InternetExplorer',
    });
  };

  const openDisplaySettings = () => {
    openWindow({
      id: 'display-settings',
      title: 'Display Properties',
      icon: '🖥️',
      x: 200,
      y: 100,
      width: 320,
      height: 380,
      minWidth: 280,
      minHeight: 340,
      isMinimized: false,
      isMaximized: false,
      component: 'DisplaySettings',
    });
  };

  const handleIconDoubleClick = (iconId: string) => {
    const icon = DESKTOP_ICONS.find(i => i.id === iconId);
    if (!icon) return;

    if (icon.url) {
      window.open(icon.url, '_blank');
      return;
    }

    switch (icon.component) {
      case 'MyComputer':
        openExplorerWindow('my-computer', 'My Computer', '🖥️', MY_COMPUTER_FILES, 'C:\\');
        break;
      case 'InternetExplorer':
        openIEWindow();
        break;
      case 'RecycleBin':
        openExplorerWindow('recycle-bin', 'Recycle Bin', '🗑️', RECYCLE_BIN_FILES, 'Recycle Bin');
        break;
      case 'Photos':
        openExplorerWindow('photos', 'Photos', '🖼️', PHOTOS_FILES, 'C:\\Photos');
        break;
      case 'Games':
        openExplorerWindow('games', 'Games', '🎮', GAMES_FILES, 'C:\\Games');
        break;
      case 'Network':
        openExplorerWindow('network', 'Network', '🌍', NETWORK_FILES, 'Network');
        break;
      case 'Newsletter':
        setShowNewsletter(true);
        break;
    }
  };

  const handleFileOpen = (file: FileItem, windowId: string) => {
    if (file.type === 'file') {
      if (file.id.startsWith('crt') || file.id.startsWith('floppy') || file.id.startsWith('cdrom') || file.id.startsWith('modem') || file.id.startsWith('pixel')) {
        openImageWindow(file.id, file.name);
      } else if (file.id === 'solitaire') {
        openGameWindow('solitaire', 'Solitaire', '🃏');
      } else if (file.id === 'minesweeper') {
        openGameWindow('minesweeper', 'Minesweeper', '💣');
      } else {
        openNotepadWindow(file.id, file.name);
      }
    } else if (file.type === 'shortcut') {
      if (file.id === 'newsletter-url') {
        setShowNewsletter(true);
      } else {
        const urls: Record<string, string> = {
          'youtube-url': 'https://youtube.com',
          'linkedin-url': 'https://linkedin.com',
          'twitter-url': 'https://twitter.com',
        };
        if (urls[file.id]) {
          window.open(urls[file.id], '_blank');
        }
      }
    }
  };

  const handleDesktopClick = () => {
    setSelectedIcon(null);
    closeStartMenu();
    closeContextMenu();
  };

  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    openContextMenu(e.clientX, e.clientY, [
      { label: 'Arrange Icons', action: () => console.log('Arrange icons') },
      { label: 'Line up Icons', action: () => console.log('Line up icons') },
      { label: '', action: () => {}, separator: true },
      { label: 'Refresh', action: () => window.location.reload() },
      { label: '', action: () => {}, separator: true },
      { label: 'Properties', action: () => openDisplaySettings() },
    ]);
  };

  const renderWindowContent = (win: typeof windows[0]) => {
    switch (win.component) {
      case 'FileExplorer':
        const props = win.props as { files: FileItem[]; path: string };
        return (
          <FileExplorer
            path={props.path}
            items={props.files}
            onNavigate={(newPath, newItems) => {
              const history = navigationHistory.get(win.id) || [];
              history.push({ path: props.path, items: props.files });
              setNavigationHistory(new Map(navigationHistory.set(win.id, history)));
              closeWindow(win.id);
              openExplorerWindow(win.id, newPath.split('\\').pop() || win.title, win.icon, newItems, newPath);
            }}
            onFileOpen={(file) => handleFileOpen(file, win.id)}
            onBack={() => {
              const history = navigationHistory.get(win.id);
              if (history && history.length > 0) {
                const prev = history.pop();
                setNavigationHistory(new Map(navigationHistory.set(win.id, history)));
                if (prev) {
                  closeWindow(win.id);
                  openExplorerWindow(win.id, prev.path.split('\\').pop() || 'Explorer', win.icon, prev.items, prev.path);
                }
              }
            }}
            canGoBack={(navigationHistory.get(win.id)?.length || 0) > 0}
          />
        );
      case 'Notepad':
        const notepadProps = win.props as { content: string; title: string };
        return <Notepad initialContent={notepadProps.content} title={notepadProps.title} readOnly />;
      case 'Minesweeper':
        return <Minesweeper />;
      case 'Solitaire':
        return <Solitaire />;
      case 'InternetExplorer':
        return <InternetExplorer />;
      case 'ImageViewer':
        const imageProps = win.props as { src: string; title: string };
        return <ImageViewer src={imageProps.src} title={imageProps.title} />;
      case 'DisplaySettings':
        return <DisplaySettings onClose={() => closeWindow(win.id)} />;
      default:
        return <div className="p-4">Content not available</div>;
    }
  };

  return (
    <div
      className="fixed inset-0 overflow-hidden select-none"
      style={getWallpaperStyle(wallpaper)}
      onClick={handleDesktopClick}
      onContextMenu={handleDesktopContextMenu}
      data-testid="desktop"
    >
      {/* Desktop Icons */}
      <div className="absolute top-4 left-4 grid grid-cols-3 gap-4" style={{ gridAutoRows: 'min-content' }}>
        {DESKTOP_ICONS.map((icon) => (
          <DesktopIcon
            key={icon.id}
            id={icon.id}
            label={icon.label}
            icon={icon.icon}
            isShortcut={icon.isShortcut}
            onDoubleClick={() => handleIconDoubleClick(icon.id)}
            onContextMenu={(e) => {
              e.preventDefault();
              openContextMenu(e.clientX, e.clientY, [
                { label: 'Open', action: () => handleIconDoubleClick(icon.id) },
                { label: '', action: () => {}, separator: true },
                { label: 'Properties', action: () => console.log('Properties:', icon.id) },
              ]);
            }}
          />
        ))}
      </div>

      {/* Windows */}
      {windows.map((win) => (
        <Win95Window key={win.id} window={win}>
          {renderWindowContent(win)}
        </Win95Window>
      ))}

      {/* Start Menu */}
      <StartMenu items={startMenuItems} onItemClick={handleStartMenuClick} />

      {/* Context Menu */}
      <ContextMenu />

      {/* Taskbar */}
      <Taskbar />

      {/* Newsletter Dialog */}
      {showNewsletter && <NewsletterDialog onClose={() => setShowNewsletter(false)} />}
    </div>
  );
}
