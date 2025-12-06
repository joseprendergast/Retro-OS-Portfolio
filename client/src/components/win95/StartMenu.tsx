import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useDesktopStore } from '@/lib/desktopStore';

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  action?: () => void;
  submenu?: MenuItem[];
  separator?: boolean;
}

interface StartMenuProps {
  items: MenuItem[];
  onItemClick: (item: MenuItem) => void;
}

export default function StartMenu({ items, onItemClick }: StartMenuProps) {
  const { startMenuOpen, closeStartMenu } = useDesktopStore();
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [activeSubSubmenu, setActiveSubSubmenu] = useState<string | null>(null);

  if (!startMenuOpen) return null;

  const handleItemClick = (item: MenuItem) => {
    if (!item.submenu) {
      onItemClick(item);
      closeStartMenu();
    }
  };

  return (
    <div
      className="fixed bottom-[30px] left-0 win95-raised bg-[#c0c0c0] z-[9998] flex"
      data-testid="start-menu"
    >
      {/* Windows 95 Side Banner */}
      <div className="w-[24px] bg-gradient-to-t from-[#000080] to-[#1084d0] flex items-end justify-center pb-2">
        <span className="text-white font-bold text-[11px] writing-mode-vertical rotate-180" style={{ writingMode: 'vertical-rl' }}>
          Windows 95
        </span>
      </div>

      {/* Menu Items */}
      <div className="min-w-[180px]">
        {items.map((item, index) => (
          <div key={item.id}>
            {item.separator && <div className="h-[1px] bg-[#808080] mx-1 my-1 shadow-[0_1px_0_#ffffff]" />}
            <div
              className={cn(
                'relative flex items-center gap-2 px-4 py-1 cursor-pointer',
                activeSubmenu === item.id && 'bg-[#000080] text-white'
              )}
              onMouseEnter={() => {
                setActiveSubmenu(item.id);
                setActiveSubSubmenu(null);
              }}
              onClick={() => handleItemClick(item)}
              data-testid={`start-menu-item-${item.id}`}
            >
              <span className="text-[16px] w-[20px]">{item.icon}</span>
              <span className="flex-1 text-[11px]">{item.label}</span>
              {item.submenu && <span className="text-[10px]">▶</span>}

              {/* First Level Submenu */}
              {item.submenu && activeSubmenu === item.id && (
                <div className="absolute left-full top-0 win95-raised bg-[#c0c0c0] min-w-[150px] z-50">
                  {item.submenu.map((subItem) => (
                    <div
                      key={subItem.id}
                      className={cn(
                        'relative flex items-center gap-2 px-4 py-1 cursor-pointer text-black',
                        activeSubSubmenu === subItem.id && 'bg-[#000080] text-white'
                      )}
                      onMouseEnter={() => setActiveSubSubmenu(subItem.id)}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!subItem.submenu) {
                          onItemClick(subItem);
                          closeStartMenu();
                        }
                      }}
                      data-testid={`start-submenu-item-${subItem.id}`}
                    >
                      <span className="text-[16px] w-[20px]">{subItem.icon}</span>
                      <span className="flex-1 text-[11px]">{subItem.label}</span>
                      {subItem.submenu && <span className="text-[10px]">▶</span>}

                      {/* Second Level Submenu */}
                      {subItem.submenu && activeSubSubmenu === subItem.id && (
                        <div className="absolute left-full top-0 win95-raised bg-[#c0c0c0] min-w-[120px] z-50">
                          {subItem.submenu.map((subSubItem) => (
                            <div
                              key={subSubItem.id}
                              className="flex items-center gap-2 px-4 py-1 cursor-pointer text-black hover:bg-[#000080] hover:text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                onItemClick(subSubItem);
                                closeStartMenu();
                              }}
                              data-testid={`start-subsubmenu-item-${subSubItem.id}`}
                            >
                              <span className="text-[16px] w-[20px]">{subSubItem.icon}</span>
                              <span className="text-[11px]">{subSubItem.label}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
