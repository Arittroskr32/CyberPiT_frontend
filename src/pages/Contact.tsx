import React, { useState } from 'react';
import { MapPinIcon, MailIcon, PhoneIcon, SendIcon } from 'lucide-react';
import { apiService } from '../services/api';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // Handle form submission to save contact message
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const messageText = formData.get('message') as string;
    const privacy = formData.get('privacy') as string;
    
    if (!privacy) {
      setMessage('Please agree to the privacy policy');
      setMessageType('error');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await apiService.contact.submit({
        name,
        email,
        subject,
        message: messageText
      });

      if (response.data.success) {
        (e.target as HTMLFormElement).reset();
        setMessage('Message sent successfully! We\'ll get back to you soon.');
        setMessageType('success');
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Failed to send message. Please try again.');
      setMessageType('error');
    }

    setIsSubmitting(false);
    
    // Clear message after 5 seconds
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };
  return <div className="min-h-screen bg-gray-900 pt-16">
      {/* Header */}
      <div className="relative py-16 bg-gray-800">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-blue-900 opacity-20"></div>
          <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-gray-900 to-transparent"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Get In Touch
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-300">
              Have a security challenge? Want to join our team? Reach out to us.
            </p>
          </div>
        </div>
      </div>
      {/* Contact section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-blue-400 mb-6">
              Contact Information
            </h2>
            <p className="text-gray-300 mb-8">
              Whether you need a security assessment, want to report a
              vulnerability, or are interested in joining our team, we're here
              to help.
            </p>
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gray-800 border border-gray-700">
                    <MailIcon className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-white">Email</h3>
                  <p className="mt-1 text-gray-300">
                    administrator@cyberpit.live
                  </p>
                  <p className="mt-1 text-gray-300">
                    cyberpitinc@gmail.com
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gray-800 border border-gray-700">
                    <MapPinIcon className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-white">Location</h3>
                  <p className="mt-1 text-gray-300">
                    We're from Bangladesh.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-gray-800 border border-gray-700">
                    <PhoneIcon className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-white">Discord</h3>
                  <p className="mt-1 text-gray-300">
                    Join our community Discord server for discussions, CTF
                    announcements, and more.
                  </p>
                  <a href="https://discord.gg/K5vJNcau" className="mt-2 inline-flex items-center px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700">
                    Join Discord
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Send Us a Message
            </h2>
            
            {/* Message Display */}
            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                messageType === 'success' 
                  ? 'bg-green-900/30 border border-green-500 text-green-400' 
                  : 'bg-red-900/30 border border-red-500 text-red-400'
              }`}>
                {message}
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Name
                </label>
                <input type="text" id="name" name="name" className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input type="email" id="email" name="email" className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
                  Subject
                </label>
                <select id="subject" name="subject" className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                  <option value="general">General Inquiry</option>
                  <option value="services">Security Services</option>
                  <option value="join">Join Our Team</option>
                  <option value="vulnerability">Report Vulnerability</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                  Message
                </label>
                <textarea id="message" name="message" rows={6} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required></textarea>
              </div>
              <div className="flex items-start">
                <input id="privacy" name="privacy" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700" required />
                <label htmlFor="privacy" className="ml-2 block text-sm text-gray-300">
                  I agree to the privacy policy and terms of service
                </label>
              </div>
              <div>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-md hover:from-blue-500 hover:to-purple-500 transition-all duration-300 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  <SendIcon className="ml-2 h-5 w-5" />
                </button>
              </div>
              {message && (
                <div className={`mt-4 p-3 rounded-md text-sm ${
                  messageType === 'success' 
                    ? 'bg-green-800 text-green-200 border border-green-700' 
                    : 'bg-red-800 text-red-200 border border-red-700'
                }`}>
                  {message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      {/* FAQ section */}
      <div className="bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-3">
                Do you offer bug bounty services?
              </h3>
              <p className="text-gray-300">
                Yes, we can help set up and manage bug bounty programs for
                organizations of all sizes, as well as provide expert hunters
                for existing programs.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-3">
                How can I join CyberPiT?
              </h3>
              <p className="text-gray-300">
                We're always looking for talented security researchers. Send us
                your resume and a brief description of your expertise through
                the contact form.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-3">
                Do you provide security training?
              </h3>
              <p className="text-gray-300">
                Yes, we offer specialized training in various security domains,
                from web application security to advanced exploit development.
              </p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-3">
                How quickly do you respond to inquiries?
              </h3>
              <p className="text-gray-300">
                We typically respond to all inquiries within 24-48 hours during
                business days. For urgent security matters, please indicate this
                in your subject line.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Contact;