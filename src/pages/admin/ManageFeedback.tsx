import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
import { apiService } from '../../services/api';

interface Feedback {
  _id: string;
  name: string;
  email: string;
  role: string;
  workplace: string;
  comment: string;
  rating: number;
  featured: boolean;
  createdAt: string;
}

const ManageFeedback: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFeedback, setEditingFeedback] = useState<Feedback | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFeedback, setNewFeedback] = useState({
    name: '',
    email: '',
    role: '',
    workplace: '',
    comment: '',
    rating: 5,
    featured: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterByFeatured, setFilterByFeatured] = useState<'all' | 'featured' | 'not-featured'>('all');

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
      const response = await apiService.admin.getFeedbacks();
      setFeedbacks(response.data.feedbacks);
    } catch (error) {
      console.error('Error loading feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.admin.addFeedback(newFeedback);
      setNewFeedback({
        name: '',
        email: '',
        role: '',
        workplace: '',
        comment: '',
        rating: 5,
        featured: false
      });
      setShowAddForm(false);
      loadFeedbacks();
    } catch (error) {
      console.error('Error adding feedback:', error);
    }
  };

  const handleUpdateFeedback = async (id: string, updates: Partial<Feedback>) => {
    try {
      await apiService.admin.updateFeedback(id, updates);
      loadFeedbacks();
      setEditingFeedback(null);
    } catch (error) {
      console.error('Error updating feedback:', error);
    }
  };

  const handleDeleteFeedback = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this feedback?')) {
      try {
        await apiService.admin.deleteFeedback(id);
        loadFeedbacks();
      } catch (error) {
        console.error('Error deleting feedback:', error);
      }
    }
  };

  const toggleFeatured = async (feedback: Feedback) => {
    try {
      await apiService.admin.updateFeedback(feedback._id, { featured: !feedback.featured });
      loadFeedbacks();
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesSearch = feedback.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         feedback.comment.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterByFeatured === 'all' ||
                         (filterByFeatured === 'featured' && feedback.featured) ||
                         (filterByFeatured === 'not-featured' && !feedback.featured);
    
    return matchesSearch && matchesFilter;
  });

  const featuredCount = feedbacks.filter(f => f.featured).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center text-white">Loading feedbacks...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Link 
              to="/admin" 
              className="mr-4 p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="h-6 w-6 text-white" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Manage Feedback</h1>
              <p className="text-gray-300">
                Total: {feedbacks.length} | Featured: {featuredCount}/5
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Add Feedback
          </button>
        </div>

        {/* Search and Filter */}
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, or comment..."
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Status</label>
              <select
                value={filterByFeatured}
                onChange={(e) => setFilterByFeatured(e.target.value as 'all' | 'featured' | 'not-featured')}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Feedback</option>
                <option value="featured">Featured Only</option>
                <option value="not-featured">Not Featured</option>
              </select>
            </div>
          </div>
        </div>

        {/* Feedback List */}
        <div className="space-y-6">
          {filteredFeedbacks.map((feedback) => (
            <div key={feedback._id} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              {editingFeedback && editingFeedback._id === feedback._id ? (
                <EditFeedbackForm
                  feedback={editingFeedback}
                  onSave={(updates) => handleUpdateFeedback(feedback._id, updates)}
                  onCancel={() => setEditingFeedback(null)}
                />
              ) : (
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-xl font-semibold text-white">{feedback.name}</h3>
                        {feedback.featured && (
                          <span className="bg-yellow-600 text-yellow-100 px-2 py-1 rounded-full text-xs font-medium">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="text-gray-300 text-sm space-y-1">
                        <p><strong>Email:</strong> {feedback.email}</p>
                        {feedback.role && <p><strong>Role:</strong> {feedback.role}</p>}
                        {feedback.workplace && <p><strong>Workplace:</strong> {feedback.workplace}</p>}
                        <div className="flex items-center space-x-1">
                          <strong>Rating:</strong>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`h-4 w-4 ${i < feedback.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleFeatured(feedback)}
                        className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                          feedback.featured
                            ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                            : 'bg-gray-600 hover:bg-yellow-600 text-gray-300'
                        }`}
                        disabled={!feedback.featured && featuredCount >= 5}
                        title={!feedback.featured && featuredCount >= 5 ? 'Maximum 5 featured feedbacks allowed' : ''}
                      >
                        {feedback.featured ? 'Unfeature' : 'Feature'}
                      </button>
                      <button
                        onClick={() => setEditingFeedback(feedback)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteFeedback(feedback._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-gray-300 italic">"{feedback.comment}"</p>
                  </div>
                  <div className="text-gray-400 text-xs mt-2">
                    Created: {new Date(feedback.createdAt).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFeedbacks.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            No feedback found matching your criteria.
          </div>
        )}

        {/* Add Feedback Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-white mb-6">Add New Feedback</h2>
              <form onSubmit={handleAddFeedback}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
                    <input
                      type="text"
                      value={newFeedback.name}
                      onChange={(e) => setNewFeedback({...newFeedback, name: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                    <input
                      type="email"
                      value={newFeedback.email}
                      onChange={(e) => setNewFeedback({...newFeedback, email: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                    <input
                      type="text"
                      value={newFeedback.role}
                      onChange={(e) => setNewFeedback({...newFeedback, role: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Workplace</label>
                    <input
                      type="text"
                      value={newFeedback.workplace}
                      onChange={(e) => setNewFeedback({...newFeedback, workplace: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Comment *</label>
                  <textarea
                    value={newFeedback.comment}
                    onChange={(e) => setNewFeedback({...newFeedback, comment: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Rating *</label>
                    <select
                      value={newFeedback.rating}
                      onChange={(e) => setNewFeedback({...newFeedback, rating: parseInt(e.target.value)})}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {[1, 2, 3, 4, 5].map(rating => (
                        <option key={rating} value={rating}>{rating} Star{rating > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newFeedback.featured}
                        onChange={(e) => setNewFeedback({...newFeedback, featured: e.target.checked})}
                        className="mr-2"
                        disabled={featuredCount >= 5 && !newFeedback.featured}
                      />
                      <span className="text-gray-300">Featured (Show on homepage)</span>
                    </label>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Add Feedback
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Edit Feedback Form Component
const EditFeedbackForm: React.FC<{
  feedback: Feedback;
  onSave: (updates: Partial<Feedback>) => void;
  onCancel: () => void;
}> = ({ feedback, onSave, onCancel }) => {
  const [editData, setEditData] = useState({
    name: feedback.name,
    email: feedback.email,
    role: feedback.role,
    workplace: feedback.workplace,
    comment: feedback.comment,
    rating: feedback.rating,
    featured: feedback.featured
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
          <input
            type="text"
            value={editData.name}
            onChange={(e) => setEditData({...editData, name: e.target.value})}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
          <input
            type="email"
            value={editData.email}
            onChange={(e) => setEditData({...editData, email: e.target.value})}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
          <input
            type="text"
            value={editData.role}
            onChange={(e) => setEditData({...editData, role: e.target.value})}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Workplace</label>
          <input
            type="text"
            value={editData.workplace}
            onChange={(e) => setEditData({...editData, workplace: e.target.value})}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Comment</label>
        <textarea
          value={editData.comment}
          onChange={(e) => setEditData({...editData, comment: e.target.value})}
          rows={3}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Rating</label>
          <select
            value={editData.rating}
            onChange={(e) => setEditData({...editData, rating: parseInt(e.target.value)})}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {[1, 2, 3, 4, 5].map(rating => (
              <option key={rating} value={rating}>{rating} Star{rating > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={editData.featured}
              onChange={(e) => setEditData({...editData, featured: e.target.checked})}
              className="mr-2"
            />
            <span className="text-gray-300">Featured</span>
          </label>
        </div>
      </div>
      <div className="flex space-x-3 pt-4">
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ManageFeedback;
