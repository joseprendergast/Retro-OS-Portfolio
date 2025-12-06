import { useState } from 'react';
import Win95Button from './Win95Button';

interface NewsletterDialogProps {
  onClose: () => void;
}

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
      <div className="fixed inset-0 z-[10000] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/20" onClick={onClose} />
        <div className="win95-window relative w-[300px]" data-testid="newsletter-success">
          <div className="win95-title-active h-[20px] flex items-center justify-between">
            <span className="text-[11px]">Newsletter</span>
            <button
              className="win95-button w-[16px] h-[14px] min-w-0 p-0 flex items-center justify-center text-[10px]"
              onClick={onClose}
            >
              ×
            </button>
          </div>
          <div className="p-4 flex flex-col items-center gap-4">
            <span className="text-[32px]">✉️</span>
            <p className="text-[12px] text-center">Thank you for subscribing!</p>
            <p className="text-[11px] text-center text-[#808080]">You'll receive updates at {email}</p>
            <Win95Button onClick={onClose} data-testid="button-close-success">OK</Win95Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="win95-window relative w-[300px]" data-testid="newsletter-dialog">
        <div className="win95-title-active h-[20px] flex items-center justify-between">
          <span className="text-[11px]">Subscribe to Newsletter</span>
          <button
            className="win95-button w-[16px] h-[14px] min-w-0 p-0 flex items-center justify-center text-[10px]"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="p-4">
          <p className="text-[11px] mb-4">Get updates about new projects and blog posts!</p>

          <div className="mb-3">
            <label className="text-[11px] block mb-1">Name:</label>
            <input
              type="text"
              className="win95-input w-full text-[11px]"
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-testid="input-newsletter-name"
            />
          </div>

          <div className="mb-3">
            <label className="text-[11px] block mb-1">Email:</label>
            <input
              type="email"
              className="win95-input w-full text-[11px]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="input-newsletter-email"
            />
          </div>

          {error && <p className="text-red-600 text-[10px] mb-2">{error}</p>}

          <div className="flex justify-end gap-2">
            <Win95Button onClick={handleSubmit} data-testid="button-subscribe">Subscribe</Win95Button>
            <Win95Button onClick={onClose} data-testid="button-cancel">Cancel</Win95Button>
          </div>
        </div>
      </div>
    </div>
  );
}
