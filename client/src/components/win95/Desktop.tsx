import { useEffect, useState, ReactNode } from 'react';
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

import {
  Computer,
  Explorer100,
  RecycleFull,
  FolderOpen,
  Folder,
  Joy102,
  Notepad2,
  Mail,
  Globe,
  Winmine1,
  Freecell1,
  Mmsys101,
  Shell3233,
} from '@react95/icons';


import starcraftImage from '@assets/starcraft_1765116863386.jpg';
import starcraftIcon from '@assets/1_1765116863380.ico';
import redAlertImage from '@assets/redalert_2_1765116863385.jpg';
import simsImage from '@assets/sims_1765116863385.jpeg';
import simsIcon from '@assets/image_1765118121238.png';
import ageOfEmpiresImage from '@assets/ages_of_empire_1765116863384.png';
import ageOfEmpiresIcon from '@assets/image_1765118009278.png';

interface DesktopIconData {
  id: string;
  label: string;
  icon: ReactNode;
  component?: string;
  isShortcut?: boolean;
  url?: string;
}

const DESKTOP_ICONS: DesktopIconData[] = [
  { id: 'my-computer', label: 'My Computer', icon: <Computer variant="32x32_4" />, component: 'MyComputer' },
  { id: 'internet-explorer', label: 'Internet Explorer', icon: <Explorer100 variant="32x32_4" />, component: 'InternetExplorer' },
  { id: 'recycle-bin', label: 'Recycle Bin', icon: <RecycleFull variant="32x32_4" />, component: 'RecycleBin' },
  { id: 'experience', label: 'Experience', icon: <Notepad2 variant="32x32_4" />, component: 'Experience' },
  { id: 'solitaire', label: 'Solitaire', icon: <Freecell1 variant="32x32_4" />, component: 'Solitaire' },
  { id: 'minesweeper', label: 'Minesweeper', icon: <Winmine1 variant="32x32_4" />, component: 'Minesweeper' },
  { id: 'starcraft', label: 'Starcraft', icon: <img src={starcraftIcon} alt="Starcraft" style={{ width: 32, height: 32 }} />, component: 'GameImage' },
  { id: 'red-alert', label: 'Red Alert 2', icon: <Joy102 variant="32x32_4" />, component: 'GameImage' },
  { id: 'sims', label: 'The Sims', icon: <img src={simsIcon} alt="The Sims" style={{ width: 32, height: 32 }} />, component: 'GameImage' },
  { id: 'age-of-empires', label: 'Age of Empires', icon: <img src={ageOfEmpiresIcon} alt="Age of Empires" style={{ width: 32, height: 32 }} />, component: 'GameImage' },
  { id: 'newsletter', label: 'Substack', icon: <Mail variant="32x32_4" />, isShortcut: true, url: 'https://joseprendergast.substack.com/' },
  { id: 'twitter', label: 'Twitter', icon: <Globe variant="32x32_4" />, isShortcut: true, url: 'https://twitter.com' },
];

const MY_COMPUTER_FILES: FileItem[] = [
  {
    id: 'my-documents',
    name: 'My Documents',
    icon: <Folder variant="32x32_4" />,
    type: 'folder',
    children: [
      { id: 'resume', name: 'Resume.doc', icon: <Notepad2 variant="32x32_4" />, type: 'file' },
      { id: 'about-me', name: 'About_Me.txt', icon: <Notepad2 variant="32x32_4" />, type: 'file' },
      {
        id: 'projects',
        name: 'Projects',
        icon: <Folder variant="32x32_4" />,
        type: 'folder',
        children: [
          { id: 'project-1', name: 'Project_1', icon: <Folder variant="32x32_4" />, type: 'folder', children: [{ id: 'desc-1', name: 'Description.txt', icon: <Notepad2 variant="32x32_4" />, type: 'file' }] },
          { id: 'project-2', name: 'Project_2', icon: <Folder variant="32x32_4" />, type: 'folder', children: [{ id: 'desc-2', name: 'Description.txt', icon: <Notepad2 variant="32x32_4" />, type: 'file' }] },
          { id: 'project-3', name: 'Project_3', icon: <Folder variant="32x32_4" />, type: 'folder', children: [{ id: 'desc-3', name: 'Description.txt', icon: <Notepad2 variant="32x32_4" />, type: 'file' }] },
        ],
      },
    ],
  },
  { id: 'my-pictures', name: 'My Pictures', icon: <Shell3233 variant="32x32_4" />, type: 'folder', children: [] },
  { id: 'my-music', name: 'My Music', icon: <Mmsys101 variant="32x32_4" />, type: 'folder', children: [] },
];


const RECYCLE_BIN_FILES: FileItem[] = [
  { id: 'old-resume', name: 'old_resume_draft.doc', icon: <Notepad2 variant="32x32_4" />, type: 'file' },
  { id: 'cringe', name: 'cringe_photo.bmp', icon: <Shell3233 variant="32x32_4" />, type: 'file' },
  { id: 'test', name: 'test_file.txt', icon: <Notepad2 variant="32x32_4" />, type: 'file' },
];

const GAMES_FILES: FileItem[] = [
  { id: 'solitaire', name: 'Solitaire', icon: <Freecell1 variant="32x32_4" />, type: 'file' },
  { id: 'minesweeper', name: 'Minesweeper', icon: <Winmine1 variant="32x32_4" />, type: 'file' },
  { id: 'starcraft', name: 'Starcraft', icon: <img src={starcraftIcon} alt="Starcraft" style={{ width: 32, height: 32 }} />, type: 'file' },
  { id: 'red-alert', name: 'Command & Conquer: Red Alert 2', icon: <Joy102 variant="32x32_4" />, type: 'file' },
  { id: 'sims', name: 'The Sims', icon: <Joy102 variant="32x32_4" />, type: 'file' },
  { id: 'age-of-empires', name: 'Age of Empires', icon: <Joy102 variant="32x32_4" />, type: 'file' },
];

const GAME_IMAGES: Record<string, string> = {
  'starcraft': starcraftImage,
  'red-alert': redAlertImage,
  'sims': simsImage,
  'age-of-empires': ageOfEmpiresImage,
};

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

  'experience': `+=====================================================+
|     JOSE PRENDERGAST - PROFESSIONAL EXPERIENCE     |
+=====================================================+

 ___________________________________________________
|                                                   |
| SVP, Product Management                           |
| AlixPartners                                      |
| Nov 2024 - Present                                |
|___________________________________________________|

 ___________________________________________________
|                                                   |
| Community Member                                  |
| Everything Marketplaces                           |
| 2023 - Present                                    |
|___________________________________________________|

 ___________________________________________________
|                                                   |
| Product Advisor                                   |
| PlateRate                                         |
| Jul 2024 - Nov 2024                               |
|___________________________________________________|

 ___________________________________________________
|                                                   |
| Product Advisor / Fractional CPO                  |
| Qviro.com                                         |
| May 2024 - Nov 2024                               |
|___________________________________________________|

 ___________________________________________________
|                                                   |
| Director of Product Management                    |
| Dot Foods                                         |
| Jan 2022 - Jun 2024                               |
|___________________________________________________|

 ___________________________________________________
|                                                   |
| IT Sr. Portfolio Manager                          |
| Santander US                                      |
| Oct 2020 - Jan 2022                               |
|___________________________________________________|

 ___________________________________________________
|                                                   |
| Group Product Manager                             |
| SNGULAR                                           |
| Mar 2020 - Jan 2022                               |
|___________________________________________________|

 ___________________________________________________
|                                                   |
| Lead Product Manager                              |
| Orange                                            |
| Jan 2018 - Mar 2020                               |
|___________________________________________________|

 ___________________________________________________
|                                                   |
| Senior Product Manager                            |
| NEC Corporation                                   |
| May 2015 - Jan 2018                               |
|___________________________________________________|

 ___________________________________________________
|                                                   |
| Global Product Manager                            |
| Telefonica                                        |
| Jan 2014 - May 2015                               |
|___________________________________________________|

 ___________________________________________________
|                                                   |
| Sr. Solutions Consultant                          |
| Telefonica                                        |
| Dec 2011 - Jan 2014                               |
|___________________________________________________|

+=====================================================+
|           Press any key to continue...             |
+=====================================================+`,

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


export default function Desktop() {
  const { windows, openWindow, closeWindow } = useWindowManager();
  const {
    wallpaper,
    setSelectedIcon,
    closeStartMenu,
    openContextMenu,
    closeContextMenu,
  } = useDesktopStore();

  const [navigationHistory, setNavigationHistory] = useState<Map<string, { path: string; items: FileItem[] }[]>>(new Map());

  const getWallpaperStyle = (wp: WallpaperType): React.CSSProperties => {
    switch (wp) {
      case 'clouds':
        return { backgroundImage: `url(https://i.pinimg.com/736x/c4/69/91/c46991139f26d28914a533ecb3c2f23f.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' };
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
      icon: <FolderOpen variant="16x16_4" />,
      submenu: [
        {
          id: 'games-menu',
          label: 'Games',
          icon: <Joy102 variant="16x16_4" />,
          submenu: [
            { id: 'solitaire', label: 'Solitaire', icon: <Freecell1 variant="16x16_4" /> },
            { id: 'minesweeper', label: 'Minesweeper', icon: <Winmine1 variant="16x16_4" /> },
          ],
        },
        { id: 'ie', label: 'Internet Explorer', icon: <Explorer100 variant="16x16_4" /> },
      ],
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: <Notepad2 variant="16x16_4" />,
      submenu: [
        { id: 'resume-doc', label: 'Resume.doc', icon: <Notepad2 variant="16x16_4" /> },
        { id: 'about-txt', label: 'About_Me.txt', icon: <Notepad2 variant="16x16_4" /> },
        {
          id: 'projects-menu',
          label: 'Projects',
          icon: <Folder variant="16x16_4" />,
          submenu: [
            { id: 'project-1-menu', label: 'Project_1', icon: <Folder variant="16x16_4" /> },
            { id: 'project-2-menu', label: 'Project_2', icon: <Folder variant="16x16_4" /> },
            { id: 'project-3-menu', label: 'Project_3', icon: <Folder variant="16x16_4" /> },
          ],
        },
      ],
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Computer variant="16x16_4" />,
      submenu: [{ id: 'display', label: 'Display', icon: <Computer variant="16x16_4" /> }],
    },
    { id: 'find', label: 'Find', icon: <Globe variant="16x16_4" /> },
    { id: 'help', label: 'Help', icon: <Globe variant="16x16_4" /> },
    { id: 'run', label: 'Run...', icon: <Computer variant="16x16_4" />, separator: true },
    { id: 'shutdown', label: 'Shut Down...', icon: <Computer variant="16x16_4" />, separator: true },
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
      icon: '🖥',
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

  const openExperienceWindow = () => {
    openWindow({
      id: 'experience',
      title: 'Experience - Notepad',
      icon: '📋',
      x: 120,
      y: 60,
      width: 500,
      height: 450,
      minWidth: 300,
      minHeight: 250,
      isMinimized: false,
      isMaximized: false,
      component: 'Notepad',
      props: { content: FILE_CONTENTS['experience'], title: 'My Experience' },
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
        openExplorerWindow('my-computer', 'My Computer', '💻', MY_COMPUTER_FILES, 'C:\\');
        break;
      case 'InternetExplorer':
        openIEWindow();
        break;
      case 'RecycleBin':
        openExplorerWindow('recycle-bin', 'Recycle Bin', '🗑', RECYCLE_BIN_FILES, 'Recycle Bin');
        break;
      case 'Experience':
        openExperienceWindow();
        break;
      case 'Solitaire':
        openGameWindow('solitaire', 'Solitaire', '🃏');
        break;
      case 'Minesweeper':
        openGameWindow('minesweeper', 'Minesweeper', '💣');
        break;
      case 'GameImage':
        openGameImageWindow(iconId, icon.label);
        break;
    }
  };

  const openGameImageWindow = (gameId: string, title: string) => {
    if (GAME_IMAGES[gameId]) {
      openWindow({
        id: `game-${gameId}`,
        title: `${title} - Game Info`,
        icon: '🎮',
        x: 120,
        y: 60,
        width: 500,
        height: 400,
        minWidth: 250,
        minHeight: 200,
        isMinimized: false,
        isMaximized: false,
        component: 'ImageViewer',
        props: { src: GAME_IMAGES[gameId], title },
      });
    }
  };

  const handleFileOpen = (file: FileItem, windowId: string) => {
    if (file.type === 'file') {
      if (file.id === 'solitaire') {
        openGameWindow('solitaire', 'Solitaire', '🃏');
      } else if (file.id === 'minesweeper') {
        openGameWindow('minesweeper', 'Minesweeper', '💣');
      } else if (GAME_IMAGES[file.id]) {
        openGameImageWindow(file.id, file.name);
      } else {
        openNotepadWindow(file.id, file.name);
      }
    } else if (file.type === 'shortcut') {
      const urls: Record<string, string> = {
        'twitter-url': 'https://twitter.com',
      };
      if (urls[file.id]) {
        window.open(urls[file.id], '_blank');
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
        return <div style={{ padding: 16 }}>Content not available</div>;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        userSelect: 'none',
        ...getWallpaperStyle(wallpaper),
      }}
      onClick={handleDesktopClick}
      onContextMenu={handleDesktopContextMenu}
      data-testid="desktop"
    >
      {/* Desktop Icons */}
      <div style={{ position: 'absolute', top: 16, left: 16, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, gridAutoRows: 'min-content' }}>
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
    </div>
  );
}
