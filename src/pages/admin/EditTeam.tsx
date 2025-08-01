import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, TrashIcon, PlusIcon, SaveIcon } from 'lucide-react';
interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  bio: string;
}
const EditTeam = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editedMember, setEditedMember] = useState<TeamMember>({
    id: 0,
    name: '',
    role: '',
    image: '',
    bio: ''
  });
  useEffect(() => {
    // Load team members from localStorage or use default data
    const savedMembers = localStorage.getItem('cyberpit_team');
    if (savedMembers) {
      setTeamMembers(JSON.parse(savedMembers));
    } else {
      // Default team members
      const defaultTeam = [{
        id: 1,
        name: 'Alex Rivera',
        role: 'Founder & Exploit Developer',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
        bio: 'Former black hat with 15 years of experience in vulnerability research. Specializes in kernel exploitation and low-level security.'
      }, {
        id: 2,
        name: 'Mia Johnson',
        role: 'Reverse Engineer',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
        bio: 'Specializes in firmware analysis and embedded systems security. Has discovered critical vulnerabilities in IoT devices from major manufacturers.'
      }, {
        id: 3,
        name: 'Raj Patel',
        role: 'Web Security Specialist',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
        bio: 'Expert in web application security and API vulnerabilities. Regular contributor to bug bounty programs with over 200 valid submissions.'
      }];
      setTeamMembers(defaultTeam);
      localStorage.setItem('cyberpit_team', JSON.stringify(defaultTeam));
    }
  }, []);
  const saveTeamMembers = (updatedMembers: TeamMember[]) => {
    localStorage.setItem('cyberpit_team', JSON.stringify(updatedMembers));
    setTeamMembers(updatedMembers);
  };
  const handleDelete = (id: number) => {
    const updatedMembers = teamMembers.filter(member => member.id !== id);
    saveTeamMembers(updatedMembers);
  };
  const handleEdit = (member: TeamMember) => {
    setIsEditing(member.id);
    setEditedMember({
      ...member
    });
  };
  const handleSaveEdit = () => {
    const updatedMembers = teamMembers.map(member => member.id === editedMember.id ? editedMember : member);
    saveTeamMembers(updatedMembers);
    setIsEditing(null);
  };
  const handleAddNew = () => {
    const newId = teamMembers.length > 0 ? Math.max(...teamMembers.map(m => m.id)) + 1 : 1;
    const newMember = {
      id: newId,
      name: 'New Team Member',
      role: 'Role / Position',
      image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      bio: 'Add a bio for this team member.'
    };
    const updatedMembers = [...teamMembers, newMember];
    saveTeamMembers(updatedMembers);
    handleEdit(newMember);
  };
  return <div className="min-h-screen bg-gray-900 pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <Link to="/admin" className="mr-4 p-2 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors">
            <ArrowLeftIcon className="h-5 w-5 text-gray-300" />
          </Link>
          <h1 className="text-3xl font-bold text-white">Edit Team</h1>
          <button onClick={handleAddNew} className="ml-auto flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-500 hover:to-purple-500 transition-colors">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Member
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map(member => <div key={member.id} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
              {isEditing === member.id ?
          // Edit mode
          <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Name
                    </label>
                    <input type="text" value={editedMember.name} onChange={e => setEditedMember({
                ...editedMember,
                name: e.target.value
              })} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Role
                    </label>
                    <input type="text" value={editedMember.role} onChange={e => setEditedMember({
                ...editedMember,
                role: e.target.value
              })} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Image URL
                    </label>
                    <input type="text" value={editedMember.image} onChange={e => setEditedMember({
                ...editedMember,
                image: e.target.value
              })} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Bio
                    </label>
                    <textarea rows={4} value={editedMember.bio} onChange={e => setEditedMember({
                ...editedMember,
                bio: e.target.value
              })} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="flex justify-end">
                    <button onClick={() => setIsEditing(null)} className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md mr-2 hover:bg-gray-600 transition-colors">
                      Cancel
                    </button>
                    <button onClick={handleSaveEdit} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition-colors">
                      <SaveIcon className="h-5 w-5 mr-2" />
                      Save
                    </button>
                  </div>
                </div> :
          // View mode
          <>
                  <div className="h-48 overflow-hidden">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {member.name}
                        </h3>
                        <p className="text-blue-400">{member.role}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => handleEdit(member)} className="p-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(member.id)} className="p-2 bg-red-900/50 text-red-300 rounded-md hover:bg-red-900 transition-colors">
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-300 mt-4">{member.bio}</p>
                  </div>
                </>}
            </div>)}
        </div>
      </div>
    </div>;
};
export default EditTeam;