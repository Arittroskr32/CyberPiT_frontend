import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Users, AlertCircle, CheckCircle, ArrowLeftIcon, Upload, X } from 'lucide-react';
import { apiService } from '../../services/api';

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  order?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface TeamMemberForm {
  name: string;
  role: string;
  image: string;
  bio: string;
  order: number;
}

const ManageTeam = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState<TeamMemberForm>({
    name: '',
    role: '',
    image: '',
    bio: '',
    order: 0
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'url' | 'file'>('file');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await apiService.admin.getTeamMembers();
      if (response.data.success) {
        setTeamMembers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
      showMessage('error', 'Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      image: '',
      bio: '',
      order: 0
    });
    setSelectedFile(null);
    setImagePreview('');
    setUploadMethod('file');
    setEditingMember(null);
    setShowAddForm(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!selectedFile) return null;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await apiService.admin.uploadTeamImage(formData);
      
      if (response.data.success) {
        showMessage('success', 'Image uploaded successfully');
        return response.data.data.url;
      }
      return null;
    } catch (error) {
      console.error('Error uploading image:', error);
      showMessage('error', 'Failed to upload image');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let imageUrl = formData.image;

      // If file upload method and file selected, upload image first
      if (uploadMethod === 'file' && selectedFile) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          showMessage('error', 'Failed to upload image');
          return;
        }
      }

      const memberData = {
        ...formData,
        image: imageUrl
      };

      if (editingMember) {
        // Update existing member
        const response = await apiService.admin.updateTeamMember(editingMember._id, memberData);
        if (response.data.success) {
          showMessage('success', 'Team member updated successfully');
          fetchTeamMembers();
          resetForm();
        }
      } else {
        // Add new member
        const response = await apiService.admin.addTeamMember(memberData);
        if (response.data.success) {
          showMessage('success', 'Team member added successfully');
          fetchTeamMembers();
          resetForm();
        }
      }
    } catch (error) {
      console.error('Error saving team member:', error);
      showMessage('error', 'Failed to save team member');
    }
  };

  const handleEdit = (member: TeamMember) => {
    setFormData({
      name: member.name,
      role: member.role,
      image: member.image,
      bio: member.bio,
      order: member.order || 0
    });
    setEditingMember(member);
    setUploadMethod('url'); // Default to URL for editing
    setSelectedFile(null);
    setImagePreview('');
    setShowAddForm(true);
  };

  const handleDelete = async (memberId: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) {
      return;
    }

    try {
      const response = await apiService.admin.deleteTeamMember(memberId);
      if (response.data.success) {
        showMessage('success', 'Team member deleted successfully');
        fetchTeamMembers();
      }
    } catch (error) {
      console.error('Error deleting team member:', error);
      showMessage('error', 'Failed to delete team member');
    }
  };

  const clearAllMembers = async () => {
    if (!confirm('Are you sure you want to delete ALL team members? This action cannot be undone.')) {
      return;
    }

    try {
      const deletePromises = teamMembers.map(member => 
        apiService.admin.deleteTeamMember(member._id)
      );
      
      await Promise.all(deletePromises);
      showMessage('success', 'All team members cleared successfully');
      fetchTeamMembers();
    } catch (error) {
      console.error('Error clearing team members:', error);
      showMessage('error', 'Failed to clear all team members');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link 
              to="/admin" 
              className="mr-4 p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="h-6 w-6 text-white" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Users className="h-6 w-6" />
                Manage Team Members
              </h1>
              <p className="text-gray-400 mt-1">
                Add, edit, or remove team members displayed on the About page
              </p>
            </div>
            </div>
          </div>
          <div className="flex gap-3">
          {teamMembers.length > 0 && (
            <button
              onClick={clearAllMembers}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </button>
          )}
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Member
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-green-600/20 border border-green-600/30 text-green-400' 
            : 'bg-red-600/20 border border-red-600/30 text-red-400'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          {message.text}
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-4">
            {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Role *
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Team Member Image *
              </label>
              
              {/* Upload Method Toggle */}
              <div className="flex gap-4 mb-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="file"
                    checked={uploadMethod === 'file'}
                    onChange={(e) => setUploadMethod(e.target.value as 'url' | 'file')}
                    className="mr-2"
                  />
                  <span className="text-gray-300">Upload Image</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="url"
                    checked={uploadMethod === 'url'}
                    onChange={(e) => setUploadMethod(e.target.value as 'url' | 'file')}
                    className="mr-2"
                  />
                  <span className="text-gray-300">Image URL</span>
                </label>
              </div>

              {uploadMethod === 'file' ? (
                <div>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 hover:border-gray-500">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-400">
                          <span className="font-semibold">Click to upload</span> team member photo
                        </p>
                        <p className="text-xs text-gray-400">PNG, JPG or JPEG (MAX. 10MB)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileSelect}
                      />
                    </label>
                  </div>
                  
                  {imagePreview && (
                    <div className="mt-3 relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setImagePreview('');
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  {uploading && (
                    <div className="mt-3">
                      <div className="bg-gray-600 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">Uploading image...</p>
                    </div>
                  )}
                </div>
              ) : (
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={uploadMethod === 'url'}
                  placeholder="https://example.com/image.jpg"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Bio *
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Display Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
              <p className="text-sm text-gray-400 mt-1">Lower numbers appear first</p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editingMember ? 'Update Member' : 'Add Member'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Team Members List */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            Current Team Members ({teamMembers.length})
          </h2>
        </div>
        
        {teamMembers.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-400 mb-2">No Team Members</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first team member.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add First Member
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {teamMembers.map((member) => (
              <div key={member._id} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-600">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                    }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-white">{member.name}</h3>
                      <p className="text-blue-400 text-sm">{member.role}</p>
                      {member.order !== undefined && (
                        <p className="text-gray-500 text-xs">Order: {member.order}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(member)}
                        className="p-1 text-gray-400 hover:text-blue-400"
                        title="Edit member"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(member._id)}
                        className="p-1 text-gray-400 hover:text-red-400"
                        title="Delete member"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm line-clamp-3">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageTeam;
