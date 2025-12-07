import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Button } from 'react95';
import styled from 'styled-components';

interface Win95ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean;
  small?: boolean;
  primary?: boolean;
  fullWidth?: boolean;
  square?: boolean;
}

const StyledButton = styled(Button)<{ $small?: boolean; $pressed?: boolean }>`
  font-size: 11px;
  min-height: ${props => props.$small ? '18px' : '22px'};
  padding: ${props => props.$small ? '0 4px' : '0 8px'};
`;

const Win95Button = forwardRef<HTMLButtonElement, Win95ButtonProps>(
  ({ className, pressed, small, primary, fullWidth, square, children, ...props }, ref) => {
    return (
      <StyledButton
        ref={ref}
        active={pressed}
        primary={primary}
        fullWidth={fullWidth}
        square={square}
        $small={small}
        $pressed={pressed}
        className={className}
        {...props}
      >
        {children}
      </StyledButton>
    );
  }
);

Win95Button.displayName = 'Win95Button';

export default Win95Button;
