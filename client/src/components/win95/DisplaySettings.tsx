import { useState } from 'react';
import Win95Button from './Win95Button';
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
    <div className="flex flex-col h-full p-4 bg-[#c0c0c0]" data-testid="display-settings">
      {/* Preview */}
      <div className="mb-4">
        <label className="text-[11px] block mb-1">Preview:</label>
        <div
          className="win95-sunken w-full h-[120px] flex items-center justify-center"
          style={{ background: getPreviewBackground(selectedWallpaper), backgroundSize: 'cover' }}
          data-testid="display-preview"
        >
          <div className="win95-window w-[80px] h-[60px] flex items-center justify-center text-[10px]">
            Window
          </div>
        </div>
      </div>

      {/* Wallpaper list */}
      <div className="mb-4">
        <label className="text-[11px] block mb-1">Wallpaper:</label>
        <div className="win95-sunken bg-white h-[100px] overflow-auto">
          {WALLPAPERS.map((wp) => (
            <div
              key={wp.id}
              className={`px-2 py-1 cursor-pointer text-[11px] ${
                selectedWallpaper === wp.id ? 'bg-[#000080] text-white' : ''
              }`}
              onClick={() => setSelectedWallpaper(wp.id)}
              data-testid={`wallpaper-option-${wp.id}`}
            >
              {wp.name}
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 mt-auto">
        <Win95Button onClick={handleOk} data-testid="button-ok">OK</Win95Button>
        <Win95Button onClick={onClose} data-testid="button-cancel">Cancel</Win95Button>
        <Win95Button onClick={handleApply} data-testid="button-apply">Apply</Win95Button>
      </div>
    </div>
  );
}
