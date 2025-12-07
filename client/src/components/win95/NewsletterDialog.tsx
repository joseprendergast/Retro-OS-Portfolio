import { useState } from 'react';
import { Button, Window, WindowHeader, WindowContent, TextInput, Panel } from 'react95';
import styled from 'styled-components';

interface NewsletterDialogProps {
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
  width: 300px;
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

const SuccessContent = styled(WindowContent)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 16px;
`;

const IconText = styled.span`
  font-size: 32px;
`;

const SuccessMessage = styled.p`
  font-size: 12px;
  text-align: center;
`;

const EmailConfirm = styled.p`
  font-size: 11px;
  text-align: center;
  color: #808080;
`;

const FormContent = styled(WindowContent)`
  padding: 16px;
`;

const IntroText = styled.p`
  font-size: 11px;
  margin-bottom: 16px;
`;

const FormField = styled.div`
  margin-bottom: 12px;
`;

const Label = styled.label`
  font-size: 11px;
  display: block;
  margin-bottom: 4px;
`;

const StyledInput = styled(TextInput)`
  width: 100%;
`;

const ErrorText = styled.p`
  color: #cc0000;
  font-size: 10px;
  margin-bottom: 8px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;

export default function NewsletterDialog({ onClose }: NewsletterDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    setSubmitted(true);
    console.log('Newsletter signup:', { name, email });
  };

  if (submitted) {
    return (
      <Overlay>
        <Backdrop onClick={onClose} />
        <DialogWindow data-testid="newsletter-success">
          <StyledHeader>
            <span>Newsletter</span>
            <CloseButton onClick={onClose}>x</CloseButton>
          </StyledHeader>
          <SuccessContent>
            <IconText>[OK]</IconText>
            <SuccessMessage>Thank you for subscribing!</SuccessMessage>
            <EmailConfirm>You'll receive updates at {email}</EmailConfirm>
            <Button onClick={onClose} data-testid="button-close-success">OK</Button>
          </SuccessContent>
        </DialogWindow>
      </Overlay>
    );
  }

  return (
    <Overlay>
      <Backdrop onClick={onClose} />
      <DialogWindow data-testid="newsletter-dialog">
        <StyledHeader>
          <span>Subscribe to Newsletter</span>
          <CloseButton onClick={onClose}>x</CloseButton>
        </StyledHeader>
        <FormContent>
          <IntroText>Get updates about new projects and blog posts!</IntroText>

          <FormField>
            <Label>Name:</Label>
            <StyledInput
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              data-testid="input-newsletter-name"
            />
          </FormField>

          <FormField>
            <Label>Email:</Label>
            <StyledInput
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              data-testid="input-newsletter-email"
            />
          </FormField>

          {error && <ErrorText>{error}</ErrorText>}

          <ButtonRow>
            <Button onClick={handleSubmit} data-testid="button-subscribe">Subscribe</Button>
            <Button onClick={onClose} data-testid="button-cancel">Cancel</Button>
          </ButtonRow>
        </FormContent>
      </DialogWindow>
    </Overlay>
  );
}
