import { useState } from 'react';
import { MenuList, MenuListItem, Separator } from 'react95';
import styled from 'styled-components';
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

const StartMenuContainer = styled.div`
  position: fixed;
  bottom: 30px;
  left: 0;
  z-index: 9998;
  display: flex;
`;

const SideBanner = styled.div`
  width: 24px;
  background: linear-gradient(to top, #000080, #1084d0);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 8px;
`;

const BannerText = styled.span`
  color: white;
  font-weight: bold;
  font-size: 11px;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
`;

const MenuContainer = styled(MenuList)`
  min-width: 180px;
`;

const StyledMenuItem = styled(MenuListItem)<{ $hasSubmenu?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 11px;
  position: relative;
  padding: 4px 16px;
`;

const IconSpan = styled.span`
  font-size: 16px;
  width: 20px;
  display: flex;
  justify-content: center;
`;

const SubmenuArrow = styled.span`
  font-size: 10px;
  margin-left: auto;
`;

const SubmenuContainer = styled(MenuList)`
  position: absolute;
  left: 100%;
  top: 0;
  min-width: 150px;
  z-index: 50;
`;

const SubSubmenuContainer = styled(MenuList)`
  position: absolute;
  left: 100%;
  top: 0;
  min-width: 120px;
  z-index: 51;
`;

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
    <StartMenuContainer
      data-testid="start-menu"
      onClick={(e) => e.stopPropagation()}
    >
      <SideBanner>
        <BannerText>Windows 95</BannerText>
      </SideBanner>

      <MenuContainer>
        {items.map((item) => (
          <div key={item.id}>
            {item.separator && <Separator />}
            <StyledMenuItem
              $hasSubmenu={!!item.submenu}
              onMouseEnter={() => {
                setActiveSubmenu(item.id);
                setActiveSubSubmenu(null);
              }}
              onClick={() => handleItemClick(item)}
              data-testid={`start-menu-item-${item.id}`}
            >
              <IconSpan>{item.icon}</IconSpan>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.submenu && <SubmenuArrow>▶</SubmenuArrow>}

              {item.submenu && activeSubmenu === item.id && (
                <SubmenuContainer>
                  {item.submenu.map((subItem) => (
                    <StyledMenuItem
                      key={subItem.id}
                      $hasSubmenu={!!subItem.submenu}
                      onMouseEnter={() => setActiveSubSubmenu(subItem.id)}
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        if (!subItem.submenu) {
                          onItemClick(subItem);
                          closeStartMenu();
                        }
                      }}
                      data-testid={`start-submenu-item-${subItem.id}`}
                    >
                      <IconSpan>{subItem.icon}</IconSpan>
                      <span style={{ flex: 1 }}>{subItem.label}</span>
                      {subItem.submenu && <SubmenuArrow>▶</SubmenuArrow>}

                      {subItem.submenu && activeSubSubmenu === subItem.id && (
                        <SubSubmenuContainer>
                          {subItem.submenu.map((subSubItem) => (
                            <StyledMenuItem
                              key={subSubItem.id}
                              onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                onItemClick(subSubItem);
                                closeStartMenu();
                              }}
                              data-testid={`start-subsubmenu-item-${subSubItem.id}`}
                            >
                              <IconSpan>{subSubItem.icon}</IconSpan>
                              <span>{subSubItem.label}</span>
                            </StyledMenuItem>
                          ))}
                        </SubSubmenuContainer>
                      )}
                    </StyledMenuItem>
                  ))}
                </SubmenuContainer>
              )}
            </StyledMenuItem>
          </div>
        ))}
      </MenuContainer>
    </StartMenuContainer>
  );
}
