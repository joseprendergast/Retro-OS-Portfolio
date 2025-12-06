import Notepad from '../win95/Notepad';

export default function NotepadExample() {
  const sampleContent = `Welcome to RetroOSPortfolio!

This is a Windows 95 themed personal website.
You can explore folders, play games, and discover easter eggs.

Feel free to edit this text - it's just like the real Notepad!`;

  return (
    <div className="w-full h-[300px] win95-window">
      <Notepad initialContent={sampleContent} title="Welcome.txt" />
    </div>
  );
}
