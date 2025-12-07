export default function StarcraftGame() {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', margin: 0, padding: 0 }}>
      <iframe 
        src="https://www.retrogames.cc/embed/32178-starcraft-64-usa.html"
        width="100%"
        height="100%"
        style={{ border: 'none', margin: 0, padding: 0, overflow: 'hidden' }}
        frameBorder="0"
        allowFullScreen={true}
        scrolling="no"
      />
    </div>
  );
}
