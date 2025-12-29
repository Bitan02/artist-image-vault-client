import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { postAPI } from '../services/api';
import ImageCard from '../components/ImageCard';

const Landing = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch random posts for landing page (public feed)
    postAPI
      .getFeed()
      .then((res) => {
        // Shuffle and take first 12
        const shuffled = res.data.posts.sort(() => 0.5 - Math.random());
        setPosts(shuffled.slice(0, 12));
      })
      .catch(() => {
        // If not authenticated, just show empty state
        setPosts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Creative Showcase
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Share your art. Preserve your memories.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/signup"
              className="bg-blue-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-300 transition"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Image Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="text-xl text-gray-500">Loading...</div>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {posts.map((post) => (
              <ImageCard key={post._id || post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No images yet. Be the first to share!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Landing;

