import { useState } from 'react';
import { Button, Toolbar, Panel } from 'react95';
import styled from 'styled-components';

interface ImageViewerProps {
  src: string;
  title: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #c0c0c0;
`;

const ToolbarContainer = styled(Toolbar)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px;
`;

const ZoomButton = styled(Button)`
  min-width: 24px;
  height: 22px;
  padding: 0 4px;
  font-size: 11px;
`;

const ZoomText = styled.span`
  font-size: 11px;
  min-width: 40px;
  text-align: center;
`;

const ImageContainer = styled.div`
  flex: 1;
  overflow: auto;
  background: #808080;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const Image = styled.img<{ $zoom: number }>`
  max-width: none;
  transform: scale(${props => props.$zoom / 100});
  transform-origin: center;
`;

const StatusBar = styled(Panel)`
  height: 20px;
  display: flex;
  align-items: center;
  padding: 0 8px;
  font-size: 10px;
`;

export default function ImageViewer({ src, title }: ImageViewerProps) {
  const [zoom, setZoom] = useState(100);

  return (
    <Container data-testid="image-viewer">
      <ToolbarContainer>
        <ZoomButton onClick={() => setZoom(z => Math.max(25, z - 25))} data-testid="button-zoom-out">-</ZoomButton>
        <ZoomText>{zoom}%</ZoomText>
        <ZoomButton onClick={() => setZoom(z => Math.min(400, z + 25))} data-testid="button-zoom-in">+</ZoomButton>
        <ZoomButton onClick={() => setZoom(100)} data-testid="button-zoom-reset">Fit</ZoomButton>
      </ToolbarContainer>

      <ImageContainer>
        <Image
          src={src}
          alt={title}
          $zoom={zoom}
          data-testid="img-viewer-content"
        />
      </ImageContainer>

      <StatusBar variant="well">
        {title}
      </StatusBar>
    </Container>
  );
}
