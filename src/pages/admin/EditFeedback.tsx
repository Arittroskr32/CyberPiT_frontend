import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, TrashIcon, PlusIcon, SaveIcon, StarIcon } from 'lucide-react';
interface Testimonial {
  id: number;
  name: string;
  role: string;
  comment: string;
  rating: number;
}
const EditFeedback = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editedTestimonial, setEditedTestimonial] = useState<Testimonial>({
    id: 0,
    name: '',
    role: '',
    comment: '',
    rating: 5
  });
  useEffect(() => {
    // Load testimonials from localStorage or use default data
    const savedTestimonials = localStorage.getItem('cyberpit_testimonials');
    if (savedTestimonials) {
      setTestimonials(JSON.parse(savedTestimonials));
    } else {
      // Default testimonials
      const defaultTestimonials = [{
        id: 1,
        name: 'Alex Chen',
        role: 'Security Engineer at TechCorp',
        comment: "CyberPiT's workshop on binary exploitation completely changed how I approach security testing. Their techniques are cutting-edge.",
        rating: 5
      }, {
        id: 2,
        name: 'Sarah Johnson',
        role: 'CISO at FinSecure',
        comment: 'We hired CyberPiT for a red team assessment and they found critical vulnerabilities that our regular audits missed. Highly recommended.',
        rating: 5
      }, {
        id: 3,
        name: 'Marcus Williams',
        role: 'CTF Competitor',
        comment: 'The tools CyberPiT has released to the community have been invaluable for our CTF team. Their approach is both practical and innovative.',
        rating: 4
      }];
      setTestimonials(defaultTestimonials);
      localStorage.setItem('cyberpit_testimonials', JSON.stringify(defaultTestimonials));
    }
  }, []);
  const saveTestimonials = (updatedTestimonials: Testimonial[]) => {
    localStorage.setItem('cyberpit_testimonials', JSON.stringify(updatedTestimonials));
    setTestimonials(updatedTestimonials);
  };
  const handleDelete = (id: number) => {
    const updatedTestimonials = testimonials.filter(testimonial => testimonial.id !== id);
    saveTestimonials(updatedTestimonials);
  };
  const handleEdit = (testimonial: Testimonial) => {
    setIsEditing(testimonial.id);
    setEditedTestimonial({
      ...testimonial
    });
  };
  const handleSaveEdit = () => {
    const updatedTestimonials = testimonials.map(testimonial => testimonial.id === editedTestimonial.id ? editedTestimonial : testimonial);
    saveTestimonials(updatedTestimonials);
    setIsEditing(null);
  };
  const handleAddNew = () => {
    const newId = testimonials.length > 0 ? Math.max(...testimonials.map(t => t.id)) + 1 : 1;
    const newTestimonial = {
      id: newId,
      name: 'New Testimonial',
      role: 'Role / Company',
      comment: 'Add your testimonial text here.',
      rating: 5
    };
    const updatedTestimonials = [...testimonials, newTestimonial];
    saveTestimonials(updatedTestimonials);
    handleEdit(newTestimonial);
  };
  return <div className="min-h-screen bg-gray-900 pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <Link to="/admin" className="mr-4 p-2 bg-gray-800 rounded-md hover:bg-gray-700 transition-colors">
            <ArrowLeftIcon className="h-5 w-5 text-gray-300" />
          </Link>
          <h1 className="text-3xl font-bold text-white">Manage Feedback</h1>
          <button onClick={handleAddNew} className="ml-auto flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-500 hover:to-purple-500 transition-colors">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New
          </button>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {testimonials.map(testimonial => <div key={testimonial.id} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              {isEditing === testimonial.id ?
          // Edit mode
          <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Name
                    </label>
                    <input type="text" value={editedTestimonial.name} onChange={e => setEditedTestimonial({
                ...editedTestimonial,
                name: e.target.value
              })} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Role
                    </label>
                    <input type="text" value={editedTestimonial.role} onChange={e => setEditedTestimonial({
                ...editedTestimonial,
                role: e.target.value
              })} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Comment
                    </label>
                    <textarea rows={4} value={editedTestimonial.comment} onChange={e => setEditedTestimonial({
                ...editedTestimonial,
                comment: e.target.value
              })} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Rating
                    </label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map(rating => <button key={rating} type="button" onClick={() => setEditedTestimonial({
                  ...editedTestimonial,
                  rating
                })} className="p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full">
                          <StarIcon className={`h-8 w-8 ${rating <= editedTestimonial.rating ? 'text-yellow-400' : 'text-gray-500'}`} fill={rating <= editedTestimonial.rating ? 'currentColor' : 'none'} />
                        </button>)}
                    </div>
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
          <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {testimonial.name}
                      </h3>
                      <p className="text-blue-400">{testimonial.role}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => handleEdit(testimonial)} className="p-2 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(testimonial.id)} className="p-2 bg-red-900/50 text-red-300 rounded-md hover:bg-red-900 transition-colors">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex my-2">
                    {[...Array(5)].map((_, i) => <StarIcon key={i} className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-600'}`} fill={i < testimonial.rating ? 'currentColor' : 'none'} />)}
                  </div>
                  <p className="text-gray-300 italic mt-4">
                    "{testimonial.comment}"
                  </p>
                </div>}
            </div>)}
        </div>
      </div>
    </div>;
};
export default EditFeedback;