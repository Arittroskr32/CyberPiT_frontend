import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { MessageSquareIcon, UsersIcon, StarIcon, FolderIcon, LogOutIcon, VideoIcon, MailIcon, FileTextIcon, UserPlusIcon } from 'lucide-react';

interface DashboardStats {
  contacts: number;
  unreadContacts: number;
  subscriptions: number;
  teamApplications: number;
  pendingApplications: number;
  teamMembers: number;
  projects: number;
  reports: number;
  newReports: number;
  feedback: number;
  pendingFeedback: number;
  videos: number;
}

const AdminDashboard = () => {
  const { logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const response = await apiService.admin.getDashboard();
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };
  const adminModules = [{
    title: 'Manage Videos',
    description: 'Update home page videos for mobile and desktop',
    icon: <VideoIcon className="h-8 w-8" />,
    link: '/admin/videos',
    color: 'from-red-600 to-orange-600',
    count: stats?.videos || 0
  }, {
    title: 'Manage Subscriptions',
    description: 'View and manage email subscribers',
    icon: <MailIcon className="h-8 w-8" />,
    link: '/admin/subscriptions',
    color: 'from-teal-600 to-emerald-600',
    count: stats?.subscriptions || 0
  }, {
    title: 'Manage Reports',
    description: 'View and manage submitted project reports',
    icon: <FileTextIcon className="h-8 w-8" />,
    link: '/admin/reports',
    color: 'from-indigo-600 to-violet-600',
    count: stats?.reports || 0,
    badge: stats?.newReports || 0
  }, {
    title: 'Team Applications',
    description: 'Review applications to join the team',
    icon: <UserPlusIcon className="h-8 w-8" />,
    link: '/admin/applications',
    color: 'from-pink-600 to-rose-600',
    count: stats?.teamApplications || 0,
    badge: stats?.pendingApplications || 0
  }, {
    title: 'Manage Feedback',
    description: 'Edit or delete user testimonials and reviews',
    icon: <StarIcon className="h-8 w-8" />,
    link: '/admin/feedback',
    color: 'from-yellow-600 to-amber-600',
    count: stats?.feedback || 0,
    badge: stats?.pendingFeedback || 0
  }, {
    title: 'Edit Team',
    description: 'Update team member information and profiles',
    icon: <UsersIcon className="h-8 w-8" />,
    link: '/admin/team',
    color: 'from-blue-600 to-cyan-600',
    count: stats?.teamMembers || 0
  }, {
    title: 'Manage Projects',
    description: 'Add, edit, or remove projects from the portfolio',
    icon: <FolderIcon className="h-8 w-8" />,
    link: '/admin/projects',
    color: 'from-purple-600 to-indigo-600',
    count: stats?.projects || 0
  }, {
    title: 'Contact Messages',
    description: 'View and respond to contact form submissions',
    icon: <MessageSquareIcon className="h-8 w-8" />,
    link: '/admin/messages',
    color: 'from-green-600 to-emerald-600',
    count: stats?.contacts || 0,
    badge: stats?.unreadContacts || 0
  }];
  const handleLogout = () => {
    logout();
  };
  return <div className="min-h-screen bg-gray-900 pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <button onClick={handleLogout} className="flex items-center px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-300 hover:bg-gray-700 transition-colors">
            <LogOutIcon className="h-5 w-5 mr-2" />
            Logout
          </button>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-400">Loading dashboard...</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminModules.map((module, index) => (
                <Link 
                  key={index} 
                  to={module.link} 
                  className="block bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1 relative"
                >
                  <div className="flex items-start">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${module.color} text-white mr-4`}>
                      {module.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">
                        {module.title}
                      </h3>
                      <p className="text-gray-400 mb-2">{module.description}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          Total: {module.count}
                        </span>
                        {module.badge && module.badge > 0 && (
                          <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                            {module.badge} new
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="mt-12 p-6 bg-gray-800 border border-gray-700 rounded-lg">
              <h2 className="text-xl font-bold text-white mb-4">
                Admin Quick Tips
              </h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>All changes are saved automatically to the database</li>
                <li>Remember to log out when you're done making changes</li>
                <li>For security purposes, avoid sharing your admin credentials</li>
                <li>Visit the public site to verify your changes are displaying correctly</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>;
};
export default AdminDashboard;