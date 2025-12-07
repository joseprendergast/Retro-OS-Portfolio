import { useState } from 'react';
import { Button, Panel } from 'react95';
import styled from 'styled-components';
import { useDesktopStore, WallpaperType } from '@/lib/desktopStore';
import cloudsWallpaper from '@assets/generated_images/windows_95_clouds_wallpaper.png';

const WALLPAPERS: { id: WallpaperType; name: string; preview: string }[] = [
  { id: 'clouds', name: 'Clouds', preview: cloudsWallpaper },
  { id: 'geometric', name: 'Geometric Pattern', preview: '' },
  { id: 'brick', name: 'Brick Wall', preview: '' },
  { id: 'circuit', name: 'Circuit Board', preview: '' },
  { id: 'solid', name: 'Solid Teal', preview: '' },
];

interface DisplaySettingsProps {
  onClose: () => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  background: #c0c0c0;
`;

const Label = styled.label`
  font-size: 11px;
  display: block;
  margin-bottom: 4px;
`;

const PreviewPanel = styled(Panel)`
  width: 100%;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  background-size: cover;
  background-position: center;
`;

const PreviewWindow = styled.div`
  width: 80px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #dfdfdf #808080 #808080 #dfdfdf;
`;

const WallpaperList = styled(Panel)`
  height: 100px;
  overflow: auto;
  margin-bottom: 16px;
  background: white;
`;

const WallpaperItem = styled.div<{ $isSelected?: boolean }>`
  padding: 4px 8px;
  cursor: pointer;
  font-size: 11px;
  background: ${props => props.$isSelected ? '#000080' : 'transparent'};
  color: ${props => props.$isSelected ? 'white' : 'inherit'};
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: auto;
`;

const StyledButton = styled(Button)`
  font-size: 11px;
  min-width: 60px;
`;

export default function DisplaySettings({ onClose }: DisplaySettingsProps) {
  const { wallpaper, setWallpaper } = useDesktopStore();
  const [selectedWallpaper, setSelectedWallpaper] = useState<WallpaperType>(wallpaper);

  const handleApply = () => {
    setWallpaper(selectedWallpaper);
  };

  const handleOk = () => {
    setWallpaper(selectedWallpaper);
    onClose();
  };

  const getPreviewBackground = (id: WallpaperType) => {
    switch (id) {
      case 'clouds': return `url(${cloudsWallpaper})`;
      case 'geometric': return 'repeating-linear-gradient(45deg, #008080, #008080 10px, #006666 10px, #006666 20px)';
      case 'brick': return 'repeating-linear-gradient(0deg, #8B4513 0px, #8B4513 20px, #654321 20px, #654321 22px)';
      case 'circuit': return 'linear-gradient(90deg, #001144 0%, #002266 50%, #001144 100%)';
      case 'solid': return '#008080';
      default: return '#008080';
    }
  };

  return (
    <Container data-testid="display-settings">
      <div style={{ marginBottom: 16 }}>
        <Label>Preview:</Label>
        <PreviewPanel
          variant="well"
          style={{ background: getPreviewBackground(selectedWallpaper) }}
          data-testid="display-preview"
        >
          <PreviewWindow>Window</PreviewWindow>
        </PreviewPanel>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Label>Wallpaper:</Label>
        <WallpaperList variant="well">
          {WALLPAPERS.map((wp) => (
            <WallpaperItem
              key={wp.id}
              $isSelected={selectedWallpaper === wp.id}
              onClick={() => setSelectedWallpaper(wp.id)}
              data-testid={`wallpaper-option-${wp.id}`}
            >
              {wp.name}
            </WallpaperItem>
          ))}
        </WallpaperList>
      </div>

      <ButtonRow>
        <StyledButton onClick={handleOk} data-testid="button-ok">OK</StyledButton>
        <StyledButton onClick={onClose} data-testid="button-cancel">Cancel</StyledButton>
        <StyledButton onClick={handleApply} data-testid="button-apply">Apply</StyledButton>
      </ButtonRow>
    </Container>
  );
}
