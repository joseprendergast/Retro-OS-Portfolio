import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface Win95ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean;
  small?: boolean;
}

const Win95Button = forwardRef<HTMLButtonElement, Win95ButtonProps>(
  ({ className, pressed, small, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'win95-button',
          pressed && 'win95-button-pressed',
          small && 'min-w-0 px-1 py-0',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Win95Button.displayName = 'Win95Button';

export default Win95Button;
