import { useState } from 'react';

interface NotepadProps {
  initialContent?: string;
  title?: string;
  readOnly?: boolean;
}

export default function Notepad({ initialContent = '', title = 'Untitled', readOnly = false }: NotepadProps) {
  const [content, setContent] = useState(initialContent);

  return (
    <div className="flex flex-col h-full bg-white" data-testid="notepad">
      <textarea
        className="flex-1 w-full p-2 font-mono text-[12px] resize-none border-0 focus:outline-none bg-white"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        readOnly={readOnly}
        placeholder="Start typing..."
        data-testid="input-notepad-content"
      />
      <div className="h-[20px] win95-sunken flex items-center px-2 text-[10px] bg-[#c0c0c0]">
        {readOnly ? 'Read Only' : `${content.length} characters`}
      </div>
    </div>
  );
}
