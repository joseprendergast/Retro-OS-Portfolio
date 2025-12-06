import NewsletterDialog from '../win95/NewsletterDialog';

export default function NewsletterDialogExample() {
  return (
    <div className="relative w-full h-[300px] bg-[#008080]">
      <NewsletterDialog onClose={() => console.log('Dialog closed')} />
    </div>
  );
}
