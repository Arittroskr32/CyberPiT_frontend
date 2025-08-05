import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GithubIcon, TwitterIcon, LinkedinIcon, FacebookIcon, MailIcon, YoutubeIcon, SendIcon } from 'lucide-react';
import { apiService } from '../../services/api';
const Footer = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage('Please enter your email address');
      setMessageType('error');
      return;
    }

    try {
      const response = await apiService.subscriptions.subscribe(email);
      
      if (response.data.success) {
        setEmail('');
        setMessage(response.data.message);
        setMessageType('success');
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to subscribe. Please try again.');
      setMessageType('error');
    }

    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };
  return <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          <div className="text-left ml-0 pl-0 sm:col-span-2 lg:col-span-1">
            <h3 className="text-2xl sm:text-4xl font-bold text-blue-400 mb-4 ml-0 pl-0">CyberPiT Inc.</h3>
            <p className="text-gray-400 text-sm mb-4 ml-0 pl-0">
              From exploit to defense — we own the pit.
            </p>
            <p className="text-gray-400 text-sm mb-4 ml-0 pl-0">Empowering ethical hackers, researchers, and defenders worldwide.</p>
            
            <div className="mt-4 sm:mt-6">
              <a href="https://discord.gg/K5vJNcau" className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium text-sm rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-lg hover:shadow-xl">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                Join Our Discord
              </a>
            </div>
          </div>
          <div className="text-center hidden md:block lg:col-span-1">
            <h3 className="text-lg font-bold text-blue-400 mb-4">Quick Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-blue-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/report" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Report
                </Link>
              </li>
              <li>
                <Link to="/join-team" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Join Team
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div className="text-center sm:text-left lg:text-center">
            <h3 className="text-lg font-bold text-blue-400 mb-4 sm:mb-6">Follow Us</h3>
            <div className="space-y-2 sm:space-y-3 lg:space-y-4">
              <a href="https://x.com/Cyberpitinc" className="flex items-center justify-center sm:justify-start lg:justify-center space-x-3 text-gray-400 hover:text-blue-400 transition-colors">
                <TwitterIcon className="h-5 w-5" />
                <span className="text-sm lg:text-base">Twitter</span>
              </a>
              <a href="https://www.linkedin.com/company/cyberpit-inc/" className="flex items-center justify-center sm:justify-start lg:justify-center space-x-3 text-gray-400 hover:text-blue-400 transition-colors">
                <LinkedinIcon className="h-5 w-5" />
                <span className="text-sm lg:text-base">LinkedIn</span>
              </a>
              <a href="https://www.facebook.com/CyberPitInc" className="flex items-center justify-center sm:justify-start lg:justify-center space-x-3 text-gray-400 hover:text-blue-400 transition-colors">
                <FacebookIcon className="h-5 w-5" />
                <span className="text-sm lg:text-base">Facebook</span>
              </a>
              <a href="https://www.youtube.com/@CyberPitInc" className="flex items-center justify-center sm:justify-start lg:justify-center space-x-3 text-gray-400 hover:text-red-400 transition-colors">
                <YoutubeIcon className="h-5 w-5" />
                <span className="text-sm lg:text-base">YouTube</span>
              </a>
            </div>
          </div>
          <div className="text-left sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-bold text-blue-400 mb-4 sm:mb-6">Get In Touch</h3>
            
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center space-x-3">
                <div>
                  <p className="text-gray-300 text-sm font-medium">Email Us</p>
                  <a href="mailto:administrator@cyberpit.live" className="text-gray-400 hover:text-blue-400 transition-colors">
                    administrator@cyberpit.live
                  </a>
                </div>
              </div>
              
              <div>
                <p className="text-gray-300 text-sm font-medium mb-3">Newsletter</p>
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative flex-grow mb-2 sm:mb-0">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MailIcon className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md sm:rounded-l-md sm:rounded-r-none text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium text-sm rounded-md sm:rounded-r-md sm:rounded-l-none hover:from-blue-500 hover:to-purple-500 transition-all duration-300"
                    >
                      <SendIcon className="h-4 w-4" />
                    </button>
                  </div>
                  {message && (
                    <div className={`text-xs ${messageType === 'error' ? 'text-red-400' : messageType === 'success' ? 'text-green-400' : 'text-blue-400'}`}>
                      {message}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
          
        </div>
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-800 text-center text-xs sm:text-sm text-gray-500">
          <p>
            &copy; 2025 CyberPiT. All rights reserved.
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;