import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuIcon, XIcon } from 'lucide-react';
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const navLinks = [{
    name: 'Home',
    path: '/'
  }, {
    name: 'About',
    path: '/about'
  }, {
    name: 'Projects',
    path: '/projects'
  }, {
    name: 'Blog',
    path: '/blog'
  }, {
    name: 'Academy',
    path: 'https://academy.cyberpit.live',
    external: true
  }, {
    name: 'Report',
    path: '/report'
  }, {
    name: 'Join Team',
    path: '/join-team'
  }, {
    name: 'Contact',
    path: '/contact'
  }];
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-gray-900/95 shadow-lg shadow-blue-500/10' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {/* Logo removed */}
          </div>
          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map(link => 
                link.external ? (
                  <a
                    key={link.name}
                    href={link.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 relative group text-gray-300 hover:text-blue-400"
                  >
                    {link.name}
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
                  </a>
                ) : (
                  <Link 
                    key={link.name} 
                    to={link.path} 
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 relative group ${location.pathname === link.path ? 'text-blue-400' : 'text-gray-300 hover:text-blue-400'}`}
                  >
                    {link.name}
                    <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${location.pathname === link.path ? 'scale-x-100' : ''}`}></span>
                  </Link>
                )
              )}
            </div>
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none">
              {isMenuOpen ? <XIcon className="block h-6 w-6" /> : <MenuIcon className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-900/95 shadow-lg shadow-blue-500/10">
          {navLinks.map(link => 
            link.external ? (
              <a
                key={link.name}
                href={link.path}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            ) : (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === link.path ? 'text-blue-400 bg-gray-800' : 'text-gray-300 hover:bg-gray-800 hover:text-blue-400'}`} 
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            )
          )}
        </div>
      </div>
    </nav>;
};
export default Navbar;