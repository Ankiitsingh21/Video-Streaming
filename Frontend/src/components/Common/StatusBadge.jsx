const StatusBadge = ({ status, sensitivity }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'uploaded':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 animate-pulse';
      case 'processed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSensitivityStyles = () => {
    switch (sensitivity) {
      case 'safe':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'flagged':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'unknown':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'uploaded':
        return '📤';
      case 'processing':
        return '⚙️';
      case 'processed':
        return '✅';
      case 'failed':
        return '❌';
      default:
        return '❓';
    }
  };

  const getSensitivityIcon = () => {
    switch (sensitivity) {
      case 'safe':
        return '✅';
      case 'flagged':
        return '🚩';
      case 'unknown':
        return '❓';
      default:
        return '❓';
    }
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyles()}`}>
        <span>{getStatusIcon()}</span>
        {status}
      </span>
      
      {sensitivity && sensitivity !== 'unknown' && (
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getSensitivityStyles()}`}>
          <span>{getSensitivityIcon()}</span>
          {sensitivity}
        </span>
      )}
    </div>
  );
};

export default StatusBadge;