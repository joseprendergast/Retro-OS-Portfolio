import DesktopIcon from '../win95/DesktopIcon';
import { useDesktopStore } from '@/lib/desktopStore';

function DesktopIconExampleInner() {
  return (
    <div className="flex gap-4 p-4 bg-[#008080]">
      <DesktopIcon
        id="my-computer"
        label="My Computer"
        icon="🖥️"
        onDoubleClick={() => console.log('Opening My Computer')}
      />
      <DesktopIcon
        id="recycle-bin"
        label="Recycle Bin"
        icon="🗑️"
        onDoubleClick={() => console.log('Opening Recycle Bin')}
      />
      <DesktopIcon
        id="youtube"
        label="YouTube"
        icon="📺"
        isShortcut
        onDoubleClick={() => console.log('Opening YouTube')}
      />
    </div>
  );
}

export default function DesktopIconExample() {
  return <DesktopIconExampleInner />;
}
