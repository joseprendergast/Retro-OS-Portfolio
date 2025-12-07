import { useState } from 'react';
import { Button, Toolbar, Panel } from 'react95';
import styled from 'styled-components';

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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ToolbarContainer = styled(Toolbar)`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
`;

const NavButton = styled(Button)`
  min-width: 24px;
  height: 22px;
  padding: 0 4px;
  font-size: 11px;
`;

const PathDisplay = styled(Panel)`
  flex: 1;
  margin-left: 8px;
  padding: 2px 8px;
  font-size: 11px;
  background: white;
`;

const FileGrid = styled.div`
  flex: 1;
  background: white;
  padding: 8px;
  overflow: auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 16px;
  align-content: start;
`;

const FileItemContainer = styled.div<{ $isSelected?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  user-select: none;
  background: ${props => props.$isSelected ? 'rgba(0, 0, 128, 0.2)' : 'transparent'};
`;

const FileIcon = styled.div<{ $isSelected?: boolean }>`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  background: ${props => props.$isSelected ? 'rgba(0, 0, 128, 0.3)' : 'transparent'};
`;

const FileName = styled.span<{ $isSelected?: boolean }>`
  font-size: 11px;
  text-align: center;
  margin-top: 4px;
  max-width: 70px;
  word-wrap: break-word;
  background: ${props => props.$isSelected ? '#000080' : 'transparent'};
  color: ${props => props.$isSelected ? 'white' : 'inherit'};
  padding: ${props => props.$isSelected ? '0 4px' : '0'};
`;

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
    <Container>
      <ToolbarContainer>
        <NavButton
          onClick={onBack}
          disabled={!canGoBack}
          data-testid="button-explorer-back"
        >
          ←
        </NavButton>
        <NavButton disabled data-testid="button-explorer-forward">→</NavButton>
        <PathDisplay variant="well" data-testid="text-path">
          {path}
        </PathDisplay>
      </ToolbarContainer>

      <FileGrid>
        {items.map((item) => (
          <FileItemContainer
            key={item.id}
            $isSelected={selectedItem === item.id}
            onClick={() => setSelectedItem(item.id)}
            onDoubleClick={() => handleDoubleClick(item)}
            data-testid={`file-item-${item.id}`}
          >
            <FileIcon $isSelected={selectedItem === item.id}>
              {item.icon}
            </FileIcon>
            <FileName $isSelected={selectedItem === item.id}>
              {item.name}
            </FileName>
          </FileItemContainer>
        ))}
      </FileGrid>
    </Container>
  );
}
