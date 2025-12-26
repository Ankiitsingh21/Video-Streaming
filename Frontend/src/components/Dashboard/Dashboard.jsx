import { useState, useEffect } from 'react';
import { videoAPI } from '../../services/api';
import socketService from '../../services/socket';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../Layout/Navbar';
import VideoCard from './VideoCard';
import UploadModal from './UploadModal';
import LoadingSpinner from '../Common/LoadingSpinner';

const Dashboard = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const { isEditor } = useAuth();

  useEffect(() => {
    fetchVideos();
    setupSocketListeners();

    return () => {
      socketService.off('video:progress');
      socketService.off('video:done');
    };
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await videoAPI.getVideos();
      setVideos(response.data.videos);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupSocketListeners = () => {
    socketService.on('video:progress', (data) => {
      setVideos((prev) =>
        prev.map((v) =>
          v._id === data.videoId
            ? { ...v, progress: data.progress }
            : v
        )
      );
    });

    socketService.on('video:done', (data) => {
      setVideos((prev) =>
        prev.map((v) =>
          v._id === data.videoId
            ? {
                ...v,
                status: 'processed',
                progress: 100,
                sensitivityResult: data.sensitivityResult
              }
            : v
        )
      );
    });
  };

  const handleUploadSuccess = () => {
    fetchVideos();
  };

  const filteredVideos = videos.filter((video) => {
    if (filter === 'all') return true;
    if (filter === 'processing') return video.status === 'processing';
    if (filter === 'processed') return video.status === 'processed';
    if (filter === 'safe') return video.sensitivityResult === 'safe';
    if (filter === 'flagged') return video.sensitivityResult === 'flagged';
    return true;
  });

  const stats = {
    total: videos.length,
    processing: videos.filter((v) => v.status === 'processing').length,
    processed: videos.filter((v) => v.status === 'processed').length,
    safe: videos.filter((v) => v.sensitivityResult === 'safe').length,
    flagged: videos.filter((v) => v.sensitivityResult === 'flagged').length
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Video Library</h1>
            <p className="text-gray-600 mt-1">Manage and stream your videos</p>
          </div>

          {isEditor() && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Upload Video
            </button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div 
            onClick={() => setFilter('all')}
            className={`card cursor-pointer transition-all ${filter === 'all' ? 'ring-2 ring-primary-500' : 'hover:shadow-lg'}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Videos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              </div>
            </div>
          </div>

          <div 
            onClick={() => setFilter('processing')}
            className={`card cursor-pointer transition-all ${filter === 'processing' ? 'ring-2 ring-yellow-500' : 'hover:shadow-lg'}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.processing}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600 animate-spin" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div 
            onClick={() => setFilter('processed')}
            className={`card cursor-pointer transition-all ${filter === 'processed' ? 'ring-2 ring-green-500' : 'hover:shadow-lg'}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Processed</p>
                <p className="text-2xl font-bold text-green-600">{stats.processed}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div 
            onClick={() => setFilter('safe')}
            className={`card cursor-pointer transition-all ${filter === 'safe' ? 'ring-2 ring-green-500' : 'hover:shadow-lg'}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Safe</p>
                <p className="text-2xl font-bold text-green-600">{stats.safe}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div 
            onClick={() => setFilter('flagged')}
            className={`card cursor-pointer transition-all ${filter === 'flagged' ? 'ring-2 ring-red-500' : 'hover:shadow-lg'}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Flagged</p>
                <p className="text-2xl font-bold text-red-600">{stats.flagged}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Videos Grid */}
        {filteredVideos.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No videos found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'Upload your first video to get started' 
                : `No videos match the "${filter}" filter`}
            </p>
            {isEditor() && filter === 'all' && (
              <button
                onClick={() => setShowUploadModal(true)}
                className="btn-primary"
              >
                Upload Your First Video
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
};

export default Dashboard;