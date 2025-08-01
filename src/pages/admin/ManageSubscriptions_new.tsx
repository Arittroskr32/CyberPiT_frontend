import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, TrashIcon, SearchIcon, MailIcon, SendIcon, LoaderIcon, Eye, EyeOff } from 'lucide-react';
import { apiService } from '../../services/api';

interface Subscription {
  _id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

const ManageSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // Email form state
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailPreview, setEmailPreview] = useState(false);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      const response = await apiService.admin.getSubscriptions();
      setSubscriptions(response.data.subscriptions || []);
      setError('');
    } catch (error: any) {
      console.error('Error loading subscriptions:', error);
      setError('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleSendBulkEmail = async () => {
    if (!emailSubject.trim() || !emailBody.trim()) {
      setError('Please provide both subject and message');
      return;
    }

    const activeSubscribers = subscriptions.filter(sub => sub.isActive).length;
    if (activeSubscribers === 0) {
      setError('No active subscribers found');
      return;
    }

    if (!confirm(`Send email to ${activeSubscribers} active subscribers?\n\nSubject: ${emailSubject}`)) {
      return;
    }

    setSendingEmail(true);
    setError('');
    setMessage('');

    try {
      const response = await apiService.admin.sendBulkEmail({
        subject: emailSubject,
        body: emailBody
      });

      if (response.data.success) {
        setMessage(`✅ Email sent successfully to ${response.data.details.sent} subscribers!`);
        setEmailSubject('');
        setEmailBody('');
        setShowEmailForm(false);
        setTimeout(() => setMessage(''), 5000);
      } else {
        setError(response.data.message || 'Failed to send email');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to send bulk email');
    } finally {
      setSendingEmail(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscription?')) return;

    try {
      await apiService.admin.deleteSubscription(id);
      setMessage('Subscription deleted successfully');
      loadSubscriptions();
      setSelectedItems(selectedItems.filter(item => item !== id));
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to delete subscription');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedItems.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedItems.length} subscriptions?`)) return;

    try {
      await apiService.admin.deleteSubscriptions(selectedItems);
      setMessage(`${selectedItems.length} subscriptions deleted successfully`);
      loadSubscriptions();
      setSelectedItems([]);
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to delete subscriptions');
    }
  };

  const handleToggleStatus = async (id: string, isActive: boolean) => {
    try {
      await apiService.admin.updateSubscription(id, { isActive: !isActive });
      setMessage(`Subscription ${!isActive ? 'activated' : 'deactivated'} successfully`);
      loadSubscriptions();
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update subscription');
    }
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredSubscriptions.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredSubscriptions.map(sub => sub._id));
    }
  };

  const toggleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // Filter subscriptions based on search term
  const filteredSubscriptions = subscriptions.filter(sub => 
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + ' ' + 
           new Date(dateString).toLocaleTimeString([], {
             hour: '2-digit',
             minute: '2-digit'
           });
  };

  const activeSubscribers = subscriptions.filter(sub => sub.isActive).length;

  const getEmailPreview = () => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${emailSubject}</title>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 650px;
                margin: 0 auto;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
            }
            .container {
                background: white;
                border-radius: 16px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.15);
                overflow: hidden;
                border: 3px solid transparent;
                background-clip: padding-box;
            }
            .header {
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
                color: white;
                padding: 50px 40px;
                text-align: center;
                position: relative;
                overflow: hidden;
            }
            .header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="0.5" fill="rgba(255,255,255,0.1)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
                opacity: 0.1;
            }
            .logo-container {
                position: relative;
                z-index: 2;
                margin-bottom: 20px;
            }
            .logo-img {
                width: 80px;
                height: 80px;
                border-radius: 20px;
                border: 3px solid rgba(255,255,255,0.2);
                box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                object-fit: cover;
                margin-bottom: 16px;
            }
            .logo-text {
                font-size: 36px;
                font-weight: 900;
                margin-bottom: 8px;
                background: linear-gradient(45deg, #00d4ff, #00ff88);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            }
            .tagline {
                font-size: 18px;
                opacity: 0.9;
                font-weight: 500;
                letter-spacing: 0.5px;
            }
            .content {
                padding: 50px 40px;
                background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
            }
            .subject-line {
                font-size: 28px;
                font-weight: 700;
                color: #1a202c;
                margin-bottom: 30px;
                text-align: center;
                padding: 20px;
                background: linear-gradient(135deg, #e6fffa 0%, #f0fff4 100%);
                border-radius: 12px;
                border-left: 5px solid #38b2ac;
                box-shadow: 0 4px 12px rgba(56, 178, 172, 0.1);
            }
            .message {
                font-size: 18px;
                line-height: 1.8;
                margin-bottom: 40px;
                white-space: pre-line;
                color: #2d3748;
                background: white;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                border: 1px solid #e2e8f0;
                font-weight: 400;
            }
            .cta {
                text-align: center;
                margin: 50px 0;
            }
            .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-decoration: none;
                padding: 18px 40px;
                border-radius: 50px;
                font-weight: 700;
                font-size: 18px;
                text-transform: uppercase;
                letter-spacing: 1px;
                box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
                transition: all 0.3s ease;
                border: 2px solid transparent;
            }
            .cta-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 15px 35px rgba(102, 126, 234, 0.6);
            }
            .features {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 20px;
                margin: 40px 0;
            }
            .feature {
                text-align: center;
                padding: 20px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                border: 1px solid #e2e8f0;
            }
            .feature-icon {
                font-size: 32px;
                margin-bottom: 10px;
            }
            .feature-text {
                font-size: 14px;
                color: #4a5568;
                font-weight: 600;
            }
            .footer {
                background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
                color: #e2e8f0;
                padding: 40px;
                text-align: center;
                font-size: 14px;
            }
            .social-links {
                margin: 25px 0;
                display: flex;
                justify-content: center;
                gap: 25px;
            }
            .social-links a {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 45px;
                height: 45px;
                background: rgba(255,255,255,0.1);
                color: #e2e8f0;
                text-decoration: none;
                font-weight: 600;
                border-radius: 50%;
                transition: all 0.3s ease;
                font-size: 16px;
            }
            .social-links a:hover {
                background: rgba(255,255,255,0.2);
                transform: translateY(-2px);
            }
            .footer-brand {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid rgba(255,255,255,0.1);
            }
            .footer-brand strong {
                font-size: 16px;
                color: #00d4ff;
            }
            @media (max-width: 600px) {
                body { padding: 10px; }
                .header, .content, .footer { padding: 30px 20px; }
                .subject-line { font-size: 24px; }
                .message { font-size: 16px; padding: 20px; }
                .logo-img { width: 60px; height: 60px; }
                .logo-text { font-size: 28px; }
                .social-links { flex-wrap: wrap; gap: 15px; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo-container">
                    <img src="https://cyberpit.live/logo.jpg" alt="CyberPiT Logo" class="logo-img" />
                    <div class="logo-text">CyberPiT</div>
                    <div class="tagline">Elite Cybersecurity Research & Innovation</div>
                </div>
            </div>
            
            <div class="content">
                <div class="subject-line">${emailSubject || 'Important Update from CyberPiT'}</div>
                
                <div class="message">${emailBody || 'Your message will appear here...'}</div>
                
                <div class="features">
                    <div class="feature">
                        <div class="feature-icon">🛡️</div>
                        <div class="feature-text">Security Research</div>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">🔐</div>
                        <div class="feature-text">Penetration Testing</div>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">🏆</div>
                        <div class="feature-text">CTF Challenges</div>
                    </div>
                    <div class="feature">
                        <div class="feature-icon">👥</div>
                        <div class="feature-text">Elite Community</div>
                    </div>
                </div>
                
                <div class="cta">
                    <a href="https://cyberpit.live" class="cta-button">Explore CyberPiT</a>
                </div>
            </div>
            
            <div class="footer">
                <div class="social-links">
                    <a href="https://github.com/cyberpit" title="GitHub">⚡</a>
                    <a href="https://x.com/Cyberpitinc" title="Twitter">🐦</a>
                    <a href="https://linkedin.com/company/cyberpit" title="LinkedIn">💼</a>
                    <a href="https://cyberpit.live" title="Website">🌐</a>
                </div>
                
                <div class="footer-brand">
                    <strong>CyberPiT Team</strong><br>
                    Elite cybersecurity researchers, ethical hackers, and cyber defenders.<br>
                    From advanced CTF challenges to real-world security solutions — we lead the way.
                    <br><br>
                    <small style="opacity: 0.7;">
                        You received this email because you subscribed to CyberPiT updates.<br>
                        © 2025 CyberPiT. All rights reserved.
                    </small>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <Link to="/admin" className="mr-4 p-2 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors">
            <ArrowLeftIcon className="h-5 w-5 text-gray-300" />
          </Link>
          <h1 className="text-3xl font-bold text-white">
            Manage Subscriptions
          </h1>
        </div>

        {/* Status Messages */}
        {message && (
          <div className="mb-6 bg-green-900/30 border border-green-500 rounded-lg p-4">
            <span className="text-green-300">{message}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-900/30 border border-red-500 rounded-lg p-4">
            <span className="text-red-300">{error}</span>
          </div>
        )}

        {/* Enhanced Bulk Email Form */}
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-lg overflow-hidden mb-6">
          <div className="p-6 border-b border-blue-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 bg-blue-600 rounded-lg mr-4">
                  <MailIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">Bulk Email Campaign</h2>
                  <p className="text-blue-200 text-sm mt-1">
                    Send professional emails to {activeSubscribers} active subscribers
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEmailForm(!showEmailForm)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {showEmailForm ? 'Hide Campaign' : 'Create Campaign'}
              </button>
            </div>
          </div>

          {showEmailForm && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      Email Subject *
                    </label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="e.g., Latest CyberPiT Updates & Security News"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-200 mb-2">
                      Email Message *
                    </label>
                    <textarea
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      placeholder="Write your message here...

Example:
Hi there!

We're excited to share our latest cybersecurity insights and platform updates with you.

🔐 New Features:
- Advanced threat detection tools
- Enhanced security challenges
- Community collaboration features

Stay secure,
CyberPiT Team"
                      rows={10}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-blue-200">
                      Email Preview
                    </label>
                    <button
                      onClick={() => setEmailPreview(!emailPreview)}
                      className="flex items-center text-blue-400 hover:text-blue-300 text-sm"
                    >
                      {emailPreview ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                      {emailPreview ? 'Hide' : 'Show'} Preview
                    </button>
                  </div>
                  
                  {emailPreview && (emailSubject || emailBody) && (
                    <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <div 
                        dangerouslySetInnerHTML={{ __html: getEmailPreview() }}
                        className="scale-50 origin-top-left transform"
                        style={{ width: '200%', height: '200%' }}
                      />
                    </div>
                  )}

                  {!emailPreview && (
                    <div className="bg-gray-800 border border-gray-600 rounded-lg p-6 text-center">
                      <MailIcon className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400 text-sm">
                        Enter subject and message to see preview
                      </p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-blue-500/30">
                <div className="text-blue-200 text-sm">
                  ✨ Professional template with CyberPiT branding will be applied automatically
                </div>
                <button
                  onClick={handleSendBulkEmail}
                  disabled={sendingEmail || !emailSubject.trim() || !emailBody.trim() || activeSubscribers === 0}
                  className={`flex items-center px-8 py-3 rounded-lg font-medium transition-colors ${
                    sendingEmail || !emailSubject.trim() || !emailBody.trim() || activeSubscribers === 0
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 shadow-lg'
                  }`}
                >
                  {sendingEmail ? (
                    <>
                      <LoaderIcon className="h-5 w-5 mr-2 animate-spin" />
                      Sending Campaign...
                    </>
                  ) : (
                    <>
                      <SendIcon className="h-5 w-5 mr-2" />
                      Send to {activeSubscribers} Subscribers
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-grow max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleDeleteSelected}
                  disabled={selectedItems.length === 0}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    selectedItems.length > 0
                      ? 'bg-red-900/50 text-red-300 hover:bg-red-900'
                      : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                  } transition-colors`}
                  title="Delete selected"
                >
                  <TrashIcon className="h-5 w-5 mr-2" />
                  Delete Selected
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-400">Loading subscriptions...</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedItems.length === filteredSubscriptions.length && filteredSubscriptions.length > 0}
                          onChange={toggleSelectAll}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                        />
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Date Subscribed
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredSubscriptions.length > 0 ? (
                    filteredSubscriptions.map((subscription) => (
                      <tr key={subscription._id} className="hover:bg-gray-700/30">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(subscription._id)}
                              onChange={() => toggleSelectItem(subscription._id)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <MailIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-white">{subscription.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            subscription.isActive 
                              ? 'bg-green-900/30 text-green-300' 
                              : 'bg-red-900/30 text-red-300'
                          }`}>
                            {subscription.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                          {formatDate(subscription.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleToggleStatus(subscription._id, subscription.isActive)}
                              className={`p-2 rounded-md transition-colors ${
                                subscription.isActive
                                  ? 'bg-yellow-900/30 text-yellow-300 hover:bg-yellow-900/50'
                                  : 'bg-green-900/30 text-green-300 hover:bg-green-900/50'
                              }`}
                              title={subscription.isActive ? 'Deactivate' : 'Activate'}
                            >
                              {subscription.isActive ? '⏸️' : '▶️'}
                            </button>
                            <button
                              onClick={() => handleDelete(subscription._id)}
                              className="p-2 bg-red-900/30 text-red-300 rounded-md hover:bg-red-900/50 transition-colors"
                              title="Delete"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-400">
                        No subscriptions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="px-6 py-4 border-t border-gray-700 bg-gray-800">
            <p className="text-gray-400 text-sm">
              Total subscribers: {subscriptions.length}
              {` (${subscriptions.filter(s => s.isActive).length} active, ${subscriptions.filter(s => !s.isActive).length} inactive)`}
              {selectedItems.length > 0 && ` • ${selectedItems.length} selected`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageSubscriptions;
