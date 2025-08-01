import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, UploadIcon, SmartphoneIcon, MonitorIcon, TrashIcon, CheckIcon } from 'lucide-react';
import { apiService } from '../../services/api';

interface Video {
  _id: string;
  name: string;
  type: 'desktop' | 'mobile';
  filename: string;
  originalName: string;
  size: number;
  isActive: boolean;
  createdAt: string;
}

const ManageVideos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState({ desktop: false, mobile: false });
  const [selectedFiles, setSelectedFiles] = useState({ desktop: null as File | null, mobile: null as File | null });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('No authentication token found. Please login again.');
        return;
      }

      const response = await apiService.admin.getVideos();
      setVideos(response.data.videos || []);
      setError(''); // Clear any previous errors
    } catch (error: any) {
      console.error('Error loading videos:', error);
      if (error.response?.status === 401) {
        setError('Authentication failed. Please login again.');
        // Clear invalid token
        localStorage.removeItem('adminToken');
      } else {
        setError(error.response?.data?.message || 'Failed to load videos');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file: File | null, type: 'desktop' | 'mobile') => {
    setSelectedFiles(prev => ({ ...prev, [type]: file }));
    setError('');
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        setError('Please select a valid video file');
        setSelectedFiles(prev => ({ ...prev, [type]: null }));
        return;
      }

      // Validate file size (150MB max)
      if (file.size > 150 * 1024 * 1024) {
        setError('File size must be less than 150MB');
        setSelectedFiles(prev => ({ ...prev, [type]: null }));
        return;
      }
    }
  };

  const handleFileUpload = async (type: 'desktop' | 'mobile') => {
    const file = selectedFiles[type];
    if (!file) return;

    const token = localStorage.getItem('adminToken');
    if (!token) {
      setError('No authentication token found. Please login again.');
      return;
    }

    setUploading(prev => ({ ...prev, [type]: true }));
    setError('');
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('video', file);
      formData.append('type', type);
      formData.append('name', `${type} Video`);

      await apiService.admin.uploadVideo(formData);
      setMessage(`${type} video uploaded successfully!`);
      setSelectedFiles(prev => ({ ...prev, [type]: null })); // Clear selected file
      loadVideos(); // Reload videos
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      console.error('Upload error:', error);
      if (error.response?.status === 401) {
        setError('Authentication failed. Please login again.');
        localStorage.removeItem('adminToken');
      } else {
        setError(error.response?.data?.message || `Failed to upload ${type} video`);
      }
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleDelete = async (videoId: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      await apiService.admin.deleteVideo(videoId);
      setMessage('Video deleted successfully!');
      loadVideos();
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to delete video');
    }
  };

  const getActiveVideo = (type: 'desktop' | 'mobile') => {
    return videos.find(video => video.type === type && video.isActive);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <Link to="/admin" className="mr-4 p-2 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors">
            <ArrowLeftIcon className="h-5 w-5 text-gray-300" />
          </Link>
          <h1 className="text-3xl font-bold text-white">Manage Videos</h1>
        </div>

        {/* Status Messages */}
        {message && (
          <div className="mb-6 bg-green-900/30 border border-green-500 rounded-lg p-4">
            <div className="flex items-center">
              <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-green-300">{message}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-900/30 border border-red-500 rounded-lg p-4">
            <span className="text-red-300">{error}</span>
          </div>
        )}

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">
            Home Page Videos
          </h2>
          <p className="text-gray-300 mb-6">
            Upload videos for the home page background. Different videos will be shown for desktop and mobile devices.
            Videos are stored in the public/video folder and will replace the current active videos.
          </p>

          {loading ? (
            <div className="text-center py-8">
              <div className="text-gray-400">Loading videos...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Desktop Video */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <MonitorIcon className="h-6 w-6 text-gray-400 mr-2" />
                  <h3 className="text-lg font-medium text-white">Desktop Video</h3>
                </div>
                
                {getActiveVideo('desktop') && (
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-white font-medium">{getActiveVideo('desktop')!.name}</p>
                        <p className="text-gray-400 text-sm">{formatFileSize(getActiveVideo('desktop')!.size)}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(getActiveVideo('desktop')!._id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded"
                        title="Delete video"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <video 
                      src={`/video/${getActiveVideo('desktop')!.filename}`} 
                      className="w-full h-auto rounded" 
                      controls 
                      muted
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Upload New Desktop Video
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        handleFileSelect(file, 'desktop');
                      }}
                      disabled={uploading.desktop}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    
                    {selectedFiles.desktop && (
                      <div className="bg-gray-700 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white text-sm font-medium">{selectedFiles.desktop.name}</p>
                            <p className="text-gray-400 text-xs">{formatFileSize(selectedFiles.desktop.size)}</p>
                          </div>
                          <button
                            onClick={() => handleFileUpload('desktop')}
                            disabled={uploading.desktop}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white text-sm rounded-md flex items-center transition-colors"
                          >
                            {uploading.desktop ? (
                              <>
                                <UploadIcon className="h-4 w-4 mr-2 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <UploadIcon className="h-4 w-4 mr-2" />
                                Upload Video
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {uploading.desktop && (
                      <div className="mt-2 flex items-center">
                        <UploadIcon className="h-4 w-4 text-blue-500 mr-2 animate-spin" />
                        <span className="text-blue-400 text-sm">Uploading desktop video...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Mobile Video */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <SmartphoneIcon className="h-6 w-6 text-gray-400 mr-2" />
                  <h3 className="text-lg font-medium text-white">Mobile Video</h3>
                </div>
                
                {getActiveVideo('mobile') && (
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-white font-medium">{getActiveVideo('mobile')!.name}</p>
                        <p className="text-gray-400 text-sm">{formatFileSize(getActiveVideo('mobile')!.size)}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(getActiveVideo('mobile')!._id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded"
                        title="Delete video"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <video 
                      src={`/video/${getActiveVideo('mobile')!.filename}`} 
                      className="w-full h-auto rounded" 
                      controls 
                      muted
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Upload New Mobile Video
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        handleFileSelect(file, 'mobile');
                      }}
                      disabled={uploading.mobile}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    
                    {selectedFiles.mobile && (
                      <div className="bg-gray-700 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white text-sm font-medium">{selectedFiles.mobile.name}</p>
                            <p className="text-gray-400 text-xs">{formatFileSize(selectedFiles.mobile.size)}</p>
                          </div>
                          <button
                            onClick={() => handleFileUpload('mobile')}
                            disabled={uploading.mobile}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white text-sm rounded-md flex items-center transition-colors"
                          >
                            {uploading.mobile ? (
                              <>
                                <UploadIcon className="h-4 w-4 mr-2 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <UploadIcon className="h-4 w-4 mr-2" />
                                Upload Video
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {uploading.mobile && (
                      <div className="mt-2 flex items-center">
                        <UploadIcon className="h-4 w-4 text-blue-500 mr-2 animate-spin" />
                        <span className="text-blue-400 text-sm">Uploading mobile video...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Video Management Tips
          </h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Videos should be optimized for web playback (H.264 codec recommended)</li>
            <li>Maximum file size is 150MB per video</li>
            <li>Desktop videos should be in landscape orientation (1920x1080 recommended)</li>
            <li>Mobile videos should be optimized for portrait viewing (1080x1920 recommended)</li>
            <li>New uploads will automatically replace the current active videos</li>
            <li>Videos are served from the /video path on your website</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManageVideos;
