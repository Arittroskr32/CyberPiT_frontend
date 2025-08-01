import React from 'react';
import { Link } from 'react-router-dom';
import { GithubIcon, TwitterIcon, LinkedinIcon, FacebookIcon } from 'lucide-react';
const Footer = () => {
  return <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold text-blue-400 mb-4">CyberPiT</h3>
            <p className="text-gray-400 text-sm mb-4">
              From exploit to defense — we own the pit.
            </p>
            <div className="flex space-x-4">
              <a href="https://x.com/Cyberpitinc" className="text-gray-400 hover:text-blue-400 transition-colors">
                <TwitterIcon className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/company/cyberpit-inc/" className="text-gray-400 hover:text-blue-400 transition-colors">
                <LinkedinIcon className="h-5 w-5" />
              </a>
              <a href="https://www.facebook.com/CyberPitInc" className="text-gray-400 hover:text-blue-400 transition-colors">
                <FacebookIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-blue-400 mb-4">Links</h3>
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
          <div>
            <h3 className="text-lg font-bold text-blue-400 mb-4">Contact</h3>
            <p className="text-gray-400 text-sm mb-2">
              support@cyberpit.example.com
            </p>
            <a href="https://discord.gg/K5vJNcau" className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-md hover:from-blue-500 hover:to-purple-500 transition-all duration-300">
              Join Our Discord
            </a>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>
            &copy; {new Date().getFullYear()} CyberPiT. All rights reserved.
          </p>
        </div>
      </div>
    </footer>;
};
export default Footer;