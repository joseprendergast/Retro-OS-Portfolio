import DisplaySettings from '../win95/DisplaySettings';

export default function DisplaySettingsExample() {
  return (
    <div className="w-[300px] h-[350px] win95-window">
      <DisplaySettings onClose={() => console.log('Settings closed')} />
    </div>
  );
}
