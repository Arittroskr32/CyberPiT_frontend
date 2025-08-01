import React, { useState } from 'react';
import { SendIcon, UserIcon, LinkedinIcon, PhoneIcon } from 'lucide-react';
import { apiService } from '../services/api';

const JoinTeam = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    interest: '',
    comment: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const interestOptions = ['Penetration Testing', 'Malware Analysis', 'Reverse Engineering', 'Web Security', 'Network Security', 'Mobile Security', 'IoT Security', 'Cryptography', 'Other'];

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
      const response = await apiService.team.apply(formData);
      
      if (response.data.success) {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          linkedin: '',
          interest: '',
          comment: ''
        });
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen bg-gray-900 pt-16">
      {/* Header */}
      <div className="relative py-16 bg-gray-800">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-purple-900 opacity-20"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-gray-900 to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Join Our Team
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-300">
              Become part of our elite cybersecurity research team
            </p>
          </div>
        </div>
      </div>
      {/* Team Application Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {submitted ? <div className="bg-green-900/30 border border-green-500 rounded-lg p-6 text-center">
            <h3 className="text-2xl font-bold text-green-400 mb-2">
              Application Submitted!
            </h3>
            <p className="text-gray-300">
              Thank you for your interest in joining CyberPiT. We'll review your
              application and contact you soon.
            </p>
          </div> : <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <PhoneIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="linkedin" className="block text-sm font-medium text-gray-300 mb-1">
                  LinkedIn Profile
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LinkedinIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input type="url" id="linkedin" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/yourprofile" className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                </div>
              </div>
              <div>
                <label htmlFor="interest" className="block text-sm font-medium text-gray-300 mb-1">
                  Area of Interest
                </label>
                <select id="interest" name="interest" value={formData.interest} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                  <option value="">Select your primary area of interest</option>
                  {interestOptions.map(option => <option key={option} value={option}>
                      {option}
                    </option>)}
                </select>
              </div>
              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-300 mb-1">
                  Why do you want to join CyberPiT?
                </label>
                <textarea id="comment" name="comment" rows={5} value={formData.comment} onChange={handleChange} placeholder="Tell us about your experience and why you'd be a good fit for our team..." className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div className="flex items-start pt-4">
                <input id="terms" name="terms" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700" required />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
                  I agree that CyberPiT may store and process my personal
                  information for recruitment purposes
                </label>
              </div>
              <div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-md hover:from-blue-500 hover:to-purple-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <SendIcon className="mr-2 h-5 w-5" />
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-white mb-6">
            What we're looking for
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h4 className="text-lg font-semibold text-blue-400 mb-2">
                Technical Skills
              </h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Strong background in cybersecurity or related field</li>
                <li>• Experience with vulnerability research</li>
                <li>• Proficiency in at least one programming language</li>
                <li>• Knowledge of common security tools and methodologies</li>
              </ul>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h4 className="text-lg font-semibold text-purple-400 mb-2">
                Personal Qualities
              </h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Curiosity and passion for solving complex problems</li>
                <li>• Strong ethical principles</li>
                <li>
                  • Ability to work both independently and as part of a team
                </li>
                <li>• Commitment to continuous learning and improvement</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default JoinTeam;