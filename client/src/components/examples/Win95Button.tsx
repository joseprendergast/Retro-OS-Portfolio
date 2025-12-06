import Win95Button from '../win95/Win95Button';

export default function Win95ButtonExample() {
  return (
    <div className="flex gap-2 p-4 bg-[#c0c0c0]">
      <Win95Button data-testid="button-ok">OK</Win95Button>
      <Win95Button data-testid="button-cancel">Cancel</Win95Button>
      <Win95Button pressed data-testid="button-pressed">Pressed</Win95Button>
      <Win95Button small data-testid="button-small">X</Win95Button>
    </div>
  );
}
