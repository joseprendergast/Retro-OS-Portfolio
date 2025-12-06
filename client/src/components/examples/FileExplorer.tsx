import FileExplorer, { FileItem } from '../win95/FileExplorer';

const sampleItems: FileItem[] = [
  { id: 'docs', name: 'My Documents', icon: '📁', type: 'folder', children: [] },
  { id: 'pics', name: 'My Pictures', icon: '🖼️', type: 'folder', children: [] },
  { id: 'music', name: 'My Music', icon: '🎵', type: 'folder', children: [] },
  { id: 'resume', name: 'Resume.doc', icon: '📄', type: 'file' },
  { id: 'readme', name: 'ReadMe.txt', icon: '📝', type: 'file' },
];

export default function FileExplorerExample() {
  return (
    <div className="w-full h-[300px] bg-[#c0c0c0] win95-window">
      <FileExplorer
        path="C:\\"
        items={sampleItems}
        onNavigate={(path, items) => console.log('Navigate to:', path, items)}
        onFileOpen={(file) => console.log('Open file:', file.name)}
        canGoBack={false}
      />
    </div>
  );
}
