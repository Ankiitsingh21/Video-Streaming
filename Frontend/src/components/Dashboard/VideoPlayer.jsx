import { useEffect, useRef } from 'react';
import { videoAPI } from '../../services/api';
import StatusBadge from '../Common/StatusBadge';

const VideoPlayer = ({ video, onClose }) => {
  const videoRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    // Close on Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (modalRef.current === e.target) {
      onClose();
    }
  };

  const streamUrl = videoAPI.getStreamUrl(video._id);

  return (
    <div 
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 animate-fade-in"
    >
      <div className="max-w-5xl w-full bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gray-800 px-6 py-4 flex items-center justify-between">
          <div className="flex-1 mr-4">
            <h2 className="text-xl font-semibold text-white line-clamp-1">
              {video.title}
            </h2>
            {video.description && (
              <p className="text-sm text-gray-400 mt-1 line-clamp-1">
                {video.description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Video Player */}
        <div className="relative bg-black" style={{ paddingTop: '56.25%' }}>
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full"
            controls
            autoPlay
            src={streamUrl}
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Footer */}
        <div className="bg-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <StatusBadge 
              status={video.status} 
              sensitivity={video.sensitivityResult} 
            />
            
            <div className="text-sm text-gray-400">
              Uploaded {new Date(video.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;