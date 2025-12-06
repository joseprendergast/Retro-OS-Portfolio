import { useState } from 'react';
import Win95Button from './Win95Button';

interface BlogPost {
  id: string;
  title: string;
  date: string;
  summary: string;
  content: string;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Welcome to My Portfolio',
    date: 'December 6, 2025',
    summary: 'An introduction to this retro-themed personal website.',
    content: `Welcome to my Windows 95 themed portfolio! 

This site is a nostalgic tribute to the golden age of personal computing. 
Here you'll find information about my projects, skills, and experience.

Feel free to explore the desktop, play some classic games, 
and discover hidden easter eggs throughout the site.

Thanks for visiting!`,
  },
  {
    id: '2',
    title: 'Building a Retro Web Experience',
    date: 'December 5, 2025',
    summary: 'The story behind creating this Windows 95 themed website.',
    content: `Creating an authentic Windows 95 experience on the web was a fun challenge.

Key features include:
- Fully functional window management system
- Playable Solitaire and Minesweeper games
- Authentic 3D border effects and color palette
- Drag-and-drop desktop icons
- Start menu with nested submenus

The goal was to capture the feel of using a computer in 1995 
while showcasing modern web development skills.`,
  },
  {
    id: '3',
    title: 'My Development Journey',
    date: 'December 4, 2025',
    summary: 'A brief overview of my programming background.',
    content: `I've been passionate about programming since discovering BASIC on my first PC.

Over the years, I've worked with many technologies:
- Frontend: React, TypeScript, CSS
- Backend: Node.js, Python, databases
- Tools: Git, Docker, cloud platforms

I enjoy building creative projects that push boundaries 
and provide unique user experiences.

This portfolio is one such project!`,
  },
];

export default function InternetExplorer() {
  const [currentUrl, setCurrentUrl] = useState('http://www.myportfolio.com/');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [history, setHistory] = useState<string[]>(['home']);
  const [historyIndex, setHistoryIndex] = useState(0);

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      if (history[newIndex] === 'home') {
        setSelectedPost(null);
      } else {
        const post = BLOG_POSTS.find(p => p.id === history[newIndex]);
        setSelectedPost(post || null);
      }
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      if (history[newIndex] === 'home') {
        setSelectedPost(null);
      } else {
        const post = BLOG_POSTS.find(p => p.id === history[newIndex]);
        setSelectedPost(post || null);
      }
    }
  };

  const openPost = (post: BlogPost) => {
    setSelectedPost(post);
    const newHistory = [...history.slice(0, historyIndex + 1), post.id];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentUrl(`http://www.myportfolio.com/blog/${post.id}`);
  };

  const goHome = () => {
    setSelectedPost(null);
    const newHistory = [...history.slice(0, historyIndex + 1), 'home'];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentUrl('http://www.myportfolio.com/');
  };

  return (
    <div className="flex flex-col h-full bg-white" data-testid="internet-explorer">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-1 bg-[#c0c0c0] border-b border-[#808080]">
        <Win95Button small onClick={goBack} disabled={historyIndex === 0} data-testid="button-ie-back">
          ← Back
        </Win95Button>
        <Win95Button small onClick={goForward} disabled={historyIndex >= history.length - 1} data-testid="button-ie-forward">
          → Forward
        </Win95Button>
        <Win95Button small onClick={goHome} data-testid="button-ie-home">
          🏠 Home
        </Win95Button>
        <Win95Button small onClick={() => window.location.reload()} data-testid="button-ie-refresh">
          🔄 Refresh
        </Win95Button>
      </div>

      {/* Address bar */}
      <div className="flex items-center gap-2 p-1 bg-[#c0c0c0] border-b border-[#808080]">
        <span className="text-[11px]">Address:</span>
        <div className="win95-sunken flex-1 bg-white px-2 py-[2px] text-[11px]" data-testid="text-url">
          {currentUrl}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {selectedPost ? (
          <article>
            <h1 className="text-[18px] font-bold text-[#000080] mb-2">{selectedPost.title}</h1>
            <p className="text-[11px] text-[#808080] mb-4">{selectedPost.date}</p>
            <div className="text-[12px] whitespace-pre-line">{selectedPost.content}</div>
            <button
              className="mt-4 text-[#0000FF] underline text-[12px] cursor-pointer"
              onClick={goHome}
              data-testid="link-back-to-home"
            >
              ← Back to articles
            </button>
          </article>
        ) : (
          <div>
            <h1 className="text-[20px] font-bold text-[#000080] mb-4">My Portfolio Blog</h1>
            <p className="text-[12px] mb-4">Welcome! Here are my latest articles:</p>
            <div className="space-y-4">
              {BLOG_POSTS.map((post) => (
                <div key={post.id} className="border-b border-[#c0c0c0] pb-4">
                  <h2
                    className="text-[14px] font-bold text-[#0000FF] cursor-pointer underline"
                    onClick={() => openPost(post)}
                    data-testid={`link-post-${post.id}`}
                  >
                    {post.title}
                  </h2>
                  <p className="text-[10px] text-[#808080]">{post.date}</p>
                  <p className="text-[11px] mt-1">{post.summary}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="h-[20px] win95-sunken flex items-center px-2 text-[10px] bg-[#c0c0c0]">
        Done
      </div>
    </div>
  );
}
