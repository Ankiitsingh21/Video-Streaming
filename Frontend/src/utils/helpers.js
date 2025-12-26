// Format file size
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${Math.round(bytes / Math.pow(k, i) * 100) / 100} ${sizes[i]}`;
};

// Format duration
export const formatDuration = (seconds) => {
  if (!seconds) return '0:00';
  
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// Format date
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Validate video file
export const validateVideoFile = (file) => {
  const allowedTypes = ['video/mp4', 'video/webm', 'video/mkv'];
  const maxSize = 200 * 1024 * 1024; // 200MB
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Only MP4, WebM, and MKV are allowed.' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File size exceeds 200MB limit.' };
  }
  
  return { valid: true };
};

// Get status color
export const getStatusColor = (status) => {
  const colors = {
    uploaded: 'blue',
    processing: 'yellow',
    processed: 'green',
    failed: 'red'
  };
  return colors[status] || 'gray';
};

// Get sensitivity color
export const getSensitivityColor = (result) => {
  const colors = {
    safe: 'green',
    flagged: 'red',
    unknown: 'gray'
  };
  return colors[result] || 'gray';
};