import React, { useEffect, useState } from 'react';
import { MailIcon } from 'lucide-react';
import { apiService } from '../services/api';
import FeedbackForm from '../components/FeedbackForm';
const VideoHero = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [videoSources, setVideoSources] = useState<{
    desktop: string | null;
    mobile: string | null;
  }>({
    desktop: null,
    mobile: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const checkDevice = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Load current videos from backend
    const loadCurrentVideos = async () => {
      try {
        console.log('🎥 Loading current videos from backend...');
        setLoading(true);
        setError(false);
        
        const response = await apiService.videos.getCurrent();
        
        if (response.data.success && response.data.videos) {
          const newVideoSources = {
            desktop: response.data.videos.desktop,
            mobile: response.data.videos.mobile
          };
          
          console.log('✅ Video sources loaded:', newVideoSources);
          setVideoSources(newVideoSources);
        } else {
          console.warn('⚠️ No videos found in database');
          setError(true);
        }
      } catch (error) {
        console.error('❌ Failed to load videos:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    // Initial check
    checkDevice();
    loadCurrentVideos();

    // Add event listener for window resize
    window.addEventListener('resize', checkDevice);

    return () => window.removeEventListener('resize', checkDevice);
  }, []);
  return (
    <section className="relative min-h-screen">
      <div className="w-full h-screen">
        {loading ? (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-white text-lg">Loading video...</p>
            </div>
          </div>
        ) : error || !videoSources.desktop || !videoSources.mobile ? (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-white text-2xl font-bold mb-2">Video Not Available</h2>
              <p className="text-gray-400">Please contact the administrator to upload videos.</p>
            </div>
          </div>
        ) : (
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            preload="auto"
            className="w-full h-full object-cover" 
            src={isMobile ? videoSources.mobile : videoSources.desktop}
            onLoadedData={(e) => {
              e.currentTarget.play();
            }}
          >
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </section>
  );
};
const Mission = () => {
  return <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-8">Our Mission</h2>
        <p className="text-xl text-gray-300 leading-relaxed">
          CyberPiT is a collective of ethical hackers, researchers, and defenders dedicated to hands-on cybersecurity. From building open-source tools to simulating real-world attacks — we train, test, and protect the digital world.
        </p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors">
            <h3 className="text-xl font-semibold text-blue-400 mb-2">
              Exploit
            </h3>
            <p className="text-gray-300">
              We uncover and responsibly disclose vulnerabilities before they can be abused.
            </p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors">
            <h3 className="text-xl font-semibold text-purple-400 mb-2">
              Research
            </h3>
            <p className="text-gray-300">
              We push boundaries with original techniques and community-driven innovation.
            </p>
          </div>
          <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors">
            <h3 className="text-xl font-semibold text-blue-400 mb-2">Defend</h3>
            <p className="text-gray-300">
              We craft resilient defenses through red teaming, threat emulation, and training.
            </p>
          </div>
        </div>
      </div>
    </section>;
};

// Featured Feedback from Database
const FeaturedFeedback = () => {
  const [featuredFeedback, setFeaturedFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedFeedback = async () => {
      try {
        const response = await apiService.feedback.getAll();
        if (response.data.success && response.data.feedback.length > 0) {
          // Filter only featured feedback (approval not required for featured items)
          const featured = response.data.feedback.filter((feedback: any) => 
            feedback.featured === true
          );
          setFeaturedFeedback(featured);
        }
      } catch (error) {
        console.error('Error loading featured feedback:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadFeaturedFeedback();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center text-white">Loading featured feedback...</div>
        </div>
      </section>
    );
  }

  if (featuredFeedback.length === 0) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center text-gray-400">No featured feedback available yet.</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          Featured User Feedback
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredFeedback.map((feedback: any) => (
            <div key={feedback._id} className="bg-gray-900 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-5 w-5 ${i < feedback.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-300 italic mb-4">
                "{feedback.comment}"
              </p>
              <div className="mt-4">
                <p className="font-medium text-blue-400">{feedback.name}</p>
                {feedback.role && <p className="text-sm text-gray-400">{feedback.role}</p>}
                {feedback.workplace && (
                  <p className="text-xs text-gray-500">{feedback.workplace}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SubscribeSection = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
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
  return <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Subscribe Now</h2>
        <p className="text-xl text-gray-300 mb-8">
          Stay updated with our latest research, tools, and security insights.
        </p>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MailIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" className="w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button type="submit" className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-md hover:from-blue-500 hover:to-purple-500 transition-all duration-300">
              Subscribe
            </button>
          </div>
          {message && <div className={`mt-3 text-sm ${messageType === 'error' ? 'text-red-400' : messageType === 'success' ? 'text-green-400' : 'text-blue-400'}`}>
              {message}
            </div>}
        </form>
      </div>
    </section>;
};
const Home = () => {
  return <div className="bg-gray-900">
      <VideoHero />
      <Mission />
      <SubscribeSection />
      <FeaturedFeedback />
      <FeedbackForm />
    </div>;
};
export default Home;