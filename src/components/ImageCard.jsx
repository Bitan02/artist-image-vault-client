import { Link } from 'react-router-dom';

const ImageCard = ({ post }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/profile/${post.username}`}>
        <div className="p-3 border-b border-gray-200">
          <p className="font-semibold text-gray-900">{post.username}</p>
        </div>
      </Link>
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={post.imageUrl}
          alt={`Post by ${post.username}`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3">
        {post.description && (
          <p className="text-sm text-gray-800 mb-2 line-clamp-2">{post.description}</p>
        )}
        <p className="text-sm text-gray-500">
          {new Date(post.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </p>
      </div>
    </div>
  );
};

export default ImageCard;

