import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, TrashIcon, SearchIcon, UserPlusIcon, LinkedinIcon, PhoneIcon } from 'lucide-react';
import { apiService } from '../../services/api';

interface Application {
  _id: string;
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  interest: string;
  comment: string;
  status: 'new' | 'reviewing' | 'accepted' | 'rejected';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

const ManageApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await apiService.admin.getApplications();
      if (response.data.success) {
        setApplications(response.data.applications);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    
    try {
      const response = await apiService.admin.deleteApplication(id);
      if (response.data.success) {
        setApplications(applications.filter(app => app._id !== id));
        if (selectedApplication && selectedApplication._id === id) {
          setSelectedApplication(null);
        }
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      alert('Failed to delete application');
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await apiService.admin.updateApplication(id, { status: newStatus });
      if (response.data.success) {
        setApplications(applications.map(app => 
          app._id === id ? { ...app, status: newStatus as any } : app
        ));
        if (selectedApplication && selectedApplication._id === id) {
          setSelectedApplication({ ...selectedApplication, status: newStatus as any });
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to delete ALL applications? This action cannot be undone.')) return;
    
    try {
      const response = await apiService.admin.clearAllApplications();
      if (response.data.success) {
        setApplications([]);
        setSelectedApplication(null);
      }
    } catch (error) {
      console.error('Error clearing applications:', error);
      alert('Failed to clear applications');
    }
  };
  // Filter applications based on search term and status
  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.interest.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'text-blue-400 bg-blue-900/30';
      case 'reviewing': return 'text-yellow-400 bg-yellow-900/30';
      case 'accepted': return 'text-green-400 bg-green-900/30';
      case 'rejected': return 'text-red-400 bg-red-900/30';
      default: return 'text-gray-400 bg-gray-900/30';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link 
              to="/admin" 
              className="mr-4 p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Team Applications</h1>
              <p className="text-gray-400 mt-1">
                Manage and review team membership applications
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">
              Total: {filteredApplications.length}
            </span>
            {applications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-medium transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="reviewing">Reviewing</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading applications...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-16">
            <UserPlusIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              {applications.length === 0 ? 'No Team Applications' : 'No Matching Results'}
            </h3>
            <p className="text-gray-500">
              {applications.length === 0 
                ? 'Team applications will appear here when users apply to join the team.' 
                : 'Try adjusting your search criteria or filters.'
              }
            </p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Interest
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Applied
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredApplications.map((app) => (
                    <tr 
                      key={app._id} 
                      className="hover:bg-gray-700/50 cursor-pointer"
                      onClick={() => setSelectedApplication(app)}
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white">{app.name}</div>
                        <div className="text-sm text-gray-400 truncate max-w-xs">
                          {app.comment.substring(0, 60)}...
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white">{app.email}</div>
                        <div className="text-sm text-gray-400">{app.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-300">{app.interest}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(app.status)}`}>
                          {app.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {app.linkedin && (
                            <a
                              href={app.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 hover:bg-gray-600 rounded text-blue-400 hover:text-blue-300"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <LinkedinIcon className="h-4 w-4" />
                            </a>
                          )}
                          <a
                            href={`tel:${app.phone}`}
                            className="p-1 hover:bg-gray-600 rounded text-green-400 hover:text-green-300"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <PhoneIcon className="h-4 w-4" />
                          </a>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(app._id);
                            }}
                            className="p-1 hover:bg-gray-600 rounded text-red-400 hover:text-red-300"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Application Detail Modal */}
        {selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-white">Application Details</h2>
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="text-gray-400 hover:text-gray-300"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{selectedApplication.name}</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(selectedApplication.status)}`}>
                        {selectedApplication.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-300 mb-2">Contact Information</h4>
                    <div className="bg-gray-700 p-3 rounded">
                      <div className="text-sm text-gray-300 space-y-1">
                        <div>Email: {selectedApplication.email}</div>
                        <div>Phone: {selectedApplication.phone}</div>
                        {selectedApplication.linkedin && (
                          <div>
                            LinkedIn: 
                            <a 
                              href={selectedApplication.linkedin} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 ml-1"
                            >
                              {selectedApplication.linkedin}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-300 mb-2">Area of Interest</h4>
                    <div className="bg-gray-700 p-3 rounded">
                      <p className="text-sm text-gray-300">{selectedApplication.interest}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-300 mb-2">Comments/Motivation</h4>
                    <div className="bg-gray-700 p-3 rounded">
                      <p className="text-sm text-gray-300 whitespace-pre-wrap">
                        {selectedApplication.comment}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-300 mb-2">Application Date</h4>
                    <p className="text-sm text-gray-400">
                      {new Date(selectedApplication.createdAt).toLocaleString()}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-300 mb-2">Status Management</h4>
                    <div className="flex flex-wrap gap-2">
                      {['new', 'reviewing', 'accepted', 'rejected'].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleUpdateStatus(selectedApplication._id, status)}
                          className={`px-3 py-1 rounded text-sm transition-colors ${
                            selectedApplication.status === status
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6 pt-4 border-t border-gray-700">
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageApplications;