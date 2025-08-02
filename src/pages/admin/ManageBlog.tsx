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
    loadBlogs();
  }, [currentPage, searchTerm]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined
      };

      console.log('📡 Loading blogs with params:', params);
      const response = await apiService.admin.getBlogs(params);
      console.log('📡 Blog API response:', response);
      
      if (response.data.success) {
        setBlogs(response.data.blogs || []);
        setPagination(response.data.pagination || { current: 1, pages: 1, total: 0 });
        console.log('✅ Blogs loaded successfully:', response.data.blogs?.length || 0);
      } else {
        setError('Failed to load blogs - API returned success=false');
        console.error('❌ API returned success=false:', response.data);
      }
    } catch (error) {
      console.error('❌ Error loading blogs:', error);
      setError(`Error loading blogs: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // If it's a network error, provide more details
      if (error instanceof Error && error.message.includes('Network Error')) {
        setError('Network error - please check if the backend server is running on port 5001');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
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
    setImageFile(null);
    setImagePreview('');
    setEditingBlog(null);
    setShowForm(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return '';

    try {
      setUploading(true);
      const formDataUpload = new FormData();
      formDataUpload.append('image', imageFile);

      const response = await apiService.admin.uploadBlogImage(formDataUpload);
      
      if (response.data.success) {
        return response.data.imageUrl;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('📝 Submitting blog form with data:', formData);
      
      let imageUrl = formData.imageUrl;
      
      // Upload image if file is selected
      if (uploadMethod === 'file' && imageFile) {
        console.log('📤 Uploading image file...');
        imageUrl = await handleImageUpload();
        if (!imageUrl) {
          alert('Failed to upload image');
          return;
        }
        console.log('✅ Image uploaded successfully:', imageUrl);
      }

      const blogData = {
        ...formData,
        imageUrl: imageUrl || undefined,
        tags: typeof formData.tags === 'string' 
          ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
          : formData.tags
      };

      console.log('📝 Final blog data to submit:', blogData);

      let response;
      if (editingBlog) {
        console.log('✏️ Updating existing blog:', editingBlog._id);
        response = await apiService.admin.updateBlog(editingBlog._id, blogData);
      } else {
        console.log('➕ Creating new blog');
        response = await apiService.admin.createBlog(blogData);
      }

      console.log('✅ Blog save response:', response);

      if (response.data.success) {
        resetForm();
        console.log('🔄 Reloading blogs list...');
        await loadBlogs();
        alert(editingBlog ? 'Blog updated successfully!' : 'Blog created successfully!');
      } else {
        console.error('❌ Blog save failed:', response.data);
        alert(`Failed to save blog: ${response.data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('❌ Error saving blog:', error);
      alert(`Failed to save blog: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEdit = async (blog: Blog) => {
    try {
      // Fetch full blog data including content
      const response = await apiService.admin.getBlog(blog._id);
      
      if (response.data.success) {
        const fullBlog = response.data.blog;
        setEditingBlog(fullBlog);
        setFormData({
          title: fullBlog.title,
          content: fullBlog.content,
          author: fullBlog.author,
          category: fullBlog.category,
          tags: Array.isArray(fullBlog.tags) ? fullBlog.tags.join(', ') : fullBlog.tags,
          imageUrl: fullBlog.imageUrl || '',
          blogUrl: fullBlog.blogUrl || '',
          isPublished: fullBlog.isPublished,
          isFeatured: fullBlog.isFeatured
        });
        setImagePreview(fullBlog.imageUrl || '');
        setShowForm(true);
      }
    } catch (error) {
      console.error('Error fetching blog for edit:', error);
      alert('Failed to load blog for editing');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await apiService.admin.deleteBlog(id);
        loadBlogs();
      } catch (error) {
        console.error('Error deleting blog:', error);
        alert('Failed to delete blog');
      }
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadBlogs();
  };

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
      {/* Back Button */}
      <div className="mb-6">
        <Link
          to="/admin"
          className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Blog Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Blog
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search blogs..."
              className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
            />
          </div>
          <button
            type="submit"
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            Search
          </button>
        </div>
      </form>

      {/* Blog Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingBlog ? 'Edit Blog' : 'Create New Blog'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>

                {/* Author */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Author *
                  </label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  >
                    {CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="cybersecurity, hacking, tutorial"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>

                {/* Blog URL */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Blog URL (External Link)
                  </label>
                  <input
                    type="url"
                    name="blogUrl"
                    value={formData.blogUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/blog-post"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    If provided, clicking on this blog will redirect to this URL instead of showing content
                  </p>
                </div>

                {/* Image Upload */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Blog Image
                  </label>
                  <div className="space-y-3">
                    {/* Upload Method Toggle */}
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => setUploadMethod('file')}
                        className={`px-3 py-1 rounded text-sm ${
                          uploadMethod === 'file'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        Upload File
                      </button>
                      <button
                        type="button"
                        onClick={() => setUploadMethod('url')}
                        className={`px-3 py-1 rounded text-sm ${
                          uploadMethod === 'url'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300'
                        }`}
                      >
                        Image URL
                      </button>
                    </div>

                    {uploadMethod === 'file' ? (
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white file:mr-4 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                        />
                      </div>
                    ) : (
                      <input
                        type="url"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                      />
                    )}

                    {/* Image Preview */}
                    {(imagePreview || formData.imageUrl) && (
                      <div className="mt-2">
                        <img
                          src={imagePreview || formData.imageUrl}
                          alt="Preview"
                          className="w-32 h-20 object-cover rounded border border-gray-600"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Content *
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    placeholder="Write your blog content here..."
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>

                {/* Options */}
                <div className="md:col-span-2 flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isPublished"
                      checked={formData.isPublished}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-gray-300">Published</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-gray-300">Featured</span>
                  </label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {editingBlog ? 'Update' : 'Create'} Blog
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Blog List */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="mb-4">No blogs found</div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Create your first blog
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                    Blog
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                    Stats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {blog.imageUrl && (
                          <img
                            src={blog.imageUrl}
                            alt={blog.title}
                            className="w-10 h-10 rounded object-cover mr-3"
                          />
                        )}
                        <div>
                          <div className="font-medium text-white">
                            {blog.title}
                            {blog.isFeatured && (
                              <Star className="inline w-4 h-4 text-yellow-500 ml-1" />
                            )}
                          </div>
                          <div className="text-sm text-gray-400">
                            {blog.content ? 
                              (blog.content.substring(0, 50) + (blog.content.length > 50 ? '...' : ''))
                              : 'No content preview available'
                            }
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {blog.author}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      {blog.category}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        blog.isPublished
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {blog.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      <div className="flex space-x-2">
                        <span className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {blog.views}
                        </span>
                        <span className="flex items-center">
                          <Heart className="w-4 h-4 mr-1" />
                          {blog.likes}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-300">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(blog)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {blog.blogUrl && (
                          <a
                            href={blog.blogUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-400 hover:text-green-300"
                          >
                            <Eye className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogManagement;
