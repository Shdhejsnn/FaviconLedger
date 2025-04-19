import React from 'react';
import { Loader, TreePine, Globe, ArrowUpRight, AlertTriangle } from 'lucide-react';
import Card from '../ui/Card';

interface CarbonProject {
  id: string;
  name: string;
  location: string;
  type: string;
  description: string;
  credits_available: number;
  price_per_credit: number;
  verification_standard: string;
  project_url?: string;
  image_url?: string;
  coordinates: [number, number]; // Coordinates for the map
}

const CarbonProjects: React.FC = () => {
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string>('');
  const [selectedCountry, setSelectedCountry] = React.useState<string>('');
  const [countries, setCountries] = React.useState<{ id: string }[]>([]);

  const projects: CarbonProject[] = [
    {
      id: '1',
      name: 'Amazon Rainforest Conservation',
      location: 'Brazil',
      type: 'Reforestation',
      description: 'This is a description for Project A',
      credits_available: 1000,
      price_per_credit: 10.50,
      verification_standard: 'Verified Carbon Standard (VCS)',
      project_url: 'https://example.com/projectA',
      image_url: 'https://example.com/imageA.jpg',
      coordinates: [-60, -5], // Example coordinates
    },
    {
      id: '2',
      name: 'Sahara Solar Farm',
      location: 'Morocco',
      type: 'Solar Energy',
      description: 'This is a description for Project B',
      credits_available: 1500,
      price_per_credit: 12.75,
      verification_standard: 'Gold Standard',
      project_url: 'https://example.com/projectB',
      image_url: 'https://example.com/imageB.jpg',
      coordinates: [-5, 31], // Example coordinates
    },
    {
      id: '3',
      name: 'Baltic Wind Farm',
      location: 'Denmark',
      type: 'Wind Energy',
      description: 'This is a description for Project C',
      credits_available: 500,
      price_per_credit: 15.00,
      verification_standard: 'Verified Carbon Standard (VCS)',
      project_url: 'https://example.com/projectC',
      image_url: 'https://example.com/imageC.jpg',
      coordinates: [10, 56], // Example coordinates
    },
    // Add more projects as needed
  ];

  React.useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader className="h-10 w-10 text-emerald-600 dark:text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 mx-auto text-amber-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {error}
          </h3>
          <button 
            onClick={() => window.location.reload()}
            className="text-emerald-600 hover:text-emerald-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Carbon Projects</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explore verified carbon reduction and removal projects worldwide
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="flex flex-col">
            {project.image_url && (
              <img
                src={project.image_url}
                alt={project.name}
                className="w-full h-48 object-cover rounded-t-lg mb-4"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <div className="flex items-start justify-between mb-4">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg">
                <TreePine className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                {project.verification_standard}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {project.name}
            </h3>

            <div className="flex items-center mb-3 text-sm text-gray-500 dark:text-gray-400">
              <Globe className="h-4 w-4 mr-1" />
              {project.location}
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 flex-grow">
              {project.description}
            </p>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-auto">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">Available Credits</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {project.credits_available.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">Price per Credit</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  ${project.price_per_credit}
                </span>
              </div>
            </div>

            <a
              href={project.project_url}
              target="_blank"
              rel="noopener noreferrer" 
              className="mt-4 w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 transition-colors flex items-center justify-center"
            >
              View Details
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </a>
          </Card>
        ))}

      </div>
    </div>
  );
};

export default CarbonProjects;