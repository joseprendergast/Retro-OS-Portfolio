import { useState } from 'react';
import { Button, Toolbar, Panel } from 'react95';
import styled from 'styled-components';

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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
`;

const ToolbarContainer = styled(Toolbar)`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
`;

const NavButton = styled(Button)`
  font-size: 11px;
  padding: 2px 8px;
`;

const AddressBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px;
  background: #c0c0c0;
  border-bottom: 1px solid #808080;
`;

const AddressLabel = styled.span`
  font-size: 11px;
`;

const AddressInput = styled(Panel)`
  flex: 1;
  background: white;
  padding: 2px 8px;
  font-size: 11px;
`;

const Content = styled.div`
  flex: 1;
  overflow: auto;
  padding: 16px;
`;

const ArticleTitle = styled.h1`
  font-size: 18px;
  font-weight: bold;
  color: #000080;
  margin-bottom: 8px;
`;

const ArticleDate = styled.p`
  font-size: 11px;
  color: #808080;
  margin-bottom: 16px;
`;

const ArticleContent = styled.div`
  font-size: 12px;
  white-space: pre-line;
`;

const BackLink = styled.button`
  margin-top: 16px;
  color: #0000ff;
  text-decoration: underline;
  font-size: 12px;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
`;

const BlogTitle = styled.h1`
  font-size: 20px;
  font-weight: bold;
  color: #000080;
  margin-bottom: 16px;
`;

const BlogIntro = styled.p`
  font-size: 12px;
  margin-bottom: 16px;
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PostItem = styled.div`
  border-bottom: 1px solid #c0c0c0;
  padding-bottom: 16px;
`;

const PostTitle = styled.h2`
  font-size: 14px;
  font-weight: bold;
  color: #0000ff;
  cursor: pointer;
  text-decoration: underline;
`;

const PostDate = styled.p`
  font-size: 10px;
  color: #808080;
`;

const PostSummary = styled.p`
  font-size: 11px;
  margin-top: 4px;
`;

const StatusBar = styled(Panel)`
  height: 20px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  font-size: 10px;
  background: #c0c0c0;
`;

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
    <Container data-testid="internet-explorer">
      <ToolbarContainer>
        <NavButton onClick={goBack} disabled={historyIndex === 0} data-testid="button-ie-back">
          Back
        </NavButton>
        <NavButton onClick={goForward} disabled={historyIndex >= history.length - 1} data-testid="button-ie-forward">
          Forward
        </NavButton>
        <NavButton onClick={goHome} data-testid="button-ie-home">
          Home
        </NavButton>
        <NavButton onClick={() => window.location.reload()} data-testid="button-ie-refresh">
          Refresh
        </NavButton>
      </ToolbarContainer>

      <AddressBar>
        <AddressLabel>Address:</AddressLabel>
        <AddressInput variant="well" data-testid="text-url">
          {currentUrl}
        </AddressInput>
      </AddressBar>

      <Content>
        {selectedPost ? (
          <article>
            <ArticleTitle>{selectedPost.title}</ArticleTitle>
            <ArticleDate>{selectedPost.date}</ArticleDate>
            <ArticleContent>{selectedPost.content}</ArticleContent>
            <BackLink onClick={goHome} data-testid="link-back-to-home">
              Back to articles
            </BackLink>
          </article>
        ) : (
          <div>
            <BlogTitle>My Portfolio Blog</BlogTitle>
            <BlogIntro>Welcome! Here are my latest articles:</BlogIntro>
            <PostList>
              {BLOG_POSTS.map((post) => (
                <PostItem key={post.id}>
                  <PostTitle onClick={() => openPost(post)} data-testid={`link-post-${post.id}`}>
                    {post.title}
                  </PostTitle>
                  <PostDate>{post.date}</PostDate>
                  <PostSummary>{post.summary}</PostSummary>
                </PostItem>
              ))}
            </PostList>
          </div>
        )}
      </Content>

      <StatusBar variant="well">
        Done
      </StatusBar>
    </Container>
  );
}
