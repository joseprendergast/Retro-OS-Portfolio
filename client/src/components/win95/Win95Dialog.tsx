import Win95Button from './Win95Button';

interface Win95DialogProps {
  title: string;
  icon?: string;
  message: string;
  buttons?: { label: string; action: () => void; primary?: boolean }[];
  onClose: () => void;
}

export default function Win95Dialog({
  title,
  icon = '❓',
  message,
  buttons = [{ label: 'OK', action: () => {}, primary: true }],
  onClose,
}: Win95DialogProps) {
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="win95-window relative min-w-[300px] max-w-[400px]" data-testid="dialog">
        {/* Title Bar */}
        <div className="win95-title-active h-[20px] flex items-center justify-between">
          <span className="text-[11px] truncate">{title}</span>
          <button
            className="win95-button w-[16px] h-[14px] min-w-0 p-0 flex items-center justify-center text-[10px]"
            onClick={onClose}
            data-testid="button-dialog-close"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex gap-4">
          <span className="text-[32px]">{icon}</span>
          <p className="text-[11px] flex-1">{message}</p>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-2 p-3 pt-0">
          {buttons.map((btn, i) => (
            <Win95Button
              key={i}
              onClick={() => {
                btn.action();
                onClose();
              }}
              data-testid={`button-dialog-${btn.label.toLowerCase()}`}
            >
              {btn.label}
            </Win95Button>
          ))}
        </div>
      </div>
    </div>
  );
}
