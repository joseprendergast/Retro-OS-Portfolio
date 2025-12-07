import { Button, Window, WindowHeader, WindowContent } from 'react95';
import styled from 'styled-components';

interface Win95DialogProps {
  title: string;
  icon?: string;
  message: string;
  buttons?: { label: string; action: () => void; primary?: boolean }[];
  onClose: () => void;
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Backdrop = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.2);
`;

const DialogWindow = styled(Window)`
  position: relative;
  min-width: 300px;
  max-width: 400px;
`;

const StyledHeader = styled(WindowHeader)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CloseButton = styled(Button)`
  min-width: 20px;
  width: 20px;
  height: 18px;
  padding: 0;
  font-size: 10px;
`;

const ContentArea = styled.div`
  padding: 16px;
  display: flex;
  gap: 16px;
`;

const IconText = styled.span`
  font-size: 32px;
`;

const MessageText = styled.p`
  font-size: 11px;
  flex: 1;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px 16px;
`;

export default function Win95Dialog({
  title,
  icon = '?',
  message,
  buttons = [{ label: 'OK', action: () => {}, primary: true }],
  onClose,
}: Win95DialogProps) {
  return (
    <Overlay>
      <Backdrop onClick={onClose} />
      <DialogWindow data-testid="dialog">
        <StyledHeader>
          <span>{title}</span>
          <CloseButton onClick={onClose} data-testid="button-dialog-close">
            x
          </CloseButton>
        </StyledHeader>
        <WindowContent>
          <ContentArea>
            <IconText>{icon}</IconText>
            <MessageText>{message}</MessageText>
          </ContentArea>

          <ButtonRow>
            {buttons.map((btn, i) => (
              <Button
                key={i}
                onClick={() => {
                  btn.action();
                  onClose();
                }}
                data-testid={`button-dialog-${btn.label.toLowerCase()}`}
              >
                {btn.label}
              </Button>
            ))}
          </ButtonRow>
        </WindowContent>
      </DialogWindow>
    </Overlay>
  );
}
