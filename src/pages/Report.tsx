import { useState } from 'react';
import { FolderPlusIcon, SendIcon } from 'lucide-react';
import { apiService } from '../services/api';

const Report = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reporterName: '',
    reporterEmail: '',
    category: '',
    projectUrl: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiService.reports.submit(formData);
      
      if (response.data.success) {
        setSubmitted(true);
        setFormData({
          title: '',
          description: '',
          reporterName: '',
          reporterEmail: '',
          category: '',
          projectUrl: ''
        });
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      {/* Header */}
      <div className="relative py-16 bg-gray-800">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-blue-900 opacity-20"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-gray-900 to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <FolderPlusIcon className="h-16 w-16 text-blue-400 mx-auto mb-4" />
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Submit Report
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-300">
              Share your report with us and get a certificate of contribution. Your work will be reviewed by our team and may be featured on the CyberPiT website.
            </p>
          </div>
        </div>
      </div>
      
      {/* Report Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {submitted ? (
          <div className="bg-green-900/30 border border-green-500 rounded-lg p-6 text-center">
            <h3 className="text-2xl font-bold text-green-400 mb-2">
              Project Submitted Successfully!
            </h3>
            <p className="text-gray-300">
              Thank you for sharing your project with us. Our team will review it and get back to you soon.
            </p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                  Project Title *
                </label>
                <input 
                  type="text" 
                  id="title" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleChange} 
                  placeholder="Enter your project title"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  required 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="reporterName" className="block text-sm font-medium text-gray-300 mb-1">
                    Your Name *
                  </label>
                  <input 
                    type="text" 
                    id="reporterName" 
                    name="reporterName" 
                    value={formData.reporterName} 
                    onChange={handleChange} 
                    placeholder="John Doe"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    required
                  />
                </div>
                <div>
                  <label htmlFor="reporterEmail" className="block text-sm font-medium text-gray-300 mb-1">
                    Email Address *
                  </label>
                  <input 
                    type="email" 
                    id="reporterEmail" 
                    name="reporterEmail" 
                    value={formData.reporterEmail} 
                    onChange={handleChange} 
                    placeholder="john@example.com"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                  Project Category *
                </label>
                <select 
                  id="category" 
                  name="category" 
                  value={formData.category} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  required
                >
                  <option value="">Select a category</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="Desktop Application">Desktop Application</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Blockchain">Blockchain</option>
                  <option value="IoT">IoT (Internet of Things)</option>
                  <option value="Game Development">Game Development</option>
                  <option value="Open Source">Open Source</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="projectUrl" className="block text-sm font-medium text-gray-300 mb-1">
                  Project URL / Drive Link *
                </label>
                <input 
                  type="url" 
                  id="projectUrl" 
                  name="projectUrl" 
                  value={formData.projectUrl} 
                  onChange={handleChange}
                  placeholder="https://drive.google.com/... or https://github.com/..."
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  required
                />
                <p className="mt-1 text-sm text-gray-400">
                  Provide a Google Drive link, GitHub repository, or live demo URL
                </p>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                  Project Description *
                </label>
                <textarea 
                  id="description" 
                  name="description" 
                  rows={8} 
                  value={formData.description} 
                  onChange={handleChange} 
                  placeholder="Please provide a detailed description of your project including:&#10;- What problem does it solve?&#10;- Key features and functionality&#10;- Technologies used&#10;- Target audience&#10;- Future development plans (if any)&#10;- Any special instructions for testing/using"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  required 
                />
              </div>
              
              <div className="flex items-start pt-4">
                <input 
                  id="terms" 
                  name="terms" 
                  type="checkbox" 
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700" 
                  required 
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
                  I confirm that this is my original work and I have the right to share this project. I understand that submitted projects may be featured on the CyberPiT website.
                </label>
              </div>
              
              <div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-md hover:from-blue-500 hover:to-purple-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SendIcon className="mr-2 h-5 w-5" />
                  {loading ? 'Submitting...' : 'Submit Project'}
                </button>
              </div>
            </form>
          </div>
        )}
        
        <div className="mt-12 bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            What happens next?
          </h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-900 text-blue-300 mr-3 flex-shrink-0">
                1
              </span>
              <span>
                Our team will review your project submission within 3-5 business days
              </span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-900 text-blue-300 mr-3 flex-shrink-0">
                2
              </span>
              <span>We may reach out for additional information or clarification about your project</span>
            </li>
            <li className="flex items-start">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-900 text-blue-300 mr-3 flex-shrink-0">
                3
              </span>
              <span>
                If approved, your project may be featured on our website and you'll receive recognition for your contribution
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Report;
