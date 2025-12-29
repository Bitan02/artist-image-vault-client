import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { postAPI, userAPI } from '../services/api';
import ImageCard from '../components/ImageCard';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const [userRes, postsRes] = await Promise.all([
        userAPI.getUserByUsername(username),
        postAPI.getPostsByUsername(username),
      ]);
      setProfileUser(userRes.data.user);
      setPosts(postsRes.data.posts);
    } catch (err) {
      setError('Failed to load profile. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
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

  if (error || !profileUser) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-red-500">{error || 'User not found'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {profileUser.username}
          </h1>
          <p className="text-gray-600">
            Member since {new Date(profileUser.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
            })}
          </p>
          <p className="text-gray-600 mt-2">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {posts.map((post) => (
              <div key={post._id || post.id} className="relative group">
                <ImageCard post={post} />
                {isOwnProfile && (
                  <button
                    onClick={() => handleDelete(post._id || post.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-lg">No posts yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

