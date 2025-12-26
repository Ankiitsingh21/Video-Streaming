import { useState } from 'react';
import StatusBadge from '../Common/StatusBadge';
import VideoPlayer from './VideoPlayer';
import { formatFileSize, formatDate } from '../../utils/helpers';

const VideoCard = ({ video }) => {
  const [showPlayer, setShowPlayer] = useState(false);

  const handlePlay = () => {
    if (video.status === 'processed') {
      setShowPlayer(true);
    }
  };

  return (
    <>
      <div className="card hover:shadow-lg transition-shadow duration-300">
        {/* Video Thumbnail / Placeholder */}
        <div 
          className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 overflow-hidden cursor-pointer group"
          onClick={handlePlay}
        >
          {/* Play Button Overlay */}
          {video.status === 'processed' && (
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-lg">
                <svg className="w-8 h-8 text-primary-600 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            </div>
          )}

          {/* Processing Overlay */}
          {video.status === 'processing' && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-white font-medium">Processing...</p>
              <p className="text-white text-sm mt-1">{video.progress}%</p>
            </div>
          )}

          {/* Center Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          {/* Progress Bar */}
          {video.status === 'processing' && (
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-200">
              <div 
                className="h-full bg-primary-600 transition-all duration-500"
                style={{ width: `${video.progress}%` }}
              ></div>
            </div>
          )}
        </div>

        {/* Video Info */}
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {video.title}
            </h3>
            {video.description && (
              <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                {video.description}
              </p>
            )}
          </div>

          <StatusBadge 
            status={video.status} 
            sensitivity={video.sensitivityResult} 
          />

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t">
            <span>{formatFileSize(video.size)}</span>
            <span>{formatDate(video.createdAt)}</span>
          </div>

          {/* Action Button */}
          {video.status === 'processed' && (
            <button
              onClick={handlePlay}
              className="w-full btn-primary mt-2"
            >
              Watch Video
            </button>
          )}

          {video.status === 'failed' && (
            <div className="text-center py-2 text-red-600 text-sm font-medium">
              Processing failed. Please try uploading again.
            </div>
          )}
        </div>
      </div>

      {/* Video Player Modal */}
      {showPlayer && (
        <VideoPlayer 
          video={video} 
          onClose={() => setShowPlayer(false)} 
        />
      )}
    </>
  );
};

export default VideoCard;