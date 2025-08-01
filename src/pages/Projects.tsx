import { useEffect, useState } from 'react';
import { CalendarIcon, TagIcon, ChevronRightIcon, StarIcon } from 'lucide-react';
import { apiService } from '../services/api';

interface Project {
  _id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  featured?: boolean;
  status: 'active' | 'upcoming' | 'completed' | 'archived';
  order?: number;
}
const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 transition-all duration-300 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 hover:transform hover:scale-105 group">
      {project.image && (
        <div className="relative overflow-hidden">
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-900/80 text-blue-300 border border-blue-700/50">
            {project.category}
          </span>
          <div className="flex items-center text-gray-400 text-sm">
            <CalendarIcon className="h-4 w-4 mr-1" />
            {project.date}
          </div>
        </div>
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">
          {project.title}
        </h3>
        <p className="text-gray-300 mb-4 line-clamp-3 leading-relaxed">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag: string, index: number) => (
            <span 
              key={index} 
              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-700/80 text-gray-300 border border-gray-600/50 hover:bg-gray-600/80 transition-colors duration-200"
            >
              <TagIcon className="h-3 w-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
        {project.link && (
          <a 
            href={project.link} 
            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-all duration-200 font-medium group-hover:translate-x-1"
          >
            Learn more
            <ChevronRightIcon className="h-4 w-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" />
          </a>
        )}
      </div>
    </div>
  );
};
const Projects = () => {
  const [featuredProject, setFeaturedProject] = useState<Project | null>(null);
  const [upcomingProjects, setUpcomingProjects] = useState<Project[]>([]);
  const [previousProjects, setPreviousProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiService.projects.getAll();
        if (response.data.success) {
          const projects = response.data.projects;
          
          // Find featured project
          const featured = projects.find((p: Project) => p.featured) || projects[0];
          if (featured) {
            setFeaturedProject(featured);
          }
          
          // Split projects by status
          const upcoming = projects.filter((p: Project) => p.status === 'upcoming');
          const completed = projects.filter((p: Project) => p.status === 'completed' && p._id !== featured?._id);
          
          setUpcomingProjects(upcoming);
          setPreviousProjects(completed);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        // Fallback to localStorage if API fails
        const savedProjects = localStorage.getItem('cyberpit_projects');
        if (savedProjects) {
          const projects = JSON.parse(savedProjects);
          const featured = projects.find((p: any) => p.id === 1) || projects[0];
          if (featured) {
            setFeaturedProject(featured);
          }
          const otherProjects = projects.filter((p: any) => p.id !== featured.id);
          const upcoming = otherProjects.slice(0, 2);
          const previous = otherProjects.slice(2);
          if (upcoming.length > 0) setUpcomingProjects(upcoming);
          if (previous.length > 0) setPreviousProjects(previous);
        }
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 pt-16">
      {/* Featured Project */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Featured Project</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
          {featuredProject ? (
            <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
              <div className="relative group">
                <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-2xl">
                  <img 
                    src={featuredProject.image} 
                    alt={featuredProject.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="absolute top-6 left-6">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-900/90 text-blue-300 border border-blue-700/50 backdrop-blur-sm">
                    {featuredProject.category}
                  </span>
                </div>
              </div>
              <div className="mt-8 lg:mt-0">
                <h3 className="text-3xl font-bold text-white mb-4 leading-tight">
                  {featuredProject.title}
                </h3>
                <div className="flex items-center text-gray-400 text-sm mb-6">
                  <CalendarIcon className="h-5 w-5 mr-2" />
                  {featuredProject.date}
                </div>
                <p className="text-gray-300 text-lg leading-relaxed mb-8">
                  {featuredProject.description}
                </p>
                <div className="flex flex-wrap gap-3 mb-8">
                  {featuredProject.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-700/80 text-gray-300 border border-gray-600/50 hover:bg-gray-600/80 transition-colors duration-200"
                    >
                      <TagIcon className="h-4 w-4 mr-2" />
                      {tag}
                    </span>
                  ))}
                </div>
                <a 
                  href={featuredProject.link} 
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
                >
                  View Project Details
                  <ChevronRightIcon className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-700 rounded-full flex items-center justify-center">
                <StarIcon className="h-12 w-12 text-gray-500" />
              </div>
              <p className="text-gray-400 text-lg">No featured project available</p>
              <p className="text-gray-500 mt-2">Featured projects will be highlighted here</p>
            </div>
          )}
        </div>
      </section>
      {/* Upcoming Projects */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Upcoming Projects
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Exciting new projects we're working on and planning to launch soon
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingProjects.length > 0 ? (
              upcomingProjects.map((project) => <ProjectCard key={project._id} project={project} />)
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 text-lg">No upcoming projects at the moment</div>
                <p className="text-gray-500 mt-2">Check back soon for exciting new developments!</p>
              </div>
            )}
          </div>
        </div>
      </section>
      {/* Previous Projects */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Previous Projects
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Completed projects showcasing our expertise and innovation
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {previousProjects.length > 0 ? (
              previousProjects.map((project) => <ProjectCard key={project._id} project={project} />)
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 text-lg">No previous projects to display</div>
                <p className="text-gray-500 mt-2">Projects will appear here as they are completed</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
export default Projects;