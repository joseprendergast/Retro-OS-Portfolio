import { useState } from 'react';
import { TextInput, Panel } from 'react95';
import styled from 'styled-components';

interface NotepadProps {
  initialContent?: string;
  title?: string;
  readOnly?: boolean;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: white;
`;

const TextArea = styled.textarea`
  flex: 1;
  width: 100%;
  padding: 8px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 12px;
  resize: none;
  border: none;
  outline: none;
  background: white;
`;

const StatusBar = styled(Panel)`
  height: 20px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  font-size: 10px;
`;

export default function Notepad({ initialContent = '', title = 'Untitled', readOnly = false }: NotepadProps) {
  const [content, setContent] = useState(initialContent);

  return (
    <Container data-testid="notepad">
      <TextArea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        readOnly={readOnly}
        placeholder="Start typing..."
        data-testid="input-notepad-content"
      />
      <StatusBar variant="well">
        {readOnly ? 'Read Only' : `${content.length} characters`}
      </StatusBar>
    </Container>
  );
}
