import { useState } from 'react';
import Win95Button from './Win95Button';

interface ImageViewerProps {
  src: string;
  title: string;
}

export default function ImageViewer({ src, title }: ImageViewerProps) {
  const [zoom, setZoom] = useState(100);

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0]" data-testid="image-viewer">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-1 border-b border-[#808080]">
        <Win95Button small onClick={() => setZoom(z => Math.max(25, z - 25))} data-testid="button-zoom-out">-</Win95Button>
        <span className="text-[11px] min-w-[40px] text-center">{zoom}%</span>
        <Win95Button small onClick={() => setZoom(z => Math.min(400, z + 25))} data-testid="button-zoom-in">+</Win95Button>
        <Win95Button small onClick={() => setZoom(100)} data-testid="button-zoom-reset">Fit</Win95Button>
      </div>

      {/* Image container */}
      <div className="flex-1 overflow-auto bg-[#808080] flex items-center justify-center p-4">
        <img
          src={src}
          alt={title}
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center' }}
          className="max-w-none"
          data-testid="img-viewer-content"
        />
      </div>

      {/* Status bar */}
      <div className="h-[20px] win95-sunken flex items-center px-2 text-[10px]">
        {title}
      </div>
    </div>
  );
}
