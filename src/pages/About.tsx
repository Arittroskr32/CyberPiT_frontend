import React, { useEffect, useState } from 'react';
import { ShieldIcon } from 'lucide-react';
import { apiService } from '../services/api';

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  order?: number;
}

const About = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await apiService.team.getAll();
        if (response.data.success) {
          setTeamMembers(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
        // Fallback to localStorage if API fails
        const savedTeamMembers = localStorage.getItem('cyberpit_team');
        if (savedTeamMembers) {
          setTeamMembers(JSON.parse(savedTeamMembers));
        }
      }
    };

    fetchTeamMembers();
  }, []);
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
              About CyberPiT
            </h1>
            <div className="mt-4 flex justify-center">
              <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
            </div>
          </div>
        </div>
      </div>
      {/* About content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden">
                <img src="/about_image.jpg" alt="About CyberPiT" className="object-cover" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-lg">
                <ShieldIcon className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </div>
          <div className="mt-10 lg:mt-0 lg:col-span-7">
            <h2 className="text-3xl font-bold text-blue-400 mb-6">Our Story</h2>
            <div className="prose prose-lg prose-blue text-gray-300">
              <p>
                CyberPiT Inc. was founded in 2025 by a group of passionate cybersecurity professionals united by one purpose: to defend digital landscapes, expose system vulnerabilities, and empower others through ethical hacking and proactive security. What started as a side project in a shared co-working space quickly evolved into a cutting-edge cybersecurity organization fueled by curiosity, community, and code.
              </p>
              <p>
                Our journey began with creating open-source tools and participating in high-stakes Capture The Flag (CTF) competitions. These challenges sharpened our technical skills and taught us the value of collaboration under pressure. Over time, we transformed these learning experiences into structured platforms for education, simulation, and real-world defense.
              </p>
              <p>
                Today, CyberPiT Inc. offers services ranging from deep-dive penetration testing to adversary emulation and threat hunting across diverse digital ecosystems. Our team thrives at the intersection of offense and defense, helping organizations identify blind spots, strengthen infrastructure, and prepare for the evolving threat landscape.
              </p>
              <p>
                 We believe cybersecurity should be accessible, hands-on, and transformative. Our labs and challenges provide a controlled yet dynamic environment where learners can test, break, and build — cultivating both technical skills and hacker mindset. At CyberPiT, every failure is a lesson, every exploit a doorway to knowledge.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Team section */}
      <div className="bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Meet Our Team</h2>
            <p className="mt-4 text-lg text-gray-300">
              Elite security researchers with diverse expertise
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map(member => <div key={member._id} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700 transition-all duration-300 hover:border-blue-500 hover:shadow-md hover:shadow-blue-500/20">
                <img src={member.image} alt={member.name} className="w-full h-64 object-cover object-center" />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white">
                    {member.name}
                  </h3>
                  <p className="text-blue-400 mb-4">{member.role}</p>
                  <p className="text-gray-400">{member.bio}</p>
                </div>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
};
export default About;