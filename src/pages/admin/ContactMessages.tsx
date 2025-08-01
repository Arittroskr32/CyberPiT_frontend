import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, TrashIcon, MailIcon, UserIcon, CalendarIcon, CheckIcon } from 'lucide-react';
import { apiService } from '../../services/api';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  adminResponse?: string;
  createdAt: string;
  updatedAt: string;
}
const ContactMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const response = await apiService.admin.getContacts();
      setMessages(response.data.contacts || response.data);
    } catch (error) {
      console.error('Error loading messages:', error);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiService.admin.deleteContact(id);
      const updatedMessages = messages.filter(message => message._id !== id);
      setMessages(updatedMessages);
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      setError('Failed to delete message');
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to delete ALL contact messages? This action cannot be undone.')) {
      return;
    }

    try {
      await apiService.admin.clearAllContacts();
      setMessages([]);
      setSelectedMessage(null);
    } catch (error) {
      console.error('Error clearing messages:', error);
      setError('Failed to clear all messages');
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await apiService.admin.updateContactStatus(id, 'read');
      const updatedMessages = messages.map(message => 
        message._id === id ? { ...message, status: 'read' as const } : message
      );
      setMessages(updatedMessages);
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage({ ...selectedMessage, status: 'read' });
      }
    } catch (error) {
      console.error('Error updating message status:', error);
      setError('Failed to update message status');
    }
  };

  const handleSelectMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    if (message.status === 'unread') {
      handleMarkAsRead(message._id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  return <div className="min-h-screen bg-gray-900 pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link to="/admin" className="mr-4 p-2 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors">
              <ArrowLeftIcon className="h-5 w-5 text-gray-300" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Contact Messages</h1>
              <p className="text-gray-400 mt-1">Manage contact form submissions</p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-medium text-white transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
        
        {error && (
          <div className="mb-4 p-4 bg-red-600/20 border border-red-600/30 rounded-lg text-red-400">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h2 className="text-lg font-semibold text-white">Inbox</h2>
            </div>
            <div className="divide-y divide-gray-700">
              {loading ? (
                <div className="p-4 text-gray-400 text-center">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="p-4 text-gray-400 text-center">No messages</div>
              ) : (
                messages.map(message => (
                  <div 
                    key={message._id} 
                    className={`p-4 cursor-pointer ${
                      selectedMessage?._id === message._id ? 'bg-gray-700' : 'hover:bg-gray-700/50'
                    } ${
                      message.status === 'unread' ? 'border-l-4 border-blue-500' : ''
                    }`} 
                    onClick={() => handleSelectMessage(message)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${
                          message.status === 'read' ? 'text-gray-300' : 'text-white'
                        }`}>
                          {message.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {message.email}
                        </p>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-400 truncate">
                      {message.message.substring(0, 50)}...
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="lg:col-span-2">
            {selectedMessage ? <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-white">
                    Message from {selectedMessage.name}
                  </h2>
                  <div className="flex space-x-2">
                    {selectedMessage.status === 'unread' && <button onClick={() => handleMarkAsRead(selectedMessage._id)} className="p-2 bg-blue-600/20 text-blue-400 rounded-md hover:bg-blue-600/40 transition-colors" title="Mark as read">
                        <CheckIcon className="h-5 w-5" />
                      </button>}
                    <button onClick={() => handleDelete(selectedMessage._id)} className="p-2 bg-red-600/20 text-red-400 rounded-md hover:bg-red-600/40 transition-colors" title="Delete message">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center">
                      <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-300">
                        {selectedMessage.name}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MailIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-300">
                        {selectedMessage.email}
                      </span>
                    </div>
                    {selectedMessage.subject && (
                      <div className="flex items-center">
                        <span className="h-5 w-5 text-gray-400 mr-2 text-sm">📋</span>
                        <span className="text-gray-300 font-medium">
                          Subject: {selectedMessage.subject}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-300">
                        {formatDate(selectedMessage.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <p className="text-gray-300 whitespace-pre-line">
                      {selectedMessage.message}
                    </p>
                  </div>
                  {selectedMessage.adminResponse && (
                    <div className="bg-blue-600/20 rounded-lg p-4">
                      <h4 className="text-blue-400 font-medium mb-2">Admin Response:</h4>
                      <p className="text-gray-300 whitespace-pre-line">
                        {selectedMessage.adminResponse}
                      </p>
                    </div>
                  )}
                  <div className="flex justify-end">
                    <a href={`mailto:${selectedMessage.email}?subject=Re: Contact from ${selectedMessage.name}`} className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-500 hover:to-purple-500 transition-colors">
                      <MailIcon className="h-5 w-5 mr-2" />
                      Reply
                    </a>
                  </div>
                </div>
              </div> : <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 flex flex-col items-center justify-center text-center h-full">
                <MailIcon className="h-12 w-12 text-gray-600 mb-4" />
                <h3 className="text-xl font-medium text-gray-300">
                  No message selected
                </h3>
                <p className="text-gray-500 mt-2">
                  Select a message from the inbox to view its contents.
                </p>
              </div>}
          </div>
        </div>
      </div>
    </div>;
};
export default ContactMessages;