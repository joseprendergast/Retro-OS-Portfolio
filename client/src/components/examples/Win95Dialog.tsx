import Win95Dialog from '../win95/Win95Dialog';

export default function Win95DialogExample() {
  return (
    <div className="relative w-full h-[200px] bg-[#008080] flex items-center justify-center">
      <Win95Dialog
        title="Confirm"
        icon="⚠️"
        message="Are you sure you want to delete this file?"
        buttons={[
          { label: 'Yes', action: () => console.log('Yes clicked') },
          { label: 'No', action: () => console.log('No clicked'), primary: true },
        ]}
        onClose={() => console.log('Dialog closed')}
      />
    </div>
  );
}
