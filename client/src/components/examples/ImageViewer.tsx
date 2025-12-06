import ImageViewer from '../win95/ImageViewer';
import crtImage from '@assets/generated_images/90s_crt_computer_setup.png';

export default function ImageViewerExample() {
  return (
    <div className="w-full h-[300px] win95-window">
      <ImageViewer src={crtImage} title="90s_computer.png" />
    </div>
  );
}
