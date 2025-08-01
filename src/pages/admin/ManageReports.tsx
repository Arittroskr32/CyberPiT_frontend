import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, TrashIcon, SearchIcon, FolderIcon, ExternalLinkIcon } from 'lucide-react';
import { apiService } from '../../services/api';

interface Report {
  _id: string;
  title: string;
  description: string;
  reporterName: string;
  reporterEmail: string;
  category: string;
  projectUrl: string;
  status: 'new' | 'reviewing' | 'approved' | 'featured' | 'rejected';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

const ManageReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await apiService.admin.getReports();
      if (response.data.success) {
        setReports(response.data.reports);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project submission?')) return;
    
    try {
      const response = await apiService.admin.deleteReport(id);
      if (response.data.success) {
        setReports(reports.filter(report => report._id !== id));
      }
    } catch (error) {
      console.error('Error deleting report:', error);
      alert('Failed to delete report');
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const response = await apiService.admin.updateReport(id, { status: newStatus });
      if (response.data.success) {
        setReports(reports.map(report => 
          report._id === id ? { ...report, status: newStatus as any } : report
        ));
        if (selectedReport && selectedReport._id === id) {
          setSelectedReport({ ...selectedReport, status: newStatus as any });
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to delete ALL project submissions? This action cannot be undone.')) return;
    
    try {
      const response = await apiService.admin.clearAllReports();
      if (response.data.success) {
        setReports([]);
        setSelectedReport(null);
      }
    } catch (error) {
      console.error('Error clearing reports:', error);
      alert('Failed to clear reports');
    }
  };

  // Filter reports based on search term, status, and category
  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reporterEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || report.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'web development': return 'text-blue-400 bg-blue-900/30';
      case 'mobile app': return 'text-green-400 bg-green-900/30';
      case 'machine learning': return 'text-purple-400 bg-purple-900/30';
      case 'cybersecurity': return 'text-red-400 bg-red-900/30';
      case 'blockchain': return 'text-yellow-400 bg-yellow-900/30';
      case 'game development': return 'text-pink-400 bg-pink-900/30';
      default: return 'text-gray-400 bg-gray-900/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'text-blue-400 bg-blue-900/30';
      case 'reviewing': return 'text-yellow-400 bg-yellow-900/30';
      case 'approved': return 'text-green-400 bg-green-900/30';
      case 'featured': return 'text-purple-400 bg-purple-900/30';
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
              <h1 className="text-3xl font-bold">Project Submissions</h1>
              <p className="text-gray-400 mt-1">
                Manage and review submitted projects from the community
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">
              Total: {filteredReports.length}
            </span>
            {reports.length > 0 && (
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
                placeholder="Search projects..."
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
              <option value="approved">Approved</option>
              <option value="featured">Featured</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="Web Development">Web Development</option>
              <option value="Mobile App">Mobile App</option>
              <option value="Desktop Application">Desktop Application</option>
              <option value="Machine Learning">Machine Learning</option>
              <option value="Data Science">Data Science</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Blockchain">Blockchain</option>
              <option value="IoT">IoT</option>
              <option value="Game Development">Game Development</option>
              <option value="Open Source">Open Source</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading project submissions...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="text-center py-16">
            <FolderIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              {reports.length === 0 ? 'No Project Submissions' : 'No Matching Results'}
            </h3>
            <p className="text-gray-500">
              {reports.length === 0 
                ? 'Project submissions will appear here when users submit their projects.' 
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
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Submitter
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredReports.map((report) => (
                    <tr 
                      key={report._id} 
                      className="hover:bg-gray-700/50 cursor-pointer"
                      onClick={() => setSelectedReport(report)}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-white truncate max-w-xs">
                            {report.title}
                          </div>
                          <div className="text-sm text-gray-400 truncate max-w-xs">
                            {report.description.substring(0, 60)}...
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white">{report.reporterName}</div>
                        <div className="text-sm text-gray-400">{report.reporterEmail}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${getCategoryColor(report.category)}`}>
                          {report.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusColor(report.status)}`}>
                          {report.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <a
                            href={report.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 hover:bg-gray-600 rounded text-blue-400 hover:text-blue-300"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLinkIcon className="h-4 w-4" />
                          </a>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(report._id);
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

        {/* Report Detail Modal */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-white">Project Details</h2>
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="text-gray-400 hover:text-gray-300"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{selectedReport.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(selectedReport.category)}`}>
                        {selectedReport.category}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(selectedReport.status)}`}>
                        {selectedReport.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-300 mb-2">Submitter Information</h4>
                    <div className="bg-gray-700 p-3 rounded">
                      <div className="text-sm text-gray-300">
                        <div>Name: {selectedReport.reporterName}</div>
                        <div>Email: {selectedReport.reporterEmail}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-300 mb-2">Project URL</h4>
                    <a
                      href={selectedReport.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 break-all"
                    >
                      {selectedReport.projectUrl}
                    </a>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-300 mb-2">Description</h4>
                    <div className="bg-gray-700 p-3 rounded">
                      <p className="text-sm text-gray-300 whitespace-pre-wrap">
                        {selectedReport.description}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-300 mb-2">Submission Date</h4>
                    <p className="text-sm text-gray-400">
                      {new Date(selectedReport.createdAt).toLocaleString()}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-300 mb-2">Status Management</h4>
                    <div className="flex flex-wrap gap-2">
                      {['new', 'reviewing', 'approved', 'featured', 'rejected'].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusUpdate(selectedReport._id, status)}
                          className={`px-3 py-1 rounded text-sm transition-colors ${
                            selectedReport.status === status
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
                    onClick={() => setSelectedReport(null)}
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

export default ManageReports;
