import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Edit, Trash2, Eye, Search,
  Save, X, Heart, Star, ArrowLeft
} from 'lucide-react';
import { apiService } from '../../services/api';

interface Blog {
  _id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  blogUrl?: string;
  isPublished: boolean;
  isFeatured: boolean;
  readTime: number;
  views: number;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

const CATEGORIES = [
  'Web Security', 'Network Security', 'Penetration Testing', 
  'Malware Analysis', 'CTF', 'Research', 'Tools', 'Other'
];

const BlogManagement: React.FC = () => {
  console.log('🚀 BlogManagement component rendering...');
  
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    category: 'Web Security',
    tags: '',
    imageUrl: '',
    blogUrl: '',
    isPublished: false,
    isFeatured: false
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');

  useEffect(() => {
    console.log('🔄 UseEffect triggered - loading blogs...');
    loadBlogs();
  }, [currentPage, searchTerm]);

  const loadBlogs = async () => {
    try {
      console.log('📡 Loading blogs...');
      setLoading(true);
      setError(null);
      
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined
      };

      console.log('📡 API request params:', params);
      const response = await apiService.admin.getBlogs(params);
      console.log('📡 API response:', response);
      
      if (response.data.success) {
        setBlogs(response.data.blogs);
        setPagination(response.data.pagination);
        console.log('✅ Blogs loaded successfully:', response.data.blogs.length);
      } else {
        setError('Failed to load blogs');
        console.error('❌ API returned success=false');
      }
    } catch (error) {
      console.error('❌ Error loading blogs:', error);
      setError(`Error loading blogs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  console.log('🎯 About to render BlogManagement component');

  // If there's an error, show it
  if (error) {
    return (
      <div className="p-6 pt-24">
        <div className="mb-6">
          <Link
            to="/admin"
            className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
        <div className="bg-red-600 text-white p-4 rounded-lg">
          <h2 className="font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button
            onClick={() => {
              setError(null);
              loadBlogs();
            }}
            className="mt-2 bg-red-700 hover:bg-red-800 px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pt-24">
      <div className="text-white">
        <h1 className="text-2xl font-bold mb-4">Blog Management - Debug Version</h1>
        <div className="mb-4 p-4 bg-gray-800 rounded">
          <p>Component is rendering successfully!</p>
          <p>Loading: {loading ? 'Yes' : 'No'}</p>
          <p>Blogs count: {blogs.length}</p>
          <p>Error: {error || 'None'}</p>
        </div>
        
        <div className="mt-4">
          <Link
            to="/admin"
            className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
        
        {loading && (
          <div className="mt-4 p-4 bg-gray-800 rounded">
            Loading blogs...
          </div>
        )}
        
        {!loading && blogs.length === 0 && (
          <div className="mt-4 p-4 bg-gray-800 rounded">
            No blogs found
          </div>
        )}
        
        {!loading && blogs.length > 0 && (
          <div className="mt-4 p-4 bg-gray-800 rounded">
            <h2>Blogs ({blogs.length})</h2>
            {blogs.map(blog => (
              <div key={blog._id} className="p-2 border-b border-gray-700">
                {blog.title}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogManagement;
