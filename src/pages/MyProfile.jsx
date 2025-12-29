import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ImageCard from '../components/ImageCard';

const MyProfile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const [userRes, postsRes] = await Promise.all([
        userAPI.getMe(),
        postAPI.getPostsByUsername(user.username),
      ]);
      setProfileData(userRes.data);
      setPosts(postsRes.data.posts);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size must be less than 10MB');
      return;
    }

    setSelectedFile(file);
    setUploadError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setUploadError('Please select an image file');
      return;
    }

    try {
      setUploading(true);
      setUploadError('');
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('description', description || '');

      await postAPI.uploadImage(formData);
      // Refresh posts
      const postsRes = await postAPI.getPostsByUsername(user.username);
      setPosts(postsRes.data.posts);
      
      // Reset form
      setSelectedFile(null);
      setDescription('');
      const fileInput = document.getElementById('image-upload');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      setUploadError(
        err.response?.data?.message || 'Failed to upload image. Please try again.'
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      await postAPI.deletePost(postId);
      setPosts(posts.filter((post) => (post._id || post.id) !== postId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete post');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {profileData?.user?.username}
          </h1>
          <p className="text-gray-600">{profileData?.user?.email}</p>
          <p className="text-gray-600 mt-2">
            {profileData?.postCount || 0} {profileData?.postCount === 1 ? 'post' : 'posts'}
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Image</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-2">
                Select Image
              </label>
              <label className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition">
                <div className="text-center">
                  {selectedFile ? (
                    <div className="text-blue-600 font-medium">{selectedFile.name}</div>
                  ) : (
                    <div>
                      <span className="text-gray-600">Click to select an image</span>
                      <span className="text-gray-400 text-sm block mt-1">or drag and drop</span>
                    </div>
                  )}
                </div>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description (optional)
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description to your image..."
                maxLength={500}
                rows={3}
                disabled={uploading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:bg-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                {description.length}/500 characters
              </p>
            </div>
            {uploadError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {uploadError}
              </div>
            )}
            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
          </form>
        </div>

        {/* Posts Grid */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">My Posts</h2>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {posts.map((post) => (
              <div key={post._id || post.id} className="relative group">
                <ImageCard post={post} />
                <button
                  onClick={() => handleDelete(post._id || post.id)}
                  className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-lg">No posts yet. Upload your first image!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;

