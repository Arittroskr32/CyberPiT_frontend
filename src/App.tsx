import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import Report from './pages/Report';
import JoinTeam from './pages/JoinTeam';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import ManageFeedback from './pages/admin/ManageFeedback';
import ManageTeam from './pages/admin/ManageTeam';
import ManageProjects from './pages/admin/ManageProjects';
import ContactMessages from './pages/admin/ContactMessages';
import ManageVideos from './pages/admin/ManageVideos';
import ManageSubscriptions from './pages/admin/ManageSubscriptions';
import ManageReports from './pages/admin/ManageReports';
import ManageApplications from './pages/admin/ManageApplications';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/admin/ProtectedRoute';

export function App() {
  // Add debug logging
  console.log('🚀 App Component Loading - Current URL:', window.location.href);
  console.log('🚀 App Component - Pathname:', window.location.pathname);
  
  return <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/report" element={<Report />} />
              <Route path="/join-team" element={<JoinTeam />} />
              {/* Admin routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>} />
              <Route path="/admin/feedback" element={<ProtectedRoute>
                    <ManageFeedback />
                  </ProtectedRoute>} />
              <Route path="/admin/team" element={<ProtectedRoute>
                    <ManageTeam />
                  </ProtectedRoute>} />
              <Route path="/admin/projects" element={<ProtectedRoute>
                    <ManageProjects />
                  </ProtectedRoute>} />
              <Route path="/admin/messages" element={<ProtectedRoute>
                    <ContactMessages />
                  </ProtectedRoute>} />
              <Route path="/admin/videos" element={<ProtectedRoute>
                    <ManageVideos />
                  </ProtectedRoute>} />
              <Route path="/admin/subscriptions" element={<ProtectedRoute>
                    <ManageSubscriptions />
                  </ProtectedRoute>} />
              <Route path="/admin/reports" element={<ProtectedRoute>
                    <ManageReports />
                  </ProtectedRoute>} />
              <Route path="/admin/applications" element={<ProtectedRoute>
                    <ManageApplications />
                  </ProtectedRoute>} />
              {/* Catch-all route for 404 - must be last */}
              <Route path="*" element={<div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-white mb-4">404 - Page Not Found</h1>
                      <p className="text-gray-400 mb-4">Current path: {window.location.pathname}</p>
                      <a href="/" className="text-blue-500 hover:text-blue-400">Go back to home</a>
                    </div>
                  </div>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>;
}