import React, { useState, useEffect } from 'react';
import { Search, Calendar, User, Clock, Tag, Eye, Heart, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { apiService } from '../services/api';

interface Blog {
  _id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  blogUrl?: string;
  readTime: number;
  views: number;
  likes: number;
  createdAt: string;
  isFeatured: boolean;
}

const BlogCard: React.FC<{ blog: Blog; onClick: () => void }> = ({ blog, onClick }) => {
  const [liked, setLiked] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (liked) return;
    
    try {
      await apiService.blogs.like(blog._id);
      setLiked(true);
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group"
    >
      {/* Blog Image */}
      <div className="relative h-48 overflow-hidden">
        {blog.imageUrl ? (
          <img
            src={blog.imageUrl}
            alt={blog.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <div className="text-white text-6xl font-bold opacity-20">
              {blog.title.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
        
        {/* Featured Badge */}
        {blog.isFeatured && (
          <div className="absolute top-3 left-3 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-semibold">
            Featured
          </div>
        )}
        
        {/* Category */}
        <div className="absolute top-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
          {blog.category}
        </div>
      </div>

      {/* Blog Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors flex items-center">
          {blog.title}
          {blog.blogUrl && (
            <ExternalLink className="w-4 h-4 ml-2 text-blue-400 flex-shrink-0" />
          )}
        </h3>

        {/* Content Preview */}
        <p className="text-gray-300 mb-4 line-clamp-3 text-sm leading-relaxed">
          {blog.content}
        </p>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs flex items-center"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
            {blog.tags.length > 3 && (
              <span className="text-gray-400 text-xs">+{blog.tags.length - 3} more</span>
            )}
          </div>
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              {blog.author}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {blog.readTime} min
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              {blog.views}
            </div>
            <button
              onClick={handleLike}
              className={`flex items-center transition-colors ${
                liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart className={`w-4 h-4 mr-1 ${liked ? 'fill-current' : ''}`} />
              {blog.likes + (liked ? 1 : 0)}
            </button>
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center text-xs text-gray-500 mt-3 pt-3 border-t border-gray-700">
          <Calendar className="w-4 h-4 mr-1" />
          {new Date(blog.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      </div>
    </div>
  );
};

const BlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0,
    hasNext: false,
    hasPrev: false
  });

  const blogsPerPage = 9;

  useEffect(() => {
    loadBlogs();
    loadCategories();
  }, [currentPage, searchTerm, selectedCategory]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: blogsPerPage,
        search: searchTerm || undefined,
        category: selectedCategory !== 'all' ? selectedCategory : undefined
      };

      const response = await apiService.blogs.getAll(params);
      
      if (response.data.success) {
        setBlogs(response.data.blogs);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error loading blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await apiService.blogs.getCategories();
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadBlogs();
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleBlogClick = (blog: Blog) => {
    // If blog has a URL, redirect to external URL
    if (blog.blogUrl) {
      window.open(blog.blogUrl, '_blank', 'noopener,noreferrer');
    } else {
      // For now, we'll just log the click for internal blogs. In a real app, you'd navigate to the blog detail page
      console.log('Navigate to internal blog:', blog._id);
      // In React Router, you'd do: navigate(`/blog/${blog._id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            CyberPiT <span className="text-blue-400">Blog</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore the latest insights, research, and discoveries in cybersecurity, 
            penetration testing, and ethical hacking.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search blogs by title, content, or tags..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* No Results */}
        {!loading && blogs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-white mb-2">No blogs found</h3>
            <p className="text-gray-400">
              {searchTerm || selectedCategory !== 'all'
                ? 'Try adjusting your search criteria or filters.'
                : 'Check back later for new content.'}
            </p>
          </div>
        )}

        {/* Blog Grid */}
        {!loading && blogs.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {blogs.map((blog) => (
                <BlogCard
                  key={blog._id}
                  blog={blog}
                  onClick={() => handleBlogClick(blog)}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center items-center space-x-4">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="flex items-center px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>

                <div className="flex items-center space-x-2">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        page === currentPage
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="flex items-center px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            )}
          </>
        )}

        {/* Results Summary */}
        {!loading && blogs.length > 0 && (
          <div className="text-center mt-8 text-gray-400">
            Showing {blogs.length} of {pagination.total} blogs
            {searchTerm && ` for "${searchTerm}"`}
            {selectedCategory !== 'all' && ` in ${selectedCategory}`}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
